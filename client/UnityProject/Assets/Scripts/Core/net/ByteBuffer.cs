using UnityEngine;
using System.Collections;
using System.IO;
using System.Text;
using System;


public class ByteBuffer :IDisposable
{
    public MemoryStream stream = null;
    BinaryWriter writer = null;
    BinaryReader reader = null;

    public ByteBuffer() 
    {
        stream = new MemoryStream();
        writer = new BinaryWriter(stream, Encoding.UTF8);
    }

    public ByteBuffer(byte[] data)
    {
        if (data != null)
        {
            stream = new MemoryStream(data);
            reader = new BinaryReader(stream, Encoding.UTF8);
        } 
        else 
        {
            stream = new MemoryStream();
            writer = new BinaryWriter(stream, Encoding.UTF8);
        }
    }

    ~ByteBuffer()
    {
        Dispose();
    }

    public override string ToString()
    {
        string rStr = string.Empty;
        var rBytes = ToBytes();
        for (int i = 0; i < rBytes.Length; i++)
        {
            rStr += "0x";
            rStr += rBytes[i].ToString("X2");
            if (i < (rBytes.Length - 1)) rStr += "-";
        }
        return rStr;
    }

    public void Dispose()
    {
        Close();
    }

    public void Close() 
    {
        if (writer != null) writer.Close();
        if (reader != null) reader.Close();

        stream.Close();
        writer = null;
        reader = null;
        stream = null;
    }

    public byte[] ToBytes()
    {
        if (writer != null) writer.Flush();
        return stream.ToArray();
    }

    public void Flush()
    {
        writer.Flush();
    }

    public void ResetPosition()
    {
        stream.Seek(0, SeekOrigin.Begin);
        stream.Position = 0;
    }

    public int GetLength()
    {
        return ToBytes().Length;
    }

    #region  写入数据
    public void WriteBytes(byte[] v)
    {
        writer.Write(v);
    }

    public void WriteString(string v)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(v);
        writer.Write(bytes);
    }

    public void WriteMessage(string v)
    {
        byte[] vBuf = Encoding.UTF8.GetBytes(v);
        writer.Write((UInt16)v.Length);
        writer.Write(vBuf);
    }

    /// <summary>
    /// 1字节写入
    /// </summary>
    public void WriteByte(int v)
    {
        writer.Write((byte)v);
    }

    /// <summary>
    /// 2字节写入
    /// </summary>
    public void WriteShort(ushort v) 
    {
        writer.Write((ushort)v);
    }

    /// <summary>
    /// 4字节写入
    /// </summary>
    public void WriteInt(int v)
    {
        writer.Write((int)v);
    }

    /// <summary>
    /// 8字节写入
    /// </summary>
    public void WriteLong(long v) 
    {
        writer.Write((long)v);
    }

    /// <summary>
    /// 4字节写入
    /// </summary>
    public void WriteFloat(float v) 
    {
        byte[] temp = BitConverter.GetBytes(v);
        Array.Reverse(temp);
        writer.Write(BitConverter.ToSingle(temp, 0));
    }

    /// <summary>
    /// 8字节写入
    /// </summary>
    public void WriteDouble(double v)
    {
        byte[] temp = BitConverter.GetBytes(v);
        Array.Reverse(temp);
        writer.Write(BitConverter.ToDouble(temp, 0));
    }

    #endregion

    #region 读出数据

    public string ReadMessage()
    {
        ushort len = ReadShort();
        byte[] buffer = new byte[len];
        buffer = reader.ReadBytes(len);
        return Encoding.UTF8.GetString(buffer);
    }

    public string ReadString(int len)
    {
        byte[] lenByte = new byte[len];
        lenByte = reader.ReadBytes(len);
        return Encoding.UTF8.GetString(lenByte);
    }

    public byte[] Read(int index, int count)
    {
        byte[] temp = new byte[count];
        reader.Read(temp, index, count);
        return temp;
    }

    public byte[] ReadRemaining()
    {
        return reader.ReadBytes((int)(stream.Length - stream.Position));
    }

    public byte[] ReadBytes()
    {
        ushort len = ReadShort();
        return reader.ReadBytes(len);
    }

    /// <summary>
    /// 1字节读出
    /// </summary>
    public int ReadByte()
    {
        return (int)reader.ReadByte();
    }

    /// <summary>
    /// 4字节读出
    /// </summary>
    public int ReadInt()
    {
        return (int)reader.ReadUInt32();
    }

    /// <summary>
    /// 2字节读出
    /// </summary>
    public ushort ReadShort() 
    {
        return (ushort)reader.ReadInt16();
    }

    /// <summary>
    /// 8字节读出
    /// </summary>
    public long ReadLong() 
    {
        return (long)reader.ReadInt64();
    }

    /// <summary>
    /// 4字节读出
    /// </summary>
    public float ReadFloat()
    {
        byte[] temp = BitConverter.GetBytes(reader.ReadSingle());
        Array.Reverse(temp);
        return BitConverter.ToSingle(temp, 0);
    }

    /// <summary>
    /// 8字节读出
    /// </summary>
    public double ReadDouble() 
    {
        byte[] temp = BitConverter.GetBytes(reader.ReadDouble());
        Array.Reverse(temp);
        return BitConverter.ToDouble(temp, 0);
    }
    #endregion
}
