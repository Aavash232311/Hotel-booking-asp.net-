using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using Bespeaking.Models;
using System.Security.Claims;
using Bespeaking.Data;
using Azure.Core;
using Microsoft.IdentityModel.Tokens;

namespace Bespeaking.Simplified
{
    public class Fundamental
    {
        public AuthDbContext _context;
        public Fundamental(AuthDbContext op) { 
            _context = op;
        }

        private static string[] fileExtension = { "jpg", "jepg", "png", "gif" };
        public  bool HasProperty(object obj, string propertyName)
        {
            Type type = obj.GetType();
            PropertyInfo? propertyInfo = type.GetProperty(propertyName);
            return propertyInfo != null;
        }
       public  void LocationAndValue(dynamic obj, dynamic key, dynamic value, out dynamic newObject)
        {
            if (HasProperty(obj, key)) // making sure we have that key
            {
                obj.GetType().GetProperty(key).SetValue(obj, value);
            }
            newObject = obj;
        }

        public Dictionary<string, string> validateStdImage(dynamic file, int maxSize)
        {
            string fileName = file.FileName;
            if (fileName.Split('.').Length == 1) { return new Dictionary<string, string>() { { "message", "file not supported" } }; }
            string extension = fileName.Split('.')[1];
            bool FileValid = false;
            for (int i = 0; i < fileExtension.Length; i++)
            {
                if (fileExtension[i] == extension)
                {
                    FileValid = true;
                    break;
                }
            }
            if (!FileValid) { return new Dictionary<string, string>() { { "message", "file not supported" } }; }
            // check for file restriction 
            float sizeInbYTE = (file.Length / 1024);
            double inmB = sizeInbYTE / 1024;
            if (inmB > maxSize)
            {
                return new Dictionary<string, string>()
                {
                    {"message", "maximum allowed size is " + maxSize + "mb" }
                };
            }else
            {
                return new Dictionary<string, string>()
                {
                    {"message", "success" }
                };
            }
        }
        public dynamic setAttr(dynamic obj, dynamic name, dynamic value)
        {
            Type type = obj.GetType();
            PropertyInfo[] propertyInfos = type.GetProperties();
            foreach (var i in propertyInfos)
            {
                try
                {
                    obj.GetType().GetProperty(name).SetValue(obj, value);
                }
                catch (Exception ex)
                {

                }
            }
            return obj;
        }
        public User GetUser(dynamic token)
        {
            string newToken = token.ToString().Split(' ')[1];
            byte[] secretKey = System.Text.Encoding.UTF8.GetBytes("my top secret key");
            var tokenHandler = new JwtSecurityTokenHandler();
            var data = tokenHandler.ReadJwtToken(newToken);
            IEnumerable<Claim> claims = data.Claims;
            string uniqueUser = claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            var user = _context.Users.Where(x => x.username == uniqueUser).FirstOrDefault();
            if (user == null)
            {
                return null;
            }
            return user;
        }

        public int roleNameToId(string name)
        {
            return _context.UserRoles.Where(x => x.Name == name).FirstOrDefault().Id;
        }
        public async Task<string> CreateToken(User user)
        {
            var RoleUserMap = _context.Roles.Where(x => x.UserId == user.Id).FirstOrDefault(); // role id of that user
            if (RoleUserMap == null)
            {
                // create a default null role if not created
                var newUserRole = new Roles()
                {
                    UserId = user.Id,
                    RoleId = 2,
                };
                _context.Roles.Add(newUserRole);
                await _context.SaveChangesAsync();
            }

            var actualRole = _context.UserRoles.Where(x => x.Id == RoleUserMap.RoleId).FirstOrDefault();

            if (actualRole == null) return "";
            // role assignment in jwt token is baed on assigned role in database 
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.username),
                new Claim(ClaimTypes.Role, actualRole.Name)
            };
            byte[] secretKey = System.Text.Encoding.UTF8.GetBytes("my top secret key");
            var key = new SymmetricSecurityKey(secretKey);

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}
