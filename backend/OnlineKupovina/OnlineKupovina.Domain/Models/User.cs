using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Domain.Models
{
    public class User
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public string Address { get; set; }
        public string ImageUri { get; set; }
        public UserType UserType { get; set; }
        public bool Verified { get; set; }
        public bool VerificationStatus { get; set; }
        public RegistrationType RegistrationType { get; set; }
        public List<Order> Orders { get; set; }
        public List<Item> Items { get; set; }
    }
}
