using UnityEngine;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

public class Util : MonoBehaviour
{
    public static int Int(object o)
    {
        return Convert.ToInt32(o);
    }

    public static float Float(object o) 
    {
        return (float)Math.Round(Convert.ToSingle(o), 2);
    }

    public static long Long(object o)
    {
        return Convert.ToInt64(o);
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

    /// <summary>
    /// 向上搜索Canvas
    /// </summary>
    static public Transform FindCanvas(Transform currentObject)
    {
        var canvas = currentObject.GetComponentInParent<Canvas>();
        if (canvas == null)
        {
            return null;
        }
        return canvas.transform;
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
    /// 销毁
    /// </summary>
    public static void SafeDestroyObject(UnityEngine.Object obj)
    {
        if (obj != null) 
            Destroy(obj);
    }

    /// <summary>
    /// 委托调用
    /// </summary>
    public static void SafeIvokeHandler(ref Action action)
    {
        if (action != null)
        {
            action.Invoke();
            action = null;
        }
    }

    public static void SafeIvokeHandler(ref Action<string, object> action, string cmd, object obj)
    {
        if (action != null)
        {
            action.Invoke(cmd, obj);
            action = null;
        }
    }

    /// <summary>
    /// 委托调用
    /// </summary>
    public static void SafeIvokeHandler(ref Action<UnityEngine.Object> action, UnityEngine.Object obj)
    {
        if (action != null)
        {
            action.Invoke(obj);
            action = null;
        }
    }

    /// <summary>
    /// 委托调用
    /// </summary>
    public static void SafeIvokeHandler(ref Action<System.Object> action, System.Object obj)
    {
        if (action != null)
        {
            action.Invoke(obj);
            action = null;
        }
    }

    /// <summary>
    /// 委托调用
    /// </summary>
    public static void SafeIvokeHandler<T>(ref Action<T> action, T obj)
    {
        if (action != null)
        {
            action.Invoke(obj);
            action = null;
        }
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
        GC.Collect(); 
        Resources.UnloadUnusedAssets();
    }

    /// <summary>
    /// 是否为数字
    /// </summary>
    public static bool IsNumber(string strNumber)
    {
        Regex regex = new Regex("[^0-9]");
        return !regex.IsMatch(strNumber);
    }

    /// <summary>
    /// 取得数据存放目录
    /// </summary>
    public static string ConfigDataPath
    {
        get
        {
            string path = string.Empty;
            string gamePath = AppConst.AppName.ToLower();
            if (Application.platform == RuntimePlatform.IPhonePlayer ||
                Application.platform == RuntimePlatform.Android ||
                Application.platform == RuntimePlatform.WP8Player)
            {
                path = Application.persistentDataPath + "/" + gamePath + "/ConfigData/";
            }
            else  // Editor 模式
            {
                path = Application.dataPath + "/" + AppConst.AssetDirName + "/ConfigData/";
            }
            return path;
        }
    }

}