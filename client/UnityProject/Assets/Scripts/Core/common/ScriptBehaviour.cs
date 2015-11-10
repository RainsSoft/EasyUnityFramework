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
/// 6.脚本程序的类型不是真正的C#类型
/// 7.TryGetValue 之类的 out 关键字可能不能使用
/// 8.序列化与反序列化不行
/// 9.不要在L#中定义模板代码
/// 10.基类方法，字段，如果未覆盖在子类，则获取不到
/// 11.Lambda慎用， Delegate 慎用
/// </summary>

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
