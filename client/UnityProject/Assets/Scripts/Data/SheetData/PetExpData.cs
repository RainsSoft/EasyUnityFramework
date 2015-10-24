using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class PetExpDataManager
{
	public class PetExpData
	{
		/// <summary>
		/// 等级
		/// </summary>
		public UInt16 PetLevel;
		/// <summary>
		/// 升级经验
		/// </summary>
		public UInt32 RepuireEXP;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, PetExpData value);

	static PetExpDataManager instance;
	public static PetExpDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new PetExpDataManager();
			}
			return instance;
		}
	}
	PetExpDataManager()
	{
		Byte[] data = Util.ReadSheetFile("PetExpData.dat");
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
			PetExpData val = new PetExpData();
			val.PetLevel = read.ReadUInt16();
			val.RepuireEXP = read.ReadUInt32();
			hashTable.Add(val.PetLevel,val);
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (PetExpData)de.Value))
				return;
		}
	}

	public PetExpData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("PetExpData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (PetExpData)hashTable[key];
	}

	public List<PetExpData> Get()
	{
		List<PetExpData> data = new List<PetExpData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((PetExpData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
