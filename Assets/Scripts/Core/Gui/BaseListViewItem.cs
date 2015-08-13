using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using UnityEngine.EventSystems;

public abstract class ListViewItemDesc { }

[RequireComponent(typeof(Image))]
public abstract class BaseListViewItem : MonoBehaviour
{
    /// <summary>
    /// 点击事件监听者
    /// </summary>
    [HideInInspector]
    public UIEventListenerBasic listener = null;
    /// <summary>
    /// 根据background 设置宽 
    /// </summary>
    [HideInInspector]
    public float width;
    /// <summary>
    /// 根据background 设置高 
    /// </summary>
    [HideInInspector]
    public float height;
    /// <summary>
    /// Item 的背景 同时关联MASK
    /// </summary>
    private Image background;

    /// <summary>
    /// 子类需要实现SetData方法
    /// </summary>
    public abstract void SetData(ListViewItemDesc item);

    public void Awake()
    {
        background = GetComponent<Image>();
        this.width = this.GetComponent<Image>().sprite.rect.width;
        this.height = this.GetComponent<Image>().sprite.rect.height;
        this.listener = UIEventListenerBasic.Get(this.background.gameObject);
    }

}
