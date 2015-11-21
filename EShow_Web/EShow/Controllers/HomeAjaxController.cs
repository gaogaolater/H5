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
        /// <summary>
        /// 根据TYPE获取图片、音乐等资源
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public ActionResult GetResource(int type)
        {
            var list = ResourceService.GetResourceListByType(type);
            return Json(list.Select(o => new { id = o.ResourceId, name = o.Name, path = o.Path, type = o.Type }));
        }

        /// <summary>
        /// 获取APP列表
        /// </summary>
        /// <returns></returns>
        public ActionResult GetAppList()
        {
            var list = WebAppService.GetAppList();
            return Json(list);
        }

        /// <summary>
        /// 根据id删除app
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
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

        /// <summary>
        /// 根据id获取App
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult GetAppById(int id)
        {
            var app = WebAppService.GetAppById(id);
            return Json(app);
        }

        /// <summary>
        /// 保存APP
        /// </summary>
        /// <param name="webAppHTML"></param>
        /// <param name="designHTML"></param>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="state"></param>
        /// <returns></returns>
        public ActionResult SaveApp(string webAppHTML,
            string designHTML, int id, string name, int state)
        {
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
