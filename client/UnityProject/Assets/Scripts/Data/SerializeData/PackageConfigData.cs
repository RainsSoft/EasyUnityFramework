using System;

[System.Serializable] 
public class ABConfig
{
    /// <summary>
    /// 资源包名
    /// </summary>
    public string name;
    /// <summary>
    /// 资源包的后缀名
    /// </summary>
    public string variant;
    /// <summary>
    /// 资源包的原始路径
    /// </summary>
    public string assetPath;
    /// <summary>
    /// 需要的资源类型，比如如果是预制件那么应该为 "t:Prefab"
    /// </summary>
    public string assetType;
    /// <summary>
    /// 打包类型
    /// </summary>
    public string packageType;
}

[System.Serializable] 
public class PackageConfigData
{
    public ABConfig[] packageConfig;
}
