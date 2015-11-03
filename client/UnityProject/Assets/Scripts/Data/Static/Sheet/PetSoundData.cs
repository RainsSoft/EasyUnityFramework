using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class PetSoundDataManager
{
	public class PetSoundData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 攻击音效
		/// </summary>
		public String AttSound;
		/// <summary>
		/// 受伤音效
		/// </summary>
		public String InjuredSound;
		/// <summary>
		/// 对白音效
		/// </summary>
		public String DialogueSound;
		/// <summary>
		/// QTE音效
		/// </summary>
		public String QteSound;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, PetSoundData value);

	static PetSoundDataManager instance;
	public static PetSoundDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new PetSoundDataManager();
			}
			return instance;
		}
	}
	PetSoundDataManager()
	{
		Byte[] data = Util.ReadSheetFile("PetSoundData.dat");
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
			PetSoundData val = new PetSoundData();
			val.ID = read.ReadUInt16();
			val.AttSound = read.ReadString();
			val.InjuredSound = read.ReadString();
			val.DialogueSound = read.ReadString();
			val.QteSound = read.ReadString();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (PetSoundData)de.Value))
				return;
		}
	}

	public PetSoundData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("PetSoundData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (PetSoundData)hashTable[key];
	}

	public List<PetSoundData> Get()
	{
		List<PetSoundData> data = new List<PetSoundData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((PetSoundData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
