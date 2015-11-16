using UnityEngine;
using System.Collections;
using System;

public class HttpRequestManager : MonoBehaviour 
{
    public HttpRequestSignin Login(string account, string password, string serverID)
    {
        var req = gate.HttpRequestPool.gameObject.AddComponent<HttpRequestSignin>();
        req.Login(account, password, serverID);
        return req;
    }

    public HttpRequestSignin CreateAccount(string account, string password)
    {
        var req = gate.HttpRequestPool.gameObject.AddComponent<HttpRequestSignin>();
        req.CreateAccount(account, password);
        return req;
    }

    public HttpRequestSignin CreateRole(string account, string loginKey, UInt32 serverID, string roleName, UInt32 p)
    {
        var req = gate.HttpRequestPool.gameObject.AddComponent<HttpRequestSignin>();
        req.CreateRole(account, loginKey, serverID, roleName, p);
        return req;
    }
}
