using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class TextMonterManager
{
	public class TextMonter
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
		/// 类型
		/// </summary>
		public Byte Type;
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
		/// 技能
		/// </summary>
		public UInt16 Skill;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, TextMonter value);

	static TextMonterManager instance;
	public static TextMonterManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new TextMonterManager();
			}
			return instance;
		}
	}
	TextMonterManager()
	{
		Byte[] data = Util.ReadSheetFile("TextMonter.dat");
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
			TextMonter val = new TextMonter();
			val.ID = read.ReadUInt16();
			val.Name = read.ReadString();
			val.ResName = read.ReadString();
			val.AttType = read.ReadByte();
			val.Type = read.ReadByte();
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
			val.Skill = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (TextMonter)de.Value))
				return;
		}
	}

	public TextMonter Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("TextMonter : Key = " + key + " 未找到! "); 
			return null;
		}
		return (TextMonter)hashTable[key];
	}

	public List<TextMonter> Get()
	{
		List<TextMonter> data = new List<TextMonter>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((TextMonter)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
