using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class LanguagesDataManager
{
	public class LanguagesData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 中文
		/// </summary>
		public String ChineseSP;
		/// <summary>
		/// 英文
		/// </summary>
		public UInt32 English;
		/// <summary>
		/// 韩文
		/// </summary>
		public String Korean;
		/// <summary>
		/// 繁体
		/// </summary>
		public String ChineseTra;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, LanguagesData value);

	static LanguagesDataManager instance;
	public static LanguagesDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new LanguagesDataManager();
			}
			return instance;
		}
	}
	LanguagesDataManager()
	{
		Byte[] data = Util.ReadSheetFile("LanguagesData.dat");
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
			LanguagesData val = new LanguagesData();
			val.ID = read.ReadUInt16();
			val.ChineseSP = read.ReadString();
			val.English = read.ReadUInt32();
			val.Korean = read.ReadString();
			val.ChineseTra = read.ReadString();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (LanguagesData)de.Value))
				return;
		}
	}

	public LanguagesData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("LanguagesData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (LanguagesData)hashTable[key];
	}

	public List<LanguagesData> Get()
	{
		List<LanguagesData> data = new List<LanguagesData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((LanguagesData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
