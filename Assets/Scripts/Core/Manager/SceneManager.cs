using UnityEngine;
using System;
using System.Collections;
public class SceneManager : MonoBehaviour 
{
    //private AsyncOperation asynCurent = null;

    private Loading loading = null;
    public void Initialize() { }

    /// <summary>
    /// 每增加一个场景 自己 就到这里增加一个场景类型,
    /// 场景的level 要和bulidSetting 里面场景的Level 对应
    /// </summary>
    public enum SceneLoadType
    { 
        Unkown = -1,         //未知场景
        Login = 0,           //登录的场景
        Loading = 1,             //加载界面
        CampScene = 2,       //新的主场景
        CityMale = 3,      //male场景
        CityPhilly = 4      //Philly场景
    }

    /// <summary>
    /// 在场景跳转之前我们先加载loading界面，在loading界面里面显示进度
    /// </summary>
    public void ShowLoading(int sceneName, Action onLoadComplete)
    {        
        StartCoroutine(LoadLevel_async((int)SceneLoadType.Loading, () =>
        {
            //这里去做加载其他场景的事
            //如果loading 加载完成了 清除之前的所有的Panel ，设置 navigationbar的所有状态 并且我们去得到这个loading脚本
            GameObject load = GameObject.FindWithTag("Loading");
            this.loading = load.GetComponent<Loading>();
            if (this.loading != null)
            {               
                StartCoroutine(LoadLevel_async(sceneName, onLoadComplete));                              
            }
        }));
        
    }
    
    public void EnterScene(int sceneName,bool isSkipLoading, Action onLoadComplete)
    {
        if (isSkipLoading)
        {
            StartCoroutine(LoadLevel_async(sceneName, onLoadComplete));
        }
        else
        {
            this.ShowLoading(sceneName, onLoadComplete);
        }     
        
    }

    public void EnterSceneAdditive(int sceneName, Action onLoadComplete)
    {
        StartCoroutine(LoadLevelAdditive_async(sceneName, onLoadComplete));
    }

    public IEnumerator LoadLevel_async(int sceneName, Action func)
    {
        AsyncOperation async = Application.LoadLevelAsync(sceneName);
        
        if (sceneName != (int)SceneLoadType.Loading && this.loading != null)
        {
            async.allowSceneActivation = false;
            this.loading.asyn = async;
            this.loading.Init();
            while (!async.isDone)
            {
                if (async.progress >= 0.9f)
                {
                    break;
                }
                yield return null;
            }
            async.allowSceneActivation = true;
        }
        //this.asynCurent  = async;
        yield return async;       

        if(async.isDone)
        {
            if (func != null)
            {                
                //Facade.GetPanelManager().ClearPanelPool();
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
        yield return async;

        if (async.isDone)
        {
            if (func != null)
            {
                //Facade.GetPanelManager().ClearPanelPool();
                func();
            }
        }

    }
}
