using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;

public class PanelManager : MonoBehaviour
{
    private Transform rootNode;

    Transform RootNode
    {
        get
        {
            if (rootNode == null)
                rootNode = Facade.PanelCamera;
            return rootNode;
        }
    }

    public UILogic PanelFocus
    {
        get { return panelCur; }
    }

    private Stack<UILogic> _panelStack = new Stack<UILogic>();
    private Dict<string, System.Type> _registTable = new Dict<string, System.Type>();
    private UILogic panelCur = null;

    public void Initialize() { }

    public void RegistLogic(string pfbName, System.Type ctrl)
    {
        if (!this._registTable.ContainsKey(pfbName))
            this._registTable.Add(pfbName, ctrl);
    }

    public UILogic GetLogic(string pfbName)
    {
        UILogic temp = null;
        _panelStack.ForEach((item) =>
        {
            if (item.ResName == pfbName) temp = item;
        });
        return temp;
    }

    public bool IsExist(string pfbName)
    {
        bool isExist = false;
        _panelStack.ForEach((item) =>
        {
            if (item.ResName == pfbName) isExist = true;
        });
        return isExist;
    }

    public void PushPanel(string pfbName)
    {
        //check safe
        if (_registTable == null || !_registTable.ContainsKey(pfbName))
        {
            DebugConsole.LogError(pfbName + " is not by regist");
            return;
        }

        if (panelCur != null && pfbName == panelCur.ResName)
        {
            DebugConsole.Log(pfbName + " is current interface");
            return;
        }

        if (panelCur != null) panelCur.Disable();

        //push
        System.Type type = null;
        _registTable.TryGetValue(pfbName, out type);

        UILogic logic = GetLogic(pfbName);
        if (logic != null) //exist
        {
            panelCur = logic;
            panelCur.Enable();
            StickElement(logic);
        }
        else //not exist
        {
            panelCur = (UILogic)ReflectionAssist.CreateInstance(type, BindingFlags.Default);
            panelCur.StartUp(RootNode);
            _panelStack.Push(panelCur);
        }
    }

    public void PopPanel()
    {
        if (_panelStack.Count < 2)
        {
            DebugConsole.Log("_panelStack is null or count just be one, don't can Pop Panel");
            return;
        }

        //exchange position
        UILogic logic = _panelStack.Pop();
        logic.Disable();
        panelCur = _panelStack.Pop();
        panelCur.Enable();

        _panelStack.Push(logic);
        _panelStack.Push(panelCur);
    }

    public void ReplacePanel(string pfbName)
    {
        //check safe
        if (_panelStack.Count < 1)
        {
            DebugConsole.Log("_panelStack is null, don't can replace Panel");
            return;
        }
        if (_registTable == null || !_registTable.ContainsKey(pfbName))
        {
            DebugConsole.LogError(pfbName + " is not by regist");
            return;
        }
        if (panelCur != null && pfbName == panelCur.ResName)
        {
            DebugConsole.Log(pfbName + " is current interface");
            return;
        }

        UILogic logic = _panelStack.Pop();
        logic.Free();
        panelCur = logic = null;

        PushPanel(pfbName);
    }

    public void ClearStack()
    {
        _panelStack.ForEach((item) =>
        {
            item.Free();
            item = null;
        });
        _panelStack.Clear();
        _panelStack.TrimExcess();
    }


    private void StickElement(UILogic element)
    {
        if (element == null) return;

        Stack<UILogic> tempStack = new Stack<UILogic>();

        while (_panelStack.Count > 0)
        {
            if (_panelStack.Peek() != element)
                tempStack.Push(_panelStack.Pop());
            else _panelStack.Pop();
        }
       
        _panelStack.Clear();

        while (tempStack.Count > 0)
        {
            _panelStack.Push(tempStack.Pop());
        }

        _panelStack.Push(element);
    }

    /// <summary>
    /// 异步时才用得代码, 暂时不用
    /// </summary>
    public enum OperateType
    {
        PushPanel,
        PopPanel,
        ReplacePanel,
        ClearStack,
        Not,
    }
    private bool isOperating = false;
    private Queue<OperateType> _operationQueue = new Queue<OperateType>();
    private void Update()
    {
        if (_operationQueue.Count < 1 || isOperating) return;

        OperateType op = _operationQueue.Dequeue();
        switch (op)
        {
            case OperateType.PushPanel:
                break;
            case OperateType.PopPanel:
                break;
            case OperateType.ReplacePanel:
                break;
            case OperateType.ClearStack:
                break;
            default:
                break;
        }
    }
}
