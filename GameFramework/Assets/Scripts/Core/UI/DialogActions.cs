using UnityEngine;
using System.Collections.Generic;
using System.Collections;
using System;

/// Key - button name.
/// Value - action on click.
public class DialogActions : IDictionary<string, Func<bool>>
{
    List<string> keys = new List<string>();
    List<Func<bool>> values = new List<Func<bool>>();
    List<KeyValuePair<string, Func<bool>>> elements = new List<KeyValuePair<string, Func<bool>>>();

    public bool IsReadOnly
    {
        get { return false; }
    }

    public IEnumerator<KeyValuePair<string, Func<bool>>> GetEnumerator()
    {
        return elements.GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return elements.GetEnumerator();
    }

    public int Count
    {
        get { return elements.Count; }
    }

    public Func<bool> this[string key]
    {
        get
        {
            var index = keys.IndexOf(key);
            return elements[index].Value;
        }
        set
        {
            var index = keys.IndexOf(key);
            elements[index] = new KeyValuePair<string, Func<bool>>(key, value);
        }
    }

    /// <summary>
    /// Get keys container
    /// </summary>
    public ICollection<string> Keys
    {
        get
        {
            return elements.ConvertAll(x => x.Key);
        }
    }

    /// <summary>
    /// Get Values container
    /// </summary>
    public ICollection<Func<bool>> Values
    {
        get
        {
            return elements.ConvertAll(x => x.Value);
        }
    }

    /// <summary>
    /// Add  by Item 
    /// </summary>
    public void Add(KeyValuePair<string, Func<bool>> item)
    {
        Add(item.Key, item.Value);
    }

    /// <summary>
    /// Add by key&value
    /// </summary>
    public void Add(string key, Func<bool> value)
    {
        if (key == null)
        {
            DebugConsole.LogError("Key is null.");
        }
        if (ContainsKey(key))
        {
            DebugConsole.LogError(string.Format("An element with the same key ({0}) already exists.", key));
        }
        keys.Add(key);
        values.Add(value);
        elements.Add(new KeyValuePair<string, Func<bool>>(key, value));
    }

    /// <summary>
    /// 清空容器
    /// </summary>
    public void Clear()
    {
        keys.Clear();
        values.Clear();
        elements.Clear();
    }

    /// <summary>
    /// Is Contains by item
    /// </summary>
    public bool Contains(KeyValuePair<string, Func<bool>> item)
    {
        return elements.Contains(item);
    }

    /// <summary>
    /// Is Contains by key
    /// </summary>
    public bool ContainsKey(string key)
    {
        if (key == null)
        {
            DebugConsole.LogError("Key is null.");
        }

        return keys.Contains(key);
    }

    /// <summary>
    /// elements to Array with copy
    /// </summary>
    public void CopyTo(KeyValuePair<string, Func<bool>>[] array, int arrayIndexStart)
    {
        elements.CopyTo(array, arrayIndexStart);
    }

    /// <summary>
    /// remove by item
    /// </summary>
    public bool Remove(KeyValuePair<string, Func<bool>> item)
    {
        if (!elements.Contains(item))
        {
            return false;
        }
        var index = elements.IndexOf(item);
        keys.RemoveAt(index);
        values.RemoveAt(index);
        elements.RemoveAt(index);

        return true;
    }

    /// <summary>
    /// remove by key
    /// </summary>
    public bool Remove(string key)
    {
        if (key == null)
        {
            DebugConsole.LogError("Key is null.");
        }

        if (!ContainsKey(key))
        {
            return false;
        }
        var index = keys.IndexOf(key);
        keys.RemoveAt(index);
        values.RemoveAt(index);
        elements.RemoveAt(index);

        return true;
    }

    /// <summary>
    /// TryGet
    /// </summary>
    public bool TryGetValue(string key, out Func<bool> value)
    {
        if (key == null)
        {
            DebugConsole.LogError("Key is null.");
        }

        if (!ContainsKey(key))
        {
            value = default(Func<bool>);
            return false;
        }

        value = values[keys.IndexOf(key)];
        return true;
    }
}
