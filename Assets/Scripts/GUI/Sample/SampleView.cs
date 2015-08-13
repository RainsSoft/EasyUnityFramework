using UnityEngine;
using System.Collections;
using UnityEngine.UI;

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
}
