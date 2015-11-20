using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;

//网络发送协议
public class SocketMessageSender : TSingleton<SocketMessageSender>
{
    private SocketMessageSender() { }

    // c->s 登陆
    public void Send_Login(string account, string loginKey)
    {
        var rBuf = new ByteBuffer();
        rBuf.WriteMessage(account);
        rBuf.WriteMessage(loginKey);
        gate.SocketClientManager.SendMessageTCP(SocketMessageCMD.MSG_LOGIN, rBuf);
    }

    static public UInt32 DecodeData(byte[] data, object destData)
    {
        IntPtr propertyPtr = Marshal.AllocHGlobal(0x20000);
        
        IntPtr ptr = Marshal.AllocCoTaskMem(data.Length);
        Marshal.Copy(data, 0, ptr, data.Length);

        UInt32 size = 0x20000;
        Marshal.PtrToStructure(propertyPtr, destData);

        Marshal.FreeCoTaskMem(ptr);
        Marshal.FreeHGlobal(propertyPtr);
        return size;
    }
}
