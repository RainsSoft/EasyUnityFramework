using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

public class AppConst
{
    public static bool AutoLogin = false;                                       //自动登录
    public static bool IsDebugMode = true;                                      //调试模式-用于内部测试

    public static RuntimePlatform RuntimePlatform = Application.platform;       //运行时平台
    public static bool EditorMode = Application.isEditor;                       //编辑器模式

    public static float TimerInterval = 0.1f;                                   //计时器间隔
    public static int FrameRate = 30;                                           //游戏帧频   -1： 不限制
    public static int VSyncCount = 0;                                           //垂直同步数

    public static string UserId = string.Empty;                                 //用户ID
    public static string AppName = "ZDay";                                      //应用程序名称
    public static string AppPrefix = AppName + "_";                             //应用程序前缀

    public static string ServerIp = "192.168.1.58";                             //IP
    public static int ServerPort = 7000;                                        //端口

    public static string AssetDirName = "StreamingAssets";

	public static string ABDirName = AssetDirName;       						//Assetbundle目录 
    public static string ABConfigPath = "Editor/AssetbundlePackage";            //Assetsbudle包的配置文件路径
    public static string ABConfigName = "assetbundle_entries";                  //Assetsbudle包的配置文件名

    public static Vector2 ReferenceResolution = new Vector2(1280, 720);

}

