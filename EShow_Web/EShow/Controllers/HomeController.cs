using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using EShow.Enum;
using EShow.Service;
using System.IO;

namespace EShow.Controllers
{
    public class HomeController : Controller
    {
        /// <summary>
        /// 首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 预览页面
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Preview(int id)
        {
            if (id <= 0)
            {
                return Content("id错误");
            }
            Models.WebApp app = WebAppService.GetAppById(id);
            return View(app);
        }

        /// <summary>
        /// 上传资源
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Upload(int type)
        {
            string result = "<script>parent.window.uploadCallBack({{success:{0},message:'{1}',path:'{2}',type:" + type + "}})</script>";
            if (type <1 || type >4)
            {
                return Content(string.Format(result, "false", "附件类型错误", ""));
            }
            string allowExt = string.Empty;
            string directName = string.Empty;
            switch (type)
            {
                case 1:
                    directName = "bgpic";
                    allowExt = ".jpg|.gif|.png";
                    break;
                case 2:
                    directName = "pagepic";
                    allowExt = ".jpg|.gif|.png";
                    break;
                case 3:
                    directName = "audio";
                    allowExt = ".mp3";
                    break;
                case 4:
                    directName = "vedio";
                    allowExt = ".mp4";
                    break;
            }
            StringBuilder strMsg = new StringBuilder();
            HttpFileCollectionBase fileList = Request.Files;
            HttpPostedFileBase postedFile = fileList[0];
            string fileName, fileExtension;
            fileName = System.IO.Path.GetFileName(postedFile.FileName);
            if (string.IsNullOrEmpty(fileName))
            {
                return Content(string.Format(result, "false", "上传文件为空", ""));
            }
            fileExtension = System.IO.Path.GetExtension(fileName);
            
            if (allowExt.IndexOf(fileExtension) == -1)
            {
                return Content(string.Format(result, "false", "不允许的附件类型", ""));
            }
            //strMsg.Append("上传的文件类型：" + postedFile.ContentType.ToString() + "<br>");
            //strMsg.Append("客户端文件地址：" + postedFile.FileName + "<br>");
            //strMsg.Append("上传文件的文件名：" + fileName + "<br>");
            //strMsg.Append("上传文件的扩展名：" + fileExtension + "<br><hr>");

            ///'可根据扩展名字的不同保存到不同的文件夹
            ///注意：可能要修改你的文件夹的匿名写入权限 
            var newfileName = Guid.NewGuid() + fileExtension;
            var path = System.Web.HttpContext.Current.Request.MapPath("/Upload/" + directName + "/");
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            var filePath = path + newfileName;
            var virtualPath = "/Upload/" + directName + "/" + newfileName;
            try
            {
                postedFile.SaveAs(filePath);
                ResourceService.AddResource(new Models.Resource()
                {
                    CreateTime = DateTime.Now,
                    Type = type,
                    Creator = "",
                    IsDelete = false,
                    Name = fileName,
                    Path = virtualPath,
                    Tip = ""
                });
                return Content(string.Format(result, "true", "", virtualPath));
            }
            catch (Exception ex)
            {
                return Content(string.Format(result, "false", ex.Message, ""));
            }
        }

    }
}
