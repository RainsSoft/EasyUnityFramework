using UnityEngine;
using System.Collections;

public class PopupWindow : MonoBehaviour
{
    public static UITemplates<BasePopups> Templates = new UITemplates<BasePopups>();

    public static BasePopups Template(string template)
    {
        var rPopups = Templates.Instance(template);
        rPopups.Init();
        return rPopups;
    }
}
