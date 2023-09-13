using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.Helpers
{
    public class PaginationResult<T>
    {
        public List<T> Data { get; set; }
        public int TotalRows { get; set; }
    }
}
