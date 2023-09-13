using OnlineKupovina.Domain.Models;
using OnlineKupovina.Infrastructure.Context;

namespace OnlineKupovina.Infrastructure.Repositories
{
    public class OrderItemRepository : GenericRepository<OrderItem>
    {
        public OrderItemRepository(OnlineKupovinaDBContext dbContext) : base(dbContext)
        {
        }
    }
}
