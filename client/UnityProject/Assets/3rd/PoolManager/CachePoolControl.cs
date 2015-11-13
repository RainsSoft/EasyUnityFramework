using UnityEngine;
using System.Collections;
using PathologicalGames;
using System.Collections.Generic;
using System.IO;

public class CachePoolControl : TSingleton<CachePoolControl>
{
    CachePoolControl() { }

    /// <summary>
    /// 场景加载过程中创建一个缓存池，将可能用到的资源放入缓存池
    /// </summary>
    private void CreatACachePool(List<Transform> rListTrans, bool rIsPoolDontDestory = false)
    {
        SpawnPool rNewSpawnPool = new SpawnPool();
        bool isExist = false;
        foreach (var rPool in PoolManager.Pools)
        {
            if (rPool.Value._dontDestroyOnLoad == rIsPoolDontDestory)
            {
                rNewSpawnPool = rPool.Value;
                isExist = true;
                break;
            }
        }

        if (!isExist)
        {
            string rPoolName = string.Format("Shape_{0}", PoolManager.Pools.Count + 1);
            GameObject objSpawn = new GameObject();
            objSpawn.transform.position = Vector3.zero;
            objSpawn.transform.localScale = Vector3.one;
            objSpawn.name = rPoolName;
            rNewSpawnPool = objSpawn.AddComponent<SpawnPool>();
            rNewSpawnPool.poolName = rPoolName;
            rNewSpawnPool._dontDestroyOnLoad = rIsPoolDontDestory;
        }
        
        AddPrefabToPool(ref rNewSpawnPool, rListTrans);
    }

    /// <summary>
    /// 加载指定文件路径下的指定文件
    /// </summary>
    /// <param name="abName"></param>
    /// <param name="assetName"></param>
    public void AddCacheToPool(string abName, string assetName, bool rIsPoolDontDestory = false)
    {
        gate.AssetLoadManager.LoadAsset<GameObject>(string.Format(abName,assetName), assetName, (prefab) =>
        {
            List<Transform> rListPrefab = new List<Transform>();
            rListPrefab.Add(prefab.transform);
            CreatACachePool(rListPrefab,rIsPoolDontDestory);
        });
    }

    /// <summary>
    /// 加载指定路径文件夹下所有的文件//TODO
    /// </summary>
    /// <param name="abName"></param>
    public void AddCacheToPool(string abName, bool rIsPoolDestory = true)
    {

    }
    /// <summary>
    /// 获取一个文件夹下所有Prefab文件名
    /// </summary>
    /// <param name="abName"></param>
    private void GetAllPrefabNameInABFile(string path, ref List<string> allFilePath, bool isFirstRun = true)
    {
        if (isFirstRun && allFilePath.Count > 0)
        {
            allFilePath.TrimExcess();
            allFilePath.Clear();
        }

        string[] names = Directory.GetFiles(path);
        string[] dirs = Directory.GetDirectories(path);

        foreach (string filename in names)
        {
            string ext = Path.GetExtension(filename);
            if (ext.Equals(".Prefab")) 
                allFilePath.Add(filename.Replace('\\', '/'));
        }
        foreach (string dir in dirs)
        {
            GetAllPrefabNameInABFile(dir, ref allFilePath, false);
        }

    }


    /// <summary>
    /// 初始化缓存池
    /// </summary>
    private void AddPrefabToPool(ref SpawnPool rPool,List<Transform> rListPrefab)
    {
        foreach (var rPrefab in rListPrefab)
        {
            
            PrefabPool refabPool = new PrefabPool(rPrefab);
            bool isContains = false;

            foreach (var item in rPool._perPrefabPoolOptions)
            {
                if (item.prefab.name .Equals(refabPool.prefab.name))
                {
                    isContains = true;
                }
            }
            if (!isContains)
            {
                //默认初始化两个Prefab
                refabPool.preloadAmount = 2;
                //开启限制
                refabPool.limitInstances = false;
                //关闭无限取Prefab
                refabPool.limitFIFO = false;
                //限制池子里最大的Prefab数量
                //refabPool.limitAmount = 5;
                //开启自动清理池子
                refabPool.cullDespawned = true;
                //最终保留
                refabPool.cullAbove = 5;
                //多久清理一次
                refabPool.cullDelay = 5;
                //每次清理几个
                refabPool.cullMaxPerPass = 5;
                //初始化内存池
                rPool._perPrefabPoolOptions.Add(refabPool);
                rPool.CreatePrefabPool(rPool._perPrefabPoolOptions[rPool.Count]);
            }
        }
    }

    /// <summary>
    /// 通过资源名字，从缓存池取出来对应的资源GameObject
    /// </summary>
    /// <param name="objName"></param>
    /// <returns></returns>
    public GameObject GetObjByName(string rName)
    {
        foreach (var sPool in PoolManager.Pools)
        {
           if( sPool.Value.prefabs.ContainsKey(rName))
           {
               return sPool.Value.Spawn(rName).gameObject;
           }
        }
        Debug.Log(string.Format("AllPools do not contains :{0}",rName));
        return null;
    }
    /// <summary>
    /// 通过资源名字，从缓存池取出来对应的资源GameObject 并设置Parent LocalPosition LocalScale
    /// </summary>
    /// <returns></returns>
    public GameObject GetObjByName(string rName,Transform rParent,Vector3 rPosition,Vector3 rScale)
    {
        var obj = GetObjByName(rName);
        obj.transform.parent = rParent;
        obj.transform.localPosition = rPosition;
        obj.transform.localScale = rScale;
        return obj;
    }

    /// <summary>
    ///  通过资源名字，从缓存池取出来对应的资源GameObject 并设置Parent LocalPosition LocalScale 以及 localEulerAngles
    /// </summary>
    /// <returns></returns>
    public GameObject GetObjByName(string rName, Transform rParent, Vector3 rPosition, Vector3 rScale, Vector3 rEulerAngles)
    {
        var obj = GetObjByName(rName,rParent,rPosition,rScale);
        obj.transform.localEulerAngles = rEulerAngles;
        return obj;
    }

    /// <summary>
    /// 丢掉用过的资源GameObject(Active = false)
    /// </summary>
    public void DropUsedByObj(GameObject rUsed)
    {
        if (!rUsed.activeSelf)
        {
            Debug.Log(string.Format("{0} is already disabled!",rUsed.name));
            return;
        }
        foreach (var sPool in PoolManager.Pools)
        {
            try
            {
                sPool.Value.Despawn(rUsed.transform);
                break;
            }
            catch {
                Debug.Log(string.Format("Name [{0}] is not in AnyPool!", rUsed.name));
            }
        }
    }

    /// <summary>
    /// 卸载rPool中所有Spawn（Active = false）
    /// </summary>
    /// <param name="rPool"></param>
    public void ClearCachePool(SpawnPool rPool)
    {
        rPool.DespawnAll();
    }

    /// <summary>
    /// 彻底摧毁缓存池rPool
    /// </summary>
    /// <param name="rPool"></param>
    public void DestoryCachePool(SpawnPool rPool)
    {
        if (!rPool._dontDestroyOnLoad)
        {
            Object.Destroy(rPool.gameObject);
        }
    }
}
