using UnityEditor;
using UnityEngine;
using System.Collections;

public class BatchOperation
{
    [MenuItem("Tools/BatchOperation/OutputLightmapInfo")]
    static void OutputLightmapInfo()
    {
        GameObject[] rGos;
        if (Selection.activeGameObject)
        {
            Debug.Log("show selection all object's lightmap info:>");
            rGos = Selection.gameObjects;
            for (int i = 0; i < rGos.Length; i++)
            {
                Debug.Log("Object name: " + rGos[i].name);
                if (!rGos[i].GetComponent<Renderer>())
                {
                    Debug.Log("Object haven't [Renderer]");
                    continue;
                }

                if (rGos[i].GetComponent<Renderer>().lightmapIndex == -1)
                {
                    Debug.Log("Object not use lightmap");
                    continue;
                }
                Debug.Log("Lightmaping Index: " + rGos[i].GetComponent<Renderer>().lightmapIndex);
                Debug.Log("Lightmaping Offset: " + rGos[i].GetComponent<Renderer>().lightmapScaleOffset);
            }
        }
    }
}

