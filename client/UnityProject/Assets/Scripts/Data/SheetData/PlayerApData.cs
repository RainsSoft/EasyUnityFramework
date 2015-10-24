using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class PlayerApDataManager
{
	public class PlayerApData
	{
		/// <summary>
		/// 等级
		/// </summary>
		public Byte Level;
		/// <summary>
		/// AP成长
		/// </summary>
		public Byte APGrowth;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, Byte key, PlayerApData value);

	static PlayerApDataManager instance;
	public static PlayerApDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new PlayerApDataManager();
			}
			return instance;
		}
	}
	PlayerApDataManager()
	{
		Byte[] data = Util.ReadSheetFile("PlayerApData.dat");
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
			PlayerApData val = new PlayerApData();
			val.Level = read.ReadByte();
			val.APGrowth = read.ReadByte();
			hashTable.Add(val.Level,val);
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
			if (callFun(index, hashTable.Count, (Byte)de.Key, (PlayerApData)de.Value))
				return;
		}
	}

	public PlayerApData Get(Byte key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("PlayerApData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (PlayerApData)hashTable[key];
	}

	public List<PlayerApData> Get()
	{
		List<PlayerApData> data = new List<PlayerApData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((PlayerApData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
