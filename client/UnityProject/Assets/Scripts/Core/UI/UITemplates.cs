using UnityEngine;
using System.Collections.Generic;
using System;

public class UITemplates<T> where T : MonoBehaviour, ITemplatable
{
    Dictionary<string, T> templates = new Dictionary<string, T>();

    Dictionary<string, Stack<T>> cache = new Dictionary<string, Stack<T>>();

    bool findTemplatesCalled;
    Action<T> onCreateCallback;

    public UITemplates(Action<T> onCreateCallback = null)
    {
        this.onCreateCallback = onCreateCallback;
    }

    public void FindTemplates()
    {
        findTemplatesCalled = true;

        Resources.FindObjectsOfTypeAll<T>().ForEach(x =>
        {
            Add(x.name, x, replace: true);
            x.gameObject.SetActive(false);
        });
    }

    public void ClearAll()
    {
        templates.Clear();
        ClearCache();
    }

    public void ClearCache()
    {
        cache.Keys.ForEach(x =>
        {
            ClearCache(x);
        });
    }

    public void ClearCache(string name)
    {
        if (!cache.ContainsKey(name))
        {
            return;
        }
        cache[name].ForEach(x =>
        {
            UnityEngine.Object.Destroy(x.gameObject);
        });
        cache[name].Clear();
        cache[name].TrimExcess();
    }

    public bool Exists(string name)
    {
        return templates.ContainsKey(name);
    }

    public T Get(string name)
    {
        if (!Exists(name))
        {
            DebugConsole.LogError("Not found template with name '" + name + "'");
        }

        return templates[name];
    }

    public void Delete(string name)
    {
        if (!Exists(name))
            return;

        templates.Remove(name);
        ClearCache(name);
    }

    public void Add(string name, T template, bool replace = true)
    {
        if (Exists(name))
        {
            if (!replace)
            {
                DebugConsole.LogError("Template with name '" + name + "' already exists.");
            }

            ClearCache(name);
            templates[name] = template;
        }
        else
        {
            templates.Add(name, template);
        }
        template.IsTemplate = true;
        template.TemplateName = name;
    }

    public T Instance(string name)
    {
        if (!findTemplatesCalled)
        {
            FindTemplates();
        }

        if ((!Exists(name)) || (templates[name] == null))
        {
            DebugConsole.LogError("Not found template with name '" + name + "'");
        }

        T template;
        if ((cache.ContainsKey(name)) && (cache[name].Count > 0))
        {
            template = cache[name].Pop();
        }
        else
        {
            template = UnityEngine.Object.Instantiate(templates[name]) as T;

            template.TemplateName = name;
            template.IsTemplate = false;

            if (onCreateCallback != null)
            {
                onCreateCallback(template);
            }
        }

        if (templates[name].transform.parent != null)
        {
            //template.transform.SetParent(templates[name].transform.parent);
        }


        return template;
    }

    public void ReturnCache(T instance)
    {
        instance.gameObject.SetActive(false);

        if (!cache.ContainsKey(instance.TemplateName))
        {
            cache[instance.TemplateName] = new Stack<T>();
        }
        cache[instance.TemplateName].Push(instance);
    }
}
