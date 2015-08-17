using UnityEngine;
using System.Collections;
using UnityEngine.EventSystems;
using UnityEngine.Events;

public class UIEventListenerBasic : MonoBehaviour,
IPointerClickHandler,
IPointerEnterHandler,
IPointerExitHandler
{
    public UnityAction<GameObject> onClick;
    public UnityAction<GameObject> onEnter;
    public UnityAction<GameObject> onExit;

    public object parameter;

    public void OnPointerClick(PointerEventData eventData) { if (onClick != null) onClick(gameObject); }
    public void OnPointerEnter(PointerEventData eventData) { if (onEnter != null) onEnter(gameObject); }
    public void OnPointerExit(PointerEventData eventData) { if (onExit != null) onExit(gameObject); }

    public static UIEventListenerBasic Get(GameObject go)
    {
        UIEventListenerBasic listener = go.GetComponent<UIEventListenerBasic>();
        if (listener == null) listener = go.AddComponent<UIEventListenerBasic>();
        return listener;
    }
}
