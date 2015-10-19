using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace RuntimeData
{
    /// <summary>
    /// 用户信息
    /// </summary>
    public class UserInfo
    {
        //用户名
        public static string UserName { set; get; }
        //用户密码
        public static string UserPassword { set; get; }
    }

    /// <summary>
    /// 角色信息
    /// </summary>
    public class RoleInfo
    {
        //================基础======================
        //角色名
        public static string RoleName { set; get; }
        //性别
        public static string Gender { set; get; }
        //年龄
        public static string Age { set; get; }
        //位置
        public static Vector3 Position { set; get; }
        //位置所在地图元素的标识
        public static string PosId { set; get; }
        //营地
        public static string Organ { set; get; }
        //城市
        public static string City { set; get; }
        //在线天数
        public static string OnlineDays { set; get; }
        //血量
        public static string HealthPinot { set; get; }
        //疲劳度
        public static string Stamina { set; get; }
        //==========================================

        //================背包======================
        //道具表
        public static List<PropInfo> Props { set; get; }
        // 负重上限
        public static float WeightLimit { set; get; }
        // 当前负重
        public static float WeightCur { set; get; }
        // 数量上限
        public static int CountLimit { set; get; }
        // 当前数量
        public static int CountCur { set; get; }
        //==========================================


        //================技能======================
        //技能表
        private static List<SkillNormalInfo> skillNormalTable = new List<SkillNormalInfo>();
        public static List<SkillNormalInfo> SkillNormalTable { get { return skillNormalTable; } }

        //特征技能 因为特征技能不用升级或者其它的相关信息 
        private static List<SkillFeatureInfo> skillFeatureTable = new List<SkillFeatureInfo>();
        public static List<SkillFeatureInfo> SkillFeatureTable { get { return skillFeatureTable; } }
        //==========================================

        //================地图要素==================
        //技能表
        private static List<MapElementInfo> mapElementTable = new List<MapElementInfo>();
        public static List<MapElementInfo> MapElementTable { get { return mapElementTable; } }
        //==========================================

        private static List<TaskInfo> taskTable = new List<TaskInfo>();
        public static List<TaskInfo> TaskTable { get { return taskTable; } }
    }

    public class MapElementInfo
    {   //类型
        public string typeId;
        //图标路径
        public string PosId;//该地图元素在服务器中的标识
        public string nameStr;
        public string scriptName;
        public string guid;
        //坐标
        public float posX;
        public float posZ;
        public string describeStr;
        public string timeCur;
        public string timelimit;
    }

    public class PropInfo
    {

    }

    public class SkillNormalInfo
    {
        //技能类型
        public string typeID;
        //what f？
        public int current;
        //what f？
        public int max;
        //what f？
        public int limit;
    }

    public class SkillFeatureInfo
    {
        //技能类型
        public string typeID;
    }

    public class TaskInfo
    {
        //技能Id
        public string taskId;
        //时间长短
        public float time;
        //结束时间
        public float endTime;
    }
}
