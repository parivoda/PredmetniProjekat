using OnlineKupovina.Domain.Models;
using OnlineKupovina.Infrastructure.Context;

namespace OnlineKupovina.Infrastructure.Repositories
{
    public class ItemRepository : GenericRepository<Item>
    {
        public ItemRepository(OnlineKupovinaDBContext dbContext) : base(dbContext)
        {
        }

    }
}
