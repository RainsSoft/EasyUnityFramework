using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections.Generic;
using JsonFx.Json;

public class AssetbundlePackage : TSingleton<AssetbundlePackage>
{
    private enum BuildPlatform
    {
        Windows = BuildTarget.StandaloneWindows,        //Windows
        OSX     = BuildTarget.StandaloneOSXIntel,       //OSX
        IOS     = BuildTarget.iOS,                      //IOS
        Android = BuildTarget.Android,                  //Android
    };

    private BuildPlatform packagePlatform = BuildPlatform.Windows;

    private AssetbundlePackage()
    {
        packagePlatform = (BuildPlatform)EditorUserBuildSettings.activeBuildTarget;
    }

    [MenuItem("Tools/BuildAssetbundleWindows")]
    public static void BuildAssetbundleWindows()
    {
        AssetbundlePackage.Instance.BuildAssetbundlesSpecify(BuildPlatform.Windows);
    }

    [MenuItem("Tools/BuildAssetbundleIphone")]
    public static void BuildAssetbundleIphone()
    {
        AssetbundlePackage.Instance.BuildAssetbundlesSpecify(BuildPlatform.IOS);
    }

    [MenuItem("Tools/BuildAssetbundleAndroid")]
    public static void BuildAssetbundleAndroid()
    {
        AssetbundlePackage.Instance.BuildAssetbundlesSpecify(BuildPlatform.Android);
    }

    private void BuildAssetbundlesSpecify(BuildPlatform platform)
    {
        packagePlatform = platform;
        List<AssetBundleBuild> abbList = GeneratorAssetbundleEntry();

        string abPath = GetAssetbundlesPath();
        DirectoryInfo dirInfo = new DirectoryInfo(abPath);
        if (!dirInfo.Exists) dirInfo.Create();

        BuildPipeline.BuildAssetBundles(abPath, abbList.ToArray(), BuildAssetBundleOptions.None, GetBuildTarget());
    }

    private BuildTarget GetBuildTarget()
    {
        switch (packagePlatform)
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

    private string GetAssetbundlesPath()
    {
        return Path.Combine(Application.dataPath + "/" + AppConst.ABDirName + "/", packagePlatform.ToString()) + "_Assetbundles";
    }

    private List<AssetBundleBuild> GeneratorAssetbundleEntry()
    {
        string path = Application.dataPath + "/" + AppConst.ABConfigPath + "/" + AppConst.ABConfigName + ".txt";
        string str = File.ReadAllText(path);

        Dict<string, ABEntry> abEntries = new Dict<string, ABEntry>();
        PackageConfigData a = JsonReader.Deserialize<PackageConfigData>(str);

        ABConfig[] configs = a.packageConfig;

        for (int i = 0; i < configs.Length; i++)
        {
            ABEntry entry = new ABEntry();
            entry.abConfig = configs[i];

            if (!abEntries.ContainsKey(entry.abConfig.name))
            {
                abEntries.Add(entry.abConfig.name, entry);
            }
        }

        List<AssetBundleBuild> abbList = new List<AssetBundleBuild>();
        foreach (var rEntryItem in abEntries)
        {            
            abbList.AddRange(rEntryItem.Value.ToABBuild());
        }
        return abbList;
    }

    private class ABEntry
    {
        public ABConfig abConfig;

        public AssetBundleBuild[] ToABBuild()
        {
            switch (abConfig.packageType)
            {
                case "Dir_Dir":
                    return GetOneDir_Dirs();
                case "Dir_File":
                    return GetOneDir_Files();
                case "Dir":
                    return GetOneDir();
                case "File":
                    return GetOneFile();
            }
            return null;
        }

        /// <summary>
        /// 得到一个文件的ABB
        /// </summary>
        private AssetBundleBuild[] GetOneFile()
        {
            Object rObj = AssetDatabase.LoadAssetAtPath(abConfig.assetPath, typeof(Object));
            if (rObj == null) return null;

            AssetBundleBuild rABB = new AssetBundleBuild();
            rABB.assetBundleName = abConfig.name;
            rABB.assetBundleVariant = abConfig.variant;
            rABB.assetNames = new string[] { abConfig.assetPath };
            return new AssetBundleBuild[] { rABB };
        }

        /// <summary>
        /// 得到一个目录的ABB
        /// </summary>
        private AssetBundleBuild[] GetOneDir()
        {
            DirectoryInfo rDirInfo = new DirectoryInfo(abConfig.assetPath);
            if (!rDirInfo.Exists) return null;

            AssetBundleBuild rABB = new AssetBundleBuild();
            rABB.assetBundleName = abConfig.name;
            rABB.assetBundleVariant = abConfig.variant;
            rABB.assetNames = new string[] { abConfig.assetPath };
            return new AssetBundleBuild[] { rABB };
        }

        /// <summary>
        /// 得到一个目录下的所有的文件对应的ABB
        /// </summary>
        private AssetBundleBuild[] GetOneDir_Files()
        {
            DirectoryInfo rDirInfo = new DirectoryInfo(abConfig.assetPath);
            if (!rDirInfo.Exists) return null;

            List<AssetBundleBuild> rABBList = new List<AssetBundleBuild>();
            string[] rGUIDS = AssetDatabase.FindAssets(abConfig.assetType, new string[] { abConfig.assetPath });
            for (int i = 0; i < rGUIDS.Length; i++)
            {
                string rAssetPath = AssetDatabase.GUIDToAssetPath(rGUIDS[i]);

                AssetBundleBuild rABB = new AssetBundleBuild();
                rABB.assetBundleName = abConfig.name + "/" + Path.GetFileNameWithoutExtension(rAssetPath);
                rABB.assetBundleVariant = abConfig.variant;
                rABB.assetNames = new string[] { rAssetPath };
                rABBList.Add(rABB);
            }
            return rABBList.ToArray();

        }

        /// <summary>
        /// 得到一个目录下的所有的目录对应的ABB
        /// </summary>
        private AssetBundleBuild[] GetOneDir_Dirs()
        {

            DirectoryInfo rDirInfo = new DirectoryInfo(abConfig.assetPath);
            if (!rDirInfo.Exists) return null;

            List<AssetBundleBuild> rABBList = new List<AssetBundleBuild>();
            DirectoryInfo[] rSubDirs = rDirInfo.GetDirectories();
            for (int i = 0; i < rSubDirs.Length; i++)
            {
                string rDirPath = rSubDirs[i].FullName;
                string rRootPath = System.Environment.CurrentDirectory + "\\";
                rDirPath = rDirPath.Replace(rRootPath, "").Replace("\\", "/");
                string rFileName = Path.GetFileNameWithoutExtension(rDirPath);

                AssetBundleBuild rABB = new AssetBundleBuild();
                rABB.assetBundleName = abConfig.name + "/" + rFileName;
                rABB.assetBundleVariant = abConfig.variant;
                rABB.assetNames = new string[] { rDirPath };
                rABBList.Add(rABB);
            }
            return rABBList.ToArray();
        }
    }
}