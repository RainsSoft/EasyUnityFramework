using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections.Generic;
//using SimpleJSON;

/// <summary>
/// 资源打包的辅助类
/// </summary>
public class AssetbundleHelper : TSingleton<AssetbundleHelper>
{
    public enum BuildPlatform
    {
        Windows = BuildTarget.StandaloneWindows,        //Windows
        OSX     = BuildTarget.StandaloneOSXIntel,       //OSX
        IOS     = BuildTarget.iOS,                      //IOS
        Android = BuildTarget.Android,                  //Android
    };

    /// <summary>
    /// 资源包的类型
    /// </summary>
    public enum AssetSourceType
    {
        Dir_Dir,            //目录下的每一个目录是一个包
        Dir_File,           //目录下的每一个文件是一个包
        Dir,                //一个目录一个包
        File,               //一个文件一个包
    };

    /// <summary>
    /// 一个资源包项
    /// </summary>
    public class ABEntry
    {
        /// <summary>
        /// 资源包名
        /// </summary>
        public string       abName;
        /// <summary>
        /// 资源包的后缀名
        /// </summary>
        public string       abVariant;
        /// <summary>
        /// 资源包的原始路径
        /// </summary>
        public string       assetResPath;
        /// <summary>
        /// 需要的资源类型，比如如果是预制件那么应该为 "t:Prefab"
        /// </summary>
        public string       assetType;
        /// <summary>
        /// 需要过滤的资源
        /// </summary>
        public List<string>     filerAssets;
        /// <summary>
        /// 原始资源的类型
        /// </summary>
        public AssetSourceType assetSrcType;

        /// <summary>
        /// 资源包名，包含后缀
        /// </summary>
        public string       ABFullName { get { return abName + "." + abVariant; } }

        public AssetBundleBuild[] ToABBuild()
        {
            //Debug.LogError(this.assetResPath);
            switch (assetSrcType)
            {
                case AssetSourceType.Dir_Dir:
                    return GetOneDir_Dirs();
                case AssetSourceType.Dir_File:
                    return GetOneDir_Files();
                case AssetSourceType.Dir:
                    return GetOneDir();
                case AssetSourceType.File:
                    return GetOneFile();
            }
            return null;
        }

        /// <summary>
        /// 得到一个文件的ABB
        /// </summary>
        private AssetBundleBuild[] GetOneFile()
        {
            Object rObj = AssetDatabase.LoadAssetAtPath(assetResPath, typeof(Object));
            if (rObj == null) return null;

            AssetBundleBuild rABB = new AssetBundleBuild();
            rABB.assetBundleName = abName;
            rABB.assetBundleVariant = abVariant;
            rABB.assetNames = new string[] { assetResPath };
            return new AssetBundleBuild[] { rABB };
        }

        /// <summary>
        /// 得到一个目录的ABB
        /// </summary>
        private AssetBundleBuild[] GetOneDir()
        {
            DirectoryInfo rDirInfo = new DirectoryInfo(assetResPath);
            if (!rDirInfo.Exists) return null;

            AssetBundleBuild rABB = new AssetBundleBuild();
            rABB.assetBundleName = abName;
            rABB.assetBundleVariant = abVariant;
            rABB.assetNames = new string[] { assetResPath };
            return new AssetBundleBuild[] { rABB };
        }

        /// <summary>
        /// 得到一个目录下的所有的文件对应的ABB
        /// </summary>
        private AssetBundleBuild[] GetOneDir_Files()
        {
            DirectoryInfo rDirInfo = new DirectoryInfo(assetResPath);
            if (!rDirInfo.Exists) return null;

            List<AssetBundleBuild> rABBList = new List<AssetBundleBuild>();
            string[] rGUIDS = AssetDatabase.FindAssets(this.assetType, new string[] { assetResPath });
            for (int i = 0; i < rGUIDS.Length; i++)
            {
                string rAssetPath = AssetDatabase.GUIDToAssetPath(rGUIDS[i]);

                AssetBundleBuild rABB = new AssetBundleBuild();
                rABB.assetBundleName = abName + "/" + Path.GetFileNameWithoutExtension(rAssetPath);
                rABB.assetBundleVariant = abVariant;
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
            Debug.LogError(this.filerAssets.Count);
            for (int j = 0; j < filerAssets.Count; j++)
            {
                if (filerAssets[j] != null)
                {
                    Debug.LogError(filerAssets[j]);
                }
            }

            DirectoryInfo rDirInfo = new DirectoryInfo(assetResPath);
            if (!rDirInfo.Exists) return null;

            List<AssetBundleBuild> rABBList = new List<AssetBundleBuild>();
            DirectoryInfo[] rSubDirs = rDirInfo.GetDirectories();
            for (int i = 0; i < rSubDirs.Length; i++)
            {
                string rDirPath = rSubDirs[i].FullName;
                Debug.LogError(rDirPath);
                string rRootPath = System.Environment.CurrentDirectory + "\\";
                rDirPath = rDirPath.Replace(rRootPath, "").Replace("\\", "/");

                Debug.LogError(Path.GetFileName("btn_news") + "__" + Path.GetFileName("btn_news.png"));
                string rFileName = Path.GetFileNameWithoutExtension(rDirPath);
                int xx = filerAssets.FindIndex((item) =>
                {
                    if (item == "btn_news")
                    {
                        Debug.LogError(rDirPath);
                    }
                    
                    return rFileName.Contains(item);
                });
                Debug.LogError(xx);
                if (xx >= 0)
                {
                    continue;
                }
                   

                AssetBundleBuild rABB = new AssetBundleBuild();
                rABB.assetBundleName = abName + "/" + rFileName;
                rABB.assetBundleVariant = abVariant;
                rABB.assetNames = new string[] { rDirPath };
                rABBList.Add(rABB);
            }
            return rABBList.ToArray();
        }
    }

    /// <summary>
    /// 当前工程的平台
    /// </summary>
    public BuildPlatform buildPlatformCur = BuildPlatform.Windows;

    private AssetbundleHelper()
    {
        buildPlatformCur = (BuildPlatform)EditorUserBuildSettings.activeBuildTarget;
    }

    /// <summary>
    /// 得到Assetbundle的路径，根据不同的平台来选择
    /// </summary>
    public string GetAssetbundlesPath()
    {

        return Path.Combine(Application.dataPath + "/" + AppConst.ABDirName + "/", buildPlatformCur.ToString()) + "_Assetbundles";
    }

    /// <summary>
    /// 打包资源
    /// </summary>
    public void BuildAssetbundles()
    {
        List<AssetBundleBuild> abbList = BuildAssetbundleEntry();
       
        string abPath = GetAssetbundlesPath();
        DirectoryInfo dirInfo = new DirectoryInfo(abPath);
        if (!dirInfo.Exists) dirInfo.Create();
        BuildPipeline.BuildAssetBundles(abPath, abbList.ToArray(), BuildAssetBundleOptions.None, this.GetBuildTargetByPlatform(this.buildPlatformCur));
    }

    /// <summary>
    /// 根据选中的平台
    /// </summary>
    public void BuildAssetbundles(BuildPlatform plat,List<ABEntry> ablist)
    {
        List<AssetBundleBuild> list = new List<AssetBundleBuild>();
        for (int i = 0; i < ablist.Count;i++ )
        {            
            list.AddRange(ablist[i].ToABBuild());
        }
               
        this.buildPlatformCur = plat;
        string abPath = GetAssetbundlesPath();
        DirectoryInfo dirInfo = new DirectoryInfo(abPath);
        if (!dirInfo.Exists) dirInfo.Create();

        BuildPipeline.BuildAssetBundles(abPath, list.ToArray(), BuildAssetBundleOptions.None, this.GetBuildTargetByPlatform(this.buildPlatformCur));
    }

    private BuildTarget GetBuildTargetByPlatform(BuildPlatform plant)
    {
        switch (plant)
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

    /// <summary>
    /// 构建AssetBundleBuild
    /// </summary>
    private List<AssetBundleBuild> BuildAssetbundleEntry()
    {
        string path = Application.dataPath + "/" + AppConst.ABConfigPath + "/" + AppConst.ABConfigName + ".txt";
        string jsString = File.ReadAllText(path);
        SimpleJSON.JSONNode  node =  SimpleJSON.JSONData.Parse(jsString);

        Dict<string, ABEntry> abEntries = new Dict<string, ABEntry>();
        
        for (int i = 0; i < node.Count;i++ )
        {
            ABEntry abtry = new ABEntry();
            abtry.abName = node[i]["abName"].AsString;
            
            abtry.abVariant = node[i]["abVariant"].AsString;
            abtry.assetResPath = node[i]["assetResPath"].AsString;
            abtry.assetSrcType = StringToAssetSourceType(node[i]["assetSrcType"].AsString);
            abtry.assetType = node[i]["assetType"].AsString;
            if(!abEntries.ContainsKey(abtry.abName))
            {                
                abEntries.Add(abtry.abName,abtry);
            }            
        }
        
        List<AssetBundleBuild> abbList = new List<AssetBundleBuild>();
        foreach (var rEntryItem in abEntries)
        {            
            abbList.AddRange(rEntryItem.Value.ToABBuild());
        }
        return abbList;
    }

    public static AssetSourceType StringToAssetSourceType(string str)
    { 
        switch(str)
        {
            case "Dir":
            return AssetSourceType.Dir;
            case "Dir_Dir":
            return AssetSourceType.Dir_Dir;
            case "Dir_File":
            return AssetSourceType.Dir_File;
            case "File":
            return AssetSourceType.File;
        }
        return AssetSourceType.Dir;        
    }
}