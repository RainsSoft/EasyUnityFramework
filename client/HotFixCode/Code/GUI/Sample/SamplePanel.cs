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

        public SampleLogic logic;
        public Button btnOpen;

        void Awake(GameObject rGo)
        {
            gameObject = rGo;
            transform = rGo.GetComponent<Transform>();

            btnOpen = Util.Get<Button>(gameObject, "OpenDialog");
        }

        void Start()
        {
        }

        void OnDestroy()
        {
        }
    }
}
