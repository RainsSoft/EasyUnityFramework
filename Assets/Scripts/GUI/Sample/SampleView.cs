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
        mySequence.Join(transform.DOMoveX(10.0f, 1.0f));
        mySequence.Join(btnOpenDialog.transform.DORotate(new Vector3(0, 180, 0), 1));
        mySequence.Join(btnOpenPopups.transform.DOScale(new Vector3(3, 3, 3), 1));

        return mySequence.Play();
    }

    public override Sequence OnAnimateOut()
    {
        Debug.Log("OnAnimateOut");
        Sequence mySequence = DOTween.Sequence();
        mySequence.Append(transform.DOMoveX(-10.0f, 1.0f));
        mySequence.Append(btnOpenDialog.transform.DORotate(new Vector3(0, 180, 0), 1));
        mySequence.PrependInterval(1);
        mySequence.Insert(0, transform.DOScale(new Vector3(3, 3, 3), mySequence.Duration()));

        return mySequence.Play();
    }
}
