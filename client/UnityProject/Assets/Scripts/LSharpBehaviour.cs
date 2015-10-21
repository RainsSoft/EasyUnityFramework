using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using System;
public class LSharpBehaviour : MonoBehaviour
{

    private List<Action<GameObject>> clickEvents = new List<Action<GameObject>>();
    System.Object lsObject;
    bool isNeedUpdate = false;
    bool isNeedFixedUpdate = false;

    public void Init()
    {
        lsObject = gate.GetLSharpManager().CreateLSharpObject(name);
    }

    protected void Awake()
    {
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
        lsObject = null;
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
        return Util.CallScriptFunction(lsObject, name, rFuncName, args);
    }

}
