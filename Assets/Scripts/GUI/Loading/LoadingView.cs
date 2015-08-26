using UnityEngine;
using System.Collections;

public class LoadingView : UIView
{
    public Progressbar progressbar = null;

    void Awake()
    {
        GetComponentReference();
    }

    public void GetComponentReference()
    {
        progressbar = Resources.FindObjectsOfTypeAll<Progressbar>()[0];
    }

    void Update()
    {
        if (progressbar == null) return;

        if (Facade.GetSceneManager().async == null) return;

        progressbar.Value = (int)(Facade.GetSceneManager().async.progress * 100);
    }


}
