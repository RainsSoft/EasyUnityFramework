using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using System;

public class ScriptBehaviour : MonoBehaviour
{
    public object _scriptObject;
    private List<Action<GameObject>> clickEvents = new List<Action<GameObject>>();

    bool isNeedStart = false;
    bool isNeedUpdate = false;
    bool isNeedLateUpdate = false;
    bool isNeedFixedUpdate = false;
    bool isNeedOnDestroy = false;

    const string startName = "Start";
    const string updateName = "Update";
    const string lateUpdateName = "LateUpdate";
    const string fixedUpdateName = "FixedUpdate";
    const string onDestroyName = "OnDestroy";

    protected virtual void Awake()
    {
        CLRSharp.ICLRType rType = null;
        var rName = name.Replace("(Clone)", "");
        bool rGot = gate.ScriptManager.TryGetType(rName, out rType);

        if(rGot)
        {
            if (_scriptObject == null)
            {
                _scriptObject = gate.ScriptManager.CreateScriptObject(rType);
            }
            isNeedStart = gate.ScriptManager.CheckExistMethod(rType, startName);
            isNeedUpdate = gate.ScriptManager.CheckExistMethod(rType, updateName);
            isNeedLateUpdate = gate.ScriptManager.CheckExistMethod(rType, lateUpdateName);
            isNeedFixedUpdate = gate.ScriptManager.CheckExistMethod(rType, fixedUpdateName);
            isNeedOnDestroy = gate.ScriptManager.CheckExistMethod(rType, onDestroyName);
            CallMethod("Awake", gameObject);
        }
        else
        {
            DebugConsole.Log("未找到" + name + "相应的脚本类");
        }
    }

    protected virtual void Start()
    {
        if (isNeedStart) CallMethod("Start");
    }

    protected virtual void Update()
    {
        if (isNeedUpdate) CallMethod("Update");

    }

    protected virtual void LateUpdate()
    {
        if (isNeedLateUpdate) CallMethod("LateUpdate");
    }

    protected virtual void FixedUpdate()
    {
        if (isNeedFixedUpdate) CallMethod("FixedUpdate");
    }


    protected virtual void OnDestroy()
    {
        if (isNeedOnDestroy) CallMethod("OnDestroy");
        ClearClick();
        _scriptObject = null;
        Debug.Log("~" + name + " was destroy!");

        gate.AssetLoadManager.UnloadUIPanel(name);
    }


    public void AddClick(GameObject rGo, Action<GameObject> func)
    {
        if (rGo == null) return;
        clickEvents.Add(func);
        rGo.GetComponent<Button>().onClick.AddListener(
            delegate 
            {
                func(rGo);
            }
        );
    }
    
    public void ClearClick()
    {
        for (int i = 0; i < clickEvents.Count; i++)
        {
            if (clickEvents[i] != null)
            {
                clickEvents[i]= null;
            }
        }
    }

    protected object CallMethod(string rFuncName, params object[] args)
    {
        if (_scriptObject == null)
            Debug.LogError("not have object invoke member function");

        return Util.CallScriptFunction(_scriptObject, name, rFuncName, args);
    }
}
