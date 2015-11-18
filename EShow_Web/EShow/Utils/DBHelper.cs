using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using System.Configuration;

namespace EShow.Utils
{
    public class DBHelper
    {
        private static string conn = ConfigurationManager.ConnectionStrings["eshow"].ConnectionString;
        //获取MySql的连接数据库对象。MySqlConnection
        public static MySqlConnection OpenConnection()
        {
            MySqlConnection connection = new MySqlConnection(conn);
            connection.Open();
            return connection;
        }
    }
}