using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace EShow.Utils
{
    public class DBHelper
    {
        private static string ConnSqlServer = ConfigurationManager.ConnectionStrings["ConnSQLServer"].ConnectionString;
        private static string ConnMySQL = ConfigurationManager.ConnectionStrings["ConnMySQL"].ConnectionString;
        private static string DbType = ConfigurationManager.AppSettings["DbType"];
        //获取MySql的连接数据库对象。MySqlConnection
        public static IDbConnection OpenConnection()
        {
            IDbConnection connection = null;
            if (DbType == "MySQL")
                connection = new MySqlConnection(ConnMySQL);
            else if (DbType == "SQLServer")
                connection = new SqlConnection(ConnSqlServer);
            else
                throw new Exception("为实现此数据库");
            connection.Open();
            return connection;
        }
    }
}