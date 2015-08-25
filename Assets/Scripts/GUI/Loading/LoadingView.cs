using UnityEngine;
using System.Collections;

public class LoadingView : UIView, IGetComponentReference 
{
    public Progressbar progressbar = null;

    void Awake()
    {
        GetComponentReference();
    }

    public void GetComponentReference()
    {
        progressbar = Util.Get<Progressbar>(this.gameObject, "Progressbar");
    }

    public void Update()
    {
        progressbar.Value = (int)(((LoadingLogic)Logic).async.progress * 100);
    }

    

}
