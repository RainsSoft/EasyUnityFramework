using UnityEngine;
using System.Collections.Generic;
using UnityEngine.UI;

public class ListViewCustom<TItem, TDesc> : BaseListView
    where TItem : BaseListViewItem
    where TDesc : ListViewItemDesc
{
    public TItem customItem;
    public List<TDesc> configItems = new List<TDesc>();

	protected virtual void Start () 
    {
        this.customItem.gameObject.SetActive(false);
	}

    public void ResetItems(List<TDesc> items)
    {
        //configItems.Clear();
        configItems = items;
        this.ResetItems();
    }

    public void ScrollDefault()
    {
        this.Toggle(0);
        this.InitContainerPosition();
    }

    private void InitContainerPosition()
    {
        Rect scrollRect = this.GetComponentInChildren<Mask>().rectTransform.rect;
        //基于父节点的Canvas2D坐标 + (滚动区域中心点 - 滚动项中心点)的局部3D坐标
        float x =
            this.container.parent.GetComponent<RectTransform>().rect.position.x +
            (scrollRect.width / 2) -
            (this.customItem.width / 2);
        this.container.SetPositionX(x);
    }

    protected float GetScrollInterval()
    {
        return this.container.GetComponent<HorizontalLayoutGroup>().spacing + this.customItem.width;
    }

    protected void ResetItems()
    {
        this.Clear();
        configItems.ForEach((desc, i) =>
        {
            var item = Instantiate(customItem) as TItem;
            item.gameObject.SetActive(true);
            Util.FixInstantiated(customItem, item);
            this.Add(item);
            item.SetData(desc);
            if (this.isClickableItem)
            {
                item.listener.onClick = ((go) =>
                {
                    this.Toggle(i);
                });
            }
        });
        this.UpdateItems();
    }
}
