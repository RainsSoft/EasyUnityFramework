using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using DG.Tweening;

namespace HotFixCode
{
    public class SamplePanel : UIView
    {
        public SampleLogic logic;
        public Button btnOpen;

        protected override void Awake(GameObject rGo)
        {
            base.Awake(rGo);
            btnOpen = Util.Get<Button>(gameObject, "OpenDialog");
        }
    }
}
