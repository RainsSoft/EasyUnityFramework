using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using System.IO;

public class PackgeSceneTool : EditorWindow
{
    
    [MenuItem("Tools/PackgeSceneTools")]
    public static void PackgeSceneTools()
    {
        //Rect rect = new Rect(0,0,700,390);
        PackgeSceneTool window = (PackgeSceneTool)EditorWindow.GetWindow(typeof(PackgeSceneTool),true, "PackgeScene");//GetWindow(typeof(PackgeSceneTool), true, "PakgeScene");// GetWindowWithRect(typeof(MyEditor), rect, true, "PackgeScene");//    
        window.Show();
    }
    
    [HideInInspector]
    [SerializeField]
    private Vector2 scrollpos = Vector2.zero;
    private string Curentpath = "Nothing";
    private List<string> CurentpathList = new List<string>();
    
    private string muilteSavepath = null;
    private string allOfthemSavePaht = null;


    private Dict<string, string> dcitDirToName = new Dict<string, string>();
    private Dict<string, bool> dictItem = new Dict<string, bool>();
        
    private List<Rect> ClickRectList = new List<Rect>();

    private string SaveScenePackgedName = null;
    private string SaveAllScenePackgedName = null;

//     private Rect CliclRect;
// 
//     private bool isMuiltiChose = false;
    private void OnGUI()
    {
        EditorGUILayout.LabelField("show all scene",EditorStyles.boldLabel);
        EditorGUILayout.HelpBox("this will show all the xxxx.unity at assests/scene/ dir. so you can opreator single one or  all of them",MessageType.None);
        EditorGUILayout.Separator();

        // this.isMuiltiChose = EditorGUILayout.Toggle("是否支持多项选择", this.isMuiltiChose);
        //加载 选择列表
        this.ShowScrollView();


        MB_EditorUtil.DrawSeparator();
        EditorGUILayout.HelpBox("Currnt Scene is :" + this.Curentpath, MessageType.Info);
        EditorGUILayout.Space();
        
        MB_EditorUtil.DrawSeparator();
        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("设置存储路径", GUILayout.Width(200)))
        {
            this.muilteSavepath = string.Empty;
            this.muilteSavepath = EditorUtility.SaveFolderPanel("Create Combined Packge Bundles Assets In Folder", "", "");
            this.muilteSavepath = "Assets" + this.muilteSavepath.Replace(Application.dataPath, "") + "/";
        }
        EditorGUILayout.LabelField("Folder: " + this.muilteSavepath);
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.Space();
        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("打包选中多个场景", GUILayout.Width(200)))
        {
            EditorApplication.delayCall = () =>
            {
                this.PackgeMuiltScene();
            };      
        }
        this.SaveScenePackgedName = EditorGUILayout.TextField("打包后的文件保存名字", this.SaveScenePackgedName, GUILayout.Width(500));
        EditorGUILayout.EndHorizontal();
        MB_EditorUtil.DrawSeparator();
        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("设置存储路径", GUILayout.Width(200)))
        {
            this.allOfthemSavePaht = string.Empty;
            this.allOfthemSavePaht = EditorUtility.SaveFolderPanel("Create Combined Packge Bundles Assets In Folder", "", "");
            this.allOfthemSavePaht = "Assets" + this.allOfthemSavePaht.Replace(Application.dataPath, "") + "/";
        }
        EditorGUILayout.LabelField("Folder: " + this.allOfthemSavePaht);
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.Space();
        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("打包所有的场景", GUILayout.Width(200)))
        {
            EditorApplication.delayCall = () =>
            {
                this.PackgeAllScenes();                    
            };      
        }
        this.SaveAllScenePackgedName = EditorGUILayout.TextField("打包后的文件保存名字", this.SaveAllScenePackgedName, GUILayout.Width(500));
        EditorGUILayout.EndHorizontal();
        MB_EditorUtil.DrawSeparator();      

        EditorGUILayout.LabelField("window mouse postion", Event.current.mousePosition.ToString());
    }

    private void ShowScrollView()
    {
        this.scrollpos = EditorGUILayout.BeginScrollView(this.scrollpos, GUILayout.Width(position.width), GUILayout.Height(position.height - 280));

        EditorGUILayout.BeginVertical();

        //add scene list
        this.AddSceneList();

        foreach (var kev in this.dictItem)
        {
            Rect rect = EditorGUILayout.BeginHorizontal();

            if (GUILayout.Button(kev.Key, GUILayout.Width(position.width - 100)))
            {
                if (!this.ClickRectList.Contains(rect))
                {
                    this.ClickRectList.Add(rect);
                    this.CurentpathList.Add(kev.Key);
                }
                else
                {
                    this.ClickRectList.Remove(rect);
                    this.CurentpathList.Remove(kev.Key);
                }
                this.Curentpath = kev.Key;               

            }
            if (GUILayout.Button("选 择", GUILayout.Width(50)))
            {
                if (!this.ClickRectList.Contains(rect))
                {
                    this.ClickRectList.Add(rect);
                    this.CurentpathList.Add(kev.Key);
                }
                else
                {
                    this.ClickRectList.Remove(rect);
                    this.CurentpathList.Remove(kev.Key);
                }
                this.Curentpath = kev.Key;
            }
            EditorGUILayout.EndHorizontal();
        }
           

        if (this.ClickRectList != null && this.ClickRectList.Count > 0)
        {
            for (int i = 0; i < this.ClickRectList.Count; i++)
            {
                Rect rect = new Rect(this.ClickRectList[i].xMin, this.ClickRectList[i].yMin, position.width - 100, this.ClickRectList[i].height);
                EditorGUI.DrawRect(rect, new Color(1, 0, 0, 0.2f));
            }
        }

        EditorGUILayout.EndVertical();
        EditorGUILayout.EndScrollView();
    }
    private void PackgeAllScenes()
    {
        if (string.IsNullOrEmpty(this.allOfthemSavePaht))
        {
            this.ShowNotification(new GUIContent("请选择文件保存路径！"));
            this.Repaint();
            return;
        }
        if (string.IsNullOrEmpty(this.SaveAllScenePackgedName))
        {
            this.ShowNotification(new GUIContent("请输入场景打包后的名字"));
            this.Repaint();
            return;
        }
        PackgeBuld.Instance.BuildScenes(this.SaveAllScenePackgedName);
    }
    private void PackgeMuiltScene()
    {
        if (string.IsNullOrEmpty(this.muilteSavepath))
        {
            this.ShowNotification(new GUIContent("请选择文件保存路径！"));
            this.Repaint();
            return;
        }
        if(string.IsNullOrEmpty(this.SaveScenePackgedName))
        {
            this.ShowNotification(new GUIContent("请输入场景打包后的名字"));
            this.Repaint();
            return;
        }
        List<string> newNameList = new List<string>();
        for (int i = 0; i < this.CurentpathList.Count; i++)
        {
            string name = "xx";
            if (this.dcitDirToName.TryGetValue(this.CurentpathList[i], out name))
            {
                string newname = name.Replace(".unity", "");
                newNameList.Add(newname);
            }
        }
        if (newNameList.Count <= 0)
        {
            this.ShowNotification(new GUIContent("请选择一个或则多个场景！"));
            this.Repaint();
            return;
        }
        PackgeBuld.Instance.BuildScenes(newNameList,this.SaveScenePackgedName);
    }
    /// <summary>
    /// 打包单个场景文件
    /// </summary>
    public  void PackgeSingleOne()
    {
        string name = "xxx";
        if (this.dcitDirToName.TryGetValue(this.Curentpath, out name))
        {
            string newname = name.Replace(".unity", "");
            PackgeBuld.Instance.BuildScenes(newname);
        }
    }
    /// <summary>
    /// 查找 指定目录下面的的Scene ，Aessts/scene/ 下面的的所有的scene 这些东西 只加载一次
    /// </summary>
    private Dict<string ,bool> AddSceneList()
    {
        string pasth = Application.dataPath + "/Scene/";  //Application.dataPath +
        
        DirectoryInfo pathinfo = new DirectoryInfo(pasth);
        foreach (FileInfo file in pathinfo.GetFiles())
        {
            if (file.Name.Contains(".unity.meta"))
            {
                // Debug.LogError(file.FullName);
            }
            else
            {
                
                if (!this.dcitDirToName.ContainsKey(file.FullName))
                {
                    this.dcitDirToName.Add(file.FullName,file.Name);
                }
                if (!this.dictItem.ContainsKey(file.FullName))
                {
                    this.dictItem.Add(file.FullName,false);
                }
               /* Debug.LogError(file.FullName);*/
            }
        }
        return this.dictItem;
    }


    private void OnDestory()
    {
        Debug.Log("clear dict");
        this.dcitDirToName.Clear();
    }
}
