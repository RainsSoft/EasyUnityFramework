using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System;
public class Loading : MonoBehaviour
{
    public Slider slider;

    [HideInInspector]
    public bool Flag = false;
    [HideInInspector]
    public AsyncOperation asyn = null;

    private void Update()
    {
        if (this.Flag && this.asyn != null)
        {
            this.slider.value += (float)(this.asyn.progress * 100) / 90;            
        }       
    }

    public void LoadScene(SceneManager scenemgr, int sceneName,Action OnCompleta)
    {
        if (scenemgr = null)
        {
            Debug.LogWarning("SceneManager is null");
            return;
        }
        this.Init();
        StartCoroutine(LoadLevel_async(sceneName, OnCompleta));
    }

    public void Init()
    {
        this.Flag = true;
    }
    public IEnumerator LoadLevel_async(int sceneName, Action func)
    {
        Debug.Log("loading succesed;And loading other scene = " + (SceneManager.SceneLoadType)sceneName);
        AsyncOperation async = Application.LoadLevelAsync(sceneName);
        this.asyn = async;
        yield return async;

        if (async.isDone)
        {
            if (func != null)
            {
                Debug.LogError("fun excuted");
                Facade.GetPanelManager().ClearStack();
                func();
            }
        }
    }

    /// <summary>
    /// 加载新场景时不卸载老场景对象
    /// </summary>
    public IEnumerator LoadLevelAdditive_async(int sceneName, Action func)
    {
        AsyncOperation async = Application.LoadLevelAdditiveAsync(sceneName);
        this.asyn = async;

        yield return async;

        if (async.isDone)
        {
            if (func != null)
            {
                Facade.GetPanelManager().ClearStack();
                func();
            }
        }

    }

}
