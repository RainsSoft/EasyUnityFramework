using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class MapTargetDataManager
{
	public class MapTargetData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 目标描述
		/// </summary>
		public Byte AimRP;
		/// <summary>
		/// 目标类型
		/// </summary>
		public Byte AimType;
		/// <summary>
		/// 数值
		/// </summary>
		public UInt32 AimNum;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, MapTargetData value);

	static MapTargetDataManager instance;
	public static MapTargetDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new MapTargetDataManager();
			}
			return instance;
		}
	}
	MapTargetDataManager()
	{
		Byte[] data = Util.ReadSheetFile("MapTargetData.dat");
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
			MapTargetData val = new MapTargetData();
			val.ID = read.ReadUInt16();
			val.AimRP = read.ReadByte();
			val.AimType = read.ReadByte();
			val.AimNum = read.ReadUInt32();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (MapTargetData)de.Value))
				return;
		}
	}

	public MapTargetData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("MapTargetData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (MapTargetData)hashTable[key];
	}

	public List<MapTargetData> Get()
	{
		List<MapTargetData> data = new List<MapTargetData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((MapTargetData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
