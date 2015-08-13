using UnityEngine;
using System.Collections;
using System.IO;

public class ResourcesUpdateManager : MonoBehaviour
{

    public void Initialize() { }
    /// <summary>
    /// 检查服务器有没有不同的版本之间的更新
    /// </summary>
    public bool CheckDifferentVersionOfResuorce()
    {
        return false;
    }

    /// <summary>
    /// 根据对比出来的不同的版本文件从服务器上下载所需的文件
    /// </summary>
    public void CreateOrCoverNewFileByDifferentVersion()
    { 
    
    }
    /// <summary>
    /// 将本地的部分streamingAssetsPath资源文件拷贝到沙盒路径里面去
    /// </summary>
    public void CopyResuorceToPersistentDataPath()
    {
        string[] filenames = new string[] { "map_element.json", "gs_cn.json", "age.json", "battle.json", "city_information.json", 
            "create_character.json", "gender.json", "gs_en.json", "interest.json", "job.json", "map_element_op.json", "skill_feature.json",
        "skill_normal.json","task.json","version.json"};
        string Frompath = string.Empty;
        Frompath = AppPlatform.GetResourcesDictionaryUrl() + "/ConfigData/";        
        if (!Directory.Exists(Frompath))
        {
            Debug.Log(" this Form Path is NOT Exists");
        }        
        string toPath = string.Empty;
        toPath = this.GetResourceByPlantFrom();
        Debug.Log("Begin to filenames Data");

        if (Application.platform == RuntimePlatform.Android)
        {
            StartCoroutine(this.LoadWWWFromStreassetpath(filenames));
        }
        else
        {
            for (int i = 0, count = filenames.Length; i < count; i++)
            {
                if (!Directory.Exists(toPath))
                {
                    Debug.Log("THIS PATH IS NOT EXITS!!!!");
                    Directory.CreateDirectory(toPath);
                }                      
                string contnet = FileHelper.ReadFile(Frompath, filenames[i]);
                using (FileStream fs = new FileStream(toPath + filenames[i], FileMode.OpenOrCreate))
                {
                    StreamWriter sw = new StreamWriter(fs);
                    fs.SetLength(0);
                    sw.Write(contnet);
                    sw.Flush();
                    sw.Close();
                }
            }
            Facade.GameController.LoadAssetbundleManifest();
        }
    }
    
    /// <summary>
    /// 用携程的方式去处理Andriod平台访问权限的问题 主要还是用WWW 下载里面的资源
    /// </summary>
    /// <param name="strlist"></param>
    /// <returns></returns>
    private IEnumerator LoadWWWFromStreassetpath(string[] strlist)
    {

        string Frompath = AppPlatform.GetResourcesDictionaryUrl() + "/ConfigData/";
        
        string Topath = this.GetResourceByPlantFrom();
        if (!Directory.Exists(Topath))
        {
            Debug.Log(" yyyyy this Topath Path is NOT Exists");
            Directory.CreateDirectory(Topath);
        }        
        
        yield return new WaitForSeconds(1);

        for (int i = 0, cont = strlist.Length; i < cont; i++)
        {
            Debug.Log("+++++++++++++++++++++++begin read WWW " + strlist[i]);
            Debug.Log("this read Path is : " + Frompath + strlist[i]);
            Debug.Log("this write Path is : " + Topath + strlist[i]);
            WWW content = new WWW(Frompath + strlist[i]);
            yield return content;
            if (!string.IsNullOrEmpty(content.error))
            {
                Debug.Log("this file can not read : " + strlist[i]);
            }            
            Debug.Log("WO ZAI ZHE ER DENG ZHE NI HUI LAI ");            
            FileHelper.WriteFileFromEnd(Topath  + strlist[i], content.text);
          
        }
        yield return 0;
        Facade.GameController.LoadAssetbundleManifest();
    }


    private string GetResourceByPlantFrom()
    {
        if (Application.platform != RuntimePlatform.WindowsEditor)
        {
            return Application.persistentDataPath +"/ConfigData/";
        }
        else
        {
            return  Application.streamingAssetsPath + "/TempConfig/";
        }
    }
    /// <summary>
    /// 启动游戏
    /// </summary>
    public void EnterGame()
    { 
        
    }

    /// <summary>
    /// 手机各个平台系统接入成功以后的回调，一般是进行检查更新（怎么演才能检测到哪里有更新呢？）
    /// </summary>
    public void PlatFormConnectedCallBack()
    { 
    
    }

    /// <summary>
    /// 开始执行资源文件的创建
    /// </summary>
    public void StartMoveResuorce()
    {
        this.CopyResuorceToPersistentDataPath();
        this.CreateOrCoverNewFileByDifferentVersion();
    }	
}
