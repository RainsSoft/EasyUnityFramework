using UnityEngine;
using System.Collections;

public class PopupWindow : MonoBehaviour
{
    public static UITemplates<BasePopups> Templates = new UITemplates<BasePopups>();

    static public BasePopups Template(string template)
    {
        return Templates.Instance(template);
    }

}
