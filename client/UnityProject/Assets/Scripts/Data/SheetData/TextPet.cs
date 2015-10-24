using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class TextPetManager
{
	public class TextPet
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 名称
		/// </summary>
		public String Name;
		/// <summary>
		/// 资源名
		/// </summary>
		public String ResName;
		/// <summary>
		/// 攻击类型
		/// </summary>
		public Byte AttType;
		/// <summary>
		/// 等级
		/// </summary>
		public Byte Level;
		/// <summary>
		/// 生命
		/// </summary>
		public UInt32 Hp;
		/// <summary>
		/// 攻击
		/// </summary>
		public UInt32 Attack;
		/// <summary>
		/// 防御
		/// </summary>
		public UInt32 Defense;
		/// <summary>
		/// 速度
		/// </summary>
		public UInt32 Speed;
		/// <summary>
		/// 免伤率
		/// </summary>
		public UInt16 DefinePer;
		/// <summary>
		/// 暴击率
		/// </summary>
		public UInt16 CriticPer;
		/// <summary>
		/// 命中率
		/// </summary>
		public UInt16 AccuracyPer;
		/// <summary>
		/// 闪躲率
		/// </summary>
		public UInt16 DogdePer;
		/// <summary>
		/// 免爆率
		/// </summary>
		public UInt16 ToughnessPer;
		/// <summary>
		/// 格挡率
		/// </summary>
		public UInt16 BolckPer;
		/// <summary>
		/// 破击率
		/// </summary>
		public UInt16 ImpalePer;
		/// <summary>
		/// 基础怒气
		/// </summary>
		public UInt16 BaseAnger;
		/// <summary>
		/// 怒气上限
		/// </summary>
		public UInt16 MaxAnger;
		/// <summary>
		/// 攻击怒气效率
		/// </summary>
		public UInt16 AttAnger;
		/// <summary>
		/// 系别
		/// </summary>
		public UInt16 MonType;
		/// <summary>
		/// 组合
		/// </summary>
		public UInt16 Group;
		/// <summary>
		/// QTE喊话
		/// </summary>
		public String QTEMacro;
		/// <summary>
		/// 技能
		/// </summary>
		public UInt16 Skill;
		/// <summary>
		/// QTE
		/// </summary>
		public UInt16 QTE;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, TextPet value);

	static TextPetManager instance;
	public static TextPetManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new TextPetManager();
			}
			return instance;
		}
	}
	TextPetManager()
	{
		Byte[] data = Util.ReadSheetFile("TextPet.dat");
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
			TextPet val = new TextPet();
			val.ID = read.ReadUInt16();
			val.Name = read.ReadString();
			val.ResName = read.ReadString();
			val.AttType = read.ReadByte();
			val.Level = read.ReadByte();
			val.Hp = read.ReadUInt32();
			val.Attack = read.ReadUInt32();
			val.Defense = read.ReadUInt32();
			val.Speed = read.ReadUInt32();
			val.DefinePer = read.ReadUInt16();
			val.CriticPer = read.ReadUInt16();
			val.AccuracyPer = read.ReadUInt16();
			val.DogdePer = read.ReadUInt16();
			val.ToughnessPer = read.ReadUInt16();
			val.BolckPer = read.ReadUInt16();
			val.ImpalePer = read.ReadUInt16();
			val.BaseAnger = read.ReadUInt16();
			val.MaxAnger = read.ReadUInt16();
			val.AttAnger = read.ReadUInt16();
			val.MonType = read.ReadUInt16();
			val.Group = read.ReadUInt16();
			val.QTEMacro = read.ReadString();
			val.Skill = read.ReadUInt16();
			val.QTE = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (TextPet)de.Value))
				return;
		}
	}

	public TextPet Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("TextPet : Key = " + key + " 未找到! "); 
			return null;
		}
		return (TextPet)hashTable[key];
	}

	public List<TextPet> Get()
	{
		List<TextPet> data = new List<TextPet>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((TextPet)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
