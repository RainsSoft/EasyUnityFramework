using UnityEngine;
using System.Collections;
using System;

public class HttpRequestManager : MonoBehaviour 
{
    public ReqSignin Login(string account, string password, string serverID)
    {
        var req = gate.RequestPool.gameObject.AddComponent<ReqSignin>();
        req.Login(account, password, serverID);
        return req;
    }

    public ReqSignin CreateAccount(string account, string password)
    {
        var req = gate.RequestPool.gameObject.AddComponent<ReqSignin>();
        req.CreateAccount(account, password);
        return req;
    }
    public ReqSignin CreateRole(string account, string loginKey, UInt32 serverID, string roleName, UInt32 p)
    {
        var req = gate.RequestPool.gameObject.AddComponent<ReqSignin>();
        req.CreateRole(account, loginKey, serverID, roleName, p);
        return req;
    }
}
