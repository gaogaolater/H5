using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EShow.Service;

namespace EShow.Controllers
{
    public class HomeAjaxController : Controller
    {
        //
        // GET: /HomeAjax/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetResource(int type)
        {
            var list = ResourceService.GetResourceListByType(type);
            return Json(list.Select(o => new { id = o.ResourceId, path = o.Path, type = o.Type }));
        }

    }
}
