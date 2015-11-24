using UnityEngine;
using System;
using System.Collections;
using System.IO;
using System.Text;

public static class FileAssist 
{
    /// <summary>
    /// 创建文件夹
    /// </summary>
    public static DirectoryInfo CreateFolder(string pathName)
    {
        if (!Directory.Exists(pathName))
        {
            return Directory.CreateDirectory(pathName);
        }
        else
        {
            Debug.LogError("CreateFolder failed: folder is exists");
            return null;
        }
    }

    /// <summary>
    /// 创建文件
    /// </summary>
    public static StreamWriter CreateFile(string pathName)
    {
        if(!File.Exists(pathName))
        {
            return File.CreateText(pathName);
        }
        else
        {
            Debug.LogError("CreateFile failed: File is exists");
            return null;
        }
    }

    /// <summary>
    /// 覆盖文件 [没有会创建]
    /// </summary>
    public static void CoverFile(string pathName, string content)
    {
        using (StreamWriter sw = File.CreateText(pathName))
        {
            sw.Write(content);
            sw.Close();
            sw.Dispose();
        }   
    }

    /// <summary>
    /// 写文件 [没有会创建]
    /// </summary>
    public static void WriteFileFromEnd(string pathName, string content)
    {
        using (StreamWriter sw = File.AppendText(pathName))
        {
            sw.Write(content);            
            sw.Close();
            sw.Dispose();
        }    
    }

    /// <summary>
    /// 读文件
    /// </summary>
    public static string ReadFile(string pathName, string filenme)
    {
        if (!Directory.Exists(pathName + filenme))
        {
            Debug.LogError("this Path is not exists");
        }
        if (!File.Exists(pathName + filenme))
        {
            Debug.LogError("ReadFile failed: File is not exists:" + pathName + filenme);            
            return null;
        }  
        using (StreamReader sr = File.OpenText(pathName + filenme))
        {
            string content;
            content = sr.ReadToEnd();
            sr.Close();
            sr.Dispose();
            return content;
        }
    }

    public static string ReadFile(string pathName)
    {
        if (!Directory.Exists(pathName))
        {
            Debug.LogError("this Path is not exists");
        }
        if (!File.Exists(pathName))
        {
            Debug.LogError("ReadFile failed: File is not exists:" + pathName);
            return null;
        }
        using (StreamReader sr = File.OpenText(pathName))
        {
            string content;
            content = sr.ReadToEnd();
            sr.Close();
            sr.Dispose();
            return content;
        }
    }

    /// <summary>
    /// 返回文件夹大小
    /// </summary>
    public static int GetAllFileSize(string folderName)
    {
        if (!Directory.Exists(folderName))
            return 0;

        DirectoryInfo di = new DirectoryInfo(folderName);
        FileInfo[] fi = di.GetFiles();

        int sum = 0;
        for (int i = 0; i < fi.Length; i++ )
            sum += Convert.ToInt32(fi[i].Length / 1024);

        DirectoryInfo[] diArray = di.GetDirectories();
        if (diArray.Length > 0)
        {
            for (int i = 0; i < diArray.Length; i++)
                sum += GetAllFileSize(diArray[i].FullName);
        }
        return sum;
    }

    /// <summary>
    /// 返回文件大小
    /// </summary>
    public static int GetFileSize(string path, string fileName)
    {
        int sum = 0;
        if (!Directory.Exists(path))
        {
            return 0;
        }
        else
        {
            FileInfo files = new FileInfo(path + fileName);
            sum += Convert.ToInt32(files.Length / 1024);
        }
        return sum;
    }

    /// <summary>
    /// 删除文件
    /// </summary>
    public static bool DeleteFile(string pathName)
    {
        if (File.Exists(pathName))
        {
            File.Delete(pathName);
            return true;
        }
        else
        {
            Debug.LogError("DeleteFile failed: File is not exists");
            return false;
        }
    }
 
}