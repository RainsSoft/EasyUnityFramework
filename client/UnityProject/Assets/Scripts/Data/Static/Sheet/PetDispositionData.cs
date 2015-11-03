using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class PetDispositionDataManager
{
	public class PetDispositionData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 性格*
		/// </summary>
		public String Name;
		/// <summary>
		/// 不攻击
		/// </summary>
		public UInt16 AttackType1;
		/// <summary>
		/// 两次攻击
		/// </summary>
		public UInt16 AttackType2;
		/// <summary>
		/// 亲密度
		/// </summary>
		public UInt16 Intimacy;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, PetDispositionData value);

	static PetDispositionDataManager instance;
	public static PetDispositionDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new PetDispositionDataManager();
			}
			return instance;
		}
	}
	PetDispositionDataManager()
	{
		Byte[] data = Util.ReadSheetFile("PetDispositionData.dat");
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
			PetDispositionData val = new PetDispositionData();
			val.ID = read.ReadUInt16();
			val.Name = read.ReadString();
			val.AttackType1 = read.ReadUInt16();
			val.AttackType2 = read.ReadUInt16();
			val.Intimacy = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (PetDispositionData)de.Value))
				return;
		}
	}

	public PetDispositionData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("PetDispositionData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (PetDispositionData)hashTable[key];
	}

	public List<PetDispositionData> Get()
	{
		List<PetDispositionData> data = new List<PetDispositionData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((PetDispositionData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
