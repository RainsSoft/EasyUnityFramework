using UnityEngine;
using System;
using System.Collections;
public class SceneManager : MonoBehaviour 
{

    string _loadSceneName = null;
    Action _onLoadComplete = null;

    public AsyncOperation async = null;

    public void EnterScene(string sceneName, Action onLoadComplete = null)
    {
        Facade.GetPanelManager().PushPanel(PanelNames.Loading);
        _loadSceneName = sceneName;
        _onLoadComplete = onLoadComplete;
        LoadScene();
    }

    public void LoadScene()
    {
        StartCoroutine(LoadSceneInternal());
    }

    IEnumerator LoadSceneInternal()
    {
        if (Facade.GetPanelManager().PanelFocus.IsCreated != true)
            yield return null;

        async = Application.LoadLevelAsync(_loadSceneName);
        yield return async;
        if (async.isDone)
        {
            Facade.GetPanelManager().ClearStack();

            if (_onLoadComplete != null)
            {
                _onLoadComplete();
                _onLoadComplete = null;
                _loadSceneName = null;
            }
        }
    }

}
