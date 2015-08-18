﻿using UnityEngine;
using System.Collections;
using DG.Tweening;

public class BasePopups : MonoBehaviour , ITemplatable
{
    bool isTemplate = true;

    public bool IsTemplate
    {
        get { return isTemplate; }
        set { isTemplate = value; }
    }

    public string TemplateName { get; set; }

    int? modalKey;

    public virtual void OnAnimateInEnd() { }
    public virtual void OnAnimateOutEnd() { }
    public virtual void ResetParametres() { }

    public void Show(bool modal = false,
                    Sprite modalSprite = null,
                    Color? modalColor = null,
                    Canvas canvas = null,
                    Vector3? position = null)
    {
        if (position == null) position = new Vector3(0, 0, 0);
        if (modalColor == null) modalColor = new Color(0, 0, 0, 0.2f);

        var parent = (canvas != null) ? canvas.transform : Facade.PopupsWindow;

        transform.SetParent(parent, false);

        if (modal) modalKey = ModleLayer.Open(this, modalSprite, modalColor);
        else modalKey = null;


        transform.SetAsLastSibling();

        transform.localPosition = (Vector3)position;
        transform.localScale = new Vector3(0.1f, 0.1f, 1.0f);
        gameObject.SetActive(true);
        AnimateIn();
    }

    public void Hide()
    {
        if (modalKey != null)
        {
            ModleLayer.Close((int)modalKey);
        }

        AnimateOut();
    }

    void AnimateIn()
    {
        transform.DOScale(1.0f, 0.5f).OnComplete(OnAnimateInEnd);
    }

    void AnimateOut()
    {
        transform.DOScale(0.1f, 0.5f).OnComplete(()=>
        {
            OnAnimateOutEnd();
            Return();
        });
    }


    void Return()
    {
        PopupWindow.Templates.ReturnCache(this);
        ResetParametres();
    }

    void Awake()
    {
        if (IsTemplate)
        {
            gameObject.SetActive(false);
        }
    }

    void OnDestroy()
    {
        if (!IsTemplate)
        {
            return;
        }

        if (TemplateName != null)
        {
            PopupWindow.Templates.Delete(TemplateName);
        }
    }
}
