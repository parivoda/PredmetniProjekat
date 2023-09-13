using AutoMapper;
using Microsoft.Extensions.Configuration;
using OnlineKupovina.Application.DTOs.OrderDto;
using OnlineKupovina.Application.ServiceInterfaces;
using OnlineKupovina.Domain.Models;
using OnlineKupovina.Infrastructure.RepositoryInterfaces;

namespace OnlineKupovina.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IRepository<OrderItem> _orderItemsRepository;
        private readonly IOrderRepository _ordersRepository;
        private readonly IRepository<Item> _itemsRepository;
        private readonly IUserService _userService;
        private readonly IRepository<User> _userRepository;
        private readonly IMapper _mapper;
        private readonly IConfigurationSection _fee;

        public OrderService(IRepository<OrderItem> orderItemsRepository, IOrderRepository ordersRepository,
            IRepository<Item> itemsRepository, IMapper mapper, IConfiguration config, IUserService userService, IRepository<User> userRepository)
        {
            _orderItemsRepository = orderItemsRepository;
            _ordersRepository = ordersRepository;
            _itemsRepository = itemsRepository;
            _userService = userService;
            _mapper = mapper;
            _fee = config.GetSection("Fee");
            _userRepository = userRepository;
        }

        public async Task AddItemToCart(long customerId, long itemId, int itemQuantity)
        {
            var item = await _itemsRepository.GetById(itemId);

            if (itemQuantity >= 0 && item.Quantity == 0)
            {
                throw new InvalidOperationException("Error while trying to add item. No enough quantity left.");
            }
            if (item.Quantity > 0 && itemQuantity == 0)
            {
                throw new InvalidOperationException("Quantity must be greater then 0.");
            }

            try
            {
                Order orderInProgress = await _ordersRepository.FindBy(x => x.Status.Equals(OrderStatus.InProgress) && x.PurchaserId == customerId);
                if (orderInProgress == null)
                {
                    var user = await _userRepository.GetById(customerId);
                    orderInProgress = new Order(user.Address,customerId, itemQuantity);
                    await _ordersRepository.Create(orderInProgress);
                    await _ordersRepository.SaveChanges();
                    OrderItem existingOrderItem = await _orderItemsRepository.FindBy(x => x.ItemId == itemId && x.OrderId == orderInProgress.Id);
                    if (existingOrderItem == null)
                    {
                        await _orderItemsRepository.Create(new OrderItem { ItemId = itemId, OrderId = orderInProgress.Id, ItemQuantity = itemQuantity });
                    }
                    else
                    {
                        existingOrderItem.ItemQuantity += itemQuantity;
                    }

                    item.Quantity -= itemQuantity;
                    orderInProgress.TotalPrice += (item.Price * itemQuantity);
                    await _itemsRepository.SaveChanges();
                    await _orderItemsRepository.SaveChanges();
                    await _ordersRepository.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // Handle the exception or log it
                Console.WriteLine("An error occurred: " + ex.Message);

                // Check for inner exception
                if (ex.InnerException != null)
                {
                    Console.WriteLine("Inner exception: " + ex.InnerException.Message);
                    // You can also access the InnerException's InnerException if needed
                }
            }
         
        }

        public async Task ConfirmOrder(long orderId, ConfirmOrderDto confirmOrderDto)
        {
            var order = await _ordersRepository.GetById(orderId);
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            order.DeliveryAddress = confirmOrderDto.DeliveryAddress;
            order.Comment = confirmOrderDto.Comment;
            order.OrderingTime = DateTime.Now;
            order.Status = OrderStatus.Finished;
            order.IsAccepted = false;
            order.IsDelivered = false;
            order.PaymentType = (PaymentType)Enum.Parse(typeof(PaymentType), confirmOrderDto.PaymentType);
            order.TotalPrice += double.Parse(_fee.Value);

            await _ordersRepository.SaveChanges();
        }

        public async Task<List<OrderViewDto>> CurrentOrderView(long customerId)
        {
            var currentOrder = await _ordersRepository.GetOrderView(customerId);
            if (currentOrder != null)
            {
                List<OrderViewDto> orderViewDtos = new();
                foreach (var orderItem in currentOrder.OrderItems)
                {
                    var totalOrderItemPrice = orderItem.Item.Price * orderItem.ItemQuantity;
                    orderViewDtos.Add(new OrderViewDto
                    {
                        Fee = double.Parse(_fee.Value),
                        ItemName = orderItem.Item.Name,
                        ItemPrice = totalOrderItemPrice,
                        ItemQuantity = orderItem.ItemQuantity,
                        OrderId = orderItem.OrderId,
                        ItemId = orderItem.ItemId,
                        TotalPrice = currentOrder.TotalPrice,
                        ItemImage = orderItem.Item.ImageUri
                    });
                }

                return orderViewDtos;
            }

            throw new InvalidOperationException("You don't have any active orders yet. Go to shop and add something to cart!");

        }

        public async Task DeleteOrder(long orderId)
        {
            var order = await _ordersRepository.GetOrderById(orderId);
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            foreach (var orderItem in order.OrderItems)
            {
                var item = await _itemsRepository.GetById(orderItem.ItemId);
                if (item == null)
                {
                    throw new ArgumentNullException(nameof(item));
                }

                item.Quantity += orderItem.ItemQuantity;
            }

            await _itemsRepository.SaveChanges();
            _ordersRepository.Delete(order);
            await _ordersRepository.SaveChanges();
        }

        public async Task DeleteOrderItem(long itemId, long orderId)
        {
            var orderItem = await _orderItemsRepository.GetById(orderId, itemId);
            var order = await _ordersRepository.GetById(orderId);
            if (orderItem == null)
            {
                throw new ArgumentNullException(nameof(orderItem));
            }

            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            var item = await _itemsRepository.GetById(itemId);
            item.Quantity += orderItem.ItemQuantity;
            order.TotalPrice -= (item.Price * orderItem.ItemQuantity);

            await _ordersRepository.SaveChanges();
            await _itemsRepository.SaveChanges();

            _orderItemsRepository.Delete(orderItem);
            await _orderItemsRepository.SaveChanges();

            var remaining = await _orderItemsRepository.FindAllBy(x => x.OrderId == orderId);
            if (!remaining.Any())
            {
                _ordersRepository.Delete(order);
                await _ordersRepository.SaveChanges();
            }
        }

        public async Task<List<OrderListCustomerDto>> CustomersOrders(long customerId)
        {
            var orders = await _ordersRepository.FindAllBy(x => x.PurchaserId == customerId &&
            x.Status.Equals(OrderStatus.Finished) && x.IsAccepted);
            if (orders.Any())
            {
                foreach (var order in orders)
                {
                    await _ordersRepository.CheckDeliveryStatus(order);
                }
                return _mapper.Map<List<OrderListCustomerDto>>(orders);
            }

            throw new InvalidOperationException("No orders yet.");
        }

        public static DateTime GenerateTime()
        {
            Random random = new();

            int additionalRandomDays = random.Next(1, 7);
            int additionalRandomHours = random.Next(24);

            TimeSpan totalOffset = new(additionalRandomDays, additionalRandomHours, 0, 0);

            DateTime randomTime = DateTime.Now.AddHours(1).Add(totalOffset);

            return randomTime;
        }

        public async Task<List<OrderDetailDto>> GetOrderDetails(long orderId)
        {
            var order = await _ordersRepository.OrderDetails(orderId);
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            List<OrderDetailDto> orderDetailsDtos = new();

            foreach (var orderItem in order.OrderItems)
            {
                var item = _mapper.Map<OrderDetailDto>(orderItem.Item);
                item.ItemQuantity = orderItem.ItemQuantity;
                item.SellerName = orderItem.Item.Seller.FirstName + " " + orderItem.Item.Seller.LastName;
                orderDetailsDtos.Add(item);
            }

            return orderDetailsDtos;
        }

        public async Task CancelOrder(long orderId)
        {
            var order = await _ordersRepository.GetOrderById(orderId);
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            TimeSpan timeDifference = DateTime.Now.Subtract(order.OrderingTime);

            if (timeDifference.TotalMinutes > 60)
            {
                throw new InvalidOperationException("You cannot cancel the order. The order can be canceled within the first hour of placing the order.");
            }

            foreach (var orderItem in order.OrderItems)
            {
                var item = await _itemsRepository.GetById(orderItem.ItemId);
                if (item == null)
                {
                    throw new ArgumentNullException(nameof(item));
                }

                item.Quantity += orderItem.ItemQuantity;
            }

            order.Status = OrderStatus.Canceled;
            
            await _ordersRepository.SaveChanges();
        }

        public async Task<List<OrderListDto>> AllOrders()
        {
            var orders = await _ordersRepository.GetAllOrders();
            if (orders.Any())
            {

                List<OrderListDto> orderListAdminDtos = new();
                foreach (var or in orders)
                {
                    await _ordersRepository.CheckDeliveryStatus(or);
                    var order = _mapper.Map<OrderListDto>(or);
                    order.Customer = or.Purchaser.FirstName + " " + or.Purchaser.LastName;
                    order.CustomerImage = or.Purchaser.ImageUri;
                    orderListAdminDtos.Add(order);
                }

                return _mapper.Map<List<OrderListDto>>(orderListAdminDtos);
            }

            throw new InvalidOperationException("No orders.");
        }

        public async Task<List<OrderListDto>> GetSellerOrders(long id, bool isNew)
        {
            var orders = await _ordersRepository.GetSellerOrders(id);

            if (orders.Any())
            {
                foreach (var order in orders)
                {
                    await _ordersRepository.CheckDeliveryStatus(order);
                }

                var filteredOrders = isNew ? orders.Where(o => !o.IsDelivered && o.IsAccepted)
                    : orders.Where(o => o.IsDelivered && o.IsAccepted);

                if (filteredOrders.Any())
                {
                    List<OrderListDto> orderListDtos = new();
                    foreach (var or in filteredOrders)
                    {
                        var order = _mapper.Map<OrderListDto>(or);
                        order.Customer = or.Purchaser.FirstName + " " + or.Purchaser.LastName;
                        order.CustomerImage = or.Purchaser.ImageUri;
                        orderListDtos.Add(order);
                    }

                    return orderListDtos;
                }
                else
                {
                    throw new InvalidOperationException("No orders.");
                }
            }

            throw new InvalidOperationException("No orders.");
        }

        public async Task<List<OrderDetailDto>> GetOrderDetails(long orderId, long sellerId)
        {
            var order = await _ordersRepository.OrderDetails(orderId);
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            List<OrderDetailDto> orderDetailsDtos = new();

            foreach (var orderItem in order.OrderItems)
            {
                if (orderItem.Item.SellerId == sellerId)
                {
                    var item = _mapper.Map<OrderDetailDto>(orderItem.Item);
                    item.ItemQuantity = orderItem.ItemQuantity;
                    orderDetailsDtos.Add(item);
                }
            }

            return orderDetailsDtos;
        }

        public async Task<List<PendingOrders>> GetUsersPendingOrders(long id)
        {
            var orders = await _ordersRepository.FindAllBy(x => x.PurchaserId == id && !x.IsAccepted && x.Status.Equals(OrderStatus.Finished));
            if (orders.Any())
            {
                return _mapper.Map<List<PendingOrders>>(orders);
            }

            throw new InvalidOperationException("No orders yet.");
        }

        public async Task<List<PendingOrders>> GetOrdersOnMap(long id)
        {
            var orders = await _ordersRepository.GetSellerOrders(id);
            var filteredOrders = orders.Where(o => !o.IsAccepted);
            if (filteredOrders.Any())
            {
                return _mapper.Map<List<PendingOrders>>(filteredOrders);
            }

            throw new ArgumentNullException(nameof(filteredOrders));
        }

        public async Task AcceptOrder(long orderId)
        {
            var order = await _ordersRepository.GetById(orderId);
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            order.IsAccepted = true;
            order.IsDelivered = false;
            order.DeliveryTime = GenerateTime();
            await _ordersRepository.SaveChanges();
        }
    }
}
