using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using System;
public class LSharpBehaviour : MonoBehaviour
{
    public object _scriptObject;
    private List<Action<GameObject>> clickEvents = new List<Action<GameObject>>();
    bool isNeedUpdate = false;
    bool isNeedFixedUpdate = false;

    protected void Awake()
    {
        _scriptObject = gate.GetLSharpManager().CreateLSharpObject(name);
        CallMethod("Awake", gameObject);
    }

    protected void Start()
    {
        CallMethod("Start");
    }

    protected void Update()
    {
        if (isNeedUpdate) CallMethod("Update");
        
    }

    public void FixedUpdate()
    {
        if (isNeedFixedUpdate) CallMethod("FixedUpdate");
    }

    protected void OnDestroy()
    {
        CallMethod("OnDestroy");
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

}
