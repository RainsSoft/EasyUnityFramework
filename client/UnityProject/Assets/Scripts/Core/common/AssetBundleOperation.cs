using UnityEngine;
using System.Collections;

public abstract class AssetBundleIterator : IEnumerator
{
	public object Current
	{
        get { return null; }
	}

	public bool MoveNext()
	{
		return !IsDone();
	}
	
	public void Reset()
	{ 
	}
	
	public abstract bool Update ();
	
	public abstract bool IsDone ();
}

public class AssetBundleOperation : AssetBundleIterator
{
	protected string 				m_AssetBundleName;
	protected string 				m_AssetName;
	protected string 				m_DownloadingError;
	protected System.Type 			m_Type;
	protected AssetBundleRequest	m_Request = null;

    public AssetBundleOperation(string bundleName, string assetName, System.Type type)
	{
		m_AssetBundleName = bundleName;
		m_AssetName = assetName;
		m_Type = type;
	}

	public T GetAsset<T>() where T : UnityEngine.Object
	{
		if (m_Request != null && m_Request.isDone)
			return m_Request.asset as T;
		else
			return null;
	}

	// Returns true if more Update calls are required.
	public override bool Update ()
	{
		if (m_Request != null)
			return false;

        AssetBundleInfo bundle = gate.AssetLoadManager.GetDownloadedAssetBundle(m_AssetBundleName, out m_DownloadingError);
		if (bundle != null && bundle.m_AssetBundle != null)
		{
			m_Request = bundle.m_AssetBundle.LoadAssetAsync(m_AssetName, m_Type);
			return false;
		}
		else
		{
			return true;
		}
	}
	
	public override bool IsDone ()
	{
		// Return if meeting downloading error.
		// m_DownloadingError might come from the dependency downloading.
		if (m_Request == null && m_DownloadingError != null)
		{
			Debug.LogError(m_DownloadingError);
			return true;
		}

		return m_Request != null && m_Request.isDone;
	}
}

public class AssetBundleManifestOperation : AssetBundleOperation
{
	public AssetBundleManifestOperation(string bundleName, string assetName, System.Type type)
		: base(bundleName, assetName, type)
	{
	}

	public override bool Update ()
	{
		base.Update();
		if (m_Request != null && m_Request.isDone)  //加载完成了。
		{
            gate.AssetLoadManager.AssetBundleManifest = GetAsset<AssetBundleManifest>();
			return false;   //返回false，让资源管理器清除本次请求。
		}
		else return true;   //还在加载ing...
	}
}
