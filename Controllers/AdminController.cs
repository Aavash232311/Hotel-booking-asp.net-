using Bespeaking.Data;
using Bespeaking.Models;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Bespeaking.Controllers
{
    public class UpdateCompanyDetails
    {
        public Guid Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyDescription { get; set; } = string.Empty;
        public int CompanyContactNumber { get; set; }
        public int CompanyRating { get; set; } = 0;

    }

    [Produces("application/json")]
    [Route("[controller]")]
    [ApiController]
    public class AdminController : Controller
    {
        public AuthDbContext _context;
        public AdminController(AuthDbContext options)
        {
            this._context = options;
        }

        public object UserToRespectiveRoles(List<User> users)
        {
            List<Roles> role = new List<Roles>();
            var allPossibleRoles = _context.UserRoles.ToList();
            foreach (var i in users)
            {
                // get each user role
                var getCurrentUserRole = _context.Roles.Where(x => x.UserId == i.Id).FirstOrDefault();
                if (getCurrentUserRole != null)
                {
                    role.Add(getCurrentUserRole);
                }
            }
            return new { role, allPossibleRoles, users };
        }

        [Route("default-user")]
        [HttpGet]
        public IActionResult GetAdminUser()
        {
            var defaultInitialUser = _context.Users.OrderByDescending(u => u.DateJoined).Take(5).ToList();
            return new JsonResult(Ok(UserToRespectiveRoles(defaultInitialUser)));
        }
        [Route("user-search")]
        [HttpGet]
        public IActionResult GetSearchedUser(string Query)
        {
            Query = Query.ToLower();
            var getUserByName = _context.Users.AsEnumerable().Where(q => Query.All(k => q.username.Contains(k)) || Query.All(k => q.email.Contains(k))).ToList().Take(5);

              return new JsonResult(Ok(getUserByName));
        }

        [Route("user-delete")]
        [HttpGet]
        public async Task<IActionResult> DeleteSelectedUser(string userId)
        {
            if (userId == null) return new JsonResult(BadRequest());
            try
            {
                Guid newId = Guid.Parse(userId);
                var user = _context.Users.Where(x => x.Id == newId).FirstOrDefault();
                if (user != null)
                {
                    _context.Users.Remove(user);
                    // REMOVE USER ROLES TOO
                    var userRoles = _context.Roles.Where(x => x.UserId == newId).FirstOrDefault();
                    if (userRoles != null)
                    {
                        _context.Roles.Remove(userRoles);
                    }
                    await _context.SaveChangesAsync();
                }
            }catch (Exception ex) { return new JsonResult(BadRequest(ex)); }

            return new JsonResult(Ok());
        }
        [Route("user-roles")]
        [HttpGet]
        public IActionResult GetUserRoles()
        {
            var userRoles = _context.UserRoles.ToList();
            return new JsonResult(Ok(userRoles));
        }
        [Route("create-role")]
        [HttpGet]
        public async Task<IActionResult> CreateRole(string name)
        {
            UserRole role = new UserRole()
            {
                Name = name
            };
            var newRole = _context.UserRoles.Add(role);
            await _context.SaveChangesAsync();
            return new JsonResult(Ok(newRole.Entity));
        }

        [Route("get-company")]
        [HttpGet]
        public IActionResult GetCompany(string LastItem)
        {
            // initial load will be 10 of them
            if (LastItem == "null")
            {
                var company = _context.Comapnies.OrderByDescending(x => x.CreatedDate).Take(10).ToList();
                return new JsonResult(company);
            }

            var lastItemDate = DateTime.Parse(LastItem);
            var dataBelow = _context.Comapnies.Where(x => x.CreatedDate < lastItemDate).OrderByDescending(x => x.CreatedDate).Take(5).ToList();
            return new JsonResult(dataBelow);
        }

        [Route("edit-company")]
        [HttpPost]
        public async Task<IActionResult> GetCompanyCread(UpdateCompanyDetails details)
        {
            var getModel = _context.Comapnies.Where(x => x.Id == details.Id).FirstOrDefault();   
            if (getModel == null) { return new JsonResult(NotFound()); }
            getModel.Name = details.CompanyName;
            getModel.Description = details.CompanyDescription;
            getModel.Rating = details.CompanyRating;
            getModel.CompanyContactNumber = details.CompanyContactNumber;

            await _context.SaveChangesAsync();
            return new JsonResult(Ok());
        }
        [Route("register-company")]
        [HttpPost]
        public async Task<IActionResult> RegisterCompany(UpdateCompanyDetails company)
        {
            Company newCompany = new Company()
            {
                Name = company.CompanyName,
                Description = company.CompanyDescription,
                Rating = company.CompanyRating,
                CompanyContactNumber = company.CompanyContactNumber,
                CompanyId = Guid.NewGuid(),
                CreatedDate = DateTime.Now,
            };
            var recent = _context.Comapnies.Add(newCompany);
            await _context.SaveChangesAsync();
            return new JsonResult(Ok(recent.Entity));
        }
        [Route("search-company")]
        [HttpGet]
        public IActionResult GetCompanyResults(string query)
        {
            if (query.Length >= 100)
            {
                return new JsonResult(NotFound());
            }
            try
            {
                Guid qry = Guid.Parse(query);
                var result = _context.Comapnies.Where(x => x.CompanyId == qry).FirstOrDefault();
                return new JsonResult(Ok(result));
            } catch (Exception ex)
            {
                // try for perfect match 
                var exactMatch = _context.Comapnies.Where(x => x.Name== query).FirstOrDefault();
                if (exactMatch != null) {
                    return new JsonResult(Ok(exactMatch)); // since react function in client side maps as list
                }
                query = query.ToLower();
                var results = _context.Comapnies.AsEnumerable().Where(q => query.All(k => q.Name.ToLower().Contains(k))).ToList().Take(5);
                return new JsonResult(Ok(results));
            }
        }
    }
}
