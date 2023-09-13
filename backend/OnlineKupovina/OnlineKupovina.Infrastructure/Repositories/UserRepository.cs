using OnlineKupovina.Domain.Models;
using OnlineKupovina.Infrastructure.Context;

namespace OnlineKupovina.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>
    {
        public UserRepository(OnlineKupovinaDBContext dbContext) : base(dbContext)
        {
        }
    }
}
