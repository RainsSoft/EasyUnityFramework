using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections.Generic;

public class PackgeBuld : TSingleton<PackgeBuld>
{
    private PackgeBuld()
    {     
    }
    
    public void BuildScenes(string saveName)
    { 
        //1:得到路径
        //2:找到路径下面的.unity3d 的文件 将其加载到一个字符串数组中

        // getPath();
        string pasth = Application.dataPath + "/Scene/";  //Application.dataPath +
        List<string> levels = new List<string>();
        DirectoryInfo pathinfo = new DirectoryInfo(pasth);
        foreach (FileInfo file in pathinfo.GetFiles())
        {
            if (file.FullName.Contains(".unity.meta"))
            {
               // Debug.LogError(file.FullName);
            }
            else 
            {
                levels.Add(file.FullName);
            }
        }
        string SavepathName = "Assets/" + saveName + ".unity3d";        
        BuildPipeline.BuildPlayer(levels.ToArray(), SavepathName, BuildTarget.StandaloneWindows64, BuildOptions.BuildAdditionalStreamedScenes);

    }

//     //打包单个的场景
//     public void BuildScenes(string name)
//     {
//         int index = (int)AppPlatform.RuntimePlatform;
//         string pasth = Application.dataPath + "/Scene/";
//         List<string> levels = new List<string>();
// 
//         // name 中包含了 .unity 后缀，所以 要去掉
// 
//         Debug.LogWarning(name);
//         string suorcepath = pasth + name + ".unity";
//         levels.Add(suorcepath); 
// 
//         string savepath = "Assets/" + name + ".unity3d" ;
//         Debug.LogWarning("savepath" + savepath);
//         BuildPipeline.BuildPlayer(levels.ToArray(), savepath, BuildTarget.StandaloneWindows64, BuildOptions.BuildAdditionalStreamedScenes);
//     }

    /// <summary>
    /// 打包选中的多个场景
    /// </summary>
    /// <param name="SceneList"></param>
    public void BuildScenes(List<string> SceneList,string saveName)
    {
        string pasth = Application.dataPath + "/Scene/";
        List<string> levels = new List<string>();

        // name 中包含了 .unity 后缀，所以 要去掉
        for (int i = 0; i < SceneList.Count; i++)
        {
            //Debug.LogError(pasth + SceneList[i] + ".unity");
            levels.Add(pasth + SceneList[i] + ".unity");
        }
       
        string savepath = string.Format("Assets/{0}.unity3d",saveName);
        BuildPipeline.BuildPlayer(levels.ToArray(), savepath, BuildTarget.StandaloneWindows64, BuildOptions.BuildAdditionalStreamedScenes);
    }
    
}
