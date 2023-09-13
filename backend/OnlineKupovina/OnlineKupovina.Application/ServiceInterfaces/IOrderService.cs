using OnlineKupovina.Application.DTOs.OrderDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.ServiceInterfaces
{
    public interface IOrderService
    {
        Task AddItemToCart(long customerId, long itemId, int itemQuantity);
        Task<List<OrderViewDto>> CurrentOrderView(long customerId);
        Task DeleteOrderItem(long itemId, long orderId);
        Task DeleteOrder(long orderId);
        Task ConfirmOrder(long orderId, ConfirmOrderDto confirmOrderDto);
        Task<List<OrderListCustomerDto>> CustomersOrders(long customerId);
        Task<List<OrderDetailDto>> GetOrderDetails(long orderId);
        Task<List<OrderDetailDto>> GetOrderDetails(long orderId, long sellerId);
        Task CancelOrder(long orderId);
        Task<List<OrderListDto>> AllOrders();
        Task<List<OrderListDto>> GetSellerOrders(long id, bool isNew);
        Task<List<PendingOrders>> GetUsersPendingOrders(long id);
        Task<List<PendingOrders>> GetOrdersOnMap(long id);
        Task AcceptOrder(long orderId);
    }
}
