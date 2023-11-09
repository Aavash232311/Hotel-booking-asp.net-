﻿using Microsoft.AspNetCore.Mvc;
using Bespeaking.Models;
using System.Security.Cryptography;
using Bespeaking.Data;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Data;
using Microsoft.AspNetCore.Authorization;
using Bespeaking.Simplified;

namespace restaurant_franchise.Controllers
{
    // 1 Admin
    // 2 Client
    // 3 Seller
    public class RefreshToken
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.Now;
        public DateTime BlackListDate { get; set; } = DateTime.Now;
    }

    public class RoleRequirments
    {
        public Guid userId { get; set; }
        public string Role { get; set; }
    }

    [Produces("application/json")]
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public AuthDbContext _context;
        public Fundamental helper;
        public AuthController(AuthDbContext context)
        {
            this._context = context;
            this.helper = new Fundamental(context);
        }
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterClient(Register userDetails)
        {

            Validator(userDetails.password, out bool status, out List<string> message);
            if (userDetails.password != userDetails.confrom_password)
            {
                status = false;
                message.Add("The two password field did not matched");
            }

            var UserExists = _context.Users.Where(x => x.username == userDetails.username || x.email == userDetails.email).FirstOrDefault();
            if (UserExists != null)
            {
                status = false;
                message.Add("User already esists !!");
            }

            if (status == false)
            {
                return new JsonResult(NotFound(message));
            }


            string magicPassword = BCrypt.Net.BCrypt.HashPassword(userDetails.password);
            var newUser = new User()
            {
                username = userDetails.username,
                email = userDetails.email,
                password = magicPassword,
                Address = userDetails.Address,
                DateJoined = DateTime.Now,
                city = userDetails.city,
                phone = userDetails.phone
            };
            var recentUser = this._context.Users.Add(newUser); // create a corresponding role for that user
            var Role = new Roles()
            {
                RoleId = 2, // BY DEFAULT REGISTRED USER IS A CLIENT
                UserId = recentUser.Entity.Id
            };
            _context.Roles.Add(Role);
            await _context.SaveChangesAsync();

            return new JsonResult(Ok(userDetails));
        }

        [HttpGet]
        [Route("RefreshToken")]
        public async Task<IActionResult> WhiteListToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = helper.GetUser(Request.Headers["Authorization"]);
            if (user == null) return new JsonResult(NotFound(new { value = "user not found" }));
            if (refreshToken != user.RefreshToken) return new JsonResult(Unauthorized(new {value = "server did not responsed anything :( "}));
            // now lets check if the token (refresh) is valid
            if (user.BlackListToken < DateTime.Now) return new JsonResult(Unauthorized(new {value = "session expired"}));

            // get the user first
            // check if the token from the cookie is equal to the refresh token saved in the database
            // check for the refresh token validation date
            // if everything okay even if access token is expired assign user a new one
            // aslo add a new refresh token so as s

             string accessToken = await CreateToken(user);
               // random token with assign and expirey date
             var newRefreshToken = GenerateToken();


               // assign token to http only cookie and save it in user record
              AssignHttpOnlyCookie(newRefreshToken, out RefreshToken RefreshTokenInfo);
              user.RefreshToken = RefreshTokenInfo.Token;
              user.DateCreated = RefreshTokenInfo.Date;
            user.BlackListToken = RefreshTokenInfo.BlackListDate;
            await _context.SaveChangesAsync();
            return new JsonResult(Ok(accessToken));
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Post(Login cred)
        {
            string username = cred.Username;
            var user = _context.Users.Where(x => x.username == username).FirstOrDefault();
            if (user == null)
            {
                return new JsonResult(BadRequest("Username or password is incorrect"));
            }

            bool isAuthenticated = BCrypt.Net.BCrypt.Verify(cred.Password, user.password);

            if (isAuthenticated == false)
            {
                return new JsonResult(BadRequest("Username or password is incorrect"));
            }
            string assignJwt = await CreateToken(user);
            // random token with assign and expirey date
            var refreshToken = GenerateToken();
            // assign token to http only cookie and save it in user record
            AssignHttpOnlyCookie(refreshToken, out RefreshToken RefreshTokenInfo);
            user.RefreshToken = RefreshTokenInfo.Token;
            user.DateCreated = RefreshTokenInfo.Date;
            user.BlackListToken = RefreshTokenInfo.BlackListDate;

            await _context.SaveChangesAsync(); //454545sdsdsdsf
            return new JsonResult(Ok(assignJwt));
        }

        private void AssignHttpOnlyCookie(RefreshToken tokenObject, out RefreshToken token)
        {
            // assigning it into http only cookie

            Response.Cookies.Append("refreshToken", tokenObject.Token, new CookieOptions()
            {
                HttpOnly = true,
                Expires = tokenObject.BlackListDate,
                Domain = "localhost",
                IsEssential = true,
            });
            token = tokenObject;
        }

        private RefreshToken GenerateToken()
        {
            // random 64 character string and token assign date as well as expirey date 
            var token = new RefreshToken()
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                BlackListDate = DateTime.Now.AddDays(2),
                Date = DateTime.Now,
            };
            return token;
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

        static private void Validator(string password, out bool status, out List<string> message)
        {
            int PasswordLength = password.Length;

            List<string> errors = new List<string>();
            bool Stat = true;

            if (password.Length <= 8)
            {
                Stat = false;
                errors.Add("Password must be minium 8 characters");
            }

            if (password.Length >= 25)
            {
                Stat = false;
                errors.Add("Password must be maximum 25 characters");
            }


            int AllInt = 0;
            int AllStr = 0;

            for (int i = 0; i < PasswordLength; i++)
            {
                try
                {
                    int.Parse(password[i].ToString());
                    AllInt++;
                }
                catch (Exception)
                {
                    AllStr++;
                }

            }
            if (AllInt == PasswordLength)
            {
                errors.Add("Password must not contain only numbers");
                Stat = false;
            }
            if (AllStr == PasswordLength)
            {
                errors.Add("Password must not contaion only alphabets");
                Stat = false;
            }

            status = Stat;
            message = errors;
        }
        [HttpGet]
        [Route("authorize")]
        [Authorize]
        public IActionResult CheckToken()
        {
            return new JsonResult(Ok());
        }
    }
}