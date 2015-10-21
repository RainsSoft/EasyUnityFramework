using UnityEngine;
using System.Collections;

public static class AppPlatform 
{
    public static string[] PlatformPathPrefixs = 
    {
        "file:///",         //OSXEditor
        "file:///",         //OSXPlayer
        "file:///",         //WindowsPlayer
        "file:///",         //WindowsEditor
        "file://",          //IphonePlayer
        "",                 //Android
    };

    public static string[] PlatformNames = 
    {
        "OSX",
        "OSX",
        "Windows",
        "Windows",
        "IOS",
        "Android"
    };

    public static bool[] PlatformIsEditor = 
    {
        true,
        false,
        false,
        true,
        false,
        false
    };


    public enum Platform
    {
        OSXEditor = 0,
        OSXPlayer,
        WindowsPlayer,
        WindowsEditor,
        IPhonePlayer,
        Android,
        Unkown,
    }

    public static Platform RuntimePlatform { set; get; }


    /// <summary>
    /// 应用程序内容路径
    /// </summary>
    public static string AppContentPath()
    {
        string path = string.Empty;

        switch (AppPlatform.RuntimePlatform)
        {
            case Platform.Android:
                path = "jar:file://" + Application.dataPath + "!/assets/";
                break;
            case Platform.IPhonePlayer:
                path = Application.dataPath + "/Raw/";
                break;
            default:
                path = Application.dataPath + "/" + AppConst.AssetDirName + "/";
                break;
        }
        return path;
    }

    /// <summary>
    /// 热更新路径 
    /// </summary>
    public static string DataPath
    {
        get
        {
            string game = AppConst.AppName.ToLower();
            if (Application.isMobilePlatform)
            {
                return Application.persistentDataPath + "/" + game + "/";
            }
            if (AppConst.IsDebugMode)
            {
                return Application.dataPath + "/" + AppConst.AssetDirName + "/";
            }
            return "c:/" + game + "/";
        }
    }

    public static string GetAssetBundleDictionaryName()
    {
        string str = string.Empty;
        int index = (int)AppPlatform.RuntimePlatform;
        str = string.Format("{0}{1}", AppPlatform.PlatformNames[index], "_Assetbundles");
        return str;
    }

    public static string GetAssetBundleDictionaryUrl()
    {
        int index = (int)AppPlatform.RuntimePlatform;
        return AppPlatform.PlatformPathPrefixs[index] + GetAssetBundleDictionaryPath();
    }

    public static string GetAssetBundleDictionaryPath()
    {
        int index = (int)AppPlatform.RuntimePlatform;
       // bool isEditor = AppPlatform.PlatformIsEditor[index];

#if UNITY_EDITOR
        string rootDir =  Application.streamingAssetsPath;
        return rootDir + "/" + AppPlatform.PlatformNames[index] + "_Assetbundles/";
#elif UNITY_STANDALONE_OSX 
        string rootDir = Application.streamingAssetsPath;
        return rootDir +"/" + AppPlatform.PlatformNames[index] + "_Assetbundles/";
#elif UNITY_ANDROID 
        string rootDir = Application.dataPath;
        return "jar:file://" + rootDir  +"/"  + "!/assets/"+ AppPlatform.PlatformNames[index] + "_Assetbundles/";
#elif UNITY_IPHONE
        string rootDir = Application.dataPath;
        return rootDir + "/Raw" + "/" + AppPlatform.PlatformNames[index] + "_Assetbundles/" ;
#endif
    }

    public static string GetAssetBundleUrl(string abName)
    {
        string rPath = GetAssetBundleDictionaryUrl() + abName;
        DebugConsole.Log(rPath);
        return rPath;
    }

    public static string GetResourcesDictionaryUrl()
    {
        string path = string.Empty;

#if UNITY_EDITOR
        path = Application.dataPath + "/" + AppConst.AssetDirName;
#elif UNITY_ANDROID 
       path = "jar:file://" + Application.dataPath  + "!/assets";
#elif (UNITY_IPHONE || UNITY_STANDALONE_OSX )
        path = Application.dataPath + "/Raw";
#endif
        return path;
    }
        


    public static void Initialize()
    {
        AppPlatform.RuntimePlatform = RuntimePlatform_To_AppPlaform(Application.platform);
    }

    private static Platform RuntimePlatform_To_AppPlaform(RuntimePlatform runtimePlatform)
    {
        switch (runtimePlatform)
        {
            case UnityEngine.RuntimePlatform.Android: return AppPlatform.Platform.Android;
            case UnityEngine.RuntimePlatform.IPhonePlayer: return AppPlatform.Platform.IPhonePlayer;
            case UnityEngine.RuntimePlatform.OSXEditor: return AppPlatform.Platform.OSXEditor;
            case UnityEngine.RuntimePlatform.OSXPlayer: return AppPlatform.Platform.OSXPlayer;
            case UnityEngine.RuntimePlatform.WindowsEditor: return AppPlatform.Platform.WindowsEditor;
            case UnityEngine.RuntimePlatform.WindowsPlayer: return AppPlatform.Platform.WindowsPlayer;
            default: return Platform.Unkown;
        }
    }

}