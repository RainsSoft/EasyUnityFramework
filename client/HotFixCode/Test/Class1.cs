using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace HotFixCode
{
    public class TestClass
    {
        public static void Test1()
        {
            Interface.Test1();
        }
        public int count = 0;
        public void Test2()
        {
            count++;
            Interface.Test2();
        }
        public void Test2(int abc, string def)
        {
            count++;
            Debug.Log("122sada11.0," + abc + "," + def + ",count=" + count);
            var s = MathUtil.RadianToDegree(2.235434);
            DebugConsole.Log(s);
        }
        
    }
}
