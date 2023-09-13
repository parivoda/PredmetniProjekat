using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineKupovina.Application.DTOs.ItemDTOs;
using OnlineKupovina.Application.Helpers;
using OnlineKupovina.Application.ServiceInterfaces;

namespace OnlineKupovina.API.Controllers
{
    [Route("api/items")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemsController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetAllItems()
        {
            try
            {
                return Ok(await _itemService.GetItems());
            }
            catch (Exception)
            {
                return NotFound("No available items.");
            }
        }

        [HttpGet("seller-items")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetSellerItems()
        {
            long id = long.Parse(User.GetId());
            try
            {
                return Ok(await _itemService.GetSellerItems(id));
            }
            catch (Exception)
            {
                return NotFound("You don't have any articles yet.");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> AddItem([FromForm] AddItemDto item)
        {
            long id = long.Parse(User.GetId());
            try
            {
                return Ok(await _itemService.AddItem(id, item));
            }
            catch (InvalidOperationException opEx)
            {
                return BadRequest(opEx.Message);
            }
            catch (Exception)
            {
                return BadRequest("Failed to add new item");
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> DeleteItem([FromRoute] string id)
        {
            long itemId = long.Parse(id);
            try
            {
                await _itemService.DeleteItem(itemId);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Failed to delete item because there are orders in progress which contains it.");
            }
        }

        [HttpPost("update-item")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> UpdateItem([FromForm] UpdateItemDto item)
        {
            try
            {
                return Ok(await _itemService.UpdateItem(item));

            }
            catch (InvalidOperationException opEx)
            {
                return BadRequest(opEx.Message);
            }
            catch (Exception)
            {
                return BadRequest("Failed to update item.");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetItem([FromRoute] long id)
        {
            try
            {
                return Ok(await _itemService.GetItem(id));
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}
