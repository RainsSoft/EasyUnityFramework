using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using DG.Tweening;

public class SampleView : UIView, IGetComponentReference
{

    public Button btnOpenDialog = null;
    public Button btnClearCache = null;
    public Button btnOpenPopups = null;

    void Awake()
    {
        GetComponentReference();
    }

    public void GetComponentReference()
    {
        btnOpenDialog = Util.Get<Button>(this.gameObject, "OpenDialog");
        btnClearCache = Util.Get<Button>(this.gameObject, "ClearCache");
        btnOpenPopups = Util.Get<Button>(this.gameObject, "OpenPopups");
    }

    public override Sequence OnAnimateIn()
    {
        Debug.Log("OnAnimateIn");
        Sequence mySequence = DOTween.Sequence();
        transform.localScale = Vector3.zero;
        mySequence.Join(transform.DOScale(1.0f, 0.5f));
        return mySequence.Play();
    }

    public override Sequence OnAnimateOut()
    {
        Debug.Log("OnAnimateOut");
        Sequence mySequence = DOTween.Sequence();
        mySequence.Join(transform.DOScale(0.0f, 0.5f));
        return mySequence.Play();
    }
}
