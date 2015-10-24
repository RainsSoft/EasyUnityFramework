using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class PetAbsorbExpDataManager
{
	public class PetAbsorbExpData
	{
		/// <summary>
		/// ID
		/// </summary>
		public Byte ID;
		/// <summary>
		/// 宠物星数
		/// </summary>
		public Byte PetStars;
		/// <summary>
		/// 吸收经验
		/// </summary>
		public UInt16 AbsorbEXP;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, Byte key, PetAbsorbExpData value);

	static PetAbsorbExpDataManager instance;
	public static PetAbsorbExpDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new PetAbsorbExpDataManager();
			}
			return instance;
		}
	}
	PetAbsorbExpDataManager()
	{
		Byte[] data = Util.ReadSheetFile("PetAbsorbExpData.dat");
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
			PetAbsorbExpData val = new PetAbsorbExpData();
			val.ID = read.ReadByte();
			val.PetStars = read.ReadByte();
			val.AbsorbEXP = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (Byte)de.Key, (PetAbsorbExpData)de.Value))
				return;
		}
	}

	public PetAbsorbExpData Get(Byte key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("PetAbsorbExpData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (PetAbsorbExpData)hashTable[key];
	}

	public List<PetAbsorbExpData> Get()
	{
		List<PetAbsorbExpData> data = new List<PetAbsorbExpData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((PetAbsorbExpData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
