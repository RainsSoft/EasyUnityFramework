using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using netMessage;

//网络发送协议
public class MessageSender : TSingleton<MessageSender>
{
    private MessageSender() { }

    // c->s 登陆
    public void Send_Login(string name, string password)
    {
        M0001 msg = new M0001();
        msg.name = name;
        msg.password = password;
        gate.NetworkManager.SendeMessage<M0001>(msg);
    }
}
