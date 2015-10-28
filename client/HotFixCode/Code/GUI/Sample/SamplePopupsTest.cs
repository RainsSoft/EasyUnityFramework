using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace HotFixCode
{
    public class SamplePopupsTest : UIPopups, IPopupsEvent
    {
        public SamplePopupsTest(BasePopups rBasePopups) : base(rBasePopups) { }

        Button btnClose = null;

        protected override void Awake(GameObject rGo)
        {
            base.Awake(rGo);
            btnClose = Util.Get<Button>(gameObject, "ButtonClose");
            btnClose.onClick.AddListener(() =>
            {
                Hide();
            });
        }

        public void OnAnimateInEnd()
        {
            Debug.Log("OnAnimateInEnd");
        }

        public void OnAnimateOutEnd()
        {
            Debug.Log("OnAnimateOutEnd");
        }

        public void OnReturnCache()
        {
            Debug.Log("OnReturnCache");
        }

    }
}
