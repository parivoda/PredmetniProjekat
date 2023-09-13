using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.ServiceInterfaces
{
    public interface IEmailService
    {
        Task SendEmail(string to, string subject, string body);

        public bool IsValidEmail(string email);
    }
}
