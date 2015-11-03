using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class BuffDataManager
{
	public class BuffData
	{
		/// <summary>
		/// ID
		/// </summary>
		public Byte Id;
		/// <summary>
		/// BUFF名称*
		/// </summary>
		public String BuffName;
		/// <summary>
		/// 作用目标
		/// </summary>
		public Byte WorkTarget;
		/// <summary>
		/// 目标类型
		/// </summary>
		public Byte SkillType;
		/// <summary>
		/// BUFF类型
		/// </summary>
		public Byte BuffType;
		/// <summary>
		/// 生效几率
		/// </summary>
		public UInt32 EffectOdds;
		/// <summary>
		/// 持续回合
		/// </summary>
		public Byte SustainBout;
		/// <summary>
		/// 数值类型
		/// </summary>
		public Byte ParaType;
		/// <summary>
		/// 数值参数
		/// </summary>
		public UInt16 ParaNum;
		/// <summary>
		/// 数值
		/// </summary>
		public UInt32 Value;
		/// <summary>
		/// BUFF图标*
		/// </summary>
		public String BuffIcon;
		/// <summary>
		/// 资源名*
		/// </summary>
		public String Rescource;
		/// <summary>
		/// BUFF挂点*
		/// </summary>
		public String BuffMP;
		/// <summary>
		/// BUFF说明*
		/// </summary>
		public String BuffDescribe;
		/// <summary>
		/// 净化标识
		/// </summary>
		public Byte Clear;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, Byte key, BuffData value);

	static BuffDataManager instance;
	public static BuffDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new BuffDataManager();
			}
			return instance;
		}
	}
	BuffDataManager()
	{
		Byte[] data = Util.ReadSheetFile("BuffData.dat");
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
			BuffData val = new BuffData();
			val.Id = read.ReadByte();
			val.BuffName = read.ReadString();
			val.WorkTarget = read.ReadByte();
			val.SkillType = read.ReadByte();
			val.BuffType = read.ReadByte();
			val.EffectOdds = read.ReadUInt32();
			val.SustainBout = read.ReadByte();
			val.ParaType = read.ReadByte();
			val.ParaNum = read.ReadUInt16();
			val.Value = read.ReadUInt32();
			val.BuffIcon = read.ReadString();
			val.Rescource = read.ReadString();
			val.BuffMP = read.ReadString();
			val.BuffDescribe = read.ReadString();
			val.Clear = read.ReadByte();
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
			if (callFun(index, hashTable.Count, (Byte)de.Key, (BuffData)de.Value))
				return;
		}
	}

	public BuffData Get(Byte key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("BuffData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (BuffData)hashTable[key];
	}

	public List<BuffData> Get()
	{
		List<BuffData> data = new List<BuffData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((BuffData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
