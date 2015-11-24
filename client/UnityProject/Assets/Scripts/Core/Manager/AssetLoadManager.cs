using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class AssetBundleInfo
{
    public AssetBundle m_AssetBundle;
    public int m_ReferencedCount;

    public AssetBundleInfo(AssetBundle assetBundle)
    {
        m_AssetBundle = assetBundle;
        m_ReferencedCount = 1;
    }
}

public class AssetLoadManager : MonoBehaviour
{

    #region 调用接口
    /// <summary>
    /// 调用接口 [Manifest]
    /// </summary>
    public void LoadManifest(string manifestName, Action func)
    {
        this.StartCoroutine(OnLoadManifest(manifestName, func));
    }

    /// <summary>
    /// 调用接口 [GUI]
    /// </summary>
    public void LoadUIPanel(string assetname, Action<GameObject> func)
    {
        this.LoadAsset<GameObject>("ui/" + assetname, assetname, func);
    }
    public void UnloadUIPanel(string assetname)
    {
        UnloadAssetBundle("ui/" + assetname.ToLower() + AppConst.BundleExtName);
    }

    /// <summary>
    /// 调用角色 [Character]
    /// </summary>
    public void LoadCharacter(string rCharaName, Action<GameObject> func)
    {
        this.LoadAsset<GameObject>(string.Format("Character/{0}", rCharaName), string.Format("Chara_{0}", rCharaName), func);
    }
    public void UnloadCharacter(string rCharaName)
    {
        if (!rCharaName.StartsWith("Chara_"))
        {
            return;
        }

        if (rCharaName.Contains("_"))
        {
            rCharaName = rCharaName.Split('_')[1];
        }
        UnloadAssetBundle("Character/" + rCharaName.ToLower() + AppConst.BundleExtName);
    }

    /// <summary>
    /// 调用角色特效 [CharacterEffect] //TODO
    /// </summary>
    public void LoadCharacterEffect(string rCharaName, string rEffectName, Action<GameObject> func)
    {
        this.LoadAsset<GameObject>("Character/" + rCharaName, rEffectName, func);
    }
    public void UnloadCharacterEffect(string rCharaName)
    {
        UnloadAssetBundle("Character/" + rCharaName.ToLower() + AppConst.BundleExtName);
    }

    /// <summary>
    /// 调用接口 [Scene]
    /// </summary>
    public void LoadScene(string assetname, Action<UnityEngine.Object> func)
    {
        this.LoadAsset<UnityEngine.Object>("scene/" + assetname, assetname, func);
    }
    public void UnoadScene(string assetname)
    {
        UnloadAssetBundle("scene/" + assetname.ToLower() + AppConst.BundleExtName);
    }
    #endregion 


    string _downloadingURL = "";
    string[] _variants = { };
    AssetBundleManifest _assetBundleManifest = null;

    Dictionary<string, AssetBundleInfo> _downloadedAssetBundles = new Dictionary<string, AssetBundleInfo>();
    Dictionary<string, WWW> _downloadingWWWs = new Dictionary<string, WWW>();
    Dictionary<string, string> _downloadingErrors = new Dictionary<string, string>();
    List<AssetBundleIterator> _bundleOperations = new List<AssetBundleIterator>();
    Dictionary<string, string[]> _dependencies = new Dictionary<string, string[]>();

    public string DownloadingURL
    {
        get { return _downloadingURL; }
        set { _downloadingURL = value; }
    }

    public string[] Variants
    {
        get { return _variants; }
        set { _variants = value; }
    }

    public AssetBundleManifest AssetBundleManifest
    {

        set { _assetBundleManifest = value; }
    }

    public void Initialize() { }

    /// <summary>
    /// 调用接口 [泛型]
    /// </summary>
    public void LoadAsset<T>(string abname, string assetname, Action<T> func)
        where T : UnityEngine.Object
    {
        abname = abname.ToLower();
        StartCoroutine(OnLoadAsset(abname, assetname, func));
    }

    IEnumerator OnLoadManifest(string manifestName, Action func)
    {
        DownLoadAssetBundle(manifestName, true);
        var operation = new AssetBundleManifestOperation(manifestName, "AssetBundleManifest", typeof(AssetBundleManifest));
        _bundleOperations.Add(operation);
        yield return this.StartCoroutine(operation);
        if (func != null) func();
    }

    IEnumerator OnLoadAsset<T>(string abname, string assetName, Action<T> func)
        where T : UnityEngine.Object
    {
        // Load asset
        string abName = abname.ToLower() + ".unity3d";
        AssetBundleOperation request = this.LoadAssetAsync(abName, assetName, typeof(T));
        if (request == null) yield break;
        yield return StartCoroutine(request);

        // Get asset
        T prefab = request.GetAsset<T>();
        if (func != null)
            func(prefab);
        else 
            DebugConsole.LogError("assetbundle load failed:" + "bundle[" + abname +"]" + "  asset[" + assetName + "]");
    }

    /// <summary>
    /// 获取一个本体和所依赖的对象都已经下载完的AssetBundleInfo
    /// </summary>
    public AssetBundleInfo GetDownloadedAssetBundle(string assetBundleName, out string error)
    {
        if (_downloadingErrors.TryGetValue(assetBundleName, out error))
            return null;

        //本体
        AssetBundleInfo bundle = null;
        _downloadedAssetBundles.TryGetValue(assetBundleName, out bundle);
        if (bundle == null) return null;

        //依赖
        string[] dependencies = null;
        if (!_dependencies.TryGetValue(assetBundleName, out dependencies))
            return bundle;

        foreach (var dependency in dependencies)
        {
            if (_downloadingErrors.TryGetValue(assetBundleName, out error))
                return bundle;

            AssetBundleInfo dependentBundle;
            _downloadedAssetBundles.TryGetValue(dependency, out dependentBundle);
            if (dependentBundle == null)
                return null;
        }

        return bundle;
    }

    /// <summary>
    /// 下载AssetBundle本体和依赖
    /// </summary>
    private void DownLoadAssetBundle(string assetBundleName, bool isLoadingAssetBundleManifest = false)
    {
        if (!isLoadingAssetBundleManifest)
            assetBundleName = RemapVariantName(assetBundleName);

        // 下载本体
        bool isDownloaded = DownloadAssetBundleInternal(assetBundleName, isLoadingAssetBundleManifest);

        // 如果已经下载过本体，直接下载依赖
        if (!isDownloaded && !isLoadingAssetBundleManifest)
            LoadDependencies(assetBundleName);
    }

    /// <summary>
    /// 实际下载的操作,返回值为真时,表示已经加载完成
    /// </summary>
    private bool DownloadAssetBundleInternal(string assetBundleName, bool isLoadingAssetBundleManifest)
    {
        //已经下载过了
        AssetBundleInfo bundle = null;
        _downloadedAssetBundles.TryGetValue(assetBundleName, out bundle);
        if (bundle != null)
        {
            bundle.m_ReferencedCount++;
            return true;
        }

        if (_downloadingWWWs.ContainsKey(assetBundleName))
            return true;

        WWW download = null;
        string url = _downloadingURL + assetBundleName;
        DebugConsole.Log("[DownloadAssetBundle]:" + url);

        if (isLoadingAssetBundleManifest)
            download = new WWW(url);
        else
            download = WWW.LoadFromCacheOrDownload(url, _assetBundleManifest.GetAssetBundleHash(assetBundleName), 0);

        _downloadingWWWs.Add(assetBundleName, download);

        return false;
    }

    /// <summary>
    /// 下载依赖
    /// </summary>
    protected void LoadDependencies(string assetBundleName)
    {
        if (_assetBundleManifest == null)
        {
            DebugConsole.LogError("Please initialize AssetBundleManifest by calling AssetBundleManager.Initialize()");
            return;
        }

        string[] dependencies = _assetBundleManifest.GetAllDependencies(assetBundleName);
        if (dependencies.Length == 0)
            return;

        for (int i = 0; i < dependencies.Length; i++)
            dependencies[i] = RemapVariantName(dependencies[i]);

        _dependencies.Add(assetBundleName, dependencies);
        for (int i = 0; i < dependencies.Length; i++)
            DownloadAssetBundleInternal(dependencies[i], false);
    }

    protected string RemapVariantName(string assetBundleName)
    {
        string[] bundlesWithVariant = _assetBundleManifest.GetAllAssetBundlesWithVariant();

        if (System.Array.IndexOf(bundlesWithVariant, assetBundleName) < 0)
            return assetBundleName;

        string[] split = assetBundleName.Split('.');

        int bestFit = int.MaxValue;
        int bestFitIndex = -1;

        for (int i = 0; i < bundlesWithVariant.Length; i++)
        {
            string[] curSplit = bundlesWithVariant[i].Split('.');
            if (curSplit[0] != split[0])
                continue;

            int found = System.Array.IndexOf(_variants, curSplit[1]);
            if (found != -1 && found < bestFit)
            {
                bestFit = found;
                bestFitIndex = i;
            }
        }

        if (bestFitIndex != -1)
            return bundlesWithVariant[bestFitIndex];
        else
            return assetBundleName;
    }

    /// <summary>
    /// 清除所有
    /// </summary>
    public void UnloadAssetBundles()
    {
        this._downloadedAssetBundles.ForEach((item) =>
        {
           item.Value.m_AssetBundle.Unload(false);
        });
        _downloadedAssetBundles.Clear();
        _dependencies.Clear();
    }

    /// <summary>
    /// 清除依赖和本体
    /// </summary>
    public void UnloadAssetBundle(string assetBundleName)
    {
        //Debug.Log(_downloadedAssetBundles.Count + " assetbundle(s) in memory before unloading " + assetBundleName);

        UnloadAssetBundleInternal(assetBundleName);
        UnloadDependencies(assetBundleName);

        //Debug.Log(_downloadedAssetBundles.Count + " assetbundle(s) in memory after unloading " + assetBundleName);
    }

    /// <summary>
    /// 清除依赖
    /// </summary>
    protected void UnloadDependencies(string assetBundleName)
    {
        string[] dependencies = null;
        if (!_dependencies.TryGetValue(assetBundleName, out dependencies))
            return;

        foreach (var dependency in dependencies)
            UnloadAssetBundleInternal(dependency);

        _dependencies.Remove(assetBundleName);
    }

    /// <summary>
    /// 实际的清除下载和加载的AssetBund
    /// </summary>
    protected void UnloadAssetBundleInternal(string assetBundleName)
    {
        string error;
        AssetBundleInfo bundle = GetDownloadedAssetBundle(assetBundleName, out error);
        if (bundle == null)
            return;

        if (--bundle.m_ReferencedCount == 0)
        {
            bundle.m_AssetBundle.Unload(false);
            _downloadedAssetBundles.Remove(assetBundleName);
            //Debug.Log("AssetBundle " + assetBundleName + " has been unloaded successfully");
        }
    }

    void Update()
    {
        //清除下载完的和下载失败的AssetBundles，并将下载完的存入Downloaded表
        var keysToRemove = new List<string>();
        foreach (var keyValue in _downloadingWWWs)
        {
            WWW download = keyValue.Value;

            if (download.error != null)
            {
                if (!_downloadingErrors.ContainsKey(keyValue.Key))
                {
                    _downloadingErrors.Add(keyValue.Key, download.error);
                    keysToRemove.Add(keyValue.Key);
                }
                continue;
            }

            if (download.isDone)
            {
                //Debug.Log("Downloading " + keyValue.Key + " is done at frame " + Time.frameCount);
                _downloadedAssetBundles.Add(keyValue.Key, new AssetBundleInfo(download.assetBundle));
                keysToRemove.Add(keyValue.Key);
            }
        }

        foreach (var key in keysToRemove)
        {
            WWW download = _downloadingWWWs[key];
            _downloadingWWWs.Remove(key);
            download.Dispose();
        }

        // 更新ProgressOperations
        for (int i = 0; i < _bundleOperations.Count; )
        {
            if (!_bundleOperations[i].Update())
                _bundleOperations.RemoveAt(i);
            else
                i++;
        }
    }

    public AssetBundleOperation LoadAssetAsync(string assetBundleName, string assetName, System.Type type)
    {
        AssetBundleOperation operation = null;
        DownLoadAssetBundle(assetBundleName);
        operation = new AssetBundleOperation(assetBundleName, assetName, type);
        _bundleOperations.Add(operation);  //添加进处理中列表，等Update处理

        return operation;
    }
}