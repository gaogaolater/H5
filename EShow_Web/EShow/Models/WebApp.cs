using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EShow.Models
{
    public class WebApp
    {
        public int AppId { get; set; }
        public string Name { get; set; }
        public string DesignHTML { get; set; }
        public string PreviewHTML { get; set; }
        public DateTime CreateTime { get; set; }
        public string Creator { get; set; }
        public int State { get; set; }
        public bool IsDelete { get; set; }
    }
}