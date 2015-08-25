using UnityEngine;
using System.Collections;

public class LoadingLogic : UILogic
{
    private LoadingView view;

    public AsyncOperation async;

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
        Enable();
    }

    IEnumerator LoadScene()
    {
        async = Application.LoadLevelAsync(SceneNames.Test);
        yield return async;
    }

}
