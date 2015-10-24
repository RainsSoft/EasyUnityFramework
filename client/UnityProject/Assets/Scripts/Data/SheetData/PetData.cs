using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class PetDataManager
{
	public class PetData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 宠物名*
		/// </summary>
		public String Name;
		/// <summary>
		/// 宠物系别
		/// </summary>
		public Byte Type;
		/// <summary>
		/// 宠物性格
		/// </summary>
		public Byte Disposition;
		/// <summary>
		/// 宠物定位
		/// </summary>
		public Byte Location;
		/// <summary>
		/// 初始品质
		/// </summary>
		public Byte Quality_Now;
		/// <summary>
		/// 最高品质
		/// </summary>
		public Byte Quality_Max;
		/// <summary>
		/// 觉醒组
		/// </summary>
		public UInt32 Awake;
		/// <summary>
		/// 宠物组合
		/// </summary>
		public UInt32 Group;
		/// <summary>
		/// 怒气积攒
		/// </summary>
		public Byte AnSpeed;
		/// <summary>
		/// 怒气上限
		/// </summary>
		public Byte AnTop;
		/// <summary>
		/// 宠物普通技能
		/// </summary>
		public UInt16 Skill1;
		/// <summary>
		/// 宠物特殊技能
		/// </summary>
		public UInt16 Skill2;
		/// <summary>
		/// 宠物模型*
		/// </summary>
		public String PetModel;
		/// <summary>
		/// 宠物头像*
		/// </summary>
		public String PetAvatar;
		/// <summary>
		/// 宠物音效*
		/// </summary>
		public UInt32 PetSounds;
		/// <summary>
		/// 故事描述*
		/// </summary>
		public String PetStory;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, PetData value);

	static PetDataManager instance;
	public static PetDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new PetDataManager();
			}
			return instance;
		}
	}
	PetDataManager()
	{
		Byte[] data = Util.ReadSheetFile("PetData.dat");
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
			PetData val = new PetData();
			val.ID = read.ReadUInt16();
			val.Name = read.ReadString();
			val.Type = read.ReadByte();
			val.Disposition = read.ReadByte();
			val.Location = read.ReadByte();
			val.Quality_Now = read.ReadByte();
			val.Quality_Max = read.ReadByte();
			val.Awake = read.ReadUInt32();
			val.Group = read.ReadUInt32();
			val.AnSpeed = read.ReadByte();
			val.AnTop = read.ReadByte();
			val.Skill1 = read.ReadUInt16();
			val.Skill2 = read.ReadUInt16();
			val.PetModel = read.ReadString();
			val.PetAvatar = read.ReadString();
			val.PetSounds = read.ReadUInt32();
			val.PetStory = read.ReadString();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (PetData)de.Value))
				return;
		}
	}

	public PetData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("PetData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (PetData)hashTable[key];
	}

	public List<PetData> Get()
	{
		List<PetData> data = new List<PetData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((PetData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
