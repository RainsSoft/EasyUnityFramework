using UnityEngine;
using System.Collections;

/// <summary>
/// Draggable UI object..
/// </summary>
[RequireComponent(typeof(RectTransform))]
public class Draggable : MonoBehaviour
{
    [SerializeField]
    GameObject handle;

    DraggableHandle handleScript;

    public GameObject Handle
    {
        get
        {
            return handle;
        }
        set
        {
            if (handle)
            {
                Destroy(handleScript);
            }
            handle = value;
            handleScript = handle.AddComponent<DraggableHandle>();
            handleScript.Drag(gameObject.GetComponent<RectTransform>());
        }
    }

    void Start()
    {
        Handle = (Handle == null) ? gameObject : handle;
    }
}