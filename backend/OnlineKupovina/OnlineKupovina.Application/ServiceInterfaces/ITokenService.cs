using OnlineKupovina.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.ServiceInterfaces
{
    public interface ITokenService
    {
        string GenerateToken(long id, UserType userType, bool verified);
    }
}
