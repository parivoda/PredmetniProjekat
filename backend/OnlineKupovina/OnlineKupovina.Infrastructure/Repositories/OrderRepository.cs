using Microsoft.EntityFrameworkCore;
using OnlineKupovina.Domain.Models;
using OnlineKupovina.Infrastructure.Context;
using OnlineKupovina.Infrastructure.RepositoryInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Infrastructure.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(OnlineKupovinaDBContext dbContext) : base(dbContext)
        {
        }

        public async Task<List<Order>> GetAllOrders()
        {
            var orders = await _dbContext.Orders.Where(o => o.Status != OrderStatus.InProgress).Include(o => o.Purchaser).ToListAsync();
            return orders;
        }

        public async Task<Order> GetOrderById(long id)
        {
            var order = await _dbContext.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Item)
            .FirstOrDefaultAsync(o => o.Id == id);

            return order;
        }

        public async Task<Order> GetOrderView(long customerId)
        {
            var order = await _dbContext.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Item)
            .FirstOrDefaultAsync(o => o.PurchaserId == customerId && o.Status == OrderStatus.InProgress);

            return order;
        }

        public async Task<Order> OrderDetails(long orderId)
        {
            var order = await _dbContext.Orders.Include(o => o.OrderItems).
                ThenInclude(oi => oi.Item).ThenInclude(i => i.Seller).
                FirstOrDefaultAsync(o => o.Id == orderId);

            return order;
        }

        public async Task<List<Order>> GetSellerOrders(long sellerId)
        {
            var orders = await _dbContext.Orders
                .Where(o => o.Status == OrderStatus.Finished)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Item)
                .Include(o => o.Purchaser)
                .Where(o => o.OrderItems.Any(oi => oi.Item.SellerId == sellerId))
                .ToListAsync();

            return orders;
        }


        public async Task CheckDeliveryStatus(Order order)
        {
            if (order.DeliveryTime < DateTime.Now)
            {
                order.IsDelivered = true;
            }

            await _dbContext.SaveChangesAsync();
        }

    }
}
