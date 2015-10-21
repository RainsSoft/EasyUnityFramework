using UnityEngine;
using System.Collections;


namespace HotFixCode
{
    public class SampleLogic : System.Object
    {
        GameObject gameObject;
        Transform transform;
        LSharpBehaviour lSharpBehaviour;

        void StartUp(Transform parent)
        {

            UIGenerator.Instance.CreateUI(PanelName.Sample, parent, OnCreated);
        }

        void Eanble()
        {
            if (!gameObject) return;
            gameObject.SetActive(true);
            gameObject.GetComponent<RectTransform>().SetAsLastSibling();
        }

        void Disable()
        {
            if (!gameObject) return;
            gameObject.SetActive(false);
        }

        void Free()
        {
            Disable();
            if (gameObject != null)
                GameObject.Destroy(gameObject);
        }

        void OnCreated(GameObject rGo)
        {
            Debug.Log("OnCreated");
            gameObject = rGo;
            transform = rGo.GetComponent<Transform>();
            lSharpBehaviour = rGo.GetComponent<LSharpBehaviour>();
            var objBtn = transform.FindChild("OpenDialog").gameObject;
            

            lSharpBehaviour.AddClick(objBtn, OnClick);

            Eanble();
        }

        void OnClick(GameObject go)
        {
            Debug.Log("OnClick" + go.name);
        }
    }
}

