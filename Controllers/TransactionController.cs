using Bespeaking.Data;
using Bespeaking.Migrations;
using Bespeaking.Models;
using Bespeaking.Simplified;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Drawing;

namespace Bespeaking.Controllers
{
    public class VerifyRecords
    {
        public string? balanceSheetId { get; set; } = string.Empty;
        public decimal? amount { get; set; }

    }
    public class EsewaResponse
    {
        public string pid { get; set; } = string.Empty;
        public string scd { get; set; } = string.Empty;
        public decimal totalAmount { get; set; }
        public string status { get; set; } = string.Empty;
        public string refId { get; set; } = string.Empty;
    }

    [Route("[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        public AuthDbContext _context;
        public Fundamental helper;
        private readonly HttpClient client = new HttpClient();
        public TransactionController(AuthDbContext context)
        {
            _context = context;
            this.helper = new Fundamental(context);
            
        }
        [Route("esewa-check")]
        [HttpPost]
        public async Task<IActionResult> EsewaTransactionVerify(VerifyRecords? record)
        {
            if (record != null)
            {
                try
                {
                    Guid balanceSheetId = Guid.Parse(record.balanceSheetId);
                    var getSheet = _context.BalanceSheets.Where(x => x.id == balanceSheetId).FirstOrDefault();
                    if (getSheet != null && getSheet.amount == record.amount) // frad can happen if someone really clever changes the value
                    {
                        var responseString = await client.GetStringAsync($"https://uat.esewa.com.np/api/epay/txn_status/v2?pid={getSheet.pid}&totalAmount={record.amount}&scd={getSheet.metchantKey}");
                        EsewaResponse? obj = JsonConvert.DeserializeObject<EsewaResponse>(responseString);
                        if (obj.status == "COMPLETE")
                        {
                            getSheet.ApiServerResponse = responseString;
                            getSheet.completed = true;
                            // create a check in model
                            await _context.SaveChangesAsync();
                            return new JsonResult(Ok());
                        }
                    }
                    return new JsonResult(BadRequest());
                }
                catch (Exception ex)
                {
                    return new JsonResult(BadRequest(new { message = ex.Message }));
                }
                //     var responseString = await client.GetStringAsync("https://uat.esewa.com.np/api/epay/txn_status/v2?pid=1+User&totalAmount=1.0&scd=EPAYTEST");
            }
            return new JsonResult(BadRequest(new {value = "Transaction did hot happen "}));
        }
        [Route("esewa-balancesheet")]
        [HttpPost]
        public async Task<IActionResult> Record(BalanceSheet sheet)
        {
            var user = helper.GetUser(Request.Headers["Authorization"]);
            // if smae pid and same clinet then dublicate
            var checkForDubicate = _context.BalanceSheets
                .Where(x => x.pid == sheet.pid && x.client == user).FirstOrDefault();
            if (user != null && checkForDubicate == null)
            {
                BalanceSheet record = new BalanceSheet()
                {
                    client = user,
                    amount = sheet.amount,
                    discount = sheet.discount,
                    api = "Esewa",
                    pid = sheet.pid,
                    metchantKey = sheet.metchantKey,
                    room = sheet.room,
                };
                var successId = _context.BalanceSheets.Add(record).Entity.id;
                await _context.SaveChangesAsync();
                return new JsonResult(Ok(successId));
            }
            return new JsonResult(BadRequest("USER NULL"));
        }
    }
}
