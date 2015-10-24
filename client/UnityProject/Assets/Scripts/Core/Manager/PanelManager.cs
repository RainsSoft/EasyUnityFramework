using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;

/// <summary>
/// 同一时刻下 UIRoot只会有一个Panel 是被激活的！！！
/// 同一时刻下 UIRoot只会有一个Panel 是被激活的！！！
/// 同一时刻下 UIRoot只会有一个Panel 是被激活的！！！
/// 重要的事情说三遍
/// </summary>

public class UIPanel
{
    /// <summary>
    /// 面板对象名
    /// </summary>
    public string PanelName { set; get; }

    /// <summary>
    /// 脚本名
    /// </summary>
    public string LogicName { set; get; }

    /// <summary>
    /// 脚本运行时对象
    /// </summary>
    public object LogicObject { set; get; }

    /// <summary>
    /// 面板是否已被创建
    /// </summary>
    public bool IsCreated { set; get; }

    public UIPanel()
    {
        PanelName = "Noting";
        LogicName = "Noting";
        LogicObject = null;
        IsCreated = false;
    }
}

public class PanelManager : TSingleton<PanelManager>
{
    Stack<UIPanel> _panelStack = new Stack<UIPanel>();
    UIPanel panelCur = new UIPanel();
    Transform rootNode;

    PanelManager() { }

    Transform RootNode
    {
        get
        {
            if (rootNode == null)
                rootNode = gate.PanelWindow;
            return rootNode;
        }
    }

    public UIPanel PanelCurrent
    {
        get { return panelCur; }
    }

    public bool TryGetPanel(string rLogicName, out UIPanel rPanel)
    {
        foreach(UIPanel rElment in _panelStack)
        {
            if (rElment.LogicName == rLogicName)
            {
                rPanel = rElment;
                return true;
            }
        }
        rPanel = new UIPanel();
        return false;
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
        if (panelCur != null && panelCur.LogicName != "Noting" && panelCur.PanelName != "Noting")
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


        UIPanel rPanel = null;
        bool rGot = TryGetPanel(rLogicName, out rPanel);
        if (rGot)
        {
            panelCur.IsCreated = rPanel.IsCreated;
            panelCur.LogicName = rPanel.LogicName;
            panelCur.PanelName = rPanel.PanelName;
            panelCur.LogicObject = rPanel.LogicObject;

            Util.CallScriptFunction(panelCur.LogicObject, panelCur.LogicName, "Enable");
            StickElement(panelCur);
        }
        else
        {
            var rPanelName = rLogicName.Replace("Logic", "Panel");

            panelCur.IsCreated = false;
            panelCur.LogicName = rLogicName;
            panelCur.PanelName = rPanelName;
            panelCur.LogicObject = gate.LSharpManager.CreateLSharpObject(rLogicName);

            Util.CallScriptFunction(panelCur.LogicObject, panelCur.LogicName, "Startup", RootNode);
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
        panel = null;
        panelCur = new UIPanel();

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
