using UnityEngine;
using System.Collections;
using DG.Tweening;

public class BasePopups : ScriptBehaviour, ITemplatable
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
    public virtual void OnReturnCache() { }

    public void Init()
    {
        transform.SetParent(gate.PopupsWindow, false);
        _scriptObject = Util.CreateScriptObject(name, this);
    }

    public void Show(bool modal = false,
                    Sprite modalSprite = null,
                    Color? modalColor = null,
                    Canvas canvas = null,
                    Vector3? position = null)
    {
        if (position == null) position = new Vector3(0, 0, 0);
        if (modalColor == null) modalColor = new Color(0, 0, 0, 0.5f);

        var parent = (canvas != null) ? canvas.transform : gate.PopupsWindow;

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
        transform.DOScale(1.0f, 0.5f).OnComplete(()=>
        {
           CallMethod("OnAnimateInEnd");
           OnAnimateInEnd();
        });
    }

    void AnimateOut()
    {
        transform.DOScale(0.1f, 0.5f).OnComplete(()=>
        {
            CallMethod("OnAnimateOutEnd");
            OnAnimateOutEnd();
            Return();
        });
    }

    void Return()
    {
        CallMethod("OnReturnCache");
        OnReturnCache();
        PopupWindow.Templates.ReturnCache(this);
    }

    protected override void Awake()
    {
        base.Awake();

        if (IsTemplate)
        {
            gameObject.SetActive(false);
        }
    }

    protected override void OnDestroy()
    {
        base.OnDestroy();

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
