using OnlineKupovina.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.DTOs.UserDTOs
{
    public class UserInfoDto
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUri { get; set; }
        public bool Verified { get; set; }
        public bool VerificationStatus { get; set; }
        public UserType UserType { get; set; }
    }
}
