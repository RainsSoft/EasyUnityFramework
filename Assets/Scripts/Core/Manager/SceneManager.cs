using UnityEngine;
using System;
using System.Collections;
public class SceneManager : MonoBehaviour 
{
    public void EnterScene(string sceneName, Action onLoadComplete = null)
    {
        Facade.GetPanelManager().ClearStack();
        Application.LoadLevel(SceneNames.Loading);
        if (onLoadComplete != null) onLoadComplete();
        Facade.GetPanelManager().PushPanel(PanelNames.Loading);
    }
}
