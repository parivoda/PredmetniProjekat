using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Domain.Models
{
    public class OrderItem
    {
        public Item Item { get; set; }
        public long ItemId { get; set; }
        public int ItemQuantity { get; set; }
        public Order Order { get; set; }
        public long OrderId { get; set; }
    }
}
