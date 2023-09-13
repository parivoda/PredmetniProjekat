using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.DTOs.OrderDto
{
    public class OrderListCustomerDto
    {
        public long Id { get; set; }
        public string Comment { get; set; }
        public string DeliveryAddress { get; set; }
        public DateTime DeliveryTime { get; set; }
        public DateTime OrderingTime { get; set; }
        public double TotalPrice { get; set; }
        public bool IsDelivered { get; set; }

    }
}
