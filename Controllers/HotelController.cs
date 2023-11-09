using Bespeaking.Data;
using Bespeaking.Models;
using Microsoft.AspNetCore.Mvc;
using Bespeaking.Simplified;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Client;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json.Linq;

namespace Bespeaking.Controllers
{
    public class EsewaMerchant
    {
        [MaxLength(100)]
        [Required]
        public string MerchantKey { get; set; } = string.Empty;
        [Required]
        [MaxLength(20)]
        public string Tax { get; set; }
    }
    [Produces("application/json")]
    [Route("[controller]")]
    [ApiController]
    public class HotelController : ControllerBase
    {
        public AuthDbContext _context;
        public Fundamental helper;
        public HotelController(AuthDbContext op)
        {
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
                    return new JsonResult(BadRequest(new { message = "Invalid license key" }));
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(BadRequest(
                    new
                    {
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
                        return new JsonResult(BadRequest(new { value = "unsupported formart" }));
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
                            additionalData = props.setAttr(additionalData, i.Name, hostPath);
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
            // check is hotel is live or not 
            return new JsonResult(Ok(new { hotel = hotel, company = company }));
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
            }
            catch (Exception ex)
            {
                var Garbage = ex.Message;
                return new JsonResult(BadRequest(new { message = Garbage }));
            }
            var roomsAdded = _context.Rooms.Add(inClassMappedForm);
            await _context.SaveChangesAsync();
            return new JsonResult(Ok(roomsAdded.Entity));
        }
        [HttpGet]
        [Route("get-rooms")]
        public IActionResult GetRooms()
        {
            var user = helper.GetUser(Request.Headers["Authorization"]);
            var room = _context.Rooms.Where(x => x.hotel.user.Id == user.Id).ToArray(); // its not gonna flood because we have restriction of 20
            return new JsonResult(Ok(room));
        }
        [AllowAnonymous]
        [HttpPost]
        [Route("update-hotel")]
        public async Task<IActionResult> UpdateHotel()
        {
            Dictionary<string, string> newDict = Request.Form.ToDictionary(x => x.Key, x => x.Value.ToString());
            string textJson = JsonConvert.SerializeObject(newDict);
            Hotel inClassMappedForm;
            try
            {
                inClassMappedForm = JsonConvert.DeserializeObject<Hotel>(textJson);
            }
            catch (Exception ex) { return new JsonResult(BadRequest(new { value = ex.Message })); }
            if (inClassMappedForm == null) return new JsonResult(NotFound());
            var user = helper.GetUser(Request.Headers["Authorization"]);
            Guid id = user.Id; // CHECK FOR HOTEL ID TOO
            var hotel = _context.Hotels.AsNoTracking().Where(x => x.user.Id == id).FirstOrDefault();
            if (hotel == null) return new JsonResult(NotFound());
            // in short client can only modify model which is registered in this account
            if (hotel.LicenseKey != inClassMappedForm.LicenseKey) return new JsonResult(NotFound("You can't user others key"));
            if (hotel.Id != inClassMappedForm.Id) return new JsonResult(NotFound("Something went wrong :( "));
            if (hotel.LicenseKey != inClassMappedForm.LicenseKey) return new JsonResult(NotFound());
            var files = Request.Form.Files; // let check through files
            foreach (var i in files)
            {
                if (i != null)
                {
                    Dictionary<string, string> validationDict = helper.validateStdImage(i, 5);
                    if (validationDict["message"] != "success")
                    {
                        return new JsonResult(BadRequest(new { value = "unsupported formart" }));
                    }
                    // porbality of collision of guid is extremely low 3x10^38 approx
                    string hostPath = Path.Combine(Guid.NewGuid().ToString() + (i.FileName));
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "Images", hostPath); // hosting path
                    try
                    {
                        using (var stream = new FileStream(path, FileMode.Create))
                        {
                            await i.CopyToAsync(stream);
                            // after you save something to sream remove old one
                            string checkForOldImage = helper.GetAttr(hotel, i.Name).ToString();
                            if (checkForOldImage != string.Empty)
                            {
                                var getPathofOldie = Path.Combine(Directory.GetCurrentDirectory(), "Images", checkForOldImage);
                                if (System.IO.File.Exists(getPathofOldie))
                                {
                                    System.IO.File.Delete(getPathofOldie);
                                }

                            }
                            inClassMappedForm = helper.setAttr(inClassMappedForm, i.Name, hostPath);
                        }
                    }

                    catch (Exception ex)
                    {
                        var Garbage = new { message = ex.Message };
                    }
                }
            }
            _context.Entry(inClassMappedForm).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new JsonResult(Ok(files));
        }
        [HttpGet]
        [AllowAnonymous]
        [Route("get-hotel-view")]
        public IActionResult GetHotel(string id)
        {
            try
            {
                Guid Id = Guid.Parse(id);
                var GetHotel = _context.Hotels.Where(x => x.Id == Id && x.live == true).FirstOrDefault();
                if (GetHotel == null) return new JsonResult(NotFound("Not Found"));
                var companyInfo = _context.Comapnies.Where(x => x.CompanyId == GetHotel.LicenseKey).FirstOrDefault();
                return new JsonResult(Ok(new { hotel = GetHotel, company = companyInfo }));

            }
            catch (Exception ex)
            {
                return new JsonResult(NotFound(new { value = ex.Message }));
            }
        }
        [HttpGet]
        [AllowAnonymous]
        [Route("get-room-view")]
        public IActionResult GetRoom(string ids)
        {
            try
            {
                Guid id = Guid.Parse(ids);
                Hotel? hotel = _context.Hotels.Where(x => x.Id == id && x.live == true).FirstOrDefault();
                if (hotel == null) { return new JsonResult(NotFound(new { value = "not found" })); }
                var GetRoomView = _context.Rooms.Where(x => x.hotel == hotel).Select(x => new
                {
                    x.Id,
                    x.type,
                    x.roomSize,
                    x.price,
                    x.discount,
                    x.roomImage,
                    x.description,
                    x.NumberOfBed
                })
                .ToList();

                return new JsonResult(Ok(GetRoomView));
            }
            catch (Exception EX) { return new JsonResult(NotFound(new { value = EX.Message })); }
        }
        [HttpGet]
        [Route("delete-room")]
        public async Task<IActionResult> DeleteRooms(string id)
        {
            try
            {
                int Id = int.Parse(id);
                var getRoom = _context.Rooms.Where(x => x.Id == Id).FirstOrDefault();
                User? getUser = helper.GetUser(Request.Headers["Authorization"]);
                Hotel? getHotel = _context.Hotels.Where(x => x.user == getUser).FirstOrDefault();
                if (getHotel == null || getRoom == null) { return new JsonResult(NotFound(new { value = "OPREATION CANNOT BE PERFOREMD 1" })); }
                if (getRoom.hotel != getHotel) { return new JsonResult(NotFound(new { value = "OPREATION CANNOT BE PERFOREMD" })); }
                if (getRoom.roomImage != null)
                {
                    var ImagePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", getRoom.roomImage);
                    if (System.IO.File.Exists(ImagePath))
                    {
                        System.IO.File.Delete(ImagePath);
                    }
                }

                _context.Rooms.Remove(getRoom);
                var checkForRooms = _context.Rooms.Where(x => x.hotel == getHotel).ToList();
                int lim = (checkForRooms.Count) - 1;
                if (lim <= 0)
                {
                    getHotel.live = false; // if empty room the transaction cannot happen
                }
                await _context.SaveChangesAsync();
                return new JsonResult(Ok(new { id = getRoom.Id, count = lim }));
            }
            catch (Exception ex)
            {
                return new JsonResult(NotFound(new { value = ex.Message }));
            }
            return new JsonResult(NotFound(new { value = "SOMETHING WENT WRONG : (" }));
        }

        [Route("esewa-get")]
        [HttpPost]
        public async Task<IActionResult> EsewaClient(Esewa key)

        {
            User? getUser = helper.GetUser(Request.Headers["Authorization"]);
            if (getUser == null) return new JsonResult(BadRequest(new { value = "User not found invalid request: (" }));
            var transactionDetail = _context.Transactions.Where(x => x.user == getUser).FirstOrDefault();
            var esewMerchant = _context.Esewas.Where(x => x.user == getUser).FirstOrDefault();
            if (esewMerchant == null )
            {
                var esewaEntity = _context.Esewas.Add(new Esewa { user = getUser, MerchantKey = key.MerchantKey });
                if (transactionDetail == null)
                {
                    _context.Transactions.Add(new Transaction { esewa = esewaEntity.Entity, user = getUser });
                }else
                {
                    transactionDetail.esewa = esewaEntity.Entity;
                }
            }else
            {
                // if there is already registred metchant
                esewMerchant.MerchantKey = key.MerchantKey;
            }
            await _context.SaveChangesAsync();
            return new JsonResult(Ok());
        }
        [Route("merchant-code-esewa-get")]
        [HttpGet]
        public IActionResult GetEsewaMerchantCode()
        {
            User? getUser = helper.GetUser(Request.Headers["Authorization"]);
            if (getUser == null) return new JsonResult(BadRequest(new { value = "User not found invalid request: (" }));
            var Code = _context.Transactions.Where(x => x.user == getUser).Select(y => y.esewa).FirstOrDefault();
            if (Code == null)
            {
                return new JsonResult(NotFound(new { value = "Nothing foudnd :( " }));
            }
            return new JsonResult(Ok(Code));
        }

       [Route("make-hotel-live")]
       [HttpGet]
       public async Task<IActionResult> MakeHotelLive()
        {

            User? getUser = helper.GetUser(Request.Headers["Authorization"]);
            if (getUser == null)
            {
                return new JsonResult(BadRequest("user not found"));
            }
            var getTransaction = _context.Transactions.Where(x => x.user == getUser).FirstOrDefault();
            if (getTransaction == null) { return new JsonResult(NotFound("no payment platfrom slelected 1")); }
            // lets say if esewa is null as well as some other paymane api key is null then it can't be verifued
            if (getTransaction == null) return new JsonResult(NotFound("no payment platfrom slelected 1"));
            // get and verify rooms
            var getRooms = _context.Rooms.Where(x => x.hotel.user == getUser).FirstOrDefault();
            if (getRooms == null) return new JsonResult(NotFound("add rooms, no room found"));
            // make hotel live if everything is oaky
            var hotel = _context.Hotels.Where(x => x.user == getUser).FirstOrDefault();
            if (hotel == null) return new JsonResult(BadRequest("something went wrong"));
            hotel.live = true;
            await _context.SaveChangesAsync();
            return new JsonResult(Ok("your hotel is live"));
        }
        [Route("get-client-transaction")]
        [HttpGet]
        public IActionResult GetMerchatTransaction(string HotelId)
        {
            try
            {
                Guid id = Guid.Parse(HotelId);
                // since we have both code and run time complexity getting a mercant directly we choose little run time complexity
                var getHotel = _context.Hotels.Where(x => x.Id == id).Select(b => b.user).FirstOrDefault();
                if (getHotel == null) { return new JsonResult(NotFound()); }
                var getTransaction = _context.Transactions.Where(x => x.user == getHotel).Select(b => new
                {
                    b.esewa // more payment api
                }).FirstOrDefault();
                return new JsonResult(Ok(getTransaction));
            }catch (Exception ex) { return new JsonResult(BadRequest(new {value = ex.Message})); }
        }
    }
}
