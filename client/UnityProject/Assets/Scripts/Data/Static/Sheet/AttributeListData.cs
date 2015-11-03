using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class AttributeListDataManager
{
	public class AttributeListData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 属性名
		/// </summary>
		public String Attribute;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, AttributeListData value);

	static AttributeListDataManager instance;
	public static AttributeListDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new AttributeListDataManager();
			}
			return instance;
		}
	}
	AttributeListDataManager()
	{
		Byte[] data = Util.ReadSheetFile("AttributeListData.dat");
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
			AttributeListData val = new AttributeListData();
			val.ID = read.ReadUInt16();
			val.Attribute = read.ReadString();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (AttributeListData)de.Value))
				return;
		}
	}

	public AttributeListData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("AttributeListData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (AttributeListData)hashTable[key];
	}

	public List<AttributeListData> Get()
	{
		List<AttributeListData> data = new List<AttributeListData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((AttributeListData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
