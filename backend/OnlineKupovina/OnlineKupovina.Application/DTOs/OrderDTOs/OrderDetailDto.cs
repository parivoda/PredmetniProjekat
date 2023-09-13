using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.DTOs.OrderDto
{
    public class OrderDetailDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int ItemQuantity { get; set; }
        public double Price { get; set; }
        public string SellerName { get; set; }
        public string ImageUri { get; set; }
    }
}
