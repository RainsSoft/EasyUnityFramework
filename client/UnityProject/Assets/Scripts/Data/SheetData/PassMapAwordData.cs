using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class PassMapAwordDataManager
{
	public class PassMapAwordData
	{
		/// <summary>
		/// ID
		/// </summary>
		public Byte ID;
		/// <summary>
		/// 奖励ID
		/// </summary>
		public Byte AwardID;
		/// <summary>
		/// 奖励名称
		/// </summary>
		public String AwardName;
		/// <summary>
		/// 奖励条件
		/// </summary>
		public Byte AwarDcondition;
		/// <summary>
		/// 条件数值
		/// </summary>
		public Byte ConditionNum;
		/// <summary>
		/// 奖励组ID
		/// </summary>
		public UInt32 AwardGroupS;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, Byte key, PassMapAwordData value);

	static PassMapAwordDataManager instance;
	public static PassMapAwordDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new PassMapAwordDataManager();
			}
			return instance;
		}
	}
	PassMapAwordDataManager()
	{
		Byte[] data = Util.ReadSheetFile("PassMapAwordData.dat");
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
			PassMapAwordData val = new PassMapAwordData();
			val.ID = read.ReadByte();
			val.AwardID = read.ReadByte();
			val.AwardName = read.ReadString();
			val.AwarDcondition = read.ReadByte();
			val.ConditionNum = read.ReadByte();
			val.AwardGroupS = read.ReadUInt32();
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
			if (callFun(index, hashTable.Count, (Byte)de.Key, (PassMapAwordData)de.Value))
				return;
		}
	}

	public PassMapAwordData Get(Byte key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("PassMapAwordData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (PassMapAwordData)hashTable[key];
	}

	public List<PassMapAwordData> Get()
	{
		List<PassMapAwordData> data = new List<PassMapAwordData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((PassMapAwordData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
