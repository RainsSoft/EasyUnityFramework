using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class ShakeMirrorDataManager
{
	public class ShakeMirrorData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 建筑名
		/// </summary>
		public String BuildName;
		/// <summary>
		/// 开启等级
		/// </summary>
		public Byte OpenLevel;
		/// <summary>
		/// 功能简述
		/// </summary>
		public String FunctionRP;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, ShakeMirrorData value);

	static ShakeMirrorDataManager instance;
	public static ShakeMirrorDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new ShakeMirrorDataManager();
			}
			return instance;
		}
	}
	ShakeMirrorDataManager()
	{
		Byte[] data = Util.ReadSheetFile("ShakeMirrorData.dat");
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
			ShakeMirrorData val = new ShakeMirrorData();
			val.ID = read.ReadUInt16();
			val.BuildName = read.ReadString();
			val.OpenLevel = read.ReadByte();
			val.FunctionRP = read.ReadString();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (ShakeMirrorData)de.Value))
				return;
		}
	}

	public ShakeMirrorData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("ShakeMirrorData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (ShakeMirrorData)hashTable[key];
	}

	public List<ShakeMirrorData> Get()
	{
		List<ShakeMirrorData> data = new List<ShakeMirrorData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((ShakeMirrorData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
