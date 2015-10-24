using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class SkillDataManager
{
	public class SkillData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 技能名称*
		/// </summary>
		public String SkillName;
		/// <summary>
		/// 目标类型
		/// </summary>
		public Byte SkillType;
		/// <summary>
		/// 伤害类型
		/// </summary>
		public Byte AimPar;
		/// <summary>
		/// 效果下限
		/// </summary>
		public UInt16 DamagePar;
		/// <summary>
		/// 效果上限
		/// </summary>
		public UInt32 MaxHurt;
		/// <summary>
		/// 附加效果
		/// </summary>
		public UInt16 AddValue;
		/// <summary>
		/// 附加BUFF
		/// </summary>
		public UInt16 AddBuff;
		/// <summary>
		/// 释放特效*
		/// </summary>
		public String CastEffect;
		/// <summary>
		/// 释放挂点*
		/// </summary>
		public String CastMP;
		/// <summary>
		/// 技能特效*
		/// </summary>
		public String SkillEffect;
		/// <summary>
		/// 特效挂点*
		/// </summary>
		public String EffectMP;
		/// <summary>
		/// 技能音效*
		/// </summary>
		public String SkillSound;
		/// <summary>
		/// 技能说明*
		/// </summary>
		public String SkillStory;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, SkillData value);

	static SkillDataManager instance;
	public static SkillDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new SkillDataManager();
			}
			return instance;
		}
	}
	SkillDataManager()
	{
		Byte[] data = Util.ReadSheetFile("SkillData.dat");
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
			SkillData val = new SkillData();
			val.ID = read.ReadUInt16();
			val.SkillName = read.ReadString();
			val.SkillType = read.ReadByte();
			val.AimPar = read.ReadByte();
			val.DamagePar = read.ReadUInt16();
			val.MaxHurt = read.ReadUInt32();
			val.AddValue = read.ReadUInt16();
			val.AddBuff = read.ReadUInt16();
			val.CastEffect = read.ReadString();
			val.CastMP = read.ReadString();
			val.SkillEffect = read.ReadString();
			val.EffectMP = read.ReadString();
			val.SkillSound = read.ReadString();
			val.SkillStory = read.ReadString();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (SkillData)de.Value))
				return;
		}
	}

	public SkillData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("SkillData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (SkillData)hashTable[key];
	}

	public List<SkillData> Get()
	{
		List<SkillData> data = new List<SkillData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((SkillData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
