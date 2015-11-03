using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class AttributeIdDataManager
{
	public class AttributeIdData
	{
		/// <summary>
		/// 属性ID
		/// </summary>
		public Byte AttID;
		/// <summary>
		/// 属性名称*
		/// </summary>
		public String AttName;
		/// <summary>
		/// 参数1
		/// </summary>
		public UInt16 ParameterA;
		/// <summary>
		/// 参数2
		/// </summary>
		public UInt16 ParameterB;
		/// <summary>
		/// 参数3
		/// </summary>
		public UInt16 ParameterC;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, Byte key, AttributeIdData value);

	static AttributeIdDataManager instance;
	public static AttributeIdDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new AttributeIdDataManager();
			}
			return instance;
		}
	}
	AttributeIdDataManager()
	{
		Byte[] data = Util.ReadSheetFile("AttributeIdData.dat");
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
			AttributeIdData val = new AttributeIdData();
			val.AttID = read.ReadByte();
			val.AttName = read.ReadString();
			val.ParameterA = read.ReadUInt16();
			val.ParameterB = read.ReadUInt16();
			val.ParameterC = read.ReadUInt16();
			hashTable.Add(val.AttID,val);
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
			if (callFun(index, hashTable.Count, (Byte)de.Key, (AttributeIdData)de.Value))
				return;
		}
	}

	public AttributeIdData Get(Byte key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("AttributeIdData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (AttributeIdData)hashTable[key];
	}

	public List<AttributeIdData> Get()
	{
		List<AttributeIdData> data = new List<AttributeIdData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((AttributeIdData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
