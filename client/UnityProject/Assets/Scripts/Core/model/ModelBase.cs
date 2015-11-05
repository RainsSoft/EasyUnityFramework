using UnityEngine;
using System;
using System.Collections;

public class ModelBase
{
    public event EventHandler<ValueUpdateEventArgs> ValueUpdateEvent;

    protected void DispatchValueUpdateEvent(string key, object oldValue, object newValue)
    {
        EventHandler<ValueUpdateEventArgs> handler = ValueUpdateEvent;
        if (handler != null)
        {
            handler(this, new ValueUpdateEventArgs(key, oldValue, newValue));
        }
    }

    protected void DispatchValueUpdateEvent(ValueUpdateEventArgs args)
    {
        EventHandler<ValueUpdateEventArgs> handler = ValueUpdateEvent;
        if (handler != null)
        {
            handler(this, args);
        }
    }

    virtual public void Destroy()
    {
        ValueUpdateEvent = null;
    }
}



public class ValueUpdateEventArgs : EventArgs
{
    public string key { get; set; }

    public object oldValue { get; set; }

    public object newValue { get; set; }

    public ValueUpdateEventArgs(String key, object oldValue, object newValue)
    {
        this.key = key;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    public ValueUpdateEventArgs() { }
}
