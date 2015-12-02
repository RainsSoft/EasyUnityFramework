using UnityEngine;
using UnityEditor;

[InitializeOnLoad]
public class EditorApplicationEvent
{
    static EditorApplicationEvent()
    {
        EditorApplication.playmodeStateChanged += () => 
        {
            if (!EditorApplication.isPlaying && EditorApplication.isPlayingOrWillChangePlaymode)
            {
                //AssetbundlePackage.BuildAssetbundleWindows();
            }
        };
    }
}