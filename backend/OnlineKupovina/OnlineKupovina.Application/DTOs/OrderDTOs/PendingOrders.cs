using OnlineKupovina.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.DTOs.OrderDto
{
    public class PendingOrders
    {
        public long Id { get; set; }
        public string Comment { get; set; }
        public string DeliveryAddress { get; set; }
        public DateTime OrderingTime { get; set; }
        public double TotalPrice { get; set; }
        public PaymentType PaymentType { get; set; }
    }
}
