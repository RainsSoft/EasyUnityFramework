using UnityEngine;
using System.Collections;
using System;
using System.IO;

public class ResponseLoginEventArgs : ResponseEventArgs
{
    public string loginKey { get; set; }

    public ResponseLoginEventArgs(UInt32 rRet, string rLoginKey)
    {
        this.ret = rRet;
        this.loginKey = rLoginKey;
    }
    public ResponseLoginEventArgs() { }
}

public class HttpRequestSignin : HttpRequestBase
{
    public event EventHandler<ResponseLoginEventArgs> ResponseLoginEvent;
    public event EventHandler<ResponseEventArgs> ResponseCreateAccountEvent;
    public event EventHandler<ResponseEventArgs> ResponseCreateRoleEvent;

    public void Login(string account, string password, string serverID)
    {
        var rPassword = Util.MD5String(password);
        var rArgs = new Dict<string, string>();
        rArgs["acc"] = account;
        rArgs["pass"] = rPassword;
        rArgs["serverID"] = serverID;
        var rPath = "Login";
        this.SendRequest(rPath, rArgs, ServerType.LoginServer, (args) =>
        {

            var stream = new MemoryStream(args.bytes);
            StreamReader sr = new StreamReader(stream, System.Text.Encoding.GetEncoding("UTF-8"));
            var ret = UInt32.Parse(sr.ReadLine());
            var key = sr.ReadLine();

            var user = gate.ModelManager.GetModel<UserModel>();
            user.LoginKey = key;
            user.ServerID = serverID;
            
            var eventArgs = new ResponseLoginEventArgs(ret, key);

            ResponseLoginEvent(this, eventArgs);
        });
    }

    public void CreateAccount(string account, string password)
    {
        var rPassword = Util.MD5String(password);
        var rArgs = new Dict<string, string>();
        rArgs["acc"] = account;
        rArgs["pass"] = rPassword;
        var rPath = "CreateAccount";
        this.SendRequest(rPath, rArgs, ServerType.LoginServer, (args) =>
        {
            var stream = new MemoryStream(args.bytes);
            StreamReader sr = new StreamReader(stream, System.Text.Encoding.GetEncoding("UTF-8"));
            var ret = UInt32.Parse(sr.ReadLine());

            var eventArgs = new ResponseEventArgs(ret);

            ResponseCreateAccountEvent(this, eventArgs);
        });
    }

    public void CreateRole(string account, string loginKey, UInt32 serverID, string roleName, UInt32 p)
    {
        var rArgs = new Dict<string, string>();
        rArgs["acc"] = account;
        rArgs["key"] = loginKey;
        rArgs["sid"] = serverID.ToString();
        rArgs["n"] = roleName;
        rArgs["p"] = p.ToString();

        var rPath = "CreateRole";
        this.SendRequest(rPath, rArgs, ServerType.LoginServer, (args) =>
        {
            var stream = new MemoryStream(args.bytes);
            StreamReader sr = new StreamReader(stream, System.Text.Encoding.GetEncoding("UTF-8"));
            var ret = UInt32.Parse(sr.ReadLine());

            var eventArgs = new ResponseEventArgs(ret);

            ResponseCreateRoleEvent(this, eventArgs);
        });
    }

}
