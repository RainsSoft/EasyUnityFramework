using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
public static class gate
{
    public static LSharpManager LSharpManager
    {
        get
        {
            return ManagerCollect.Instance.GetManager<LSharpManager>(ManagerName.LSharp);
        }
    }

    public static TimerManager TimerManager
    {
        get
        {
            return ManagerCollect.Instance.GetManager<TimerManager>(ManagerName.Timer);
        }
    }

    public static MusicManager MusicManager
    {
        get
        {
            return ManagerCollect.Instance.GetManager<MusicManager>(ManagerName.Music);
        }
    }

    public static PanelManager PanelManager
    {
        get
        {
            return ManagerCollect.Instance.GetManager<PanelManager>(ManagerName.Panel);
        }
    }

    public static NetworkManager NetworkManager
    {
        get
        {
            return ManagerCollect.Instance.GetManager<NetworkManager>(ManagerName.Network);
        }
    }

    public static AssetLoadManager AssetLoadManager
    {
        get
        {
            return ManagerCollect.Instance.GetManager<AssetLoadManager>(ManagerName.Asset);
        }
    }

    public static CroutineManager CroutineManager
    {
        get
        {
            return ManagerCollect.Instance.GetManager<CroutineManager>(ManagerName.Croutine);
        }
    }

    public static SceneManager SceneManager
    {
        get
        {
            return ManagerCollect.Instance.GetManager<SceneManager>(ManagerName.Scene);
        }
    }

    public static GestureManager GestureManager
    {
        get
        {
            return ManagerCollect.Instance.GetManager<GestureManager>(ManagerName.Gesture);
        }
    }

    public static ResourcesUpdateManager ResourcesUpdateManager
    {
        get
        {
            return ManagerCollect.Instance.GetManager<ResourcesUpdateManager>(ManagerName.ResourcesUpdate);
        }
       
    }

    public static GameController GameController
    {
        get
        {
            return ManagerCollect.Instance.MainUpdate.GetComponent<GameController>();
        }
    }

    public static GameObject GUIRoot
    {
        get
        {
            GameObject go = GameObject.FindWithTag("GUIRoot");
            if (go != null) return go;
            return null;
        }
    }

    public static Transform PanelWindow
    {
        get
        {
            GameObject go = GameObject.FindWithTag("PanelWindow");
            if (go != null) return go.GetComponent<Transform>();
            return null;
        }
    }

    public static Transform EffectCamera
    {
        get
        {
            GameObject go = GameObject.FindWithTag("EffectCamera");
            if (go != null) return go.transform;
            return null;
        }
    }

    public static Transform MessageCanvas
    {
        get
        {
            GameObject go = GameObject.FindWithTag("MessageCanvas");
            if (go != null) return go.transform;
            return null;
        }
    }

    public static Transform PopupsWindow
    {
        get
        {
            GameObject go = GameObject.FindWithTag("PopupsWindow");
            if (go != null) return go.transform;
            return null;
        }
    }

    public static MessageSender MessageSender
    {
        get { return MessageSender.Instance; }
    }
}
