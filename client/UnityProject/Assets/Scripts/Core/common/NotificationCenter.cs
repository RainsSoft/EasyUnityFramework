using UnityEngine;
using System;
using UnityEngine.Events;
using System.Collections.Generic;

using Handler = UnityEngine.Events.UnityAction<object, object>;
using SenderTable = System.Collections.Generic.Dictionary<object, System.Collections.Generic.List<UnityEngine.Events.UnityAction<object, object>>>;


/// <summary>
/// 需要监听的地方添加观察者
/// NotificationCenter.Instance.AddObserver(EventHandler(Sender, arg), NoticeGeneralName.Test, sender);
/// 监听对象销毁或弃用时删除观察者
/// NotificationCenter.Instance.RemoveObserver(EventHandler(Sender, arg), NoticeGeneralName.Test, sender);
/// 某个事件发生时派发通知给所有观察者
/// NotificationCenter.Instance.PostNotification(NoticeGeneralName.Test);
/// 
/// notificationName的定义，目前定义在NoticeGeneralName，特殊类型通知另行定义
/// </summary>

public class NotificationCenter : TSingleton<NotificationCenter>
{
    private Dictionary<string, SenderTable> _table = new Dictionary<string, SenderTable>();
    private HashSet<List<Handler>> _invoking = new HashSet<List<Handler>>();

    NotificationCenter() { }

    /// <summary>
    /// 添加一个观察者，不指定发送者，发送者默认为NotificationCenter
    /// </summary>
    /// <param name="handler">EventHandler</param>
    /// <param name="notificationName">NotificationName</param>
    public void AddObserver(Handler handler, string notificationName)
    {
        AddObserver(handler, notificationName, null);
    }

    /// <summary>
    /// 添加一个观测者，并指定发送者
    /// </summary>
    public void AddObserver(Handler handler, string notificationName, System.Object sender)
    {
        if (handler == null)
        {
            Debug.LogError("Can't add a null event handler for notification, " + notificationName);
            return;
        }

        if (string.IsNullOrEmpty(notificationName))
        {
            Debug.LogError("Can't observe an unnamed notification");
            return;
        }

        if (!_table.ContainsKey(notificationName))
            _table.Add(notificationName, new SenderTable());

        SenderTable subTable = _table[notificationName];

        System.Object key = (sender != null) ? sender : this;

        if (!subTable.ContainsKey(key))
            subTable.Add(key, new List<Handler>());

        List<Handler> list = subTable[key];
        if (!list.Contains(handler))
        {
            if (_invoking.Contains(list))
                subTable[key] = list = new List<Handler>(list);

            list.Add(handler);
        }
    }

    /// <summary>
    /// 派发一条通知
    /// </summary>
    public void PostNotification(string notificationName)
    {
        PostNotification(notificationName, null);
    }

    /// <summary>
    /// 派发一条通知 并指定发送者
    /// </summary>
    public void PostNotification(string notificationName, System.Object sender)
    {
        PostNotification(notificationName, sender, null);
    }

    /// <summary>
    /// 派发一条通知 并指定发送者, 指定发送信息
    /// </summary>
    public void PostNotification(string notificationName, System.Object sender, System.Object e)
    {
        if (string.IsNullOrEmpty(notificationName))
        {
            Debug.LogError("A notification name is required");
            return;
        }

        // No need to take action if we dont monitor this notification
        if (!_table.ContainsKey(notificationName))
            return;

        // Post to subscribers who specified a sender to observe
        SenderTable subTable = _table[notificationName];
        if (sender != null && subTable.ContainsKey(sender))
        {
            List<Handler> handlers = subTable[sender];
            _invoking.Add(handlers);
            for (int i = 0; i < handlers.Count; ++i)
                handlers[i](sender, e);
            _invoking.Remove(handlers);
        }

        // Post to subscribers who did not specify a sender to observe
        if (subTable.ContainsKey(this))
        {
            List<Handler> handlers = subTable[this];
            _invoking.Add(handlers);
            for (int i = 0; i < handlers.Count; ++i)
                handlers[i](sender, e);
            _invoking.Remove(handlers);
        }
    }

    public void RemoveObserver(Handler handler, string notificationName)
    {
        RemoveObserver(handler, notificationName, null);
    }

    public void RemoveObserver(Handler handler, string notificationName, System.Object sender)
    {
        if (handler == null)
        {
            Debug.LogError("Can't remove a null event handler for notification, " + notificationName);
            return;
        }

        if (string.IsNullOrEmpty(notificationName))
        {
            Debug.LogError("A notification name is required to stop observation");
            return;
        }

        // No need to take action if we dont monitor this notification
        if (!_table.ContainsKey(notificationName))
            return;

        SenderTable subTable = _table[notificationName];
        System.Object key = (sender != null) ? sender : this;

        if (!subTable.ContainsKey(key))
            return;

        List<Handler> list = subTable[key];
        int index = list.IndexOf(handler);
        if (index != -1)
        {
            if (_invoking.Contains(list))
                subTable[key] = list = new List<Handler>(list);
            list.RemoveAt(index);
        }
    }

    public void Clean()
    {
        string[] notKeys = new string[_table.Keys.Count];
        _table.Keys.CopyTo(notKeys, 0);

        for (int i = notKeys.Length - 1; i >= 0; --i)
        {
            string notificationName = notKeys[i];
            SenderTable senderTable = _table[notificationName];

            object[] senKeys = new object[senderTable.Keys.Count];
            senderTable.Keys.CopyTo(senKeys, 0);

            for (int j = senKeys.Length - 1; j >= 0; --j)
            {
                object sender = senKeys[j];
                List<Handler> handlers = senderTable[sender];
                if (handlers.Count == 0)
                    senderTable.Remove(sender);
            }

            if (senderTable.Count == 0)
                _table.Remove(notificationName);
        }
    }
}