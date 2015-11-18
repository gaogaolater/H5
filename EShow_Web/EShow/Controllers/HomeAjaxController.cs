using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EShow.Service;
using EShow.DTO;

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

        public ActionResult GetAppList()
        {
            var list = WebAppService.GetAppList();
            return Json(list);
        }

        public ActionResult DeleteAppById(int id)
        {
            try
            {
                WebAppService.DeleteAppById(id);
                return Json(new BaseResp<string>()
                {
                    success = true
                });
            }
            catch (Exception ex)
            {
                return Json(new BaseResp<string>()
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        public ActionResult GetAppById(int id)
        {
            var app = WebAppService.GetAppById(id);
            return Json(app);
        }

        public ActionResult SaveApp(string webAppHTML,
            string designHTML, int id, string name, int state)
        {
            //if (string.IsNullOrEmpty(webAppHTML) || string.IsNullOrEmpty(designHTML))
            //{
            //    return Json(new BaseResp<string>()
            //    {
            //        success = false,
            //        message = "提交数据错误"
            //    });
            //}
            if (string.IsNullOrEmpty(name)) 
            {
                return Json(new BaseResp<string>()
                {
                    success = false,
                    message = "名称不能为空"
                });
            }
            try
            {
                if (id > 0)
                {
                    WebAppService.UpdateApp(new Models.WebApp()
                    {
                        AppId = id,
                        DesignHTML = designHTML,
                        Name = name,
                        PreviewHTML = webAppHTML,
                        State = state
                    });
                }
                else
                {
                    id = WebAppService.AddApp(new Models.WebApp()
                    {
                        DesignHTML = designHTML,
                        IsDelete = false,
                        Name = name,
                        PreviewHTML = webAppHTML,
                        State = state,
                        CreateTime = DateTime.Now,
                        Creator = ""
                    });
                }
                return Json(new BaseResp<int>()
                {
                    success = true,
                    data = id
                });
            }
            catch (Exception ex)
            {
                return Json(new BaseResp<string>()
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

    }
}
