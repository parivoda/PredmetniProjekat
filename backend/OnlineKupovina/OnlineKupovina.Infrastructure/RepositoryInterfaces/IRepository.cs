using System.Linq.Expressions;

namespace OnlineKupovina.Infrastructure.RepositoryInterfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<IEnumerable<TEntity>> GetAll();
        Task<TEntity> GetById(params object[] keys);
        Task Create(TEntity entity);
        void Delete(TEntity entity);
        Task SaveChanges();

        Task<TEntity> FindBy(Expression<Func<TEntity, bool>> predicate);
        Task<IEnumerable<TEntity>> FindAllBy(Expression<Func<TEntity, bool>> predicate);
    }
}
