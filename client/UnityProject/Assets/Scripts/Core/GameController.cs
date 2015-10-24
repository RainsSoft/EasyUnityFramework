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
    object _scriptMainUpdate = null;
    bool inited = false;

    void Awake()
    {
        DebugConsole.Log("APP Startup");
        Initialize(); 
    }

    void Initialize()
    {
        //取消 Destroy 对象 
        DontDestroyOnLoad(gameObject);
        DontDestroyOnLoad(gate.GUIRoot);
        DontDestroyOnLoad(DebugConsole.Instance);

        //平台初始化
        AppPlatform.Initialize();

        //基本设置
        Screen.sleepTimeout = SleepTimeout.NeverSleep;
        Application.targetFrameRate = AppConst.FrameRate;
        UnityEngine.QualitySettings.vSyncCount = AppConst.VSyncCount;
        DOTween.Init().SetCapacity(500, 100);
        DOTween.defaultAutoKill = true;

        //挂载管理器并初始化
        ManagerCollect.Instance.AddManager(ManagerName.LSharp, LSharpManager.Instance);
        ManagerCollect.Instance.AddManager(ManagerName.Panel, PanelManager.Instance);

        ManagerCollect.Instance.AddManager<CroutineManager>(ManagerName.Croutine);
        ManagerCollect.Instance.AddManager<TimerManager>(ManagerName.Timer);
        ManagerCollect.Instance.AddManager<AssetLoadManager>(ManagerName.Asset);
        ManagerCollect.Instance.AddManager<SceneManager>(ManagerName.Scene);
        ManagerCollect.Instance.AddManager<MusicManager>(ManagerName.Music);
        ManagerCollect.Instance.AddManager<GestureManager>(ManagerName.Gesture);

        gate.TimerManager.Initialize();
        gate.MusicManager.Initialize();
        gate.LSharpManager.Initialize();

        DebugConsole.Log("APP Initialize complete");

        LoadAssetbundleManifest();
    }

    public void LoadAssetbundleManifest()
    {
        var tempManager = gate.AssetLoadManager;
        string bundlName = AppPlatform.GetAssetBundleDictionaryName();
        tempManager.DownloadingURL = AppPlatform.GetAssetBundleDictionaryUrl();
        Debug.Log("AssetBundleDictionaryUrl:  " + tempManager.DownloadingURL);
        tempManager.LoadManifest(bundlName, () =>
        {
            //资源载入完成 开始游戏
            DebugConsole.Log("APP LoadAssetbundleManifest complete");
            GameStart();
        });
    }

    /// <summary>
    /// 进入游戏
    /// </summary>
    void GameStart()
    {
        //启动脚本系统
        _scriptMainUpdate = gate.LSharpManager.CreateLSharpObject("MainUpdate");
        Util.CallScriptFunction(_scriptMainUpdate, "MainUpdate", "Init");
       // inited = true;
    }

    /// <summary>
    /// 退出游戏
    /// </summary>
    void GameEnd()
    {

        Util.CallScriptFunction(_scriptMainUpdate, "MainUpdate", "End");
        _scriptMainUpdate = null;
        gate.AssetLoadManager.UnloadAssetBundles();
        Util.ClearMemory();
        DebugConsole.Log("APP UnloadAssetBundles complete");
    }



    void OnApplicationQuit()
    {
        GameEnd();
        DebugConsole.Log("APP End");
    }

    void Update()
    {
        if (_scriptMainUpdate != null && inited)
            Util.CallScriptFunction(_scriptMainUpdate, "MainUpdate", "Update");

    }

    void FixedUpdate()
    {
        if (_scriptMainUpdate != null && inited)
            Util.CallScriptFunction(_scriptMainUpdate, "MainUpdate", "FixedUpdate");
    }

    void LateUpdate()
    {
        if (_scriptMainUpdate != null && inited)
            Util.CallScriptFunction(_scriptMainUpdate, "MainUpdate", "LateUpdate");
    }




}
