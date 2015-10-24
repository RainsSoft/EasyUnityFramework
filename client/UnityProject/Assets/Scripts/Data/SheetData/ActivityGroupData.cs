using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class ActivityGroupDataManager
{
	public class ActivityGroupData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
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
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, ActivityGroupData value);

	static ActivityGroupDataManager instance;
	public static ActivityGroupDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new ActivityGroupDataManager();
			}
			return instance;
		}
	}
	ActivityGroupDataManager()
	{
		Byte[] data = Util.ReadSheetFile("ActivityGroupData.dat");
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
			ActivityGroupData val = new ActivityGroupData();
			val.ID = read.ReadUInt16();
			val.Mon1 = read.ReadUInt16();
			val.Mon2 = read.ReadUInt16();
			val.Mon3 = read.ReadUInt16();
			val.Mon4 = read.ReadUInt16();
			val.Mon5 = read.ReadUInt16();
			val.Mon6 = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (ActivityGroupData)de.Value))
				return;
		}
	}

	public ActivityGroupData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("ActivityGroupData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (ActivityGroupData)hashTable[key];
	}

	public List<ActivityGroupData> Get()
	{
		List<ActivityGroupData> data = new List<ActivityGroupData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((ActivityGroupData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
