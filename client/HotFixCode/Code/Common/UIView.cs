using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace HotFixCode
{
    public abstract class UIView
    {
        protected GameObject gameObject;
        protected Transform transform;

        /// <summary>
        /// 子类必须重载并调用基类
        /// </summary>
        protected virtual void Awake(GameObject rGo)
        {
            gameObject = rGo;
            transform = rGo.GetComponent<Transform>();
        }

        /// <summary>
        /// 子类选择性重载
        /// </summary>
        protected virtual void Start() { }
        protected virtual void OnDestroy() { }
        protected virtual void Update() { }
        protected virtual void LateUpdate() { }
        protected virtual void FixedUpdate() { }

    }
}
