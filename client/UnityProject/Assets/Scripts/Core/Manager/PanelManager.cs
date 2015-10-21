using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;

class UIPanel
{
    public string LogicName { set; get; }
    public object LogicObject { set; get; }
}

public class PanelManager : TSingleton<PanelManager>
{
    PanelManager() { }

    private Transform rootNode;

    Transform RootNode
    {
        get
        {
            if (rootNode == null)
                rootNode = gate.PanelCamera;
            return rootNode;
        }
    }

    public System.Object PanelCurrent
    {
        get { return panelCur; }
    }

    private Stack<UIPanel> _panelStack = new Stack<UIPanel>();
    private UIPanel panelCur = new UIPanel();

    public System.Object GetLogic(string rLogicName)
    {
        
        System.Object temp = null;
        _panelStack.ForEach((item) =>
        {
            if (item.LogicName == rLogicName) temp = item.LogicObject;
        });
        return temp;
    }

    public bool IsExist(string rLogicName)
    {
        bool isExist = false;
        _panelStack.ForEach((item) =>
        {
            if (item.LogicName == rLogicName) isExist = true;
        });
        return isExist;
    }

    public void PushPanel(string rLogicName)
    {
        if (panelCur != null)
        {
            if (panelCur.LogicName == rLogicName)
            {
                DebugConsole.Log(rLogicName + " is repeat");
                return;
            }

            if (panelCur.LogicObject != null)
            {
                Util.CallScriptFunction(panelCur.LogicObject, panelCur.LogicName, "Disable");
            }
        }

        System.Object logic = GetLogic(rLogicName);
        if (logic != null)
        {
            panelCur.LogicObject = logic;
            panelCur.LogicName = rLogicName;
            Util.CallScriptFunction(panelCur.LogicObject, panelCur.LogicName, "Enable");
            StickElement(panelCur);
        }
        else
        {
            panelCur.LogicObject = gate.GetLSharpManager().CreateLSharpObject(rLogicName);
            panelCur.LogicName = rLogicName;
            Util.CallScriptFunction(panelCur.LogicObject, panelCur.LogicName, "StartUp", RootNode);
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
        var panel = _panelStack.Pop();
        Util.CallScriptFunction(panel.LogicObject, panel.LogicName, "Disable");
        panelCur = _panelStack.Pop();
        Util.CallScriptFunction(panelCur.LogicObject, panelCur.LogicName, "Enable");

        _panelStack.Push(panel);
        _panelStack.Push(panelCur);
    }

    public void ReplacePanel(string rLogicName)
    {
        //check safe
        if (_panelStack.Count < 1)
        {
            DebugConsole.Log("_panelStack is null, don't can replace Panel");
            return;
        }

        if (panelCur.LogicName == rLogicName)
        {
            DebugConsole.Log(rLogicName + " is repeat");
            return;
        }

        UIPanel panel = _panelStack.Pop();
        Util.CallScriptFunction(panel.LogicObject, panel.LogicName, "Free");
        panelCur = panel = null;

        PushPanel(rLogicName);
    }

    public void ClearStack()
    {
        _panelStack.ForEach((item) =>
        {
            Util.CallScriptFunction(item.LogicObject, item.LogicName, "Free");
            item = null;
        });
        _panelStack.Clear();
        _panelStack.TrimExcess();
    }


    void StickElement(UIPanel element)
    {
        if (element == null) return;

        Stack<UIPanel> tempStack = new Stack<UIPanel>();

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

}
