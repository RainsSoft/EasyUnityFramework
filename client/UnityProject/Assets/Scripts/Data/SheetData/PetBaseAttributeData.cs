using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class PetBaseAttributeDataManager
{
	public class PetBaseAttributeData
	{
		/// <summary>
		/// 等级
		/// </summary>
		public Byte Level;
		/// <summary>
		/// 宠物生命
		/// </summary>
		public UInt16 HP;
		/// <summary>
		/// 宠物攻击
		/// </summary>
		public UInt16 Att;
		/// <summary>
		/// 宠物防御
		/// </summary>
		public UInt16 Def;
		/// <summary>
		/// 宠物法攻
		/// </summary>
		public UInt16 AttEX;
		/// <summary>
		/// 宠物法防
		/// </summary>
		public UInt16 DefEX;
		/// <summary>
		/// 宠物武力
		/// </summary>
		public UInt16 Force;
		/// <summary>
		/// 宠物耐力
		/// </summary>
		public UInt16 Stamina;
		/// <summary>
		/// 宠物法力
		/// </summary>
		public UInt16 Magic;
		/// <summary>
		/// 宠物灵力
		/// </summary>
		public UInt16 Wakan;
		/// <summary>
		/// 宠物速度
		/// </summary>
		public Byte Speed;
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
		/// 免爆等级
		/// </summary>
		public UInt16 Toughness;
		/// <summary>
		/// 格挡等级
		/// </summary>
		public UInt16 Bolck;
		/// <summary>
		/// 破击等级
		/// </summary>
		public UInt16 Impale;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, Byte key, PetBaseAttributeData value);

	static PetBaseAttributeDataManager instance;
	public static PetBaseAttributeDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new PetBaseAttributeDataManager();
			}
			return instance;
		}
	}
	PetBaseAttributeDataManager()
	{
		Byte[] data = Util.ReadSheetFile("PetBaseAttributeData.dat");
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
			PetBaseAttributeData val = new PetBaseAttributeData();
			val.Level = read.ReadByte();
			val.HP = read.ReadUInt16();
			val.Att = read.ReadUInt16();
			val.Def = read.ReadUInt16();
			val.AttEX = read.ReadUInt16();
			val.DefEX = read.ReadUInt16();
			val.Force = read.ReadUInt16();
			val.Stamina = read.ReadUInt16();
			val.Magic = read.ReadUInt16();
			val.Wakan = read.ReadUInt16();
			val.Speed = read.ReadByte();
			val.Accuracy = read.ReadUInt16();
			val.Dogde = read.ReadUInt16();
			val.Critic = read.ReadUInt16();
			val.Toughness = read.ReadUInt16();
			val.Bolck = read.ReadUInt16();
			val.Impale = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (Byte)de.Key, (PetBaseAttributeData)de.Value))
				return;
		}
	}

	public PetBaseAttributeData Get(Byte key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("PetBaseAttributeData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (PetBaseAttributeData)hashTable[key];
	}

	public List<PetBaseAttributeData> Get()
	{
		List<PetBaseAttributeData> data = new List<PetBaseAttributeData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((PetBaseAttributeData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
