using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class ManagerCollect : TSingleton<ManagerCollect>
{
    private ManagerCollect() { }
    static Dictionary<string, object> m_Managers = new Dictionary<string, object>();
    static GameObject _mainUpdate;

    /// <summary>
    /// 添加System管理器
    /// </summary>
    public void AddManager(string typeName, object obj)
    {
        if (!m_Managers.ContainsKey(typeName))
        {
            m_Managers.Add(typeName, obj);
        }
    }

    /// <summary>
    /// 添加UnityEngine管理器
    /// </summary>
    public T AddManager<T>(string typeName) where T : Component
    {
        object result = null;
        m_Managers.TryGetValue(typeName, out result);
        if (result != null)
        {
            return (T)result;
        }
        Component c = gate.MainUpdate.gameObject.AddComponent<T>();
        m_Managers.Add(typeName, c);
        return default(T);
    }

    /// <summary>
    /// 获取管理器
    /// </summary>
    public T GetManager<T>(string typeName) where T : class
    {
        if (!m_Managers.ContainsKey(typeName))
        {
            return default(T);
        }
        object manager = null;
        m_Managers.TryGetValue(typeName, out manager);
        return (T)manager;
    }

    /// <summary>
    /// 删除管理器
    /// </summary>
    public void RemoveManager(string typeName)
    {
        if (!m_Managers.ContainsKey(typeName))
            return;

        object manager = null;
        m_Managers.TryGetValue(typeName, out manager);
        Type type = manager.GetType();
        if (type.IsSubclassOf(typeof(MonoBehaviour)))
            GameObject.Destroy((Component)manager);
        m_Managers.Remove(typeName);
    }
}
