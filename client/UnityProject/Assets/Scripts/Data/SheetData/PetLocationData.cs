using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class PetLocationDataManager
{
	public class PetLocationData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 宠物定位*
		/// </summary>
		public String Location;
		/// <summary>
		/// 生命参数
		/// </summary>
		public UInt32 Hp;
		/// <summary>
		/// 武力参数
		/// </summary>
		public UInt16 Force;
		/// <summary>
		/// 耐力参数
		/// </summary>
		public UInt16 Stamina;
		/// <summary>
		/// 法力参数
		/// </summary>
		public UInt16 Magic;
		/// <summary>
		/// 灵力参数
		/// </summary>
		public UInt16 Wakan;
		/// <summary>
		/// 命中参数
		/// </summary>
		public UInt16 Accuracy;
		/// <summary>
		/// 闪避参数
		/// </summary>
		public UInt16 Dogde;
		/// <summary>
		/// 暴击参数
		/// </summary>
		public UInt16 Critic;
		/// <summary>
		/// 免暴参数
		/// </summary>
		public UInt16 Toughness;
		/// <summary>
		/// 格挡参数
		/// </summary>
		public UInt16 Bolck;
		/// <summary>
		/// 破击参数
		/// </summary>
		public UInt16 Impale;
		/// <summary>
		/// 速度参数
		/// </summary>
		public UInt16 Speed;
		/// <summary>
		/// 定位图标*
		/// </summary>
		public String LocationIcon;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, PetLocationData value);

	static PetLocationDataManager instance;
	public static PetLocationDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new PetLocationDataManager();
			}
			return instance;
		}
	}
	PetLocationDataManager()
	{
		Byte[] data = Util.ReadSheetFile("PetLocationData.dat");
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
			PetLocationData val = new PetLocationData();
			val.ID = read.ReadUInt16();
			val.Location = read.ReadString();
			val.Hp = read.ReadUInt32();
			val.Force = read.ReadUInt16();
			val.Stamina = read.ReadUInt16();
			val.Magic = read.ReadUInt16();
			val.Wakan = read.ReadUInt16();
			val.Accuracy = read.ReadUInt16();
			val.Dogde = read.ReadUInt16();
			val.Critic = read.ReadUInt16();
			val.Toughness = read.ReadUInt16();
			val.Bolck = read.ReadUInt16();
			val.Impale = read.ReadUInt16();
			val.Speed = read.ReadUInt16();
			val.LocationIcon = read.ReadString();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (PetLocationData)de.Value))
				return;
		}
	}

	public PetLocationData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("PetLocationData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (PetLocationData)hashTable[key];
	}

	public List<PetLocationData> Get()
	{
		List<PetLocationData> data = new List<PetLocationData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((PetLocationData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
