using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class PlayerExpDataManager
{
	public class PlayerExpData
	{
		/// <summary>
		/// 等级
		/// </summary>
		public UInt16 Mlevel;
		/// <summary>
		/// 升级经验
		/// </summary>
		public UInt32 RequireEXP;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, PlayerExpData value);

	static PlayerExpDataManager instance;
	public static PlayerExpDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new PlayerExpDataManager();
			}
			return instance;
		}
	}
	PlayerExpDataManager()
	{
		Byte[] data = Util.ReadSheetFile("PlayerExpData.dat");
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
			PlayerExpData val = new PlayerExpData();
			val.Mlevel = read.ReadUInt16();
			val.RequireEXP = read.ReadUInt32();
			hashTable.Add(val.Mlevel,val);
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (PlayerExpData)de.Value))
				return;
		}
	}

	public PlayerExpData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("PlayerExpData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (PlayerExpData)hashTable[key];
	}

	public List<PlayerExpData> Get()
	{
		List<PlayerExpData> data = new List<PlayerExpData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((PlayerExpData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
