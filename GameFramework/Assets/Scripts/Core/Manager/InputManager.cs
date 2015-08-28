using UnityEngine;
using System.Collections;

/// <summary>
/// 输入信息的载体
/// </summary>
public class InputCarrier
{
    public float AxisX = 0.0f;
    public float AxisY = 0.0f;
    public Vector3 Vpositon = new Vector3();
    public bool isMove = false;//是否移动（鼠标输入的时候要判断是否是在鼠标左键按下的状态）
}

public class InputManager : MonoBehaviour
{
    private bool mousePressStatus = false;//鼠标是否按下
    public void Initialize() { }

    /// <summary>
    /// 获取移动信息
    /// </summary>
    /// <returns></returns>
    public InputCarrier GetInput()
    {
       InputCarrier inputCarrier = new InputCarrier();
       if (Application.platform.Equals(RuntimePlatform.Android) || Application.platform.Equals(RuntimePlatform.IPhonePlayer))
        {
            if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Moved)
            {
                mousePressStatus = true;
            }
            if (Input.GetTouch(0).phase == TouchPhase.Ended)
            {
                mousePressStatus = false;
            }
        }
        if (Application.platform.Equals(RuntimePlatform.WindowsEditor))
        {
            if (Input.GetMouseButtonDown(0))
            {
                this.mousePressStatus = true;
            }
            if (Input.GetMouseButtonUp(0))
            {
                this.mousePressStatus = false;
            }
        }
        if (this.mousePressStatus)
        {
            inputCarrier.isMove = true;
            inputCarrier.AxisX = Input.GetAxis("Mouse X");

            inputCarrier.AxisY = Input.GetAxis("Mouse Y");
            inputCarrier.Vpositon = Camera.main.transform.position;
        }
        else
        {
            inputCarrier.isMove = false;
        }
        return inputCarrier;
    }
    
}