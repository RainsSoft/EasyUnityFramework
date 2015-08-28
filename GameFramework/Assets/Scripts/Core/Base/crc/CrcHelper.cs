using UnityEngine;
using System.Collections;
using Snappy;
using System;
using System.IO;
public static class CrcHelper
{
    public static string CheckConfigFile(string fileName)
    {
        string path = Util.ConfigDataPath + "/" + fileName;
        return CheckFile(path);
    }

    public static string CheckScriptFile(string fileName)
    {
        string path = Util.ConfigDataPath + "/Resources/ScriptsUpdate/" + fileName;
        return CheckFile(path);
    }

    public static string CheckFile(string path)
    {
        string s = String.Empty;
        if (!File.Exists(path))
            return "0";
        using (FileStream fs = File.Open(path, FileMode.Open))
        {
            s = GetHash(StreamToBytes(fs));
            return s;
        }
    }

    public static string GetHash(byte[] buffer)
    {
        if (buffer.Length == 0 || buffer == null)
        {
            return "0";
        }

        String hashString = String.Empty;

        Crc32 crc32 = new Crc32();

        foreach (byte b in crc32.ComputeHash(buffer))
        {
            hashString += b.ToString("x2").ToLower();
        }

        return hashString;
    }

    private static byte[] StreamToBytes(Stream stream)
    {

        byte[] bytes = new byte[stream.Length];

        stream.Read(bytes, 0, bytes.Length);

        stream.Seek(0, SeekOrigin.Begin);

        return bytes;

    }

}
