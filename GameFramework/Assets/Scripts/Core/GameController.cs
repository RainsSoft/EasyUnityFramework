using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using netMessage;
using System.Text;
using System;
using DG.Tweening;
using UnityEngine.Events;

public class GameController : MonoBehaviour 
{
    void Awake()
    {
        this.PreInitialize(); 
    }

    /// <summary>
    /// 预初始化 【资源更新前】
    /// </summary>
    private void PreInitialize()
    {
        //取消 Destroy 对象 
        DontDestroyOnLoad(gameObject);
        DontDestroyOnLoad(Facade.GUIRoot);
        DontDestroyOnLoad(DebugConsole.Instance);

        //基本设置
        Screen.sleepTimeout = SleepTimeout.NeverSleep;
        Application.targetFrameRate = AppConst.FrameRate;
        UnityEngine.QualitySettings.vSyncCount = AppConst.VSyncCount;
        DOTween.Init().SetCapacity(500, 100);
        DOTween.defaultAutoKill = true;

        //完全静态类初始化
        AppPlatform.Initialize();

        //挂载管理器并初始化
        ManagerCollect.Instance.AddManager<CroutineManager>(ManagerNames.Croutine);
        ManagerCollect.Instance.AddManager<TimerManager>(ManagerNames.Timer);
        ManagerCollect.Instance.AddManager<AssetLoadManager>(ManagerNames.Asset);
        ManagerCollect.Instance.AddManager<PanelManager>(ManagerNames.Panel);
        ManagerCollect.Instance.AddManager<SceneManager>(ManagerNames.Scene);
        ManagerCollect.Instance.AddManager<MusicManager>(ManagerNames.Music);
        ManagerCollect.Instance.AddManager<InputManager>(ManagerNames.Input);

        Facade.GetTimerManager().Initialize();
        Facade.GetMusicManager().Initialize();

        LoadAssetbundleManifest();
    }

    /// <summary>
    /// 后初始化【资源更新后】
    /// </summary>
    private void PostInitialize()
    {
        RegistUI();
        GameStart();
    }

    /// <summary>
    /// 进入游戏
    /// </summary>
    private void GameStart()
    {
        Facade.GetPanelManager().PushPanel(PanelNames.Sample);
    }

    /// <summary>
    /// 退出游戏
    /// </summary>
    private void GameEnd()
    {
        Facade.GetAssetLoadManager().UnloadAssetBundles();
        Util.ClearMemory();
    }

    private void RegistUI()
    {
        Facade.GetPanelManager().RegistLogic(PanelNames.Sample, typeof(SampleLogic));
        Facade.GetPanelManager().RegistLogic(PanelNames.Loading, typeof(LoadingLogic));
    }

	public void LoadAssetbundleManifest()
    {
        var tempManager = Facade.GetAssetLoadManager();
        string bundlName = AppPlatform.GetAssetBundleDictionaryName();
        tempManager.DownloadingURL = AppPlatform.GetAssetBundleDictionaryUrl();
        tempManager.LoadManifest(bundlName, () =>
        {
            this.PostInitialize();
        });
    }

    public void OnApplicationQuit()
    {
        GameEnd();
    }

}
