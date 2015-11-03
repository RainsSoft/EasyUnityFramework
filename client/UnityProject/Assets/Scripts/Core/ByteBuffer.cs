﻿using UnityEngine;
using System.Collections;
using System.IO;
using System.Text;
using System;


public class ByteBuffer
{
    MemoryStream stream = null;
    BinaryWriter writer = null;
    BinaryReader reader = null;

    public ByteBuffer() 
    {
        stream = new MemoryStream();
        writer = new BinaryWriter(stream);
    }

    public ByteBuffer(byte[] data)
    {
        if (data != null)
        {
            stream = new MemoryStream(data);
            reader = new BinaryReader(stream);
        } 
        else 
        {
            stream = new MemoryStream();
            writer = new BinaryWriter(stream);
        }
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

    public void WriteByte(int v)
    {
        writer.Write((byte)v);
    }

    public void WriteInt(int v)
    {
        writer.Write((int)v);
    }

    public void WriteShort(ushort v) 
    {
        writer.Write((ushort)v);
    }

    public void WriteLong(long v) 
    {
        writer.Write((long)v);
    }

    public void WriteFloat(float v) 
    {
        byte[] temp = BitConverter.GetBytes(v);
        Array.Reverse(temp);
        writer.Write(BitConverter.ToSingle(temp, 0));
    }

    public void WriteDouble(double v)
    {
        byte[] temp = BitConverter.GetBytes(v);
        Array.Reverse(temp);
        writer.Write(BitConverter.ToDouble(temp, 0));
    }

    public void WriteString(string v)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(v);
        writer.Write(bytes);
    }

    public void WriteBytes(byte[] v) 
    {
        writer.Write(v);
    }

    public int ReadByte()
    {
        return (int)reader.ReadByte();
    }

    public int ReadInt()
    {
        return (int)reader.ReadUInt32();
    }

    public int ReadInt32()
    {
        byte[] lenByte = new byte[4];
        lenByte = reader.ReadBytes(4);
        string temp = Encoding.ASCII.GetString(lenByte);
        int len = int.Parse(temp);
        return len;
    }

    public ushort ReadShort() 
    {
        return (ushort)reader.ReadInt16();
    }

    public long ReadLong() 
    {
        return (long)reader.ReadInt64();
    }

    public float ReadFloat()
    {
        byte[] temp = BitConverter.GetBytes(reader.ReadSingle());
        Array.Reverse(temp);
        return BitConverter.ToSingle(temp, 0);
    }

    public double ReadDouble() 
    {
        byte[] temp = BitConverter.GetBytes(reader.ReadDouble());
        Array.Reverse(temp);
        return BitConverter.ToDouble(temp, 0);
    }

    public string ReadString() 
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
        string temp = Encoding.ASCII.GetString(lenByte);
        return temp;
    }

    public byte[] ReadBytes() 
    {
        ushort len = ReadShort();
        return reader.ReadBytes(len);
    }

    public byte[] Read( int index, int count)
    {
        byte[] temp = new byte[count];
        reader.Read(temp, index, count);
        return temp;
    }

    public byte[] ReadBytesRemaining()
    {

        return reader.ReadBytes((int)(stream.Length - stream.Position));
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
}