using Microsoft.AspNetCore.Http;

namespace OnlineKupovina.Application.DTOs.ItemDTOs
{
    public class AddItemDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public IFormFile ImageUri { get; set; }
    }
}
