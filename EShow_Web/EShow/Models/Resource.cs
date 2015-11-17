using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EShow.Models
{
    public class Resource
    {
        public int ResourceId { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public string Tip { get; set; }
        public DateTime CreateTime { get; set; }
        public string Creator { get; set; }
        public int Type { get; set; }
        public bool IsDelete { get; set; }
    }
}