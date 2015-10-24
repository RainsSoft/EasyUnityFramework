using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class TypeImpactManager
{
	public class TypeImpact
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 系别*
		/// </summary>
		public String Name;
		/// <summary>
		/// 蛮斗
		/// </summary>
		public UInt16 Type1;
		/// <summary>
		/// 坚甲
		/// </summary>
		public UInt16 Type2;
		/// <summary>
		/// 神奇
		/// </summary>
		public UInt16 Type3;
		/// <summary>
		/// 幻影
		/// </summary>
		public UInt16 Type4;
		/// <summary>
		/// 灵风
		/// </summary>
		public UInt16 Type5;
		/// <summary>
		/// 幽罗
		/// </summary>
		public UInt16 Type6;
		/// <summary>
		/// 淘气
		/// </summary>
		public UInt16 Type7;
		/// <summary>
		/// 上古
		/// </summary>
		public UInt16 Type8;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, TypeImpact value);

	static TypeImpactManager instance;
	public static TypeImpactManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new TypeImpactManager();
			}
			return instance;
		}
	}
	TypeImpactManager()
	{
		Byte[] data = Util.ReadSheetFile("TypeImpact.dat");
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
			TypeImpact val = new TypeImpact();
			val.ID = read.ReadUInt16();
			val.Name = read.ReadString();
			val.Type1 = read.ReadUInt16();
			val.Type2 = read.ReadUInt16();
			val.Type3 = read.ReadUInt16();
			val.Type4 = read.ReadUInt16();
			val.Type5 = read.ReadUInt16();
			val.Type6 = read.ReadUInt16();
			val.Type7 = read.ReadUInt16();
			val.Type8 = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (TypeImpact)de.Value))
				return;
		}
	}

	public TypeImpact Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("TypeImpact : Key = " + key + " 未找到! "); 
			return null;
		}
		return (TypeImpact)hashTable[key];
	}

	public List<TypeImpact> Get()
	{
		List<TypeImpact> data = new List<TypeImpact>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((TypeImpact)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
