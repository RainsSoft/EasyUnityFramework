using UnityEngine;
using System;
using System.Collections.Generic;
using UnityEngine.UI;
using System.Linq;
using UnityEngine.Events;

public class ListViewBaseEvent : UnityEvent<int, BaseListViewItem> { }

public abstract class BaseListView : MonoBehaviour
{
    /// <summary>
    /// Item容器父节点
    /// </summary>
    public RectTransform container;     

    /// <summary>
    /// //外部监听事件
    /// </summary>
    public ListViewBaseEvent OnSelect = new ListViewBaseEvent();                                    
    public ListViewBaseEvent OnDeselect = new ListViewBaseEvent();                                 

    /// <summary>
    /// 确定是否需要每个Item带有点击Handle
    /// </summary>
    public bool isClickableItem = false;                        

    /// <summary>
    /// 当前选择项的索引
    /// </summary>
    private int selectedIndex = -1;

    /// <summary>
    /// Item容器
    /// </summary>
    protected List<BaseListViewItem> items = new List<BaseListViewItem>();              

    /// <summary>
    /// 选择项Handle的容器
    /// </summary>
    private List<UnityAction<GameObject>> callbackClick = new List<UnityAction<GameObject>>();
    //private List<UnityAction<GameObject>> callbacksEnter = new List<UnityAction<GameObject>>();
    //private List<UnityAction<GameObject>> callbacksExit = new List<UnityAction<GameObject>>();


    public int SelectedIndex
    {
        get { return this.selectedIndex; }
    }

    /// <summary>
    /// [需实现] 选择一项
    /// </summary>
    protected virtual void SelectItem(int index) { }

    /// <summary>
    /// [需实现] 弃选一项
    /// </summary>
    protected virtual void DeselectItem(int index) { }

    /// <summary>
    /// 清除所有容器
    /// </summary>
    public virtual void Clear()
    {
        List<BaseListViewItem> temp = new List<BaseListViewItem>();
        temp.Clear();
        UpdateItems(temp);
    }

    protected virtual int Remove(BaseListViewItem item)
    {
        if (this.isClickableItem) this.RemoveCallbacks();

        var index = items.FindIndex(x => x == item);

        if (selectedIndex == index)
        {
            Deselect(index);
            selectedIndex = -1;
        }
        else if (selectedIndex > index)
        {
            selectedIndex -= 1;
        }

        items.Remove(item);
        Free(item);

        if (this.isClickableItem) AddCallbacks();
        return index;
    }

    protected virtual BaseListViewItem Add(BaseListViewItem item)
    {
        if (this.isClickableItem) this.AddCallback(item, items.Count);
        items.Add(item);
        return item;
    }

    protected void Toggle(int index)
    {
        if (selectedIndex == index) Deselect(index);
        else if (selectedIndex != index) Select(index);
    }

    protected bool IsValid(int index)
    {
        return (index >= 0) && (index < items.Count);
    }

    protected virtual void OnDestroy()
    {
        if (this.isClickableItem) RemoveCallbacks();
        items.ForEach(x => Free(x));
    }

    protected void UpdateItems()
    {
        this.UpdateItems(this.items);
    }

    private void UpdateItems(List<BaseListViewItem> newItems)
    {
        if (this.isClickableItem) RemoveCallbacks();

        items.Where(item => !newItems.Contains(item)).ForEach((item) =>
        {
            Free(item);
        });

        newItems.ForEach(x =>
        {
            x.transform.SetParent(container, false);
            x.gameObject.SetActive(true);
        });

        selectedIndex = -1;

        items = newItems;

        if (this.isClickableItem) AddCallbacks();
    }

    private void Select(int index)
    {
        if (index == -1) return;

        if (!IsValid(index))
        {
            var message = string.Format("Index must be between 0 and Items.Count ({0}). Gameobject {1}.", items.Count, name);
            throw new IndexOutOfRangeException(message);
        }

        //弃选上一个
        if ((selectedIndex != -1) && (selectedIndex != index))
        {
            Deselect(selectedIndex);
        }

        //选择新一个
        selectedIndex = index;

        SelectItem(index);

        OnSelect.Invoke(index, items[index]);
    }

    private void Deselect(int index)
    {
        if (index == -1) return;

        selectedIndex = -1;

        DeselectItem(index);

        OnDeselect.Invoke(index, items[index]);
    }

    private void AddCallbacks()
    {
        items.ForEach((item, index) => AddCallback(item.GetComponent<BaseListViewItem>(), index));
    }

    private void AddCallback(BaseListViewItem item, int index)
    {
        callbackClick.Add(go => Toggle(index));

        item.listener.onClick += callbackClick[index];
    }

    private void RemoveCallbacks()
    {
        if (callbackClick.Count > 0)
        {
            items.ForEach((item, index) =>
            {
                if (item == null)
                {
                    return;
                }
                if (callbackClick.Count > index)
                {
                    item.GetComponent<BaseListViewItem>().listener.onClick -= callbackClick[index];
                }
            });
        }
        callbackClick.Clear();
    }

    private void Free(BaseListViewItem item)
    {
        if (item == null) return;
        if (item.gameObject == null) return;
        Destroy(item.gameObject);
    }
}

