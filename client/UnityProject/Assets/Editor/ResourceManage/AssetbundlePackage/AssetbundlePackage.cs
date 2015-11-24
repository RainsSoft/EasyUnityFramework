using JsonFx.Json;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;

public class AssetbundlePackage 
{
    [MenuItem("Tools/PackageTool/BuildAssetWindows")]
    public static void BuildAssetbundleWindows()
    {
        BuildAssetbundlesSpecify(PackagePlatform.BuildPlatform.Windows);
    }

    [MenuItem("Tools/PackageTool/BuildAssetIOS")]
    public static void BuildAssetbundleIOS()
    {
        BuildAssetbundlesSpecify(PackagePlatform.BuildPlatform.IOS);
    }

    [MenuItem("Tools/PackageTool/BuildAssetAndroid")]
    public static void BuildAssetbundleAndroid()
    {
        BuildAssetbundlesSpecify(PackagePlatform.BuildPlatform.Android);
    }

    static void BuildAssetbundlesSpecify(PackagePlatform.BuildPlatform rBuildPlatform)
    {

        PackagePlatform.Instance.platformCurrent = rBuildPlatform;

        List<AssetBundleBuild> abbList = GeneratorAssetbundleEntry();

        string rPath = PackagePlatform.Instance.GetAssetBundlesPath();
        if (Directory.Exists(rPath) == false)
            Directory.CreateDirectory(rPath);

        BuildPipeline.BuildAssetBundles(rPath, abbList.ToArray(), BuildAssetBundleOptions.None, PackagePlatform.Instance.GetBuildTarget());
    }

    static List<AssetBundleBuild> GeneratorAssetbundleEntry()
    {
       
        string path = Application.dataPath + "/" + PackagePlatform.ABConfigPath + ".txt";
        string str = File.ReadAllText(path);
        
        Dict<string, ABEntry> abEntries = new Dict<string, ABEntry>();
        AssetPackageConfig apc = JsonReader.Deserialize<AssetPackageConfig>(str);

        BundleInfo[] bundlesInfo = apc.bundles;

        for (int i = 0; i < bundlesInfo.Length; i++)
        {
            ABEntry entry = new ABEntry();
            entry.bundleInfo = bundlesInfo[i];

            if (!abEntries.ContainsKey(entry.bundleInfo.name))
            {
                abEntries.Add(entry.bundleInfo.name, entry);
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
        public BundleInfo bundleInfo;

        public AssetBundleBuild[] ToABBuild()
        {
            switch (bundleInfo.packageType)
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
            Object rObj = AssetDatabase.LoadAssetAtPath(bundleInfo.assetPath, typeof(Object));
            if (rObj == null) return null;

            AssetBundleBuild rABB = new AssetBundleBuild();
            rABB.assetBundleName = bundleInfo.name;
            rABB.assetBundleVariant = bundleInfo.variant;
            rABB.assetNames = new string[] { bundleInfo.assetPath };
            return new AssetBundleBuild[] { rABB };
        }

        /// <summary>
        /// 得到一个目录的ABB
        /// </summary>
        private AssetBundleBuild[] GetOneDir()
        {
            DirectoryInfo rDirInfo = new DirectoryInfo(bundleInfo.assetPath);
            if (!rDirInfo.Exists) return null;

            AssetBundleBuild rABB = new AssetBundleBuild();
            rABB.assetBundleName = bundleInfo.name;
            rABB.assetBundleVariant = bundleInfo.variant;
            rABB.assetNames = new string[] { bundleInfo.assetPath };
            return new AssetBundleBuild[] { rABB };
        }

        /// <summary>
        /// 得到一个目录下的所有的文件对应的ABB
        /// </summary>
        private AssetBundleBuild[] GetOneDir_Files()
        {
            DirectoryInfo rDirInfo = new DirectoryInfo(bundleInfo.assetPath);
            if (!rDirInfo.Exists) return null;

            List<string> allABPaths = new List<string>();
            Util.RecursiveDir(bundleInfo.assetPath, ref allABPaths);

            List<AssetBundleBuild> rABBList = new List<AssetBundleBuild>();

            for (int i = 0; i < allABPaths.Count; i++)
            {
                string rAssetPath = allABPaths[i];
                AssetBundleBuild rABB = new AssetBundleBuild();
                rABB.assetBundleName = bundleInfo.name + "/" + Path.GetFileNameWithoutExtension(rAssetPath);
                rABB.assetBundleVariant = bundleInfo.variant;
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
            DirectoryInfo rDirInfo = new DirectoryInfo(bundleInfo.assetPath);
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
                rABB.assetBundleName = bundleInfo.name + "/" + rFileName;
                rABB.assetBundleVariant = bundleInfo.variant;
                rABB.assetNames = new string[] { rDirPath };
                rABBList.Add(rABB);
            }
            return rABBList.ToArray();
        }
    }
}