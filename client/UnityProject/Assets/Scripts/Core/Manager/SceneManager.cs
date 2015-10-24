using UnityEngine;
using System;
using System.Collections;
public class SceneManager : MonoBehaviour 
{

    string _loadSceneName = null;
    Action _onLoadComplete = null;

    public AsyncOperation async = null;
    public bool IsLoading { get; set; }

    const string loadingLogic = "LoadingLogic";

    public void EnterScene(string sceneName, Action onLoadComplete = null)
    {
        gate.PanelManager.PushPanel(loadingLogic);
        _loadSceneName = sceneName;
        _onLoadComplete = onLoadComplete;
        LoadScene();
    }

    /// <summary>
    /// 暂时先用这个  这里肯定是要重写的 
    /// </summary>
    public void EnterScene(string sceneName)
    {
        gate.PanelManager.PushPanel(loadingLogic);
        _loadSceneName = sceneName;
        //_onLoadComplete = onLoadComplete;
        LoadScene();
    }
    void LoadScene()
    {
        StartCoroutine(LoadSceneInternal());
    }

    IEnumerator LoadSceneInternal()
    {

        while (true)
        {
            var rPanel = gate.PanelManager.PanelCurrent;
            if (rPanel == null || rPanel.IsCreated == false)
            {
                yield return null;
            }
            else
            {
                break;
            }

        }

        async = Application.LoadLevelAsync(_loadSceneName);
        IsLoading = true;
        yield return async;
        async.allowSceneActivation = false;

        if (async.isDone)
        {
            gate.PanelManager.ClearStack();
            _loadSceneName = null;

            if (_onLoadComplete != null)
            {
                //_onLoadComplete();
                _onLoadComplete = null;
            }

            IsLoading = false;
            async.allowSceneActivation = true;
        }

    }

}
