using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class AttributeCountDataManager
{
	public class AttributeCountData
	{
		/// <summary>
		/// 等级
		/// </summary>
		public Byte Level;
		/// <summary>
		/// 计算值
		/// </summary>
		public UInt16 CountNum;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, Byte key, AttributeCountData value);

	static AttributeCountDataManager instance;
	public static AttributeCountDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new AttributeCountDataManager();
			}
			return instance;
		}
	}
	AttributeCountDataManager()
	{
		Byte[] data = Util.ReadSheetFile("AttributeCountData.dat");
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
			AttributeCountData val = new AttributeCountData();
			val.Level = read.ReadByte();
			val.CountNum = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (Byte)de.Key, (AttributeCountData)de.Value))
				return;
		}
	}

	public AttributeCountData Get(Byte key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("AttributeCountData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (AttributeCountData)hashTable[key];
	}

	public List<AttributeCountData> Get()
	{
		List<AttributeCountData> data = new List<AttributeCountData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((AttributeCountData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
