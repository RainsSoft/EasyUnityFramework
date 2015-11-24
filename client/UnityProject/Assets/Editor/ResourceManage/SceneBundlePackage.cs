using UnityEngine;
using UnityEditor;
using JsonFx.Json;
using System.IO;

public class SceneBundlePackage
{

    [MenuItem("Tools/PackageTool/BuildSceneWindows")]
    public static void BuildAssetbundleWindows()
    {
        BuildSceneSpecify(PackagePlatform.BuildPlatform.Windows);
    }

    [MenuItem("Tools/PackageTool/BuildSceneIOS")]
    public static void BuildAssetbundleIOS()
    {
        BuildSceneSpecify(PackagePlatform.BuildPlatform.IOS);
    }

    [MenuItem("Tools/PackageTool/BuildSceneAndroid")]
    public static void BuildAssetbundleAndroid()
    {
        BuildSceneSpecify(PackagePlatform.BuildPlatform.Android);
    }

    static void BuildSceneSpecify(PackagePlatform.BuildPlatform rBuildPlatform)
    {
        if (!Directory.Exists(PackagePlatform.SBDirectory))
        {
            Debug.Log("没有需要打包的场景文件");
            return;
        }

        PackagePlatform.Instance.platformCurrent = rBuildPlatform;

        string rOutPath = PackagePlatform.Instance.GetSceneBundlePath();
        if (Directory.Exists(rOutPath) == false)
            Directory.CreateDirectory(rOutPath);

        var guids = AssetDatabase.FindAssets("t:scene", new string[] { PackagePlatform.SBDirectory });
        var rInPaths = new string[guids.Length];
        var rCount = 0;

        foreach(var guid in guids)
        {
            var rPath = rInPaths[rCount] = AssetDatabase.GUIDToAssetPath(guid);

            var rName = rPath.Substring(rPath.LastIndexOf('/') + 1, rPath.LastIndexOf('.') - rPath.LastIndexOf('/') - 1);

            var rfullPath = rOutPath + "/" + rName.ToLower() + ".unity3d";

            BuildPipeline.BuildPlayer(new string[] { rPath }, rfullPath, PackagePlatform.Instance.GetBuildTarget(), BuildOptions.BuildAdditionalStreamedScenes);

            Debug.Log("build scene:>" + rPath);
            rCount++;
        }

    }
}
