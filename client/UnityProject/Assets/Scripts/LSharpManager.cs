using UnityEngine;
using System.Collections;

public class LSharpManager : MonoBehaviour 
{
    CLRSharp.CLRSharp_Environment env;
    // Use this for initialization
    void Start()
    {
        //创建CLRSharp环境
        env = new CLRSharp.CLRSharp_Environment(new Logger());

        //加载L#模块
        TextAsset dll = Resources.Load("HotFixCode.dll") as TextAsset;
        //TextAsset pdb = Resources.Load("HotFixCode.pdb") as TextAsset;
        System.IO.MemoryStream msDll = new System.IO.MemoryStream(dll.bytes);
        //System.IO.MemoryStream msPdb = new System.IO.MemoryStream(pdb.bytes);
        env.LoadModule(msDll);//如果无符号是pdb的话，第二个参数传null
        //env.LoadModule(msDll, msPdb, new Mono.Cecil.Pdb.PdbReaderProvider());//Pdb
        //env.LoadModule(msDll, msMdb, new Mono.Cecil.Mdb.MdbReaderProvider());//如果符号是Mdb格式
        Debug.Log("LoadModule HotFixCode.dll done.");

        //step01建立一个线程上下文，用来模拟L#的线程模型，每个线程创建一个即可。
        CLRSharp.ThreadContext context = new CLRSharp.ThreadContext(env);
        Debug.Log("Create ThreadContext for L#.");

        //step02取得想要调用的L#类型
        CLRSharp.ICLRType wantType = env.GetType("HotFixCode.TestClass");//用全名称，包括命名空间
        Debug.Log("GetType:" + wantType.Name);
        //和反射代码中的Type.GetType相对应

        //step03 静态调用
        //得到类型上的一个函数，第一个参数是函数名字，第二个参数是函数的参数表，这是一个没有参数的函数
        CLRSharp.IMethod method01 = wantType.GetMethod("Test1", CLRSharp.MethodParamList.constEmpty());
        method01.Invoke(context, null, null);//第三个参数是object[] 参数表，这个例子不需要参数
        //这是个静态函数调用，对应到代码他就是HotFixCode.TestClass.Test1();

        //step04 成员调用
        //第二个测试程序是一个成员变量，所以先要创建实例
        CLRSharp.IMethod methodctor = wantType.GetMethod(".ctor", CLRSharp.MethodParamList.constEmpty());//取得构造函数
        object typeObj = methodctor.Invoke(context, null, null);//执行构造函数
        //这几行的作用对应到代码就约等于 HotFixCode.TestClass typeObj =new HotFixCode.TestClass();
        CLRSharp.IMethod method02 = wantType.GetMethod("Test2", CLRSharp.MethodParamList.constEmpty());
        method02.Invoke(context, typeObj, null);
        //这两行的作用就相当于 typeOBj.Test2();

        var list = CLRSharp.MethodParamList.Make(env.GetType(typeof(int)), env.GetType(typeof(string)));
        CLRSharp.IMethod method03 = wantType.GetMethod("Test2", list);
        method03.Invoke(context, typeObj, new object[] { 1234, "abcddd" });
        //这两行的作用就相当于 typeOBj.Test2(1234,"abcddd");
    }

    void Update()
    {

    }
    public class Logger : CLRSharp.ICLRSharp_Logger//实现L#的LOG接口
    {
        public void Log(string str)
        {
            Debug.Log(str);
        }

        public void Log_Error(string str)
        {
            Debug.LogError(str);
        }

        public void Log_Warning(string str)
        {
            Debug.LogWarning(str);
        }
    }
}
