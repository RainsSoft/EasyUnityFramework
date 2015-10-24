using UnityEngine;
using System.Collections;

namespace HotFixCode
{
    public class LoadingPanel : UIView
    {
        public LoadingLogic logic;
        public Progressbar progressbar = null;

        protected override void Awake(GameObject rGo)
        {
            base.Awake(rGo);
            progressbar = Resources.FindObjectsOfTypeAll<Progressbar>()[0];
        }

        protected override void Update()
        {
            if (progressbar == null) return;

            if (gate.SceneManager.async == null) return;

            progressbar.Value = (int)(gate.SceneManager.async.progress * 100);
        }
    }

}
