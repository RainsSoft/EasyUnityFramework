using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using DG.Tweening;

namespace HotFixCode
{
    public class SamplePanel : UIView
    {
        public SampleLogic logic;
        public Button buttonDialog;
        public Button buttonPopups;
        public Button buttonScene;
        public Button buttonTween;
        public Button buttonCroutine;
        public Button buttonWaiting;
        public Button buttonPanel;
        public Button buttonReadData;
        public Button buttonCreateAccount;
        public Button buttonCreateRole;
        public Button buttonLogin;

        protected override void Awake(GameObject rGo)
        {
            base.Awake(rGo);
            buttonDialog = Util.Get<Button>(gameObject, "ButtonDialog");
            buttonPopups = Util.Get<Button>(gameObject, "ButtonPopups");
            buttonScene = Util.Get<Button>(gameObject, "ButtonScene");
            buttonTween = Util.Get<Button>(gameObject, "ButtonTween");
            buttonCroutine = Util.Get<Button>(gameObject, "ButtonCroutine");
            buttonWaiting = Util.Get<Button>(gameObject, "ButtonWaiting");
            buttonPanel = Util.Get<Button>(gameObject, "ButtonPanel");
            buttonReadData = Util.Get<Button>(gameObject, "ButtonReadData");
            buttonCreateAccount = Util.Get<Button>(gameObject, "ButtonCreateAccount");
            buttonCreateRole = Util.Get<Button>(gameObject, "ButtonCreateRole");
            buttonLogin = Util.Get<Button>(gameObject, "ButtonLogin");
        }

    }
}
