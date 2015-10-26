using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using System;

public class LSharpBehaviour : MonoBehaviour
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

    void Awake()
    {
        CLRSharp.ICLRType rType = null;
        bool rGot = gate.LSharpManager.TryGetType(name, out rType);

        if(rGot)
        {
            _scriptObject = gate.LSharpManager.CreateLSharpObject(rType);

            isNeedStart = gate.LSharpManager.CheckExistMethod(rType, startName);
            isNeedUpdate = gate.LSharpManager.CheckExistMethod(rType, updateName);
            isNeedLateUpdate = gate.LSharpManager.CheckExistMethod(rType, lateUpdateName);
            isNeedFixedUpdate = gate.LSharpManager.CheckExistMethod(rType, fixedUpdateName);
            isNeedOnDestroy = gate.LSharpManager.CheckExistMethod(rType, onDestroyName);
        }
        else
        {
            DebugConsole.Log("未找到" + name + "相应的脚本类");
        }

        CallMethod("Awake", gameObject);
    }

    void Start()
    {
        if (isNeedStart) CallMethod("Start");
    }

    void OnDestroy()
    {
        if (isNeedOnDestroy) CallMethod("OnDestroy");
        ClearClick();
        Util.ClearMemory();
        _scriptObject = null;
        Debug.Log("~" + name + " was destroy!");
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


    void Update()
    {
        if (isNeedUpdate) CallMethod("Update");

    }

    void LateUpdate()
    {
        if (isNeedLateUpdate) CallMethod("LateUpdate");
    }

    void FixedUpdate()
    {
        if (isNeedFixedUpdate) CallMethod("FixedUpdate");
    }

}
