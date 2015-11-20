using UnityEngine;
using System.Collections;

namespace HotFixCode
{
    public class LoadingLogic : UILogic
    {
        LoadingPanel panel;

        void SetProgressbarValue(int rProgress)
        {
            if (panel.progressbar == null) return;
            panel.progressbar.Value = rProgress;
        }
        void SetProgressbarTips(string rText)
        {
            if (panel.textTips == null) return;
            panel.textTips.text = rText;
        }

        protected override void Startup(RectTransform parent)
        {
            UIGenerator.Instance.CreateUI(PanelName.Loading, parent, OnCreated);
        }

        protected override void OnCreated(GameObject rGo)
        {
            base.OnCreated(rGo);

            panel = behaviour._scriptObject as LoadingPanel;
            panel.logic = this;

            Enable();
        }

        protected override void Enable()
        {
            base.Enable();
        }

        protected override void Disable()
        {
            base.Disable();
        }

        protected override void Free()
        {
            base.Free();
        }

    }
}

