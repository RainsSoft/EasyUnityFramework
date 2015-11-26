using UnityEngine;
using System.IO;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Text;
public class Util : MonoBehaviour
{
    public static String GetReadableByteSize(double size)
    {
        String[] units = new String[] { "B", "KB", "MB", "GB", "TB", "PB" };
        double mod = 1024.0;
        int i = 0;
        while (size >= mod)
        {
            size /= mod;
            i++;
        }
        return Math.Round(size) + units[i];

    }

    /// <summary>
    /// new 一个新对象
    /// </summary>
    public static GameObject NewObject(string name, GameObject rParent)
    {
        var rGo = new GameObject(name);
        rGo.transform.SetParent(rParent.transform);
        rGo.transform.localPosition = rParent.transform.localPosition;
        rGo.transform.localScale = rParent.transform.localScale;
        rGo.transform.localRotation = rParent.transform.localRotation;
        return rGo;
    }

    /// <summary>
    /// 对物体的tranform归零
    /// </summary>
    public static void ResetTransform(GameObject obj)
    {
        obj.transform.localPosition = Vector3.zero;
        obj.transform.localScale = Vector3.one;
        obj.transform.localRotation = Quaternion.identity;
       
    }

    /// <summary>
    /// 延时功能
    /// </summary>
    public static void DelayCall(float rTime, UnityEngine.Events.UnityAction rFunc)
    {
        gate.CroutineManager.StartTask(OnDelayCall(rTime, rFunc));

    }
    /// <summary>
    /// 回调协程
    /// </summary>
    private static System.Collections.IEnumerator OnDelayCall(float time, UnityEngine.Events.UnityAction rFunc)
    {
        yield return new WaitForSeconds(time);
        if (rFunc != null) rFunc();
    }

    /// <summary>
    /// 计算文件的MD5值
    /// </summary>
    public static string MD5File(string file)
    {
        try
        {
            FileStream fs = new FileStream(file, FileMode.Open);
            System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
            byte[] retVal = md5.ComputeHash(fs);
            fs.Close();

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < retVal.Length; i++)
            {
                sb.Append(retVal[i].ToString("x2"));
            }
            return sb.ToString();
        }
        catch (Exception ex)
        {
            throw new Exception("md5file() fail, error:" + ex.Message);
        }
    }

    /// <summary>
    /// 计算字符串的MD5值
    /// </summary>
    public static string MD5String(string str)
    {
        System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
        string ret = BitConverter.ToString(md5.ComputeHash(System.Text.Encoding.UTF8.GetBytes(str)), 4, 8);
        return ret.Replace("-", "");
    }

    /// <summary>
    /// 调用脚本成员函数
    /// </summary>
    public static object CallScriptFunction(object rObj, string rTypeName, string rFuncName, params object[] rArgs)
    {
        var rName = rTypeName.Replace("(Clone)", "");
        return gate.ScriptManager.CallScriptMethod(rObj, rName, rFuncName, rArgs);
    }

    /// <summary>
    /// 调用脚本静态函数
    /// </summary>
    public static object CallScriptFunctionStatic(string rTypeName, string rFuncName, params object[] rArgs)
    {
        var rName = rTypeName.Replace("(Clone)", "");
        return gate.ScriptManager.CallScriptMethodStatic(rName, rFuncName, rArgs);
    }

    /// <summary>
    /// 创建脚本对象
    /// </summary>
    public static object CreateScriptObject(string rTypeName, params object[] rArgs)
    {
        var rName = rTypeName.Replace("(Clone)", "");
        return gate.ScriptManager.CreateScriptObject(rName, rArgs);
    }

    /// <summary>
    /// 修正RectTransform
    /// </summary>
    public static void FixInstantiated(Component source, Component instance)
    {
        FixInstantiated(source.gameObject, instance.gameObject);
    }

    /// <summary>
    /// 修正RectTransform
    /// </summary>
    public static void FixInstantiated(GameObject source, GameObject instance)
    {
        var defaultRectTransform = source.GetComponent<RectTransform>();
        var rectTransform = instance.GetComponent<RectTransform>();

        rectTransform.localPosition = defaultRectTransform.localPosition;
        rectTransform.localRotation = defaultRectTransform.localRotation;
        rectTransform.localScale = defaultRectTransform.localScale;
        rectTransform.anchoredPosition = defaultRectTransform.anchoredPosition;
    }

    /// <summary>
    /// 向上搜索Canvas
    /// </summary>
    public static Transform FindCanvas(Transform currentObject)
    {
        var canvas = currentObject.GetComponentInParent<Canvas>();
        if (canvas == null)
        {
            return null;
        }
        return canvas.transform;
    }

    /// <summary>
    /// 搜索子物体组件-GameObject版
    /// </summary>
    public static T Get<T>(GameObject go, string subnode) where T : Component
    {
        if (go != null) {
            Transform sub = go.transform.FindChild(subnode);
            if (sub != null) return sub.GetComponent<T>();
        }
        return null;
    }

    /// <summary>
    /// 搜索子物体组件-Transform版
    /// </summary>
    public static T Get<T>(Transform go, string subnode) where T : Component
    {
        if (go != null) {
            Transform sub = go.FindChild(subnode);
            if (sub != null) return sub.GetComponent<T>();
        }
        return null;
    }

    /// <summary>
    /// 搜索子物体组件-Component版
    /// </summary>
    public static T Get<T>(Component go, string subnode) where T : Component
    {
        return go.transform.FindChild(subnode).GetComponent<T>();
    }

    /// <summary>
    /// 添加组件
    /// </summary>
    public static T Add<T>(GameObject go) where T : Component 
    {
        if (go != null)
        {
            T[] ts = go.GetComponents<T>();
            for (int i = 0; i < ts.Length; i++ ) 
            {
                if (ts[i] != null) DestroyImmediate(ts[i]);
            }
            return go.AddComponent<T>();
        }
        return null;
    }

    /// <summary>
    /// 添加组件
    /// </summary>
    public static T Add<T>(Transform go) where T : Component
    {
        return Add<T>(go.gameObject);
    }

    /// <summary>
    /// 查找子对象
    /// </summary>
    public static GameObject Child(GameObject go, string subnode) 
    {
        return Child(go.transform, subnode);
    }

    /// <summary>
    /// 查找子对象
    /// </summary>
    public static GameObject Child(Transform go, string subnode) 
    {
        Transform tran = go.FindChild(subnode);
        if (tran == null) return null;
        return tran.gameObject;
    }

    /// <summary>
    /// 取平级对象
    /// </summary>
    public static GameObject Peer(GameObject go, string subnode)
    {
        return Peer(go.transform, subnode);
    }

    /// <summary>
    /// 取平级对象
    /// </summary>
    public static GameObject Peer(Transform go, string subnode)
    {
        Transform tran = go.parent.FindChild(subnode);
        if (tran == null) return null;
        return tran.gameObject;
    }

    /// <summary>
    /// 清除所有子节点
    /// </summary>
    public static void ClearChild(Transform go)
    {
        if (go == null) return;
        for (int i = go.childCount - 1; i >= 0; i--) 
        {
            Destroy(go.GetChild(i).gameObject);
        }
    }

    /// <summary>
    /// 生成一个Key名
    /// </summary>
    public static string GetKey(string key)
    {
        return AppConst.AppPrefix + AppConst.UserId + "_" + key;
    }

    /// <summary>
    /// 取得整型
    /// </summary>
    public static int GetInt(string key)
    {
        string name = GetKey(key);
        return PlayerPrefs.GetInt(name);
    }

    /// <summary>
    /// 有没有值
    /// </summary>
    public static bool HasKey(string key)
    {
        string name = GetKey(key);
        return PlayerPrefs.HasKey(name);
    }

    /// <summary>
    /// 保存整型
    /// </summary>
    public static void SetInt(string key, int value)
    {
        string name = GetKey(key);
        PlayerPrefs.DeleteKey(name);
        PlayerPrefs.SetInt(name, value);
    }

    /// <summary>
    /// 取得数据
    /// </summary>
    public static string GetString(string key)
    {
        string name = GetKey(key);
        return PlayerPrefs.GetString(name);
    }

    /// <summary>
    /// 保存数据
    /// </summary>
    public static void SetString(string key, string value)
    {
        string name = GetKey(key);
        PlayerPrefs.DeleteKey(name);
        PlayerPrefs.SetString(name, value);
    }

    /// <summary>
    /// 删除数据
    /// </summary>
    public static void RemoveData(string key)
    {
        string name = GetKey(key);
        PlayerPrefs.DeleteKey(name);
    }

    /// <summary>
    /// 清理内存
    /// </summary>
    public static void ClearMemory()
    {
        Resources.UnloadUnusedAssets();
        GC.Collect();
    }

    /// <summary>
    /// 清理UI缓存
    /// </summary>
    public static void ClearUICache()
    {
        ModleLayer.Templates.ClearAll();
        WaitingLayer.Templates.ClearAll();
        DialogBox.Templates.ClearAll();
        PopupWindow.Templates.ClearAll();
        gate.PanelManager.ClearStack();
    }

    /// <summary>
    /// 是否为数字
    /// </summary>
    public static bool IsNumber(string strNumber)
    {
        Regex regex = new Regex("[^0-9]");
        return !regex.IsMatch(strNumber);
    }

    public static int Random(int min, int max)
    {
        return UnityEngine.Random.Range(min, max);
    }

    public static float Random(float min, float max)
    {
        return UnityEngine.Random.Range(min, max);
    }

    public static string Uid(string uid)
    {
        int position = uid.LastIndexOf('_');
        return uid.Remove(0, position + 1);
    }

    public static long GetTime()
    {
        TimeSpan ts = new TimeSpan(DateTime.UtcNow.Ticks - new DateTime(1970, 1, 1, 0, 0, 0).Ticks);
        return (long)ts.TotalMilliseconds;
    }

    //待修改 
    public static byte[] ReadSheetFile(string filename)
    {
        string path = string.Empty;

        path = AppPlatform.RuntimeAssetsPath + "Sheet/" + filename;

        if (!File.Exists(path))
        {
            Debug.LogError("不存在数据文件:" + path);
            return null;
        }
        return System.IO.File.ReadAllBytes(path);
    }

    /// <summary>
    /// 得到Path文件夹下所有文件 并放入allFilePath List中
    /// </summary>
    public static void RecursiveDir(string path, ref List<string> allFilePath, bool isFirstRun = true)
    {
        if (isFirstRun && allFilePath.Count > 0)
        {
            allFilePath.TrimExcess();
            allFilePath.Clear();
        }

        string[] names = Directory.GetFiles(path);
        string[] dirs = Directory.GetDirectories(path);

        foreach (string filename in names)
        {
            string ext = Path.GetExtension(filename);
            if (ext.Equals(".meta")) continue;

            allFilePath.Add(filename.Replace('\\', '/'));
        }
        foreach (string dir in dirs)
        {
            RecursiveDir(dir, ref allFilePath, false);
        }

    }
  
}