using UnityEngine;
using System.Reflection;
using System.IO;
using System;
using ProtoBuf;
using System.Text;
using netMessage;
using System.Collections;
using System.Collections.Generic;

public class NetworkManager : MonoBehaviour 
{
    public Action<string, object> Receive_Login;

    void Update()
    {
        if (_respondQueue.Count > 0)
        {
            while (_respondQueue.Count > 0)
            {
                KeyValuePair<string, ByteBuffer> eve = _respondQueue.Dequeue();

                if (eve.Key == Protocal.Connect) OnConnect();
                else if (eve.Key == Protocal.Exception) OnException();
                else if (eve.Key == Protocal.Disconnect) OnDisconnect(); 
                else
                {
                    MemoryStream stream = new MemoryStream(eve.Value.ToBytes());
                    string typeName = "netMessage.M" + eve.Key;
                    Type type = Type.GetType(typeName);
                    object obj = ProtoBuf.Serializer.Deserialize(stream, type);

                    switch (eve.Key)
                    {
                        case Protocal.Login: Receive_Login(eve.Key, obj); break;
                        default:
                             break;
                    }
                }
            }
        }
    }    

    private static Queue<KeyValuePair<string, ByteBuffer>> _respondQueue = new Queue<KeyValuePair<string, ByteBuffer>>();

    public static void AddEvent(string _event, ByteBuffer data)
    {
        _respondQueue.Enqueue(new KeyValuePair<string, ByteBuffer>(_event, data));
    }

    public void SendeMessage<T>(T msg)
    {
        string cmd = msg.GetType().Name.Substring(1, 4);
        if (cmd == null)
            return;
        byte[] cmdByte = Encoding.ASCII.GetBytes(cmd);
        byte[] msgBytes = GetMessageByte<T>(msg);
        if (msgBytes == null)
            return;
        ByteBuffer buf = new ByteBuffer();
        buf.WriteBytes(cmdByte);
        buf.WriteBytes(msgBytes);
        this.SendMessage(buf);
    }

    public void SendConnect()
    {
        SocketClient.SendConnect();
    }

    public void OnConnect()
    {
        DebugConsole.Log("Game Server connected!!");
    }

    public void OnException()
    {
        DebugConsole.LogError("OnException------->>>>");
    }


    public void OnDisconnect()
    {
        DebugConsole.LogError("OnDisconnect------->>>>");
    }



    void OnDestroy()
    {
        DebugConsole.Log("~NetworkManager was destroy");
    }

    void SendMessage(ByteBuffer buffer)
    {
        SocketClient.SendMessage(buffer);
    }

    byte[] GetMessageByte<T>(object msg)
    {
        MemoryStream memStream = new MemoryStream();
        ProtoBuf.Serializer.SerializeWithLengthPrefix(memStream, (T)msg, PrefixStyle.None);
        byte[] msgBytes = memStream.ToArray();
        memStream.Close();
        return msgBytes;
    }
}
