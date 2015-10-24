using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class MonsterChallengeDataManager
{
	public class MonsterChallengeData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt32 Id;
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
		/// <summary>
		/// 怪物组4
		/// </summary>
		public UInt32 MonGroupD;
		/// <summary>
		/// 怪物组5
		/// </summary>
		public UInt32 MonGroupE;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt32 key, MonsterChallengeData value);

	static MonsterChallengeDataManager instance;
	public static MonsterChallengeDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new MonsterChallengeDataManager();
			}
			return instance;
		}
	}
	MonsterChallengeDataManager()
	{
		Byte[] data = Util.ReadSheetFile("MonsterChallengeData.dat");
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
			MonsterChallengeData val = new MonsterChallengeData();
			val.Id = read.ReadUInt32();
			val.MonGroupA = read.ReadUInt32();
			val.MonGroupB = read.ReadUInt32();
			val.MonGroupC = read.ReadUInt32();
			val.MonGroupD = read.ReadUInt32();
			val.MonGroupE = read.ReadUInt32();
			hashTable.Add(val.Id,val);
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
			if (callFun(index, hashTable.Count, (UInt32)de.Key, (MonsterChallengeData)de.Value))
				return;
		}
	}

	public MonsterChallengeData Get(UInt32 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("MonsterChallengeData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (MonsterChallengeData)hashTable[key];
	}

	public List<MonsterChallengeData> Get()
	{
		List<MonsterChallengeData> data = new List<MonsterChallengeData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((MonsterChallengeData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
