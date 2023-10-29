using Bespeaking.Data;
using Bespeaking.Models;
using Microsoft.AspNetCore.Mvc;
using Bespeaking.Simplified;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Client;

namespace Bespeaking.Controllers
{
    [Produces("application/json")]
    [Route("[controller]")]
    [ApiController]
    public class HotelController : ControllerBase
    {
        public AuthDbContext _context;
        public Fundamental helper;
        public HotelController(AuthDbContext op) {
            _context = op;
            this.helper = new Fundamental(op);
        }

        [Route("register-hotel")]
        [HttpPost]
        public async Task<IActionResult> RegisterHotel()
        {
            Fundamental props = new Fundamental(_context);
            var user = props.GetUser(Request.Headers["Authorization"]);
            if (user == null) return new JsonResult(NotFound("something went wrong :)"));
            Dictionary<string, string> dict = Request.Form.ToDictionary(x => x.Key, x => x.Value.ToString());
            try
            {
                Guid verify = Guid.Parse(dict["LicenseKey"]); // check weather the license is valid or not
                // check from license key weather that key exists or not
                var Company = _context.Comapnies.Where(x => x.CompanyId == verify).FirstOrDefault();
                if (Company == null)
                {
                    return new JsonResult(BadRequest( new {message = "Invalid license key"} ));
                }
            }catch (Exception ex)
            {
                return new JsonResult(BadRequest(
                    new  { 
                        message = dict["LicenseKey"],
                    }
                    ));
            }
            string json = JsonConvert.SerializeObject(dict);
            Hotel? additionalData = JsonConvert.DeserializeObject<Hotel>(json);
            if (additionalData == null) return new JsonResult(BadRequest());
            var file = Request.Form.Files;
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Images"); // physicsal directory 
            Hotel newInstance = additionalData;
            foreach (var i in file)
            {
                if (i != null)
                {
                    Dictionary<string, string> validationDict = props.validateStdImage(i, 5);
                    Console.WriteLine(validationDict["message"]);
                    if (validationDict["message"] != "success")
                    {
                        return new JsonResult(BadRequest(new {value = "unsupported formart"}));
                    }
                    // porbality of collision of guid is extremely low 3x10^38 approx
                    string hostPath = Path.Combine(Guid.NewGuid().ToString() + (i.FileName));
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "Images", hostPath); // hosting path
                    try
                    {
                        using (var stream = new FileStream(path, FileMode.Create))
                        {
                            await i.CopyToAsync(stream);
                            Console.WriteLine(i.Name + " " + hostPath);
                            additionalData =  props.setAttr(additionalData, i.Name, hostPath);
                        }
                    }

                    catch (Exception ex)
                    {
                        var Garbage = new { message = ex.Message };
                    }
                }
            }
            // save on file strean and then save respective path to database
            additionalData.user = user;
            _context.Hotels.Add(additionalData);
            // lets update a user role to hotel admin role
            var updateClientRole = _context.Roles.Where(x => x.UserId == user.Id).FirstOrDefault();
            if (updateClientRole != null)
            {
                int getRoleId = props.roleNameToId("Manager");
                updateClientRole.RoleId = getRoleId;
                // after changinf the role id lets give client a new jwt token 
                string assignJwt = await props.CreateToken(user);
                await _context.SaveChangesAsync();
                return new JsonResult(Ok(assignJwt));
            }
            else 
            { 
                 return new JsonResult(BadRequest(new
                {
                    message = "Something is wrong with your account!!"
                }));
            }
        }
        [HttpGet]
        [Route("get-hotel")]
        public IActionResult GetCurrentHotel()
        {
            var user = helper.GetUser(Request.Headers["Authorization"]);
            var hotel = _context.Hotels.Where(x => x.user.Id == user.Id).FirstOrDefault();
            var company = _context.Comapnies.Where(x => x.CompanyId == hotel.LicenseKey).FirstOrDefault();
            return new JsonResult(Ok(new { hotel = hotel,  company = company }));
        }

        [HttpPost]
        [Route("add-rooms")]
        public async Task<IActionResult> AddRooms()
        {
            // maimum room allowed is 20
            Dictionary<string, string> newDict = Request.Form.ToDictionary(x => x.Key, x => x.Value.ToString());
            string textJson = JsonConvert.SerializeObject(newDict);
            var inClassMappedForm = JsonConvert.DeserializeObject<Room>(textJson);
            var user = helper.GetUser(Request.Headers["Authorization"]);
            if (user == null) return new JsonResult(NotFound("something went wrong :)"));
            var room = _context.Rooms.Where(x => x.hotel.user.Id == user.Id).ToArray();
            if (room.Count() > 20) return new JsonResult(BadRequest(new { message = "maxmimum room type 20" }));
            var hotel = _context.Hotels.Where(x => x.user.Id == user.Id).FirstOrDefault();
            if (hotel == null) return new JsonResult(BadRequest(new { message = "CRITICAL Request not identitied" }));
            inClassMappedForm.hotel = hotel;
            if (inClassMappedForm == null)
            {
                return new JsonResult(BadRequest(new { message = "form invalid :( " }));
            }
            var files = Request.Form.Files[0];
            string imgGuid = Guid.NewGuid().ToString();
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Images", "room_images" + imgGuid + files.FileName);
            try
            {
                Dictionary<string, string> validationError = helper.validateStdImage(files, 5);
                if (validationError["message"] != "success") return new JsonResult(BadRequest(new { message = validationError }));
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await files.CopyToAsync(stream);
                    inClassMappedForm.roomImage = Path.Combine("room_images" + imgGuid + files.FileName);
                }
            }catch (Exception ex)
            {
                var Garbage = ex.Message;
                return new JsonResult(BadRequest(new {message = Garbage}));
            }
            _context.Rooms.Add(inClassMappedForm);
            await _context.SaveChangesAsync();
            return new JsonResult(Ok());
        }
        [HttpGet]
        [Route("get-rooms")]
        public IActionResult GetRooms()
        {
            var user = helper.GetUser(Request.Headers["Authorization"]);
            var room = _context.Rooms.Where(x => x.hotel.user.Id == user.Id).ToArray(); // its not gonna flood because we have restriction of 20
            return new JsonResult(Ok(room));
        }
    }
}
