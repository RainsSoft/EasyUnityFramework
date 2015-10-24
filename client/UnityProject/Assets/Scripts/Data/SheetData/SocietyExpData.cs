using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class SocietyExpDataManager
{
	public class SocietyExpData
	{
		/// <summary>
		/// 等级
		/// </summary>
		public Byte GuildLevel;
		/// <summary>
		/// 升级经验
		/// </summary>
		public UInt32 RequireLevel;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, Byte key, SocietyExpData value);

	static SocietyExpDataManager instance;
	public static SocietyExpDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new SocietyExpDataManager();
			}
			return instance;
		}
	}
	SocietyExpDataManager()
	{
		Byte[] data = Util.ReadSheetFile("SocietyExpData.dat");
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
			SocietyExpData val = new SocietyExpData();
			val.GuildLevel = read.ReadByte();
			val.RequireLevel = read.ReadUInt32();
			hashTable.Add(val.GuildLevel,val);
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
			if (callFun(index, hashTable.Count, (Byte)de.Key, (SocietyExpData)de.Value))
				return;
		}
	}

	public SocietyExpData Get(Byte key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("SocietyExpData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (SocietyExpData)hashTable[key];
	}

	public List<SocietyExpData> Get()
	{
		List<SocietyExpData> data = new List<SocietyExpData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((SocietyExpData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
