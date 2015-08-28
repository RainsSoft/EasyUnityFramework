using UnityEngine;
using System;
using System.IO;
using System.Net.Sockets;
using System.Collections.Generic;
using System.Text;

public enum DisType
{
    Exception,
    Disconnect,
}

public enum NetActionType
{
    Connect,
    Message,
    Logout
}

public class SocketClient : MonoBehaviour
{
    private const int MAX_READ_LENGTH = 8192;
    private const int CHECK_FLAG = 0x58;
    private const int CHECK_FLAG_BYTELENGTH = 1;
    private const int PAYLOAD_LENGTH_BYTELENGTH = 7;
    private const int PAYLOAD_CMD_BYTELENGTH = 4;
    private const int PACKET_HEAD_BYTELENGTH = CHECK_FLAG_BYTELENGTH + PAYLOAD_LENGTH_BYTELENGTH + PAYLOAD_CMD_BYTELENGTH;

    private TcpClient client = null;

    private NetworkStream sendStream = null;

    private MemoryStream receiveStream;
    private BinaryReader receiveReader;
    private byte[] receiveBuffer = new byte[MAX_READ_LENGTH];

    private static Queue<KeyValuePair<NetActionType, ByteBuffer>> _events = new Queue<KeyValuePair<NetActionType, ByteBuffer>>();


    public static void Logout()
    {
        _events.Enqueue(new KeyValuePair<NetActionType, ByteBuffer>(NetActionType.Logout, null));
    }

    public static void SendConnect()
    {
        _events.Enqueue(new KeyValuePair<NetActionType, ByteBuffer>(NetActionType.Connect, null));
    }

    public static void SendMessage(ByteBuffer buffer)
    {
        _events.Enqueue(new KeyValuePair<NetActionType, ByteBuffer>(NetActionType.Message, buffer));
    }

    void Awake()
    {
        receiveStream = new MemoryStream();
        receiveReader = new BinaryReader(receiveStream);
    }

    void Update()
    {
        while (_events.Count > 0)
        {
            KeyValuePair<NetActionType, ByteBuffer> _event = _events.Dequeue();
            switch (_event.Key)
            {
                case NetActionType.Connect:
                    ConnectServer(AppConst.ServerIp, AppConst.ServerPort);
                    break;
                case NetActionType.Message:
                    SessionSend(_event.Value.ToBytes());
                    break;
                case NetActionType.Logout:
                    Close();
                    break;
            }
            if (_event.Value != null) _event.Value.Close();
        }
    }

    void ConnectServer(string host, int port)
    {
        client = null;
        client = new TcpClient();
        client.SendTimeout = 1000;
        client.ReceiveTimeout = 1000;  
        client.NoDelay = true;
        try
        {
            client.BeginConnect(host, port, new AsyncCallback(OnConnect), null);
        }
        catch (Exception e)
        {
            Close();
            DebugConsole.LogError(e.Message);
        }
    }

    void OnConnect(IAsyncResult asr)
    {
        sendStream = client.GetStream();
        client.GetStream().BeginRead(receiveBuffer, 0, MAX_READ_LENGTH, new AsyncCallback(OnRead), null);
        NetworkManager.AddEvent(Protocal.Connect, new ByteBuffer());
    }

    void OnRead(IAsyncResult asr)
    {
        int readLenth = 0;
        try
        {
            lock (client.GetStream())
            {         
                //读取字节流到缓冲区
                readLenth = client.GetStream().EndRead(asr);
            }
            if (readLenth < 1)
            {           
                //包尺寸有问题，断线处理
                OnDisconnected(DisType.Disconnect, "readLenth < 1");
                return;
            }
            //分析数据包内容，抛给逻辑层
            OnReceive(receiveBuffer, readLenth);   
            lock (client.GetStream())
            {       
                //分析完，再次监听服务器发过来的新消息
                Array.Clear(receiveBuffer, 0, receiveBuffer.Length);
                client.GetStream().BeginRead(receiveBuffer, 0, MAX_READ_LENGTH, new AsyncCallback(OnRead), null);
            }
        }
        catch (Exception ex)
        {
            PrintBytes();
            OnDisconnected(DisType.Exception, ex.Message);
        }
    }

    void OnReceive(byte[] bytes, int length)
    {
        receiveStream.Seek(0, SeekOrigin.End);
        receiveStream.Write(bytes, 0, length);
        //Reset to beginning
        receiveStream.Seek(0, SeekOrigin.Begin);
        while (RemainingBytes() > 2)
        {
            //包Flag验证
            ushort packetFlag = receiveReader.ReadByte();
            if (packetFlag != CHECK_FLAG)
            {
                receiveStream.Position = receiveStream.Position - 1;
                break;
            }

            //取消息长度
            byte[] lenByte = new byte[PAYLOAD_LENGTH_BYTELENGTH];
            lenByte = receiveReader.ReadBytes(PAYLOAD_LENGTH_BYTELENGTH);
            int messageLen = int.Parse(Encoding.ASCII.GetString(lenByte));

            //取payload
            if (RemainingBytes() >= (messageLen + PAYLOAD_CMD_BYTELENGTH))
            {
                MemoryStream ms = new MemoryStream();
                BinaryWriter writer = new BinaryWriter(ms);
                writer.Write(receiveReader.ReadBytes((messageLen + PAYLOAD_CMD_BYTELENGTH)));
                ms.Seek(0, SeekOrigin.Begin);
                OnReceivedInternal(ms);
            }
            else
            {
                receiveStream.Position = receiveStream.Position - 2;
                break;
            }
        }
        //重置剩余的数据
        byte[] leftover = receiveReader.ReadBytes((int)RemainingBytes());
        receiveStream.SetLength(0);
        receiveStream.Write(leftover, 0, leftover.Length);
    }

    void OnReceivedInternal(MemoryStream ms)
    {
        BinaryReader r = new BinaryReader(ms);
        byte[] message = r.ReadBytes((int)(ms.Length - ms.Position));
        ByteBuffer buffer = new ByteBuffer(message);
        string cmd = buffer.ReadString(PAYLOAD_CMD_BYTELENGTH);
        byte[] buf = buffer.ReadBytesRemaining();
        string base64Str = Encoding.ASCII.GetString(buf);
        byte[] dataBytes = Convert.FromBase64String(base64Str);
        NetworkManager.AddEvent(cmd, new ByteBuffer(dataBytes));
    }

    void SessionSend(byte[] message)
    {
        using (MemoryStream ms = new MemoryStream())
        {
            ms.Position = 0;
            byte[] bufMessage = new byte[(message.Length - PAYLOAD_CMD_BYTELENGTH)];
            Array.Copy(message, PAYLOAD_CMD_BYTELENGTH, bufMessage, 0, (message.Length - PAYLOAD_CMD_BYTELENGTH));
            string base64Str = Convert.ToBase64String(bufMessage);
            byte[] base64Byte = Encoding.ASCII.GetBytes(base64Str);
            byte[] lenByte = Encoding.ASCII.GetBytes((base64Byte.Length).ToString());

            //占位包头 12个字节 
            byte[] bufHead = Encoding.ASCII.GetBytes("000000000000");
            //flag
            Array.Copy(Encoding.ASCII.GetBytes("X"), 0, bufHead, 0, CHECK_FLAG_BYTELENGTH);
            //message length 
            Array.Copy(lenByte, 0, bufHead, (PAYLOAD_LENGTH_BYTELENGTH + CHECK_FLAG_BYTELENGTH) - lenByte.Length, lenByte.Length);
            //cmd
            Array.Copy(message, 0, bufHead, PACKET_HEAD_BYTELENGTH - PAYLOAD_CMD_BYTELENGTH, PAYLOAD_CMD_BYTELENGTH);

            //写入包头和数据
            BinaryWriter writer = new BinaryWriter(ms);
            writer.Write(bufHead);
            writer.Write(base64Byte);
            writer.Flush();

            //发送
            if (client != null && client.Connected)
            {
                byte[] packet = ms.ToArray();
                sendStream.BeginWrite(packet, 0, packet.Length, new AsyncCallback(OnWrite), null);
            }
            else
            {
                DebugConsole.LogError("client.connected----->>false");
            }
        }
    }

    void OnWrite(IAsyncResult r)
    {
        try
        {
            sendStream.EndWrite(r);
        }
        catch (Exception ex)
        {
            DebugConsole.LogError("OnWrite--->>>" + ex.Message);
        }
    }

    void Close()
    {
        if (client != null)
        {
            if (client.Connected) client.Close();
            client = null;
        }
    }

    void OnDisconnected(DisType dis, string msg)
    {
        Close();
        string protocal = dis == DisType.Exception ?
        Protocal.Exception : Protocal.Disconnect;

        ByteBuffer buffer = new ByteBuffer();
        buffer.WriteString(protocal);
        NetworkManager.AddEvent(protocal, buffer);
        DebugConsole.LogError("Connection was closed by the server:>" + msg + " Distype:>" + dis);
    }

    long RemainingBytes()
    {
        return receiveStream.Length - receiveStream.Position;
    }

    void PrintBytes()
    {
        string returnStr = string.Empty;
        for (int i = 0; i < receiveBuffer.Length; i++)
        {
            returnStr += receiveBuffer[i].ToString("X2");
        }
        DebugConsole.LogError(returnStr);
    }
}
