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
    }

}
