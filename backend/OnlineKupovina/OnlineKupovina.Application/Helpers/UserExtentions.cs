using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace OnlineKupovina.Application.Helpers
{
    public static class UserExtentions
    {
        public static string GetId(this ClaimsPrincipal user)
        {
            var result = user.Claims.FirstOrDefault(claim => claim.Type == "id")?.Value;
            if (string.IsNullOrEmpty(result))
            {
                throw new InvalidOperationException();
            }
            return result;
        }
    }
}
