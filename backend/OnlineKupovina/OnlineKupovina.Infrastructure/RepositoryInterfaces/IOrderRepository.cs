using OnlineKupovina.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Infrastructure.RepositoryInterfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<Order> GetOrderView(long customerId);
        Task<Order> GetOrderById(long id);
        Task<Order> OrderDetails(long orderId);
        Task<List<Order>> GetAllOrders();
        Task<List<Order>> GetSellerOrders(long sellerId);
        Task CheckDeliveryStatus(Order order);
    }
}
