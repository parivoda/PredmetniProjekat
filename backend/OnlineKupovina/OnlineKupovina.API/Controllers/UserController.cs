using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineKupovina.Application.DTOs.UserDTOs;
using OnlineKupovina.Application.Helpers;
using OnlineKupovina.Application.ServiceInterfaces;

namespace OnlineKupovina.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> CreateUser([FromForm] UserDto user)
        {
            try
            {
                return Ok(await _userService.RegisterUser(user));

            }
            catch (InvalidDataException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] UserLoginDto user)
        {
            try
            {
                return Ok(await _userService.LoginUser(user));
            }
            catch (InvalidDataException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest("Something went wrong.");
            }
        }


        [HttpPost("google-signin")]
        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInDto googleSignInDto)
        {
            try
            {
                return Ok(await _userService.RegisterWithGoogle(googleSignInDto));
            }
            catch (InvalidJwtException jwtEx)
            {
                return Unauthorized(jwtEx.Message);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateUser([FromForm] UpdateUserProfile user)
        {
            long id = long.Parse(User.GetId());
            try
            {
                return Ok(await _userService.UpdateProfile(id, user));

            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> MyProfile()
        {
            long id = long.Parse(User.GetId());
            try
            {
                return Ok(await _userService.UsersProfile(id));
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            long id = long.Parse(User.GetId());
            try
            {
                await _userService.ChangePassword(id, changePasswordDto);
                return Ok("Successfully changed password");
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet("sellers")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetUnverifiedUsers(int page = 1, int rowsPerPage = 3)
        {
            try
            {
                return Ok(await _userService.GetUnverifiedSellers(page, rowsPerPage));

            }
            catch (Exception)
            {
                return NotFound("No users.");
            }
        }

        [HttpPut("verify/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> VerifyUser([FromRoute] long id)
        {
            try
            {
                await _userService.VerifyUser(id);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Something went wrong :/");
            }
        }

        [HttpPut("decline/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeclineUser([FromRoute] long id)
        {
            try
            {
                await _userService.DeclineUser(id);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Something went wrong :/");
            }
        }

        [HttpGet("verification-status")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> SellerVerificationStatus()
        {
            try
            {
                long id = long.Parse(User.GetId());
                return Ok(await _userService.GetVerificationStatus(id));
            }
            catch (Exception)
            {
                return BadRequest("Something went wrong :/");
            }
        }
    }
}
