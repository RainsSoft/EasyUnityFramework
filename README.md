# EasyUnityFramework

## 简述
EasyUnityFramework是基于Unity实现的一套简单的开源游戏架构

* Unity版本 : 5.2.0f3  
* UI : UGUI
* 热更新系统 : C#代码全平台热更新（L#）
* 资源打包系统 ： Unity5.0新打包系统
* 网络 ： TCP + HTTP
* 静态数据生成部分暂不开源

## 引用

EasyUnityFramework或参考设计思路，或直接代码引用了以下开源项目，在此表示感谢与尊敬

* L#
* SimpleFramework
* JsonFX
* UIWidget
* DOTween
* TsiU

## 支持功能

* C#脚本全平台热更新(L#)
* TCP消息+HTTP请求
* UGUI常用控件实现（ListView, Draggable, DialogBox, Progressbar, Tab）
* 基于MVC的简洁UI架构实现
* Assetbundle打包与加载系统
* 手势消息分发（Tap, Move, Drag, Swipe）
* 简洁的行为树实现
* 多平台管理
* 可用于脚本代码与原生代码之间通信的消息机制

## 使用说明

**目录结构** 

1. HotFixCode: 热更新代码工程文件夹
2. UnityProject: Unity工程文件夹
3. HotFixExport: 热更新代码导出的DLL文件夹(生成热更新工程时产生，开发期间会Copy至UnityProject的Resources目录下，方便开发)

## 联系方式
QQ: 648398613  
Email: 648398613@qq.com

## 版本记录

V0.0.1_alpha[2015.11.26]  

1. 测试版本
 