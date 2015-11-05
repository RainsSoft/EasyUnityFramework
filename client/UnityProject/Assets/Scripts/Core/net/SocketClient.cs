using UnityEngine;
using System;
using System.IO;
using System.Net.Sockets;
using System.Collections.Generic;
using System.Text;

public class SocketClient : MonoBehaviour
{
    const int MAX_READ_LENGTH           = 8192;
    const int PAYLOAD_CMD_BYTELENGTH    = 2;
    const int PACKET_BYTELENGTH         = 2;
    const int PACKET_HEAD_BYTELENGTH    = PACKET_BYTELENGTH + PAYLOAD_CMD_BYTELENGTH;

    TcpClient client                    = null;
    NetworkStream sendStream            = null;
    MemoryStream receiveStream          = null;
    BinaryReader receiveReader          = null;
    byte[] receiveBuffer                = new byte[MAX_READ_LENGTH];
    object locker                       = new object();

    static Queue<KeyValuePair<NetActionType, ByteBuffer>> _events = new Queue<KeyValuePair<NetActionType, ByteBuffer>>();

    #region 事件处理
    public static void Logout()
    {
        _events.Enqueue(new KeyValuePair<NetActionType, ByteBuffer>(NetActionType.Logout, null));
    }

    public static void SendConnectTCP()
    {
        _events.Enqueue(new KeyValuePair<NetActionType, ByteBuffer>(NetActionType.Connect, null));
    }

    public static void SendMessageTCP(ByteBuffer buffer)
    {
        _events.Enqueue(new KeyValuePair<NetActionType, ByteBuffer>(NetActionType.Message, buffer));
    }

    void Update()
    {
        while (_events.Count > 0)
        {
            KeyValuePair<NetActionType, ByteBuffer> _event = _events.Dequeue();
            switch (_event.Key)
            {
                case NetActionType.Connect:
                    ConnectServer(AppConst.TcpServerIp, AppConst.TcpServerPort);
                    break;
                case NetActionType.Message:
                    Send(_event.Value.ToBytes());
                    break;
                case NetActionType.Logout:
                    Close();
                    break;
            }
            if (_event.Value != null) _event.Value.Close();
        }
    }
    #endregion

    #region 开启网络
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
        SocketClientManager.AddEvent(SocketStatusCMD.Connect, new ByteBuffer());
    }
    #endregion

    #region 接收消息
    void OnRead(IAsyncResult asr)
    {
        int readLenth = 0;
        try
        {
            lock (locker)
            {         
                readLenth = client.GetStream().EndRead(asr);
            }
            if (readLenth < 1)
            {
                Disconnected(DisconnectType.Meddle, "readLenth < 1");
                return;
            }

            OnReceive(receiveBuffer, readLenth);   
            lock (locker)
            {       
                Array.Clear(receiveBuffer, 0, receiveBuffer.Length);
                client.GetStream().BeginRead(receiveBuffer, 0, MAX_READ_LENGTH, new AsyncCallback(OnRead), null);
            }
        }
        catch (Exception ex)
        {
            Disconnected(DisconnectType.System, ex.Message);
        }
    }

    void OnReceive(byte[] bytes, int length)
    {
        receiveStream.Seek(0, SeekOrigin.End);
        receiveStream.Write(bytes, 0, length);
        receiveStream.Seek(0, SeekOrigin.Begin);
        while (RemainingBytes() > 2)
        {

            //取包长度
            byte[] lenBuf = new byte[PACKET_BYTELENGTH];
            lenBuf = receiveReader.ReadBytes(PACKET_BYTELENGTH);
            UInt16 packetLen = BitConverter.ToUInt16(lenBuf, 0);

            //取payload
            if (RemainingBytes() >= (packetLen - PACKET_BYTELENGTH))
            {
                using(MemoryStream ms = new MemoryStream())
                {
                    BinaryWriter bw = new BinaryWriter(ms);
                    bw.Write(receiveReader.ReadBytes(packetLen));
                    ms.Seek(0, SeekOrigin.Begin);
                    OnReceivedInternal(ms);
                    bw.Flush();
                    bw.Close();
                }
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
        BinaryReader br = new BinaryReader(ms);
        byte[] message = br.ReadBytes((int)(ms.Length - ms.Position));
        br.Close();
        ms.Close();
        ms.Dispose();

        ByteBuffer temp = new ByteBuffer(message);
        ushort cmd = temp.ReadShort();
        byte[] buf = temp.ReadRemaining();
        SocketClientManager.AddEvent(cmd.ToString(), new ByteBuffer(buf));
    }
    #endregion

    #region 发送消息
    void Send(byte[] payload)
    {
        using (MemoryStream ms = new MemoryStream())
        {
            ms.Position = 0;

            var packetLen = (payload.Length + PACKET_BYTELENGTH);

            BinaryWriter bw = new BinaryWriter(ms);
            bw.Write((UInt16)packetLen);
            bw.Write(payload);
            bw.Flush();
            bw.Close();

            if (client != null && client.Connected)
            {
                byte[] packet = ms.ToArray();
                sendStream.BeginWrite(packet, 0, packet.Length, new AsyncCallback(OnWrite), null);
            }
            else
            {
                DebugConsole.LogError("client connect failed");
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
            DebugConsole.LogError("client write failed :>" + ex.Message);
        }
    }
    #endregion

    #region 关闭网络
    void Close()
    {
        if (client != null)
        {
            if (client.Connected) client.Close();
            client = null;
        }
    }

    void Disconnected(DisconnectType dis, string msg)
    {
        Close();
        string protocal = dis == DisconnectType.System ?
        SocketStatusCMD.Exception : SocketStatusCMD.Disconnect;

        ByteBuffer buffer = new ByteBuffer();
        buffer.WriteString(protocal);
        SocketClientManager.AddEvent(protocal, buffer);
        DebugConsole.LogError("Disconnected :>" + msg + " DisconnectType:>" + dis);
    }
    #endregion

    void Awake()
    {
        receiveStream = new MemoryStream();
        receiveReader = new BinaryReader(receiveStream);
    }

    long RemainingBytes()
    {
        return receiveStream.Length - receiveStream.Position;
    }
}

public enum DisconnectType
{
    System,
    Meddle,
}

public enum NetActionType
{
    Connect,
    Message,
    Logout
}