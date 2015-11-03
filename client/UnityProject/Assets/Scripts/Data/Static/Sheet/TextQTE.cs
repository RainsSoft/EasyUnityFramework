using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class TextQTEManager
{
	public class TextQTE
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt32 ID;
		/// <summary>
		/// 伤害
		/// </summary>
		public UInt32 Hurt;
		/// <summary>
		/// 类型
		/// </summary>
		public UInt32 Type;
		/// <summary>
		/// 持续回合
		/// </summary>
		public UInt32 Bout;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt32 key, TextQTE value);

	static TextQTEManager instance;
	public static TextQTEManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new TextQTEManager();
			}
			return instance;
		}
	}
	TextQTEManager()
	{
		Byte[] data = Util.ReadSheetFile("TextQTE.dat");
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
			TextQTE val = new TextQTE();
			val.ID = read.ReadUInt32();
			val.Hurt = read.ReadUInt32();
			val.Type = read.ReadUInt32();
			val.Bout = read.ReadUInt32();
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
			if (callFun(index, hashTable.Count, (UInt32)de.Key, (TextQTE)de.Value))
				return;
		}
	}

	public TextQTE Get(UInt32 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("TextQTE : Key = " + key + " 未找到! "); 
			return null;
		}
		return (TextQTE)hashTable[key];
	}

	public List<TextQTE> Get()
	{
		List<TextQTE> data = new List<TextQTE>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((TextQTE)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
