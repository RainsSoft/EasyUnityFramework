using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class SpawnDataManager
{
	public class SpawnData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt32 ID;
		/// <summary>
		/// 怪物组1
		/// </summary>
		public UInt32 MonGroupA;
		/// <summary>
		/// 怪物组2
		/// </summary>
		public UInt32 MonGroupB;
		/// <summary>
		/// 怪物组3
		/// </summary>
		public UInt32 MonGroupC;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt32 key, SpawnData value);

	static SpawnDataManager instance;
	public static SpawnDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new SpawnDataManager();
			}
			return instance;
		}
	}
	SpawnDataManager()
	{
		Byte[] data = Util.ReadSheetFile("SpawnData.dat");
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
			SpawnData val = new SpawnData();
			val.ID = read.ReadUInt32();
			val.MonGroupA = read.ReadUInt32();
			val.MonGroupB = read.ReadUInt32();
			val.MonGroupC = read.ReadUInt32();
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
			if (callFun(index, hashTable.Count, (UInt32)de.Key, (SpawnData)de.Value))
				return;
		}
	}

	public SpawnData Get(UInt32 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("SpawnData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (SpawnData)hashTable[key];
	}

	public List<SpawnData> Get()
	{
		List<SpawnData> data = new List<SpawnData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((SpawnData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
