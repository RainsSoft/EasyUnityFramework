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
                case "ButtonReadData":
                    TestReadData();
                    break;
                case "ButtonCreateAccount":
                    TestCreateAccount();
                    break;
                case "ButtonCreateRole":
                    TestCreateRole();
                    break;
                case "ButtonLogin":
                    TestLogin();
                    break;
                default:
                    break;
            }

        }

        string account = "1";
        void TestCreateAccount()
        {
            var req = gate.HttpRequestManager.CreateAccount(account, "1");
           req.ResponseCreateAccountEvent += (sender, args) =>
           {
               Debug.Log("ResponseCreateAccountEvent");
               Debug.Log(args.ret);
           };
        }

        void TestCreateRole()
        {
            var req = gate.HttpRequestManager.CreateRole(account,
                gate.ModelManager.GetModel<UserModel>().LoginKey,
                1,
                "role01",
                1);
            req.ResponseCreateRoleEvent += (sender, args) =>
            {
                Debug.Log("ResponseCreateRoleEvent");
                Debug.Log(args.ret);
            };
        }

        void TestLogin()
        {
            var req = gate.HttpRequestManager.Login(account, "1", "1");
            
            
            req.ResponseLoginEvent += (sender, args) =>
            {
                Debug.Log("ResponseLoginEvent");
                Debug.Log(args.ret);
                Debug.Log(args.loginKey);
                switch (args.ret)
                {
                    case 0:
                        DialogBox.Template(TemplateName.DialogBox).Show(message: "服务器异常错误");
                        break;
                    case 1:
                        DialogBox.Template(TemplateName.DialogBox).Show(message: "密码错误,请重新输入");
                        break;
                    case 2:
                        DialogBox.Template(TemplateName.DialogBox).Show(message: "该帐号并不存在,请重新输入");
                        break;
                    case 3:
                        DialogBox.Template(TemplateName.DialogBox).Show(message: "对应游戏服务器无法连接,请重新输入");
                        break;
                    case 200:
                        var rKey = gate.ModelManager.GetModel<UserModel>().LoginKey = args.loginKey;
                        DialogBox.Template(TemplateName.DialogBox).Show(message: "进入游戏");
                        TestIntoGame(rKey);
                        break;
                    default:
                        DialogBox.Template(TemplateName.DialogBox).Show(message: "未知错误");
                        break;
                }
            };
        }

        void TestIntoGame(string rKey)
        {
            gate.SocketClientManager.SendConnectTCP();
            gate.SocketClientManager.OnConnectedTCP = () =>
            {
                SocketMessageSender.Instance.Send_Login(account, rKey);
                gate.SocketClientManager.OnReceive_MSG_LOGIN += (sender, args) =>
                {
                    Debug.Log("Receive_Login");
                    Debug.Log(args.buf.ToString());
                };
            };
        }

        void TestReadData()
        {
            var rTemp = Sheet.languagesdatamanager.Get();
            var rlog = rTemp[0].ChineseSP;
            Debug.Log("Static Data :" + rlog);

            var userModel = gate.ModelManager.GetModel<UserModel>();
            var rName = userModel.UserName;
            var money = userModel.Gold;
            Debug.Log("Dynamic Data :");
            Debug.Log("UserName = " + rName);
            Debug.Log("Gold =" + money);

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
            behaviour.AddClick(panel.buttonReadData.gameObject, OnClick);
            behaviour.AddClick(panel.buttonCreateAccount.gameObject, OnClick);
            behaviour.AddClick(panel.buttonCreateRole.gameObject, OnClick);
            behaviour.AddClick(panel.buttonLogin.gameObject, OnClick);
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

