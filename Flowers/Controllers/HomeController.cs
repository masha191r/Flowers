using Flowers.Models;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Flowers.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            using (var context = new FlowerContext())
            {
                var flowers = context.Flower.ToList();

                if (flowers != null)
                {
                    ViewBag.FlowersJson = JsonConvert.SerializeObject(flowers);
                    return View();
                }
                else
                {
                    TempData["Message"] = "Немає в базі";
                    return RedirectToAction("Auth");
                }
            }


            return View();
        }
        [HttpGet]
        public ActionResult Auth()
        {
            ViewBag.Message = "Auth Page";
            return View();
        }

        [HttpPost]
        public ActionResult Auth(RegisterViewModel model)
        {
            // Простий приклад (у реальному проєкті — перевірка в базі даних)
                using (var context = new FlowerContext())
                {
                    var contact = context.Contact.FirstOrDefault(c => c.Name == model.Name && c.Password == model.Password);

                    if (contact != null)
                    {
                    TempData["Contact"] = contact;
                    RedirectToAction("Index");
                    }
                    else
                    {
                        TempData["Message"] = "Неправильний логін або пароль";
                        return RedirectToAction("Auth");
                    }
                }
                // Встановлення сесії, cookies тощо
                TempData["Message"] = "Успішний вхід!";
                return RedirectToAction("Index");

            ViewBag.Error = "Неправильний логін або пароль.";
            return View("Auth");
        }

        [HttpGet]
        public ActionResult Register()
        {
                return View();
        }

        [HttpPost]
        public ActionResult Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                using (var context = new FlowerContext())
                {
                    // Creates the database if not exists
                    context.Database.EnsureCreated();
                    context.Contact.Add(model);
                    context.SaveChanges();
                }

                TempData["Message"] = "Реєстрація успішна!";
                return RedirectToAction("Auth");
            }

            return View(model);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}