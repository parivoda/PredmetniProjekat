using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.DTOs.OrderDto
{
    public class ConfirmOrderDto
    {
        public string Comment { get; set; }
        public string DeliveryAddress { get; set; }
        public string PaymentType { get; set; }
    }
}
