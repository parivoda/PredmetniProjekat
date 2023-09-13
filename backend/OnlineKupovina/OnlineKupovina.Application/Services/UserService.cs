using AutoMapper;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using OnlineKupovina.Application.DTOs.UserDTOs;
using OnlineKupovina.Application.Helpers;
using OnlineKupovina.Application.ServiceInterfaces;
using OnlineKupovina.Domain.Models;
using OnlineKupovina.Infrastructure.RepositoryInterfaces;
using Org.BouncyCastle.Crypto.Generators;

namespace OnlineKupovina.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly IRepository<User> _repository;
        private readonly IEmailService _emailService;
        private readonly IConfigurationSection _googleCredentials;
        private readonly ITokenService _tokenService;

        public UserService(IMapper mapper, IRepository<User> repository, IConfiguration config,
            IEmailService emailService, ITokenService tokenService)
        {
            _mapper = mapper;
            _repository = repository;
            _emailService = emailService;
            _googleCredentials = config.GetSection("GoogleClientId");
            _tokenService = tokenService;
        }

        public async Task<TokenDto> RegisterUser(UserDto newUser)
        {
            if (_emailService.IsValidEmail(newUser.Email))
            {
                User user = await _repository.FindBy(x => x.Email.Equals(newUser.Email));
                if (user == null)
                {
                    user = _mapper.Map<User>(newUser);
                    if (!newUser.UserType.Equals(UserType.Seller))
                    {
                        user.Verified = true;
                        user.VerificationStatus = true;
                    }

                    if (newUser.ImageUri != null && newUser.ImageUri.Length > 0)
                    {
                        string imagePath = await ImageHandler.SaveImageFile(newUser.ImageUri, Path.Combine("Images", "Users"));

                        user.ImageUri = imagePath;
                    }
                    else
                    {
                        string defaultImagePath = Path.Combine("Images", "Users", "default-profile-picture.png");
                        user.ImageUri = defaultImagePath;
                    }

                    user.RegistrationType = RegistrationType.Classic;
                    user.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
                    await _repository.Create(user);
                    await _repository.SaveChanges();


                    return new TokenDto { Token = _tokenService.GenerateToken(user.Id, user.UserType, user.Verified) };
                }
                else
                {
                    throw new Exception("User with that email already exists. Try another one.");
                }
            }
            else
            {
                throw new InvalidDataException("Email is not in correct format. Valid format is: example@gmail.com");
            }
        }

        public async Task<TokenDto> RegisterWithGoogle(GoogleSignInDto googleSignInDto)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(googleSignInDto.GoogleToken);
            if (payload.Audience.ToString() == _googleCredentials.Value)
            {
                throw new InvalidJwtException("Invalid google token.");
            }

            User user = await _repository.FindBy(x => x.Email.Equals(payload.Email));

            if (user == null)
            {
                // napravi novog 
                user = new User
                {
                    Email = payload.Email,
                    Username = payload.GivenName + "_" + payload.FamilyName,
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName,
                    Password = "google pass",
                    Address = "Google address",
                    UserType = UserType.Customer,
                    BirthDate = new DateTime(2000, 10, 10),
                    Verified = true,
                    VerificationStatus = true,
                    RegistrationType = RegistrationType.Google
                };
                if (payload.Picture != null)
                {
                    string imageUrl = payload.Picture;
                    string targetFolderPath = Path.Combine("Images", "Users");

                    string res = await ImageHandler.SaveGoogleImage(imageUrl, targetFolderPath);
                    user.ImageUri = res;
                }
                else
                {
                    string defaultImagePath = Path.Combine("Images", "Users", "default-profile-picture.png");
                    user.ImageUri = defaultImagePath;
                }

                await _repository.Create(user);
                await _repository.SaveChanges();

                return new TokenDto { Token = _tokenService.GenerateToken(user.Id, user.UserType, user.Verified) };
            }

            // samo token
            return new TokenDto { Token = _tokenService.GenerateToken(user.Id, user.UserType, user.Verified) };
        }

        public async Task<TokenDto> LoginUser(UserLoginDto loginUser)
        {
            User existingUser = await _repository.FindBy(x => x.Email.Equals(loginUser.Email));
            if (_emailService.IsValidEmail(loginUser.Email))
            {
                if (existingUser == null)
                {
                    throw new InvalidDataException("User with that email doesn't exist. Try again.");
                }
                else if (!BCrypt.Net.BCrypt.Verify(loginUser.Password, existingUser.Password))
                {
                    throw new InvalidDataException("Incorrect password. Try again.");
                }

                return new TokenDto { Token = _tokenService.GenerateToken(existingUser.Id, existingUser.UserType, existingUser.Verified) };
            }
            else
            {
                throw new InvalidDataException("Email is not in correct format. Valid format is: example@gmail.com");
            }

        }

        public async Task<UserProfileDto> UpdateProfile(long id, UpdateUserProfile newProfile)
        {
            User user = await _repository.GetById(id);
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }
            else
            {
                if (newProfile.ImageUri != null && newProfile.ImageUri.Length > 0)
                {
                    string imagePath = await ImageHandler.SaveImageFile(newProfile.ImageUri, Path.Combine("Images", "Users"));

                    user.ImageUri = imagePath;
                }

                user.Username = newProfile.Username;
                user.FirstName = newProfile.FirstName;
                user.LastName = newProfile.LastName;
                user.Address = newProfile.Address;
                user.BirthDate = newProfile.BirthDate;

                await _repository.SaveChanges();
                return _mapper.Map<UserProfileDto>(user);
            }
        }

        public async Task<UserProfileDto> UsersProfile(long id)
        {
            var user = await _repository.GetById(id);
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            return _mapper.Map<UserProfileDto>(user);
        }

        public async Task<PaginationResult<UserInfoDto>> GetUnverifiedSellers(int page, int rowsPerPage)
        {
            var users = await _repository.FindAllBy(x => !x.UserType.Equals(UserType.Administrator));
            if (users.Any())
            {
                var sortedUsers = users.OrderBy(x => x.UserType == UserType.Seller ? 0 : 1).ThenBy(x => x.VerificationStatus ? 1 : 0);
                var totalRows = sortedUsers.Count();

                var paginatedUsers = sortedUsers
                    .Skip(page * rowsPerPage)
                    .Take(rowsPerPage)
                    .ToList();

                var result = new PaginationResult<UserInfoDto>
                {
                    Data = _mapper.Map<List<UserInfoDto>>(paginatedUsers),
                    TotalRows = totalRows
                };

                return result;
            }

            throw new ArgumentNullException();

        }

        public async Task VerifyUser(long id)
        {
            var user = await _repository.GetById(id);
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            user.Verified = true;
            user.VerificationStatus = true;
            await _repository.SaveChanges();

             _emailService.SendEmail(user.Email, "Welcome to web shop", $"Hello {user.FirstName}." +
                $" Administrator has approved your registration request. You can start adding items!");
        }

        public async Task ChangePassword(long id, ChangePasswordDto newPassword)
        {
            var user = await _repository.GetById(id);
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword.NewPassword);
            await _repository.SaveChanges();
        }

        public async Task DeclineUser(long id)
        {
            var user = await _repository.GetById(id);
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            user.VerificationStatus = true;
            await _repository.SaveChanges();

             _emailService.SendEmail(user.Email, "Registration", $"Hello {user.FirstName}." +
                $" Administrator has rejected your registration request.");
        }

        public async Task<VerificationDto> GetVerificationStatus(long id)
        {
            var user = await _repository.GetById(id);
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            return _mapper.Map<VerificationDto>(user);
        }

    }
}
