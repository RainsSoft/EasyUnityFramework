using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using UnityEngine.UI;
using UnityEngine;


namespace HotFixCode
{
    /// <summary>
    /// 此抽象类中的方法， 子类必须全部重载!!!
    /// 此抽象类中的方法， 子类必须全部重载!!!
    /// 此抽象类中的方法， 子类必须全部重载!!!
    /// 重要的事情说三遍
    /// 
    /// 
    /// 且标记virtual的函数必须首先调用基类
    /// 否则宿主程序无法 Get到子类的继承方法
    /// </summary>
    public abstract class UILogic
    {
        protected GameObject gameObject;
        protected Transform transform;
        protected LSharpBehaviour behaviour;

        /// <summary>
        /// 被宿主程序启动
        /// </summary>
        /// <param name="parent">要挂载的UI Window</param>
        protected abstract void Startup(RectTransform parent);

        /// <summary>
        /// 供宿主程序创建面板后调用的回调
        /// </summary>
        /// <param name="rGo">回传的面板对象</param>
        protected virtual void OnCreated(GameObject rGo)
        {
            gameObject = rGo;
            transform = rGo.GetComponent<Transform>();
            behaviour = rGo.GetComponent<LSharpBehaviour>();

            var rPanel = gate.PanelManager.PanelCurrent;
            if (gameObject.name.Contains(rPanel.PanelName))
            {
                rPanel.IsCreated = true;
                Debug.Log(gameObject.name + "与脚本匹配完成");
            }
            else
            {
                Debug.Log(gameObject.name + "产生了非预期的变化， 脚本与其未匹配成功");
            }
        }

        /// <summary>
        /// 启用面板
        /// </summary>
        protected virtual void Eanble()
        {
            if (!gameObject) return;
            gameObject.SetActive(true);
            transform.SetAsLastSibling();
        }

        /// <summary>
        /// 弃用面板
        /// </summary>
        protected virtual void Disable()
        {
            if (!gameObject) return;
            gameObject.SetActive(false);
        }
        
        /// <summary>
        /// 销毁面板
        /// </summary>
        protected virtual void Free()
        {
            Disable();
            if (gameObject != null)
                GameObject.Destroy(gameObject);
        }
        

    }
}
