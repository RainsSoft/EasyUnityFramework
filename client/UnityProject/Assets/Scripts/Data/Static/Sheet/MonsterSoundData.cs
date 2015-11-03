using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class MonsterSoundDataManager
{
	public class MonsterSoundData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 攻击音效
		/// </summary>
		public String AttSound;
		/// <summary>
		/// 受伤音效
		/// </summary>
		public String InjuredSound;
		/// <summary>
		/// 对白音效
		/// </summary>
		public String DialogueSound;
		/// <summary>
		/// QTE音效
		/// </summary>
		public String QteSound;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, MonsterSoundData value);

	static MonsterSoundDataManager instance;
	public static MonsterSoundDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new MonsterSoundDataManager();
			}
			return instance;
		}
	}
	MonsterSoundDataManager()
	{
		Byte[] data = Util.ReadSheetFile("MonsterSoundData.dat");
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
			MonsterSoundData val = new MonsterSoundData();
			val.ID = read.ReadUInt16();
			val.AttSound = read.ReadString();
			val.InjuredSound = read.ReadString();
			val.DialogueSound = read.ReadString();
			val.QteSound = read.ReadString();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (MonsterSoundData)de.Value))
				return;
		}
	}

	public MonsterSoundData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("MonsterSoundData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (MonsterSoundData)hashTable[key];
	}

	public List<MonsterSoundData> Get()
	{
		List<MonsterSoundData> data = new List<MonsterSoundData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((MonsterSoundData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
