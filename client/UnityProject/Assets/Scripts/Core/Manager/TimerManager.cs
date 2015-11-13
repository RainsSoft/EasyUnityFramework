using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine.Events;

//Usage:
//
// TimerInfo ti = new TimerInfo((o) =>
// {
//     Debug.Log(o.tick);
// });
// Global.TimerManager.AddTimerEvent(ti);

public class TimerEvent : UnityEvent<TimerInfo> { }  
public class TimerInfo
{
    public long tick;
    public bool stop;
   
    public bool delete;
    public TimerEvent TimerUpdate = new TimerEvent();
    public TimerInfo(UnityAction<TimerInfo> tu)
    {
        this.TimerUpdate.AddListener(tu);
        delete = false;
    }
}

public class TimerManager : MonoBehaviour
{
    private float interval = 0;
    private List<TimerInfo> objects = new List<TimerInfo>();



    public float Interval
    {
        get { return interval; }
        set { interval = value; }
    }

    public void Initialize()
    {
        interval = 0.1f;
        StartTimer();
    }

    /// <summary>
    /// 启动计时器
    /// </summary>
    public void StartTimer()
    {
        InvokeRepeating("Run", 0, interval);
    }

    /// <summary>
    /// 停止计时器
    /// </summary>
    public void StopTimer()
    {
        CancelInvoke("Run");
    }

    /// <summary>
    /// 添加计时器事件
    /// </summary>
    public void AddTimerEvent(TimerInfo info)
    {
        if (!objects.Contains(info))
            objects.Add(info);
    }

    /// <summary>
    /// 删除计时器事件
    /// </summary>
    /// <param name="name"></param>
    public void RemoveTimerEvent(TimerInfo info) 
    {
        if (objects.Contains(info) && info != null)
            info.delete = true;
    }

    /// <summary>
    /// 停止计时器事件
    /// </summary>
    public void StopTimerEvent(TimerInfo info)
    {
        if (objects.Contains(info) && info != null) 
            info.stop = true;      
    }

    /// <summary>
    /// 继续计时器事件
    /// </summary>
    public void ResumeTimerEvent(TimerInfo info) 
    {
        if (objects.Contains(info) && info != null) 
            info.delete = false;
    }

    /// <summary>
    /// 计时器运行
    /// </summary>
    void Run()
    {
        if (objects.Count == 0) return;
        for (int i = 0; i < objects.Count; i++) 
        {
            TimerInfo o = objects[i];
            if (o.delete || o.stop) { continue; }
            o.TimerUpdate.Invoke(o);
            o.tick++;
        }

        for (int i = objects.Count - 1; i >= 0; i-- )
        {
            if (objects[i].delete) 
                objects.Remove(objects[i]);
        }
    }
}

