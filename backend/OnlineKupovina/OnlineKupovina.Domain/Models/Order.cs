using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Domain.Models
{
    public class Order
    {
        public long Id { get; set; }
        public string Comment { get; set; }
        public string DeliveryAddress { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public User Purchaser { get; set; }
        public long PurchaserId { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime DeliveryTime { get; set; }
        public DateTime OrderingTime { get; set; }
        public double TotalPrice { get; set; }
        public bool IsDelivered { get; set; }
        public bool IsAccepted { get; set; }
        public PaymentType PaymentType { get; set; }

        public Order(string userAddress,long purchaserId,double total)
        {
            DeliveryAddress = userAddress;
            Comment= string.Empty;
            DeliveryAddress= string.Empty;
            PurchaserId = purchaserId;
            OrderingTime = DateTime.Now;
        }

        public Order() { }

        public Order(long id, string comment, string deliveryAddress, List<OrderItem> orderItems, User purchaser, long purchaserId, OrderStatus status, DateTime deliveryTime, DateTime orderingTime, double totalPrice, bool isDelivered, bool isAccepted, PaymentType paymentType)
        {
            Id = id;
            Comment = comment;
            DeliveryAddress = deliveryAddress;
            OrderItems = orderItems;
            Purchaser = purchaser;
            PurchaserId = purchaserId;
            Status = status;
            DeliveryTime = deliveryTime;
            OrderingTime = orderingTime;
            TotalPrice = totalPrice;
            IsDelivered = isDelivered;
            IsAccepted = isAccepted;
            PaymentType = paymentType;
        }
    }
}
