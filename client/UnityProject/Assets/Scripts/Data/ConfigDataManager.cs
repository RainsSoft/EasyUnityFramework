using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
/*
public class ConfigDataManager : TSingleton<ConfigDataManager>
{
    private ConfigDataManager()
    {}

    private Dict<string, JSONNode> _configDataPool = new Dict<string, JSONNode>();

    public void SaveConfig(string fileName, string content)
    {
        JSONNode jNode = JSON.Parse(content);
        if (!_configDataPool.ContainsKey(fileName))
            _configDataPool.Add(fileName, jNode);
        else
            _configDataPool[fileName] = jNode;

        this.WriteConfigToLocal(fileName, content);
    }

    public JSONNode GetConfig(string fileName)
    {
        JSONNode jNode = null;
        if (ContainsConfig(fileName))
            _configDataPool.TryGetValue(fileName, out jNode);
        else
            jNode = this.ReadConfigFromLocal(fileName);
        return jNode;
    }

    public bool ContainsConfig(string fileName)
    {
        if (_configDataPool.ContainsKey(fileName))
            return true;
        else
            return false;
    }

    public void WriteConfigToLocal(string fileName, string content)
    {
        FileHelper.CoverFile(Util.ConfigDataPath + "/" + fileName, content);
    }

    public JSONNode ReadConfigFromLocal(string fileName)
    {
        string content = FileHelper.ReadFile(Util.ConfigDataPath + "/" + fileName);
        SaveConfig(fileName, content);
        return _configDataPool[fileName];
    }
}
 * */
