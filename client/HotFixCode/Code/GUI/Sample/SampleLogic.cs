using UnityEngine;
using System.Collections;


namespace HotFixCode
{
    public class SampleLogic
    {
        GameObject gameObject;
        Transform transform;
        LSharpBehaviour behaviour;
        SamplePanel panel;

        void Startup(RectTransform parent)
        {
            UIGenerator.Instance.CreateUI(PanelName.Sample, parent, OnCreated);
        }

        void Eanble()
        {
            if (!gameObject) return;
            gameObject.SetActive(true);
            gameObject.GetComponent<RectTransform>().SetAsLastSibling();

        }

        void Disable()
        {
            if (!gameObject) return;
            gameObject.SetActive(false);
        }

        void Free()
        {
            Disable();
            if (gameObject != null)
                GameObject.Destroy(gameObject);
        }

        void OnCreated(GameObject rGo)
        {
            gameObject = rGo;
            transform = rGo.GetComponent<Transform>();
            behaviour = rGo.GetComponent<LSharpBehaviour>();

            panel = behaviour._scriptObject as SamplePanel;
            panel.logic = this;
            
            
            behaviour.AddClick(panel.btnOpen.gameObject, OnClick);
            Eanble();

        }

        void OnClick(GameObject go)
        {
            Debug.Log("OnClick" + go.name);
            //WaitingLayer.Show();
            
            DialogBox.Template(TemplateName.DialogBox).Show(title: "SDFASDF");
        }
    }
}

