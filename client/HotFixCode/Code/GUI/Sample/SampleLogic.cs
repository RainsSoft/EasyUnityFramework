using UnityEngine;
using System.Collections;
using DG.Tweening;

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

        void OnClick(GameObject rGo)
        {
            //Debug.Log("OnClick" + rGo.name);

            //WaitingLayer.Show();
            //DialogBox.Template(TemplateName.DialogBox).Show(title: "SDFASDF");
            //gameObject.transform.DOMoveX(10, 20);

            gate.SceneManager.EnterScene(SceneName.Test, () => 
            {
                Debug.Log("进入到场景" + SceneName.Test);
            });
        }
        
        void Onc()
        {
            Debug.Log("Test:load complete");
        }
    }
}

