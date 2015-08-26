using UnityEngine;
using System.Collections;

public class LoadingLogic : UILogic
{

    private LoadingView view;


    public override void StartUp(Transform parent)
    {
        base.StartUp(parent);
        ResName = PanelNames.Loading;
        UIGenerator.Instance.CreateUI(ResName, parent, OnCreated);
    }

    public override void Enable()
    {
        base.Enable();
    }

    public override void Disable()
    {
        base.Disable();
    }

    private void OnCreated(GameObject go)
    {
        Prefab = go;
        view = Prefab.AddComponent<LoadingView>();
        view.Logic = this;
        IsCreated = true;
        Enable();
    }
}
