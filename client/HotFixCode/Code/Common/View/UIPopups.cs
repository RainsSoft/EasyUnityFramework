using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HotFixCode
{
    public class UIPopups : UIView
    {
        public UIPopups(BasePopups rBasePopups)
        {
            basePopups = rBasePopups;
        }

        /// <summary>
        /// 从宿主程序中获得的基类
        /// </summary>
        public BasePopups basePopups = null;

        /// <summary>
        /// 打开一个弹出面板
        /// </summary>
        public void Show(bool modal = true)
        {
            if(basePopups != null)
            {
                basePopups.Show(modal);
            }
        }

        /// <summary>
        /// 关闭一个弹出面板
        /// </summary>
        public void Hide()
        {
            if (basePopups != null)
            {
                basePopups.Hide();
            }
        }

    }
}
