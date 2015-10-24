using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class PetQualityDataManager
{
	public class PetQualityData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 品质名*
		/// </summary>
		public String QualityName;
		/// <summary>
		/// 成长值
		/// </summary>
		public UInt16 GrowValue;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, PetQualityData value);

	static PetQualityDataManager instance;
	public static PetQualityDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new PetQualityDataManager();
			}
			return instance;
		}
	}
	PetQualityDataManager()
	{
		Byte[] data = Util.ReadSheetFile("PetQualityData.dat");
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
			PetQualityData val = new PetQualityData();
			val.ID = read.ReadUInt16();
			val.QualityName = read.ReadString();
			val.GrowValue = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (PetQualityData)de.Value))
				return;
		}
	}

	public PetQualityData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("PetQualityData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (PetQualityData)hashTable[key];
	}

	public List<PetQualityData> Get()
	{
		List<PetQualityData> data = new List<PetQualityData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((PetQualityData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
