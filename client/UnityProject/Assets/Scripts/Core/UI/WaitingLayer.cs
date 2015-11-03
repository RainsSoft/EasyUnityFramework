using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using DG.Tweening;

[RequireComponent(typeof(RectTransform))]
public class WaitingLayer : MonoBehaviour, ITemplatable
{
    bool isTemplate = true;
    public bool IsTemplate
    {
        get  { return isTemplate; }
        set  { isTemplate = value; }
    }
    public string TemplateName { get; set; }

    public static UITemplates<WaitingLayer> Templates = new UITemplates<WaitingLayer>();

    static int? modalKey;
    static Tweener rotator = null;
    static WaitingLayer layer = null;
    static string key = "WaitingTemplate";

    public static void Show()
    {
        if (layer) return;
        layer = Templates.Instance(key);

        layer.transform.SetParent(gate.MessageCanvas, false);
        layer.gameObject.SetActive(true);

        var rect = layer.GetComponent<RectTransform>();
        rect.sizeDelta = new Vector2(0, 0);
        rect.anchorMin = new Vector2(0, 0);
        rect.anchorMax = new Vector2(0, 0);
        rect.pivot = new Vector2(0.5f, 0.5f);
        rect.anchoredPosition = new Vector3(AppConst.ReferenceResolution.x / 2, AppConst.ReferenceResolution.y / 2, 0.0f);

        var img = layer.GetComponent<Image>();
        img.SetNativeSize();

        if(rotator != null)
        {
            rotator.Play();
        }
        else
        {
            rotator = img.transform.DORotate(new Vector3(0, 0, 10), 0.2f, RotateMode.Fast).SetLoops(-1, LoopType.Incremental);
        }

        if (layer) modalKey = ModleLayer.Open(layer, color: new Color(0.0f, 0.0f, 0.0f, 0.5f));
        else modalKey = null;

        layer.transform.SetAsLastSibling();

    }

    public static void Hide()
    {
        if(layer)
        {
            rotator.Pause();
            Templates.ReturnCache(layer);
            layer = null;
            if (modalKey != null)
            {
                ModleLayer.Close((int)modalKey);
            }
        }
    }

}
