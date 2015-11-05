using UnityEngine;
using System.Collections;

public class UserModel : ModelBase
{
    UserModel() { }

    /// <summary>
    /// 用户名
    /// </summary>
    public string UserName { set; get; }

    /// <summary>
    /// 登录Key
    /// </summary>
    public string LoginKey { set; get; }

    /// <summary>
    /// 账户
    /// </summary>
    public string Account { set; get; }

    /// <summary>
    /// 密码
    /// </summary>
    public string Password { set; get; }

    /// <summary>
    /// 服务器ID
    /// </summary>
    public string ServerID { set; get; }


    #region 金币
    int _gold;
    public const string goldName = "Gold";
    public int Gold
    {
        get
        {
            return _gold;
        }
        set
        {
            if (_gold == value) return;

            if (value <= 0) _gold = 0;

            var oldValue = _gold;
            _gold = value;
            DispatchValueUpdateEvent(goldName, oldValue, value);
        }
    }
    #endregion
}

