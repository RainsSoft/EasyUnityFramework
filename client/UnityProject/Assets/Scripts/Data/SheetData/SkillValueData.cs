using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class SkillValueDataManager
{
	public class SkillValueData
	{
		/// <summary>
		/// ID
		/// </summary>
		public Byte ID;
		/// <summary>
		/// 效果名称*
		/// </summary>
		public String Name;
		/// <summary>
		/// 作用目标
		/// </summary>
		public Byte Value1;
		/// <summary>
		/// 目标类型
		/// </summary>
		public Byte Value2;
		/// <summary>
		/// 效果类型
		/// </summary>
		public Byte Value3;
		/// <summary>
		/// 数值类型
		/// </summary>
		public Byte Value4;
		/// <summary>
		/// 数值
		/// </summary>
		public UInt16 Value5;
		/// <summary>
		/// 效果说明*
		/// </summary>
		public String Describe;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, Byte key, SkillValueData value);

	static SkillValueDataManager instance;
	public static SkillValueDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new SkillValueDataManager();
			}
			return instance;
		}
	}
	SkillValueDataManager()
	{
		Byte[] data = Util.ReadSheetFile("SkillValueData.dat");
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
			SkillValueData val = new SkillValueData();
			val.ID = read.ReadByte();
			val.Name = read.ReadString();
			val.Value1 = read.ReadByte();
			val.Value2 = read.ReadByte();
			val.Value3 = read.ReadByte();
			val.Value4 = read.ReadByte();
			val.Value5 = read.ReadUInt16();
			val.Describe = read.ReadString();
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
			if (callFun(index, hashTable.Count, (Byte)de.Key, (SkillValueData)de.Value))
				return;
		}
	}

	public SkillValueData Get(Byte key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("SkillValueData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (SkillValueData)hashTable[key];
	}

	public List<SkillValueData> Get()
	{
		List<SkillValueData> data = new List<SkillValueData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((SkillValueData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
