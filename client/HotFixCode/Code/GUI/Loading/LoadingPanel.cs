using UnityEngine;
using System.Collections;
using UnityEngine.UI;
namespace HotFixCode
{
    public class LoadingPanel : UIView
    {
        public LoadingLogic logic;
        public Progressbar progressbar = null;
        public Text textTips = null;

        protected override void Awake(GameObject rGo)
        {
            base.Awake(rGo);

            progressbar = Util.Get<Progressbar>(gameObject, "Progressbar");
            textTips = Util.Get<Text>(gameObject, "TextTips");
        }
    }

}
