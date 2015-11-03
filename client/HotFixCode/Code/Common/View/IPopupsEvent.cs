using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HotFixCode
{
    /// <summary>
    /// 弹窗面板的事件
    /// </summary>
    interface IPopupsEvent
    {
        /// <summary>
        /// 入场动画结束时被调用
        /// </summary>
        void OnAnimateInEnd();

        /// <summary>
        /// 出场动画结束时被调用
        /// </summary>
        void OnAnimateOutEnd();

        /// <summary>
        /// 被置回缓存池前被调用
        /// </summary>
        void OnReturnCache();
    }
}
