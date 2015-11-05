using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class ResponseEventArgs : EventArgs
{
    public UInt32 ret { get; set; }

    public ResponseEventArgs(UInt32 rRet)
    {
        this.ret = rRet;
    }

    public ResponseEventArgs() { }
}

public class HttpRequestBase : MonoBehaviour
{
    ServerType useServerType;

    public enum ServerType
    {
        UpdateServer,
        LoginServer
    }

    protected void SendRequest(string rPath, Dict<string, string> rArgs, ServerType rType, Action<WWW> rOnResponse)
    {
        var url = AppConst.HttpServerHost + rPath;
        useServerType = rType;
        WaitingLayer.Show();
        this.StartCoroutine(GET(url, rArgs, rOnResponse));
    }

    IEnumerator GET(string url, Dict<string, string> rArgs, Action<WWW> rOnResponse)
    {
        string Parameters;
        bool first;

        if (rArgs.Count > 0)
        {
            first = true;
            Parameters = "?";

            foreach (var arg in rArgs)
            {
                if (first) first = false;
                else Parameters += "&";

                Parameters += arg.Key + "=" + arg.Value;
            }
        }
        else
        {
            Parameters = "";
        }

        url = url + Parameters;
        WWW rWWW = new WWW(url);
        yield return rWWW;

        if (rWWW.error != null)
        {
            Debug.Log("error :" + rWWW.error);

        }
        else
        {
            rOnResponse.Invoke(rWWW);
            rWWW.Dispose();
            rWWW = null;
        }
        Destroy(this);
        WaitingLayer.Hide();
    }

    IEnumerator POST(string url, Dict<string, string> rArgs, Action<WWW> rOnResponse)
    {
        WWWForm form = new WWWForm();
        foreach (var arg in rArgs)
        {
            form.AddField(arg.Key, arg.Value);
        }

        WWW rWWW = new WWW(url, form);
        yield return rWWW;

        if (rWWW.error != null)
        {
            Debug.Log("error :" + rWWW.error);
        }
        else
        {
            rOnResponse.Invoke(rWWW);
            rWWW.Dispose();
            rWWW = null;
        }
    }
}
