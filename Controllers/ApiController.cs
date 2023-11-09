using Bespeaking.Data;
using Bespeaking.Models;
using Bespeaking.Simplified;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Bespeaking.Controllers
{
    public class Vector
    {
        public double latitude { get; set; }
        public double longitude { get; set; }
    }

    [Produces("application/json")]
    [Route("[controller]")]
    [ApiController]
    public class ApiController : ControllerBase
    {
        public Fundamental helper;
        public AuthDbContext _context;
        public ApiController(AuthDbContext op) { 
            this._context = op;
            this.helper = new Fundamental(op);
        }
        [Route("haversine")]
        [HttpGet]
        public ActionResult Haversine(string query)
        {
            // {"latitude":$27.7516,"longitude":$85.33,"altitude":0,"altitudeReference":-1}
            if (query == null) return new JsonResult(NoContent());
            Vector? postion = JsonConvert.DeserializeObject<Vector>(query.Replace("$", ""));
            // since we are getting hotels from around 5km (considering gps not being presise in some device) 
            if (postion == null) return new JsonResult(NotFound());
            List<Hotel> hotels = new List<Hotel>();
            foreach (var  i in _context.Hotels) 
            {
                if (hotels.Count >= 12) break;
                Vector? hotelPosition = JsonConvert.DeserializeObject<Vector>((i.position).Replace("$", ""));
                if (hotelPosition == null) continue;
                double d = helper.Distance(postion.latitude, postion.longitude, hotelPosition.latitude, hotelPosition.longitude);
                /* a = sin2(dlat / 2) + cos(lat1).cost(lat2) sin(dlon/2) */
                // c = a tan inverse (root a, root 1 - a
                // d = R.c R = radious of earth 
                if (d <= 5.13 && i.live == true)
                {
                    hotels.Add(i);
                }
            }
            return new JsonResult(Ok(hotels));
        }
        [Route("query-based-seo")]
        [HttpGet]
        public ActionResult QueryBasedOptimization(string query, string pageSize)
        {
            int page;
            try
            {
                page = int.Parse(pageSize);
            }catch (Exception ex) { return new JsonResult(BadRequest(new { message = ex.Message })); }
            if (query.Length >= 50) return new JsonResult(NoContent());
            query = query.ToLower();
            var results = _context.Hotels
            .Where(h => h.name.Contains(query) || h.location.Contains(query));
            int toalNumberOfRecord = results.Count();
            var res = results.Skip(5 * (page - 1)).Take(5).ToList();
            // skip record(x) = page size * (page number - 1)
            // example x =    5 * (2 - 1) = 5 (skpils the next 5 record which has already been displayed in previous respose)
            // total number of page(n) = total items / items per page (round up to nearest number)
            decimal n = toalNumberOfRecord / 5;
            int range = (int)Math.Ceiling(n);
            return new JsonResult(Ok(new {result = res, pages = range }));
        }
    }
}
