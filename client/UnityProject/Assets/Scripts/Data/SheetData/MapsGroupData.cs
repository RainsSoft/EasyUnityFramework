using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class MapsGroupDataManager
{
	public class MapsGroupData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt32 ID;
		/// <summary>
		/// 怪物1
		/// </summary>
		public UInt16 Mon1;
		/// <summary>
		/// 怪物2
		/// </summary>
		public UInt16 Mon2;
		/// <summary>
		/// 怪物3
		/// </summary>
		public UInt16 Mon3;
		/// <summary>
		/// 怪物4
		/// </summary>
		public UInt16 Mon4;
		/// <summary>
		/// 怪物5
		/// </summary>
		public UInt16 Mon5;
		/// <summary>
		/// 怪物6
		/// </summary>
		public UInt16 Mon6;
		/// <summary>
		/// 显示怪
		/// </summary>
		public UInt16 MonX;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt32 key, MapsGroupData value);

	static MapsGroupDataManager instance;
	public static MapsGroupDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new MapsGroupDataManager();
			}
			return instance;
		}
	}
	MapsGroupDataManager()
	{
		Byte[] data = Util.ReadSheetFile("MapsGroupData.dat");
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
			MapsGroupData val = new MapsGroupData();
			val.ID = read.ReadUInt32();
			val.Mon1 = read.ReadUInt16();
			val.Mon2 = read.ReadUInt16();
			val.Mon3 = read.ReadUInt16();
			val.Mon4 = read.ReadUInt16();
			val.Mon5 = read.ReadUInt16();
			val.Mon6 = read.ReadUInt16();
			val.MonX = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (UInt32)de.Key, (MapsGroupData)de.Value))
				return;
		}
	}

	public MapsGroupData Get(UInt32 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("MapsGroupData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (MapsGroupData)hashTable[key];
	}

	public List<MapsGroupData> Get()
	{
		List<MapsGroupData> data = new List<MapsGroupData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((MapsGroupData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
