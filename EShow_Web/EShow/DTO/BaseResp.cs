using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EShow.DTO
{
    public class BaseResp<T>
    {
        public bool success { get; set; }
        public string message { get; set; }
        public int errorcode { get; set; }
        public T data { get; set; }
    }
}