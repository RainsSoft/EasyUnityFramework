using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class MonsterAttributeDataManager
{
	public class MonsterAttributeData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 组别*
		/// </summary>
		public Byte Group;
		/// <summary>
		/// 生命
		/// </summary>
		public UInt16 HP;
		/// <summary>
		/// 攻击
		/// </summary>
		public UInt16 Att;
		/// <summary>
		/// 防御
		/// </summary>
		public UInt16 Def;
		/// <summary>
		/// 法攻
		/// </summary>
		public UInt16 AttEX;
		/// <summary>
		/// 法防
		/// </summary>
		public UInt16 DefEX;
		/// <summary>
		/// 速度
		/// </summary>
		public UInt32 Speed;
		/// <summary>
		/// 命中等级
		/// </summary>
		public UInt16 Accuracy;
		/// <summary>
		/// 闪避等级
		/// </summary>
		public UInt16 Dogde;
		/// <summary>
		/// 暴击等级
		/// </summary>
		public UInt16 Critic;
		/// <summary>
		/// 韧性等级
		/// </summary>
		public UInt16 Toughness;
		/// <summary>
		/// 破击等级
		/// </summary>
		public UInt16 Impale;
		/// <summary>
		/// 格挡等级
		/// </summary>
		public UInt16 Bolck;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, MonsterAttributeData value);

	static MonsterAttributeDataManager instance;
	public static MonsterAttributeDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new MonsterAttributeDataManager();
			}
			return instance;
		}
	}
	MonsterAttributeDataManager()
	{
		Byte[] data = Util.ReadSheetFile("MonsterAttributeData.dat");
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
			MonsterAttributeData val = new MonsterAttributeData();
			val.ID = read.ReadUInt16();
			val.Group = read.ReadByte();
			val.HP = read.ReadUInt16();
			val.Att = read.ReadUInt16();
			val.Def = read.ReadUInt16();
			val.AttEX = read.ReadUInt16();
			val.DefEX = read.ReadUInt16();
			val.Speed = read.ReadUInt32();
			val.Accuracy = read.ReadUInt16();
			val.Dogde = read.ReadUInt16();
			val.Critic = read.ReadUInt16();
			val.Toughness = read.ReadUInt16();
			val.Impale = read.ReadUInt16();
			val.Bolck = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (MonsterAttributeData)de.Value))
				return;
		}
	}

	public MonsterAttributeData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("MonsterAttributeData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (MonsterAttributeData)hashTable[key];
	}

	public List<MonsterAttributeData> Get()
	{
		List<MonsterAttributeData> data = new List<MonsterAttributeData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((MonsterAttributeData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
