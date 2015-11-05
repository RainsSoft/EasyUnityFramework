using UnityEngine;
using System.Collections;
using System.Reflection;
using System;

public class ReflectionAssist
{
    public static readonly BindingFlags flags_common    = BindingFlags.Instance | 
                                                          BindingFlags.SetField | BindingFlags.GetField |
                                                          BindingFlags.GetProperty | BindingFlags.SetProperty;
    public static readonly BindingFlags flags_public    = flags_common | BindingFlags.Public;
    public static readonly BindingFlags flags_nonpublic = flags_common | BindingFlags.NonPublic;
    public static readonly BindingFlags flags_all       = flags_common | BindingFlags.Public | BindingFlags.NonPublic;
    public static readonly Type[]       empty_types     = new Type[0];

    public static ConstructorInfo GetConstructorInfo(BindingFlags rBindFlags, Type rType)
    {
        return rType.GetConstructor(rBindFlags, null, empty_types, null);
    }

    public static object CreateInstance(Type rType, BindingFlags rBindFlags)
    {
        ConstructorInfo rConstructorInfo = GetConstructorInfo(rBindFlags, rType);
        return rConstructorInfo.Invoke(null);
    }

    public static object GetAttrMember(object rObject, string rMemberName, BindingFlags rBindFlags)
    {
        if (rObject == null) return null;
        Type rType = rObject.GetType();
        return rType.InvokeMember(rMemberName, rBindFlags, null, rObject, new object[] { });
    }

    public static void SetAttrMember(object rObject, string rMemberName, BindingFlags rBindFlags, params object[] rParams)
    {
        if (rObject == null) return;
        Type rType = rObject.GetType();
        rType.InvokeMember(rMemberName, rBindFlags, null, rObject, rParams);
    }

    public static object MethodMember(object rObject, string rMemberName, BindingFlags rBindFlags, params object[] rParams)
    {
        if (rObject == null) return null;
        Type rType = rObject.GetType();
        return rType.InvokeMember(rMemberName, rBindFlags, null, rObject, rParams);
    }
}
