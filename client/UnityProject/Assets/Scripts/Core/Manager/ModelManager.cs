using UnityEngine;
using System.Collections;
using System;

using System.Reflection;
public class ModelManager: TSingleton<ModelManager>
{
    ModelManager() { }

    private Dict<string, BaseModel> modelPool = new Dict<string, BaseModel>();

    public T GetModel<T>() where T : BaseModel
    {
        Type type = typeof(T);
        if (modelPool.ContainsKey(type.Name))
        {
            return modelPool[type.Name] as T;
        }

        ConstructorInfo ci = typeof(T).GetConstructor(BindingFlags.NonPublic | BindingFlags.Instance, null, EmptyTypes, null);
        if (ci == null) { throw new InvalidOperationException("class must contain a private constructor"); }
        T model = (T)ci.Invoke(null);
        modelPool.Add(type.Name, model);
        return model;
    }

    public void Clear()
    {
        foreach (BaseModel m in modelPool.OriginCollection.Values)
        {
            m.Destroy();
        }
        modelPool.Clear();
    }

    public void Destroy()
    {
        Clear();
        modelPool = null;
    }
}
