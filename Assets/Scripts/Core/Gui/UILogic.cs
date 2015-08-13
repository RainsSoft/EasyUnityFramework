using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using UnityEngine.Events;
using UnityEngine.EventSystems;

public class UILogic
{
    public string ResName { get; set; }
    protected GameObject Prefab { get; set; }
    protected Transform Parent { get; set; }

    public virtual void StartUp(Transform parent)
    {
        if (!parent) Parent = parent;
    }

    public virtual void Enable()
    {
        if (!Prefab) return;
        Prefab.SetActive(true);
    }

    public virtual void Disable()
    {
        if (!Prefab) return;
        Prefab.SetActive(false);
    }
    
    public virtual void Free() 
    {
        Disable();
        Util.SafeDestroyObject(Prefab);
    }

    public virtual void OnMessage(string cmd, object message) { }
}
