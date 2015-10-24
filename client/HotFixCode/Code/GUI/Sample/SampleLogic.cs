using UnityEngine;
using System.Collections;


namespace HotFixCode
{
    public class SampleLogic : UILogic
    {
        SamplePanel panel;

        protected override void Startup(RectTransform parent)
        {
            UIGenerator.Instance.CreateUI(PanelName.Sample, parent, OnCreated);
        }

        protected override void OnCreated(GameObject rGo)
        {
            base.OnCreated(rGo);

            panel = behaviour._scriptObject as SamplePanel;
            panel.logic = this;

            behaviour.AddClick(panel.btnOpen.gameObject, OnClick);
            Eanble();
        }

        protected override void Eanble()
        {
            base.Eanble();
        }

        protected override void Disable()
        { 
            base.Disable();
        }

        protected override void Free()
        {
            base.Free();
        }

        void OnClick(GameObject go)
        {
            Debug.Log("OnClick" + go.name);

            //WaitingLayer.Show();
            //DialogBox.Template(TemplateName.DialogBox).Show(title: "SDFASDF");

            gate.SceneManager.EnterScene(SceneName.Test);
        }
        
        void Onc()
        {
            Debug.Log("Test:load complete");
        }
    }
}

