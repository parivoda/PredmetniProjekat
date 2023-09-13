using OnlineKupovina.Application.DTOs.ItemDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.ServiceInterfaces
{
    public interface IItemService
    {
        Task<List<ItemDto>> GetItems();
        Task<ItemDto> AddItem(long id, AddItemDto newItem);
        Task DeleteItem(long id);
        Task<ItemDto> UpdateItem(UpdateItemDto item);
        Task<ItemDto> GetItem(long id);
        Task<List<ItemDto>> GetSellerItems(long sellerId);
    }
}
