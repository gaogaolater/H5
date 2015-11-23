using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using EShow.Utils;
using Dapper;

namespace EShow.Service
{
    public class ResourceService
    {
        public static List<Models.Resource> GetResourceListByType(int type)
        {
            List<Models.Resource> list = null;
            string sql = "select * from resource where isdelete = 0 and type=@type order by resourceid desc";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                list = conn.Query<Models.Resource>(sql, new { type = type }).ToList();
            }
            return list;
        }

        public static int AddResource(Models.Resource resource)
        {
            int id = 0;
            string sql = @"INSERT INTO resource
                        (Name,
                        Path,
                        Tip,
                        Type,
                        CreateTime,
                        Creator,
                        IsDelete)
                        VALUES
                        (@Name,
                        @Path,
                        @Tip,
                        @Type,
                        @CreateTime,
                        @Creator,
                        0);select @@IDENTITY";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                id = conn.Query<int>(sql,resource).FirstOrDefault();
            }
            return id;
        }

        public static void DeleteResourceById(int id)
        {
            string sql = @"update resource set isdelete = 1 where resourceid=@id";
            using (IDbConnection conn = DBHelper.OpenConnection())
            {
                conn.Execute(sql, new { id = id });
            }
        }
    }
}