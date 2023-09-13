using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.DTOs.OrderDto
{
    public class OrderViewDto
    {
        public long OrderId { get; set; }
        public long ItemId { get; set; }
        public string ItemImage { get; set; }
        public string ItemName { get; set; }
        public int ItemQuantity { get; set; }
        public double ItemPrice { get; set; }
        public double TotalPrice { get; set; }
        public double Fee { get; set; }
    }
}
