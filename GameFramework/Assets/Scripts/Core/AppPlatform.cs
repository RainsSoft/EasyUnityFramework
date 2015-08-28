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
        IphonePlayer,
        Android,
        Unkown,
    }

    public static Platform RuntimePlatform { set; get; }


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
        bool isEditor = AppPlatform.PlatformIsEditor[index];

#if UNITY_EDITOR
        string rootDir = isEditor ? Application.dataPath : Application.streamingAssetsPath;
        return rootDir + "/Assetbundles/" + AppPlatform.PlatformNames[index] + "_Assetbundles/";
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
            case UnityEngine.RuntimePlatform.IPhonePlayer: return AppPlatform.Platform.IphonePlayer;
            case UnityEngine.RuntimePlatform.OSXEditor: return AppPlatform.Platform.OSXEditor;
            case UnityEngine.RuntimePlatform.OSXPlayer: return AppPlatform.Platform.OSXPlayer;
            case UnityEngine.RuntimePlatform.WindowsEditor: return AppPlatform.Platform.WindowsEditor;
            case UnityEngine.RuntimePlatform.WindowsPlayer: return AppPlatform.Platform.WindowsPlayer;
            default: return Platform.Unkown;
        }
    }

}