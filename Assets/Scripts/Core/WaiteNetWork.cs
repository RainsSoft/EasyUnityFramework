using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using DG.Tweening;
public class WaiteNetWork : MonoBehaviour 
{
    public GameObject Strenth;
    public Button ReconnectButton;
    public Button GameOverButton;
    public Text Tip;
    public Transform EffectTransfrom;

    /// <summary>
    /// 开始网络等待
    /// </summary>
    public void StartWiateNetWork()
    {
        this.ShowEffect();
    }

    private Tweener tweenr;

    /// <summary>
    /// 结束网络等待
    /// </summary>
    public void EndWaiteNetWork()
    {
        if (this.EffectTransfrom.gameObject.activeInHierarchy && this.tweenr != null)
        {
            this.tweenr.Pause();
        }       
        this.EffectTransfrom.localRotation = Quaternion.identity;
    }

    private void ShowStrenth(bool enable)
    {
        this.Strenth.SetActive(enable);
    }

    private void ShowEffect()
    {
        if (this.EffectTransfrom.gameObject.activeInHierarchy)
        {
           this.tweenr = this.EffectTransfrom.DORotate(new Vector3(0, 0, 360), 1, RotateMode.LocalAxisAdd).SetLoops(-1, LoopType.Restart);           
        }        
    }

}
