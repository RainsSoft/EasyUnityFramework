using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class SamplePopups : BasePopups
{
    Button btnOk;

    public void Start()
    {
        btnOk = Util.Get<Button>(this.gameObject, "OK");
        btnOk.onClick.AddListener(() =>
            {
                Hide();
            });
    }

    public override void ResetParametres()
    {
    
    }


    public override void OnAnimateInEnd()
    {
        DebugConsole.Log("OnAnimateInEnd");
    }

    public override void OnAnimateOutEnd()
    {
        DebugConsole.Log("OnAnimateOutEnd");
    }
}
