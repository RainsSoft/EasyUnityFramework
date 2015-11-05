using UnityEngine;
using System.Collections;
using System;
public class EditorExtends 
{

    /// <summary>
    /// EDITOR下创建对象
    /// </summary>
#if UNITY_EDITOR

    static public GameObject CreateObject(string path, Transform parent = null)
    {
        var prefab = UnityEditor.AssetDatabase.LoadAssetAtPath<GameObject>(path);
        if (prefab == null)
        {
            throw new ArgumentException(string.Format("Prefab not found at path {0}.", path));
        }

        var go = UnityEngine.Object.Instantiate(prefab) as GameObject;

        var go_parent = parent ?? UnityEditor.Selection.activeTransform;
        if ((go_parent == null) || (go_parent.gameObject.GetComponent<RectTransform>() == null))
        {
            go_parent = UnityEngine.Object.FindObjectOfType<Canvas>().transform;
        }

        if (go_parent != null)
        {
            go.transform.SetParent(go_parent, false);
        }

        go.name = prefab.name;

        var rectTransform = go.GetComponent<RectTransform>();
        if (rectTransform != null)
        {
            rectTransform.anchoredPosition = new Vector2(0, 0);
        }

        Util.FixInstantiated(prefab, go);

        return go;
    }
#endif
}
