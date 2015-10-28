using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using DG.Tweening;

namespace HotFixCode
{
    public class SampleTwoPanel : UIView
    {
        public SampleTwoLogic logic;
        public Button buttonBack;

        protected override void Awake(GameObject rGo)
        {
            base.Awake(rGo);
            buttonBack = Util.Get<Button>(gameObject, "ButtonBack");
        }

    }
}
