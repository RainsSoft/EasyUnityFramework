using UnityEngine;
using System.Collections;
using DG.Tweening;
interface IGetComponentReference
{
     void GetComponentReference();
}

public abstract class UIView : MonoBehaviour 
{
    
    public UILogic Logic { get; set; }

    public virtual Sequence OnAnimateIn() { return null; }
    public virtual Sequence OnAnimateOut() { return null; }

}
