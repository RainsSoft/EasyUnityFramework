using UnityEngine;
using System.Collections;
using System.IO; 

public class ResourcesUpdateManager : MonoBehaviour
{
    const string ResourcesUpdateUrl = "http://192.168.0.35:8080/";

    System.Action OnResourceUpdateComplete;

    public void ResourceUpdateStart(System.Action func)
    {
        if(func != null)
        {
            OnResourceUpdateComplete = func;
        }
        CheckExtractResource();
    }

    void ResourceUpdateEnd()
    {
        Debug.Log("[ResourceUpdateEnd]");
        if (OnResourceUpdateComplete != null)
        {
            OnResourceUpdateComplete.Invoke();
            OnResourceUpdateComplete = null;
        }
    }
    
    void CheckExtractResource()
    {
        bool rNoExtract = Directory.Exists(AppPlatform.RuntimeAssetsPath) && File.Exists(AppPlatform.RuntimeAssetsPath + "files.txt");
        if (rNoExtract || AppConst.IsDebugMode)
        {

            DebugConsole.Log("[extracted] or [Debug mode] is open");
            StartCoroutine(OnUpdateResource());
            return;
        }
        DebugConsole.Log("[not extract] run before extract to RuntimeAssetsPath");
        StartCoroutine(OnExtractResource());
    }

    IEnumerator OnExtractResource()
    {
        string rAssetsPath = AppPlatform.AssetsPath;
        string rRuntimeAssetsPath = AppPlatform.RuntimeAssetsPath;

        DebugConsole.Log("[AssetsPath]：" + rAssetsPath);
        DebugConsole.Log("[RuntimeAssetsPath] :" + rRuntimeAssetsPath);

        string infile = rAssetsPath + "files.txt";
        string outfile = rRuntimeAssetsPath + "files.txt";

        //清理解包文件夹
        DebugConsole.Log("[clear RuntimeAssetsPath dir]");
        if (File.Exists(outfile)) File.Delete(outfile);
        if (Directory.Exists(rRuntimeAssetsPath)) Directory.Delete(rRuntimeAssetsPath, true);
        Directory.CreateDirectory(rRuntimeAssetsPath);

        //写文件列表文件
        if (AppPlatform.PlatformCurrent == Platform.Android)
        {
            WWW www = new WWW(infile);
            yield return www;

            if (www.isDone)
            {
                File.WriteAllBytes(outfile, www.bytes);
            }
            yield return null;
        }
        else
        {
            File.Copy(infile, outfile, true);
        }
        yield return new WaitForEndOfFrame();

        //释放所有文件到运行时读取目录
        string[] files = File.ReadAllLines(outfile);
        foreach (var file in files)
        {
            string[] rKeyValue = file.Split('|');
            infile = rAssetsPath + rKeyValue[0];
            outfile = rRuntimeAssetsPath + rKeyValue[0];

            DebugConsole.Log("[extracting]:>" + infile + "[TO]" + outfile);

            string rDirName = Path.GetDirectoryName(outfile);
            if (!Directory.Exists(rDirName)) Directory.CreateDirectory(rDirName);

            if (AppPlatform.PlatformCurrent == Platform.Android)
            {
                WWW www = new WWW(infile);
                yield return www;

                if (www.isDone)
                {
                    File.WriteAllBytes(outfile, www.bytes);
                }
                yield return 0;
            }
            else
            {
                if (File.Exists(outfile))
                {
                    File.Delete(outfile);
                }
                File.Copy(infile, outfile, true);
            }
            yield return new WaitForEndOfFrame();
        }

        DebugConsole.Log("[extract complete]");
        yield return new WaitForSeconds(0.1f);

        //解包完成，开始启动更新资源
        StartCoroutine(OnUpdateResource());
    }


    IEnumerator OnUpdateResource()
    {
        if (!AppConst.IsUpdateMode)
        {
            ResourceUpdateEnd();
            yield break;
        }

        string rRuntimeAssetsPath = AppPlatform.RuntimeAssetsPath;
        string url = ResourcesUpdateUrl;

        string listUrl = url + "files";

        WWW www = new WWW(listUrl);
        yield return www;

        if (www.error != null)
        {
            Debug.Log(www.error);
            yield break;
        }

        if (!Directory.Exists(rRuntimeAssetsPath))
        {
            Directory.CreateDirectory(rRuntimeAssetsPath);
        }

        File.WriteAllBytes(rRuntimeAssetsPath + "files.txt", www.bytes);

        string filesText = www.text;
        string[] files = filesText.Split('\n');

        for (int i = 0; i < files.Length; i++)
        {
            if (string.IsNullOrEmpty(files[i])) continue;
            string[] keyValue = files[i].Split('|');
            string fileName = keyValue[0];
            string localfilePath = (rRuntimeAssetsPath + fileName).Trim();
            string path = Path.GetDirectoryName(localfilePath);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            string fileUrl = url + fileName;

            bool canUpdate = !File.Exists(localfilePath);
            if (!canUpdate)
            {
                string remoteMd5 = keyValue[1].Trim();
                string localMd5 = Util.MD5File(localfilePath);
                canUpdate = !remoteMd5.Equals(localMd5);
                if (canUpdate) File.Delete(localfilePath);
            }

            if (canUpdate)
            {  
                //本地缺少文件
                Debug.Log(fileUrl);
                www = new WWW(fileUrl); yield return www;
                if (www.error != null)
                {
                    Debug.Log(www.error+path);
                    yield break;
                }
                File.WriteAllBytes(localfilePath, www.bytes);
                
            }
        }
        yield return new WaitForEndOfFrame();

        ResourceUpdateEnd();
    }
}
