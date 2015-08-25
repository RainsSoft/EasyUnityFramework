using UnityEngine;
using System.Collections;

public class SampleLogic : UILogic
{
    private SampleView view;
    private SamplePopups popup;


    public override void StartUp(Transform parent)
    {
        base.StartUp(parent);
        ResName = PanelNames.Sample;
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
        view = Prefab.AddComponent<SampleView>();
        view.Logic = this;
        view.btnOpenDialog.onClick.AddListener(OnOpenDialog);
        view.btnClearCache.onClick.AddListener(OnClearCache);
        view.btnOpenPopups.onClick.AddListener(OnOpenPopups);
        Enable();
    }

    void OnOpenDialog()
    {
        DialogBox.Template(TemplateNames.DialogBox).Show(
            buttons: new DialogActions()
            { 
                {"Close", DialogBox.Close},
                {"Ok", OnOk}
            },
            title: "Simple Dialog",
            message: "Simple dialog with only close button.",
            modal: true);
    }

    bool OnOk()
    {
        DebugConsole.Log("you click on [OK]");
        WaitingLayer.Show();
        return false;
    }


    void OnClearCache()
    {
       // DialogBox.Templates.ClearCache();
       // ModleLayer.Templates.ClearCache();
       // PopupWindow.Templates.ClearCache();
       //popup = PopupWindow.Template(PopupsNames.Sample) as SamplePopups;
      // popup.Show(modal: true);
        Facade.GetSceneManager().EnterScene(SceneNames.Test);
    }

    void OnOpenPopups()
    {
      //  popup = PopupWindow.Template(PopupsNames.Sample) as SamplePopups;
       // popup.Show(modal: true);

        //GameObject go = Util.Peer(view.gameObject, "Progressbar");
        //go.GetComponent<Progressbar>().Play();

        Facade.GetPanelManager().PopPanel();
       // popup.Hide();

    }

    public override void OnMessage(string cmd, object message)
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

