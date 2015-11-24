using UnityEngine;
using System.Collections;
using UnityEditor;
using System.IO;

public class PackagePlatform : TSingleton<PackagePlatform>
{
    PackagePlatform() { }

    public static string ABConfigPath = "Editor/ResourceManage/AssetbundlePackage/AssetPackageConfig";
    public static string SBDirectory = "Assets/Art/Scene";

    public BuildPlatform platformCurrent = BuildPlatform.Windows;

    public enum BuildPlatform
    {
        Windows = BuildTarget.StandaloneWindows,        //Windows
        OSX = BuildTarget.StandaloneOSXIntel,           //OSX
        IOS = BuildTarget.iOS,                          //IOS
        Android = BuildTarget.Android,                  //Android
    };

    public BuildTarget GetBuildTarget()
    {
        switch (platformCurrent)
        {
            case BuildPlatform.IOS:
                return BuildTarget.iOS;

            case BuildPlatform.Android:
                return BuildTarget.Android;

            case BuildPlatform.Windows:
                return BuildTarget.StandaloneWindows64;

            case BuildPlatform.OSX:
                return BuildTarget.StandaloneOSXIntel64;
        }
        return BuildTarget.StandaloneWindows64;
    }

    public string GetAssetBundlesPath()
    {
        return Path.Combine(Application.dataPath + "/" + AppConst.AssetDirName + "/", platformCurrent.ToString()) + "_Assetbundles";
    }

    public string GetSceneBundlePath()
    {
        return Path.Combine(Application.dataPath + "/" + AppConst.AssetDirName + "/", platformCurrent.ToString()) + "_Scenebundles";
    }
}
