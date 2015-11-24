using UnityEngine;
using System.Collections;

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

public static class AppPlatform 
{
    public static string[] PlatformPathPrefixs = 
    {
        "file:///",         //OSXEditor
        "file:///",         //OSXPlayer
        "file:///",         //WindowsPlayer
        "file:///",         //WindowsEditor
        "file://",          //IphonePlayer
        "file:///",         //Android
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

    public static Platform PlatformCurrent { set; get; }


    public static string AssetsPath
    {
        get
        {
            string path = string.Empty;

            switch (AppPlatform.PlatformCurrent)
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
    }

    public static string RuntimeAssetsPath
    {
        get
        {
            string game = AppConst.AppName.ToLower();
            //移动平台走沙盒
            if (Application.isMobilePlatform)
            {
                return Application.persistentDataPath + "/" + game + "/";
            }
            //测试走流文件
            if (AppConst.IsDebugMode)
            {
                return Application.dataPath + "/" + AppConst.AssetDirName + "/";
            }
            //非测试
            return "c:/" + game + "/";
        }
    }

    public static string GetAssetBundleDirName()
    {
        string str = string.Empty;
        int index = (int)AppPlatform.PlatformCurrent;
        str = string.Format("{0}{1}", AppPlatform.PlatformNames[index], "_Assetbundles");
        return str;
    }

    public static string GetAssetBundleDirUrl()
    {
        int index = (int)AppPlatform.PlatformCurrent;
        return AppPlatform.PlatformPathPrefixs[index] + RuntimeAssetsPath + GetAssetBundleDirName() + "/";
    }

    public static string GetSceneBundleDirName()
    {
        string str = string.Empty;
        int index = (int)AppPlatform.PlatformCurrent;
        str = string.Format("{0}{1}", AppPlatform.PlatformNames[index], "_Scenebundles");
        return str;
    }

    public static string GetSceneBundleDirUrl()
    {
        int index = (int)AppPlatform.PlatformCurrent;
        return AppPlatform.PlatformPathPrefixs[index] + RuntimeAssetsPath + GetSceneBundleDirName() + "/";
    }

    public static void Initialize()
    {
        AppPlatform.PlatformCurrent = RuntimePlatform_To_AppPlaform(Application.platform);
    }

    private static Platform RuntimePlatform_To_AppPlaform(RuntimePlatform runtimePlatform)
    {
        switch (runtimePlatform)
        {
            case UnityEngine.RuntimePlatform.Android: return Platform.Android;
            case UnityEngine.RuntimePlatform.IPhonePlayer: return Platform.IPhonePlayer;
            case UnityEngine.RuntimePlatform.OSXEditor: return Platform.OSXEditor;
            case UnityEngine.RuntimePlatform.OSXPlayer: return Platform.OSXPlayer;
            case UnityEngine.RuntimePlatform.WindowsEditor: return Platform.WindowsEditor;
            case UnityEngine.RuntimePlatform.WindowsPlayer: return Platform.WindowsPlayer;
            default: return Platform.Unkown;
        }
    }

}