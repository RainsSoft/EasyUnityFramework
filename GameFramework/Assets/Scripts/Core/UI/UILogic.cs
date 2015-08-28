using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using UnityEngine.Events;
using UnityEngine.EventSystems;
using DG.Tweening;
public class UILogic
{
    public string ResName { get; set; }
    public bool IsCreated { get; set; }

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
        Prefab.GetComponent<RectTransform>().SetAsLastSibling();
        Sequence s = Prefab.GetComponent<UIView>().OnAnimateIn();
        if (s != null) s.OnComplete(OnAnimateInEnd);
    }

    public virtual void Disable()
    {
        if (!Prefab) return;
        Sequence s = Prefab.GetComponent<UIView>().OnAnimateOut();
        if (s != null)
        {
            s.OnComplete(() =>
            {
                OnAnimateOutEnd();
                Prefab.SetActive(false);
            });
        }
        else
        {
            Prefab.SetActive(false);
        }
    }
    
    public virtual void Free() 
    {
        Disable();
        Util.SafeDestroyObject(Prefab);
    }

    public virtual void OnAnimateInEnd() { }
    public virtual void OnAnimateOutEnd() { }
    public virtual void OnMessage(string cmd, object message) { }
}
