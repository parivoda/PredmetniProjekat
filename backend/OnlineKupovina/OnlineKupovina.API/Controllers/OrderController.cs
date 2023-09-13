using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineKupovina.Application.DTOs.OrderDto;
using OnlineKupovina.Application.Helpers;
using OnlineKupovina.Application.ServiceInterfaces;
using System.Data;

namespace OnlineKupovina.API.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("add-to-cart/{itemId}/{quantity}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> AddToCart([FromRoute] long itemId, [FromRoute] int quantity)
        {
            long userId = long.Parse(User.GetId());
            try
            {
                await _orderService.AddItemToCart(userId, itemId, quantity);
                return Ok("Item successfully added to cart. Go to cart to check your order!");

            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("order-view")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetOrderView()
        {
            long userId = long.Parse(User.GetId());
            try
            {
                return Ok(await _orderService.CurrentOrderView(userId));

            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{itemId}/{orderId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> DeleteOrderItem([FromRoute] long itemId, [FromRoute] long orderId)
        {
            try
            {
                await _orderService.DeleteOrderItem(itemId, orderId);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Failed to delete order item.");
            }
        }

        [HttpDelete("{orderId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> DeleteOrder([FromRoute] long orderId)
        {
            try
            {
                await _orderService.DeleteOrder(orderId);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Failed to delete order.");
            }
        }

        [HttpPut("confirm-order/{orderId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> ConfirmOrder([FromRoute] long orderId, [FromBody] ConfirmOrderDto confirmOrderDto)
        {
            try
            {
                await _orderService.ConfirmOrder(orderId, confirmOrderDto);
                return Ok("Order is successfully confirmed, wait for seller to start delivering.");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("previous-orders")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> PreviousOrders()
        {
            long userId = long.Parse(User.GetId());
            try
            {
                return Ok(await _orderService.CustomersOrders(userId));

            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("order-details/{orderId}")]
        [Authorize(Roles = "Customer, Administrator")]
        public async Task<IActionResult> GetOrderDetails([FromRoute] long orderId)
        {
            try
            {
                return Ok(await _orderService.GetOrderDetails(orderId));

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("seller-order-details/{orderId}")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetSellerOrderDetails([FromRoute] long orderId)
        {
            long userId = long.Parse(User.GetId());
            try
            {
                return Ok(await _orderService.GetOrderDetails(orderId, userId));

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("cancel-order/{orderId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CancelOrder([FromRoute] long orderId)
        {
            try
            {
                await _orderService.CancelOrder(orderId);
                return Ok("Order is successfully canceled.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest("Failed to cancel order.");
            }
        }

        [HttpGet("all-orders")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                return Ok(await _orderService.AllOrders());

            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("seller-orders")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetSellerOrders([FromQuery] bool isNew)
        {
            long userId = long.Parse(User.GetId());
            try
            {
                return Ok(await _orderService.GetSellerOrders(userId, isNew));

            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("pending-orders")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetPendingOrders()
        {
            long userId = long.Parse(User.GetId());
            try
            {
                return Ok(await _orderService.GetUsersPendingOrders(userId));

            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("orders-map")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetOrdersOnMap()
        {
            long userId = long.Parse(User.GetId());
            try
            {
                return Ok(await _orderService.GetOrdersOnMap(userId));

            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPut("accept-order/{orderId}")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> AcceptOrder([FromRoute] long orderId)
        {
            try
            {
                await _orderService.AcceptOrder(orderId);
                return Ok("Order successfully accepted, you can see it in new orders.");

            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}
