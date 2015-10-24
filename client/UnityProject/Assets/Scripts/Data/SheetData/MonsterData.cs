using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class MonsterDataManager
{
	public class MonsterData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 怪物名*
		/// </summary>
		public String Name;
		/// <summary>
		/// 怪物类型
		/// </summary>
		public Byte TypeLevel;
		/// <summary>
		/// 怪物系别
		/// </summary>
		public Byte Type;
		/// <summary>
		/// 怪物等级
		/// </summary>
		public Byte Level;
		/// <summary>
		/// 怒气积攒
		/// </summary>
		public Byte AnSpeed;
		/// <summary>
		/// 怒气上限
		/// </summary>
		public Byte AnTop;
		/// <summary>
		/// 属性权重ID
		/// </summary>
		public UInt16 MonAttWV;
		/// <summary>
		/// 怪物普通技能
		/// </summary>
		public UInt16 Skill1;
		/// <summary>
		/// 怪物特殊技能
		/// </summary>
		public Byte Skill2;
		/// <summary>
		/// 怪物模型*
		/// </summary>
		public String MonModel;
		/// <summary>
		/// 怪物音效*
		/// </summary>
		public Byte MonSound;
		/// <summary>
		/// 怪物头像*
		/// </summary>
		public String MonPortrait;
		/// <summary>
		/// 怪物描述*
		/// </summary>
		public String MonRP;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, MonsterData value);

	static MonsterDataManager instance;
	public static MonsterDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new MonsterDataManager();
			}
			return instance;
		}
	}
	MonsterDataManager()
	{
		Byte[] data = Util.ReadSheetFile("MonsterData.dat");
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
			MonsterData val = new MonsterData();
			val.ID = read.ReadUInt16();
			val.Name = read.ReadString();
			val.TypeLevel = read.ReadByte();
			val.Type = read.ReadByte();
			val.Level = read.ReadByte();
			val.AnSpeed = read.ReadByte();
			val.AnTop = read.ReadByte();
			val.MonAttWV = read.ReadUInt16();
			val.Skill1 = read.ReadUInt16();
			val.Skill2 = read.ReadByte();
			val.MonModel = read.ReadString();
			val.MonSound = read.ReadByte();
			val.MonPortrait = read.ReadString();
			val.MonRP = read.ReadString();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (MonsterData)de.Value))
				return;
		}
	}

	public MonsterData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("MonsterData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (MonsterData)hashTable[key];
	}

	public List<MonsterData> Get()
	{
		List<MonsterData> data = new List<MonsterData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((MonsterData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
