using UnityEngine;
using System.Collections;
using System;
public class UIGenerator : TSingleton<UIGenerator>
{
    private UIGenerator() { }
    /// <summary>
    /// 创建面板，请求资源管理器
    /// </summary>
    public void CreateUI(string pfbName, Transform parent, Action<GameObject> func)
    {
        gate.AssetLoadManager.LoadUIPanel(pfbName, (prefab) =>
        {
            GameObject go = GameObject.Instantiate(prefab) as GameObject;
            if (go == null) return;
            go.name = pfbName;
            go.layer = LayerMask.NameToLayer("UI");
            go.transform.SetParent(parent);
            go.transform.localScale = Vector3.one;
            go.transform.localPosition = Vector3.zero;
            go.transform.localRotation = Quaternion.identity;
            go.AddComponent<ScriptBehaviour>();
            if (func != null)
            {
                func(go);   //回传面板对象
            }
        });
    }
}
