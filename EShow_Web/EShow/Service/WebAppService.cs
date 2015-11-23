using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using EShow.Utils;
using Dapper;

namespace EShow.Service
{
    public class WebAppService
    {
        public static List<Models.WebApp> GetAppList()
        {
            List<Models.WebApp> list = null;
            string sql = @"select AppId,Name,CreateTime,Creator,State,IsDelete 
                        from webapp where isdelete = 0 order by appid desc";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                list = conn.Query<Models.WebApp>(sql).ToList();
            }
            return list;
        }

        public static Models.WebApp GetAppById(int id)
        {
            Models.WebApp model = null;
            string sql = @"select * from webapp where AppId=@id";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                model = conn.Query<Models.WebApp>(sql, new { id = id }).FirstOrDefault();
            }
            return model;
        }

        public static int AddApp(Models.WebApp model)
        {
            int id = 0;
            string sql = @"INSERT INTO webapp
                        (Name,
                        DesignHTML,
                        PreviewHTML,
                        CreateTime,
                        Creator,
                        State,
                        IsDelete)
                        VALUES
                        (@Name,
                        @DesignHTML,
                        @PreviewHTML,
                        @CreateTime,
                        @Creator,
                        @State,0);select @@IDENTITY";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                id = conn.Query<int>(sql, model).FirstOrDefault();
            }
            return id;
        }

        public static void UpdateApp(Models.WebApp model)
        {
            string sql = @"UPDATE webapp
                            SET
                            Name = @Name,
                            DesignHTML = @DesignHTML,
                            PreviewHTML = @PreviewHTML,
                            State = @State
                            WHERE AppId = @AppId";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                conn.Execute(sql, model);
            }
        }

        public static void DeleteAppById(int id)
        {
            string sql = @"UPDATE webapp
                            SET
                            isdelete = 1 
                            WHERE AppId = @id";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                conn.Execute(sql, new { id = id });
            }
        }
    }
}