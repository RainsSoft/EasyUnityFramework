using UnityEngine;
using System;
using System.Collections;
public class SceneManager : MonoBehaviour 
{
    int progress = 0;
    string loadSceneName = null;
    UnityEngine.Events.UnityAction onLoadComplete = null;
    AsyncOperation async = null;

    public bool IsLoading { get; set; }

    const string logicName = "LoadingLogic";
    const string callFuncName = "SetProgressbar";

    public void EnterScene(string sceneName, UnityEngine.Events.UnityAction rFunc)
    {
        gate.PanelManager.PushPanel(logicName);
        loadSceneName = sceneName;
        onLoadComplete = rFunc;
        LoadScene();
    }

    void LoadScene()
    {
        StartCoroutine(LoadSceneInternal());
    }

    IEnumerator LoadSceneInternal()
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

        //加载场景Bundle（待添加）
        

        //加载场景
        int rDisplayProgress = 0;
        async = Application.LoadLevelAsync(loadSceneName);
        IsLoading = true;

        async.allowSceneActivation = false;
        while (async.progress < 0.9f)
        {
            progress = (int)async.progress * 100;
            while (rDisplayProgress < progress)
            {
                ++rDisplayProgress;
                Util.CallScriptFunction(rPanel.LogicObject, rPanel.LogicName, callFuncName, rDisplayProgress);
                yield return new WaitForEndOfFrame();
            }
            yield return null;
        }

        progress = 100;

        while (rDisplayProgress < progress)
        {

            ++rDisplayProgress;
            Util.CallScriptFunction(rPanel.LogicObject, rPanel.LogicName, callFuncName, rDisplayProgress);
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
