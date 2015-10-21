using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using DG.Tweening;

namespace HotFixCode
{
    public class SamplePanel
    {
        GameObject gameObject;
        Transform transform;

        void Awake(GameObject rGo)
        {
            gameObject = rGo;
            transform = rGo.transform;
            Debug.Log("Awake");
        }

        void Start()
        {
            Debug.Log("Start");
        }

        void OnDestroy()
        {
            Debug.Log("test");
        }
    }
}
