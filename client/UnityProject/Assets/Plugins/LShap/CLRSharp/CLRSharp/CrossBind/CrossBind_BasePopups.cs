using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace CLRSharp
{
    public interface IBasePopups_LSharp
    {

        void Show(bool modal = false,
                     Sprite modalSprite = null,
                     Color? modalColor = null,
                     Canvas canvas = null,
                     Vector3? position = null);

        void Hide();
 
    }

    public class CrossBind_BasePopups : ICrossBind
    {
        public Type Type
        {
            get { return typeof(IBasePopups_LSharp); }

        }
        public object CreateBind(CLRSharp_Instance inst)
        {
            return new Base_BasePopups(inst);
        }

        class Base_BasePopups : IBasePopups_LSharp
        {
            CLRSharp_Instance inst;
            public Base_BasePopups(CLRSharp_Instance inst)
            {
                this.inst = inst;

            }

            public void Show(bool modal = false,
                     Sprite modalSprite = null,
                     Color? modalColor = null,
                     Canvas canvas = null,
                     Vector3? position = null)
            {
             
                var context = ThreadContext.activeContext;
                var _type = context.environment.GetType(typeof(IBasePopups_LSharp));

                CLRSharp.ICLRType param1 = context.environment.GetType(typeof(bool));
                CLRSharp.ICLRType param2 = context.environment.GetType(typeof(Sprite));
                CLRSharp.ICLRType param3 = context.environment.GetType(typeof(Color?));
                CLRSharp.ICLRType param4 = context.environment.GetType(typeof(Canvas));
                CLRSharp.ICLRType param5 = context.environment.GetType(typeof(Vector3?));
                MethodParamList list = MethodParamList.Make(param1, param2, param3, param4, param5);

                var _method = this.inst.type.GetMethod(_type.FullName + "." + "Show", list);
                object obj = _method.Invoke(context, inst, new object[] { modal, modalSprite, modalColor, canvas, position });
            }

            public void Hide()
            {
                var context = ThreadContext.activeContext;
                var _type = context.environment.GetType(typeof(IBasePopups_LSharp));

                var _method = this.inst.type.GetMethod(_type.FullName + "." + "Hide", MethodParamList.constEmpty());
                object obj = _method.Invoke(context, inst, null);

            }
        }
    }

}
