using UnityEngine;
using System.Collections;
using System.Collections.Specialized;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using UnityEditor;
using System.IO;


/// <summary>
/// 资源统一打包工具
/// </summary>
public class AssetbundleManager
{
    [MenuItem("Tools/PackageAssets")]
    public static void PackageAssets()
    {
        AssetbundleHelper.Instance.BuildAssetbundles();
    }
}

/// <summary>
/// 
/// </summary>
public class AssestBundlePackgeTool : EditorWindow
{
     [MenuItem("Tools/AssestBundlePackgeTool")]
    public static void  ShowWindow()
    { 
        AssestBundlePackgeTool Wind = (AssestBundlePackgeTool)EditorWindow.GetWindow(typeof(AssestBundlePackgeTool),true, "AssestBundlePackgeTool");
        Wind.Show();
    }


     public class propertyClass 
     {
        /// <summary>
        /// Windows_Assetbundles 目录下面的的文件名
        /// </summary>
        public string abName;
        /// <summary>
        /// 文件的后缀名
        /// </summary>
        public string abVariant;
        /// <summary>
        /// 资源所在的文件夹（来源）
        /// </summary>
        public string assetResPath;
        /// <summary>
        /// 对资源所在的文件夹、文件的打包操作类型
        /// </summary>
        public AssetbundleHelper.AssetSourceType assetSrcType;
        /// <summary>
        /// 需要的资源类型，比如如果是预制件那么应该为 "t:Prefab"
        /// </summary>
        public string assetType;
        ///// <summary>
        ///// 需要过滤的文件
        ///// </summary>
        //public List<UnityEngine.Object> filerAssets = new List<Object>();

        // /// <summary>
        // /// 需要过滤的文件，且要添加到配置中
        // /// </summary>
        //public List<string> filterFile;
        
         /// <summary>
         ///  filter file
         /// </summary>
        public bool filter = false;     

        public propertyClass()
        { 
        }
        public void Init(AssetbundleHelper.ABEntry entry)
        {
            this.abName = entry.abName;
            this.abVariant = entry.abVariant;
            this.assetResPath = entry.assetResPath;
            this.assetSrcType = entry.assetSrcType; ;
            this.assetType = entry.assetType;            
        }


     }

     private Dict<string, bool> resourceFlodOut = new Dict<string, bool>();
     private Dict<string, AssetbundleHelper.ABEntry> resuorceAbentry = new Dict<string, AssetbundleHelper.ABEntry>();
     private Dict<string, propertyClass> resourceProperty = new Dict<string, propertyClass>();

     private Vector2 scrollpos = Vector2.zero;
     private AssetbundleHelper.BuildPlatform myBuildPlatform = AssetbundleHelper.BuildPlatform.Windows;
     private bool CreateNewBundFlied = false;
     private void Awake()
     {
         //界面已加载就根据配置去 设置我的所有的 打包资源类型
         string path = Application.dataPath + "/" + AppConst.ABConfigPath + "/" + AppConst.ABConfigName + ".txt";
         string jsString = File.ReadAllText(path);
         SimpleJSON.JSONNode node = SimpleJSON.JSONData.Parse(jsString);        
         for (int i = 0; i < node.Count; i++)
         {
             AssetbundleHelper.ABEntry abtry = new AssetbundleHelper.ABEntry();
             abtry.abName = node[i]["abName"].AsString;

             abtry.abVariant = node[i]["abVariant"].AsString;
             abtry.assetResPath = node[i]["assetResPath"].AsString;
             abtry.assetSrcType = AssetbundleHelper.StringToAssetSourceType(node[i]["assetSrcType"].AsString);// (AssetSourceType)node[i]["abname"].AsString;
             abtry.assetType = node[i]["assetType"].AsString;
             
             if (!this.resuorceAbentry.ContainsKey(abtry.abName))
             {                
                 this.resuorceAbentry.Add(abtry.abName, abtry);
             }
         }

         foreach(var item in this.resuorceAbentry)
         {
             if(!this.resourceFlodOut.ContainsKey(item.Key))
             {
                this.resourceFlodOut.Add(item.Key,false);
             }
             if(!this.resourceProperty.ContainsKey(item.Key))
             {
                 propertyClass newproperty = new propertyClass();
                 newproperty.Init(item.Value);
                 this.resourceProperty.Add(item.Key,newproperty);
             }
         }
     }
    private void OnGUI()
     {
        
         EditorGUILayout.HelpBox("You can Bundle all the Sources,", MessageType.Info);        

         //显示出所有要打包的资源
         this.DrawGui();

         MB_EditorUtil.DrawSeparator();
         this.CreateNewFlied();            

         MB_EditorUtil.DrawSeparator();
         
         EditorGUILayout.BeginVertical(); 
         EditorGUILayout.LabelField("选择打包到什么平台");
         EditorGUILayout.BeginHorizontal();
         this.myBuildPlatform = (AssetbundleHelper.BuildPlatform)EditorGUILayout.EnumPopup(this.myBuildPlatform,GUILayout.Width(200));
         GUILayout.Space(20);
        if(GUILayout.Button("保存当前配置",GUILayout.Width(250)))
        {
            //保存当前配置
            EditorApplication.delayCall = () => 
            {
                this.SaveConfig();                
            };
        }
         EditorGUILayout.EndHorizontal();
         EditorGUILayout.EndVertical();

         MB_EditorUtil.DrawSeparator();
         EditorGUILayout.BeginHorizontal();
         GUILayout.Space(position.width / 5); 
         if(GUILayout.Button("打包资源",GUILayout.Width(position.width/2)))
         {
             //这里要做的就是准备好所有数据然后将数据传过去
             EditorApplication.delayCall = () => { this.BeginBuild(); };            
         }
         EditorGUILayout.EndHorizontal();
     }

    private string SaveName = string.Empty;
    private string SaveLastName = string.Empty;
    private string SaveResourcePath = string.Empty;
    private AssetbundleHelper.AssetSourceType SaveResType = AssetbundleHelper.AssetSourceType.Dir;
    private string SaveResourceType = string.Empty;
    private KeyValuePair<string, AssetbundleHelper.ABEntry> SaveAbentry = new KeyValuePair<string, AssetbundleHelper.ABEntry>();
    private void CreateNewFlied()
    {
        this.CreateNewBundFlied = EditorGUILayout.Foldout(this.CreateNewBundFlied, "创建一个新的打包项");
        if(this.CreateNewBundFlied)
        {
            this.SaveName = EditorGUILayout.TextField("    打包的资源",this.SaveName, GUILayout.Width(500));
            this.SaveLastName = EditorGUILayout.TextField("    打包的资源后缀名", this.SaveLastName, GUILayout.Width(500));

            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.TextField("    原始资源所在文件夹", this.SaveResourcePath, GUILayout.Width(position.width - 300));
            if (GUILayout.Button("    选择路径", GUILayout.Width(100)))
            {
                this.SaveResourcePath = EditorUtility.SaveFolderPanel("Create Combined Packge Bundles Assets In Folder", "", "");
                this.SaveResourcePath = "Assets" + this.SaveResourcePath.Replace(Application.dataPath, "");//+ "/";
            }
            EditorGUILayout.EndHorizontal();
            this.SaveResType = (AssetbundleHelper.AssetSourceType)EditorGUILayout.EnumPopup("    目录及文件的操作类型", this.SaveResType, GUILayout.Width(300));
            this.SaveResourceType = EditorGUILayout.TextField(new GUIContent("    资源类型", "如： t:prefab"), this.SaveResourceType, GUILayout.Width(300));
            AssetbundleHelper.ABEntry entry = new AssetbundleHelper.ABEntry();

            entry.abName = this.SaveName;
            entry.abVariant = this.SaveLastName;
            entry.assetResPath = this.SaveResourcePath;
            entry.assetSrcType = this.SaveResType;
            entry.assetType = this.SaveResourceType;

            this.SaveAbentry = new KeyValuePair<string, AssetbundleHelper.ABEntry>(entry.abName, entry);
           
            //MB_EditorUtil.DrawSeparator();
            if(GUILayout.Button("确定创建",GUILayout.Width(position.width / 5)))
            {
                EditorApplication.delayCall = () => 
                {
                    this.OnSureCreate();
                };
            }
        }
    }

    private void OnSureCreate()
    {
        if (this.resuorceAbentry.ContainsKey(this.SaveAbentry.Key))
        {
            this.ShowNotification(new GUIContent("该字段已在打包队列中"));
            return;
        }

        if (string.IsNullOrEmpty(this.SaveAbentry.Value.abName) ||string.IsNullOrEmpty(this.SaveAbentry.Value.abVariant) ||string.IsNullOrEmpty(this.SaveAbentry.Value.assetResPath) ||
            string.IsNullOrEmpty(this.SaveAbentry.Value.assetType) )
        {
            this.ShowNotification(new GUIContent("参数字段不能为空"));
            return;
        }
        this.resuorceAbentry.Add(this.SaveAbentry.Key,this.SaveAbentry.Value);
        this.resourceFlodOut.Add(this.SaveAbentry.Key, false);
        foreach(var item in this.resuorceAbentry)
        {
            Debug.LogError(item.Key);
        }
        this.Repaint();
    }
    /// <summary>
    /// 保存更改好了的配置到 指定的配置表中
    /// </summary>
    private void SaveConfig()
    {        
        string x = "{";
        int i = 0;
        foreach (var item in this.resourceProperty)
        {
            SimpleJSON.JSONClass nimadan = new SimpleJSON.JSONClass();
            nimadan.Add("abName", item.Value.abName);
            nimadan.Add("abVariant", item.Value.abVariant);
            nimadan.Add("assetResPath", item.Value.assetResPath);
            nimadan.Add("assetSrcType", item.Value.assetSrcType.ToString());
            nimadan.Add("assetType", item.Value.assetType);
                        
            SimpleJSON.JSONClass caonidaye = new SimpleJSON.JSONClass();
            caonidaye.Add(item.Value.abName,nimadan);
           
            string xx = caonidaye.ToString();
            string xxx = xx.Substring(1, xx.Length -2);
                 
            if (i == this.resourceProperty.Count - 1)
            {                
                x += xxx + "}";
            }
            else 
            {                
                x += xxx + ",";
            }
            i++;    
        }
                
        this.CreateAJsonMart(x);
    }
    private void CreateAJsonMart(string json)
    {

        string path = Application.dataPath + "/" + AppConst.ABConfigPath + "/" + AppConst.ABConfigName + ".txt";
        using (FileStream fs = new FileStream(path, FileMode.OpenOrCreate))      
        {            
            StreamWriter sw = new StreamWriter(fs);
            fs.SetLength(0);
            sw.Write(json);
            sw.Flush();
            sw.Close();           
        }
    }    

    private void BeginBuild()
    {
        List<AssetbundleHelper.ABEntry> ablist = new List<AssetbundleHelper.ABEntry>();
        foreach(var item in this.resourceProperty)
        {
            AssetbundleHelper.ABEntry entry = new AssetbundleHelper.ABEntry();
            entry.abName = item.Value.abName;
            entry.abVariant = item.Value.abVariant;
            entry.assetResPath = item.Value.assetResPath;
            entry.assetSrcType = item.Value.assetSrcType;
            entry.assetType = item.Value.assetType;
            ablist.Add(entry);
        }

        AssetbundleHelper.Instance.BuildAssetbundles(this.myBuildPlatform, ablist);
    }
    private void DrawGui()
    {
        this.scrollpos = EditorGUILayout.BeginScrollView(this.scrollpos, GUILayout.Width(position.width), GUILayout.Height(position.height - 280));
        
        foreach(var item in this.resuorceAbentry)
        {            
            string name = "Show " + item.Key + " Setting";
            if(this.resourceFlodOut.ContainsKey(item.Key))
            {
                MB_EditorUtil.DrawSeparator();
                this.resourceFlodOut[item.Key] = EditorGUILayout.Foldout(this.resourceFlodOut[item.Key], name);
                if (this.resourceFlodOut[item.Key])
                {                    
                    this.ShowButtonClicked(item.Key,item.Value);
                }
            }
        }
        EditorGUILayout.EndScrollView();
    }

    private void ShowButtonClicked(string name,AssetbundleHelper.ABEntry abentry) 
    {        
        if (!this.resourceProperty.ContainsKey(name))
        {
            propertyClass nwwProperty = new propertyClass();
            nwwProperty.Init(abentry);
            this.resourceProperty.Add(name, nwwProperty);
        }


        var propertys = this.resourceProperty[name];
        
        if(propertys == null)
        {
            Debug.LogWarning("this propertys  is null ,Please check out");
            return;
        }        

        EditorGUILayout.BeginVertical();
        propertys.abName = EditorGUILayout.TextField("    打包后保存的名字", propertys.abName);
        propertys.abVariant =EditorGUILayout.TextField("    打包后保存的后缀名", propertys.abVariant);

        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.TextField("    原始资源所在文件夹", propertys.assetResPath, GUILayout.Width(position.width - 300));
        if (GUILayout.Button("选择路径",GUILayout.Width(100) ))
        {
            propertys.assetResPath = EditorUtility.SaveFolderPanel("Create Combined Packge Bundles Assets In Folder", "", "");
            propertys.assetResPath = "Assets" + propertys.assetResPath.Replace(Application.dataPath, "");//+ "/";
        }
        EditorGUILayout.EndHorizontal();

        propertys.assetSrcType = (AssetbundleHelper.AssetSourceType)EditorGUILayout.EnumPopup("    目录及文件的操作类型", propertys.assetSrcType, GUILayout.Width(300));

        propertys.assetType = EditorGUILayout.TextField("    资源类型", propertys.assetType);

        this.resourceProperty[name] = propertys;
        EditorGUILayout.EndVertical();        
    }       
}
