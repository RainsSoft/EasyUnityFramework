using UnityEngine;
using System.Collections.Generic;
using UnityEngine.UI;
using DG.Tweening;

/// <summary>
/// 双向页面切换控件
/// </summary>
[AddComponentMenu("UI/FlipListView", -1)]
public class FlipListView : ListViewCustom<BaseListViewItem, ListViewItemDesc>
{
    public Button btnLeft;
    public Button btnRitght;
    public float scrollSpeed;
    private Tween tweenCur;

    private void Awake()
    {
        this.btnLeft.onClick.AddListener(OnScrollLeft);
        this.btnRitght.onClick.AddListener(OnScrollRight);
    }

    protected override void Start()
    {
        base.Start();
        base.isClickableItem = false;
    }

    private void OnScrollLeft()
    {
        if (this.tweenCur != null) return;
        if (!IsValid(this.SelectedIndex - 1)) return;

        this.Toggle(this.SelectedIndex - 1);

        float x = this.container.localPosition.x + GetScrollInterval();
        this.tweenCur = this.container.DOLocalMoveX(x, scrollSpeed).OnComplete(() => 
        { 
            this.tweenCur = null;
        });
    }

    private void OnScrollRight()
    {
        if (this.tweenCur != null) return;
        if (!IsValid(this.SelectedIndex + 1)) return;

        this.Toggle(this.SelectedIndex + 1);

        float x = this.container.localPosition.x - GetScrollInterval();
        this.tweenCur = this.container.DOLocalMoveX(x, scrollSpeed).OnComplete(() =>
        {
            this.tweenCur = null;
        });
    }
    

#if UNITY_EDITOR
    [UnityEditor.MenuItem("GameObject/UI/FlipListView")]
    static void CreateObject()
    {
        EditorExtends.CreateObject("Assets/OriginalRes/Prefabs/GUI/Widgets/FlipListView.prefab");
    }
#endif
}
