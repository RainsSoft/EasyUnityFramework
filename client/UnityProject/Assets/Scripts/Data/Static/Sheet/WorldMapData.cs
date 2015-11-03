using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class WorldMapDataManager
{
	public class WorldMapData
	{
		/// <summary>
		/// ID
		/// </summary>
		public Byte ID;
		/// <summary>
		/// 名称
		/// </summary>
		public String AreaName;
		/// <summary>
		/// 闯关奖励
		/// </summary>
		public Byte AreaAward;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, Byte key, WorldMapData value);

	static WorldMapDataManager instance;
	public static WorldMapDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new WorldMapDataManager();
			}
			return instance;
		}
	}
	WorldMapDataManager()
	{
		Byte[] data = Util.ReadSheetFile("WorldMapData.dat");
		if (data == null)
		{
			return;
		}
		TheBegin(data);
	}
	public void TheBegin(Byte[] data)
	{
		MemoryStream mem = new MemoryStream(data);
		BinaryReader read = new BinaryReader(mem);
		UInt32 max = read.ReadUInt32();
		for (int n = 0; n < max; n++)
		{
			WorldMapData val = new WorldMapData();
			val.ID = read.ReadByte();
			val.AreaName = read.ReadString();
			val.AreaAward = read.ReadByte();
			hashTable.Add(val.ID,val);
		}
		read.Close();
		mem.Close();
		return;
	}

	public void TheEnd()
	{
		hashTable.Clear();
	}

	public void Find(DelegateProxy_4 callFun)
	{
		int index = 0;
		foreach (DictionaryEntry de in hashTable)
		{
			index++;
			if (callFun(index, hashTable.Count, (Byte)de.Key, (WorldMapData)de.Value))
				return;
		}
	}

	public WorldMapData Get(Byte key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("WorldMapData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (WorldMapData)hashTable[key];
	}

	public List<WorldMapData> Get()
	{
		List<WorldMapData> data = new List<WorldMapData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((WorldMapData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
