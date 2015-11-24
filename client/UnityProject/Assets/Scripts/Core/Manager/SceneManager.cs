using UnityEngine;
using System;
using System.Collections;
public class SceneManager : MonoBehaviour 
{
    int progress = 0;
    string loadSceneName = null;
    UnityEngine.Events.UnityAction onLoadComplete = null;
    AsyncOperation async = null;

    AssetBundle sceneBundle = null;

    public bool IsLoading { get; set; }

    const string logicName = "LoadingLogic";
    const string callSetTips = "SetProgressbarTips";
    const string callSetValue = "SetProgressbarValue";


    public void EnterScene(string sceneName, UnityEngine.Events.UnityAction rFunc)
    {
        gate.PanelManager.PushPanel(logicName);
        loadSceneName = sceneName;
        onLoadComplete = rFunc;
        LoadScene();
    }

    void LoadScene()
    {
        StartCoroutine(LoadSceneBundle());
    }

    IEnumerator LoadSceneBundle()
    {
        var rPanel = gate.PanelManager.PanelCurrent;

        //检查Loading UI 
        while (true)
        {
            if (rPanel != null &&
                rPanel.LogicName == logicName &&
                rPanel.IsCreated == true)
                break;
            else
                yield return new WaitForEndOfFrame();
        }

        if (String.IsNullOrEmpty(loadSceneName)) yield break;

        var rUrl = AppPlatform.GetSceneBundleDirUrl() + loadSceneName.ToLower() + ".unity3d";
        Debug.Log("[[DownloadSceneBundle]:>]" + rUrl);

        var download = WWW.LoadFromCacheOrDownload(rUrl, 0);
        yield return download;

        if (download.error != null)
        {
            Debug.LogError(download.error);
            yield break;
        }

        sceneBundle = download.assetBundle;

        this.StartCoroutine(LoadSceneInternal(rPanel));
    }

    IEnumerator LoadSceneInternal(UIPanel rPanel)
    {
        int rDisplayProgress = 0;
        //加载场景
        Util.CallScriptFunction(rPanel.LogicObject, rPanel.LogicName, callSetTips, "Loading Scene ...");
        Util.CallScriptFunction(rPanel.LogicObject, rPanel.LogicName, callSetValue, rDisplayProgress);

        async = Application.LoadLevelAsync(loadSceneName);
        IsLoading = true;
        async.allowSceneActivation = false;

        while (async.progress < 0.9f)
        {
            progress = (int)async.progress * 100;
            while (rDisplayProgress < progress)
            {
                ++rDisplayProgress;
                Util.CallScriptFunction(rPanel.LogicObject, rPanel.LogicName, callSetValue, rDisplayProgress);
                yield return new WaitForEndOfFrame();
            }
            yield return null;
        }

        progress = 100;

        while (rDisplayProgress < progress)
        {

            ++rDisplayProgress;
            Util.CallScriptFunction(rPanel.LogicObject, rPanel.LogicName, callSetValue, rDisplayProgress);
            yield return new WaitForEndOfFrame();

        }
        async.allowSceneActivation = true;
        LoadSceneComplete();
        IsLoading = false;
    }

    void LoadSceneComplete()
    {
        Util.ClearUICache();
        Util.ClearMemory();
        sceneBundle.Unload(false);

        // 加载完成
        if (onLoadComplete != null)
        {
            onLoadComplete.Invoke();
            onLoadComplete = null;
        }

        loadSceneName = null;
        async = null;
        progress = 0;
    }

}