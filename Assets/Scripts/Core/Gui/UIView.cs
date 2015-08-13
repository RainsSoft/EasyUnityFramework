using UnityEngine;
using System.Collections;

interface IGetComponentReference
{
     void GetComponentReference();
}

public class UIView : MonoBehaviour 
{
    
    public UILogic Logic { get; set; }
}
