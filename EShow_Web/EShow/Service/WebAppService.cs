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
        public List<Models.WebApp> GetAppList()
        {
            List<Models.WebApp> list = null;
            string sql = "select * from webapp where isdelete = 0 order by appid desc";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                list = conn.Query<Models.WebApp>(sql).ToList();
            }
            return list;
        }

        public void AddApp(Models.WebApp model)
        {
            string sql = @"INSERT INTO `webapp`
                        (`Name`,
                        `DesignHTML`,
                        `PreviewHTML`,
                        `CreateTime`,
                        `Creator`,
                        `State`,
                        `IsDelete`)
                        VALUES
                        (@Name,
                        @DesignHTML,
                        @PreviewHTML,
                        @CreateTime,
                        @Creator,
                        @State,0)";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                conn.Execute(sql,model);
            }
        }

        public void UpdateApp(Models.WebApp model)
        {
            string sql = @"UPDATE `webapp`
                            SET
                            `Name` = @Name,
                            `DesignHTML` = @DesignHTML,
                            `PreviewHTML` = @PreviewHTML,
                            `CreateTime` = @CreateTime,
                            `Creator` = @Creator,
                            `State` = @State
                            WHERE `AppId` = @AppId";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                conn.Execute(sql, model);
            }
        }

        public void DeleteAppById(int id)
        {
            string sql = @"UPDATE `webapp`
                            SET
                            `isdelete` = 1 
                            WHERE `AppId` = @id";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                conn.Execute(sql, new { id = id });
            }
        }
    }
}