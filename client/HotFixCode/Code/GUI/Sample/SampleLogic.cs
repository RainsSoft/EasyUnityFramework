using UnityEngine;
using System.Collections;
using DG.Tweening;

namespace HotFixCode
{
    public class SampleLogic : UILogic
    {
        SamplePanel panel = null;
        SamplePopupsTest popupsTest = null;

        #region Example code

        void OnClick(GameObject rGo)
        {
            Debug.Log(rGo.name);
            switch (rGo.name)
            {
                case "ButtonDialog":
                    TestDialogBox();
                    break;
                case "ButtonPopups":
                    TestPopups();
                    break;
                case "ButtonScene":
                    TestSceneChange();
                    break;
                case "ButtonTween":
                    TestTween();
                    break;
                case "ButtonCroutine":
                    TestCroutine();
                    break;
                case "ButtonWaiting":
                    TestWaitingLayer();
                    break;
                case "ButtonPanel":
                    TestPanelChange();
                    break;
                default:
                    break;
            }

        }

        void TestPanelChange()
        {
            gate.PanelManager.PushPanel(LogicName.SampleTwo);
        }

        void TestWaitingLayer()
        {
            WaitingLayer.Show();
            gate.CroutineManager.StartTask(WaitingLayerEnumerator());
        }

        void TestDialogBox()
        {
            DialogBox.Template(TemplateName.DialogBox).Show(title: "DialogBoxTest");
        }

        void TestTween()
        {
            gameObject.transform.DOMoveX(1, 20);
        }

        void TestSceneChange()
        {
            gate.SceneManager.EnterScene(SceneName.Test, () =>
            {
                Debug.Log("进入到场景" + SceneName.Test);
                gate.PanelManager.PushPanel(LogicName.SampleTwo);
            });
        }

        void TestPopups()
        {
            popupsTest = (SamplePopupsTest)(PopupWindow.Template(PopupsName.Sample)._scriptObject);
            popupsTest.Show();
        }

        void TestCroutine()
        {
            gate.CroutineManager.StartTask(CroutineEnumerator());
        }

        IEnumerator CroutineEnumerator()
        {
            var count =  0;
            while (count < 50)
            {
                Debug.Log(count);
                count++;
                yield return new WaitForSeconds(1);
            }
        }

        IEnumerator WaitingLayerEnumerator()
        {
            yield return new WaitForSeconds(2);
            WaitingLayer.Hide();
        }
        #endregion

        #region Must funcation

        protected override void Startup(RectTransform parent)
        {
            UIGenerator.Instance.CreateUI(PanelName.Sample, parent, OnCreated);
        }

        protected override void OnCreated(GameObject rGo)
        {
            base.OnCreated(rGo);

            panel = behaviour._scriptObject as SamplePanel;
            panel.logic = this;

            behaviour.AddClick(panel.buttonDialog.gameObject, OnClick);
            behaviour.AddClick(panel.buttonCroutine.gameObject, OnClick);
            behaviour.AddClick(panel.buttonPopups.gameObject, OnClick);
            behaviour.AddClick(panel.buttonScene.gameObject, OnClick);
            behaviour.AddClick(panel.buttonTween.gameObject, OnClick);
            behaviour.AddClick(panel.buttonWaiting.gameObject, OnClick);
            behaviour.AddClick(panel.buttonPanel.gameObject, OnClick);
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
        #endregion

    }
}

