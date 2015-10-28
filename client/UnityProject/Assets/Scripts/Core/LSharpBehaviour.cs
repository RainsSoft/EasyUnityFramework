using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using System;

/// <summary>
/// <脚本程序重要备注>
/// 1.请勿在脚本程序中直接继承宿主程序的类, 除非被注册为CrossBind
/// 2.脚本程序专门处理UI层的逻辑，不参与游戏底层编写
/// 3.脚本程序中不可使用类型System.Action。 But 泛型版本可以使用。
///     问题进展：目前此问题无解..  如需使用, 请用其他类型代替，如 UnityAction
///     原因：无法获取到System.Core.dll下的 System.Action, System.Action类型与泛型版本不在一个程序集，编译dll的引用和unity实际的不同
/// 4.在脚本中使用协程，请使用 gate.CroutineManager.StartTask（）函数
/// 5.如在宿主程序中需要与脚本程序通信， 所有字符串形式的方法名，类型名等，记得存为常量（const string）使用，不要直接使用字符串
/// 
/// (没有说三遍，不要以为不重要啊魂淡)
/// </summary>

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

    protected virtual void Awake()
    {
        CLRSharp.ICLRType rType = null;
        var rName = name.Replace("(Clone)", "");
        bool rGot = gate.LSharpManager.TryGetType(rName, out rType);

        if(rGot)
        {
            if (_scriptObject == null)
            {
                _scriptObject = gate.LSharpManager.CreateLSharpObject(rType);
            }
            isNeedStart = gate.LSharpManager.CheckExistMethod(rType, startName);
            isNeedUpdate = gate.LSharpManager.CheckExistMethod(rType, updateName);
            isNeedLateUpdate = gate.LSharpManager.CheckExistMethod(rType, lateUpdateName);
            isNeedFixedUpdate = gate.LSharpManager.CheckExistMethod(rType, fixedUpdateName);
            isNeedOnDestroy = gate.LSharpManager.CheckExistMethod(rType, onDestroyName);
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
