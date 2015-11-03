using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class AttributeWeightDataManager
{
	public class AttributeWeightData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 生命权重
		/// </summary>
		public UInt16 HpMV;
		/// <summary>
		/// 普攻权重
		/// </summary>
		public UInt16 AttMV;
		/// <summary>
		/// 普防权重
		/// </summary>
		public UInt16 DefMV;
		/// <summary>
		/// 法攻权重
		/// </summary>
		public UInt16 AttEXMV;
		/// <summary>
		/// 法防权重
		/// </summary>
		public UInt16 DefEXMV;
		/// <summary>
		/// 速度权重
		/// </summary>
		public UInt16 SpeMV;
		/// <summary>
		/// 命中权重
		/// </summary>
		public UInt16 AccMV;
		/// <summary>
		/// 闪避权重
		/// </summary>
		public UInt16 DogMV;
		/// <summary>
		/// 暴击权重
		/// </summary>
		public UInt16 CriMV;
		/// <summary>
		/// 免爆权重
		/// </summary>
		public UInt16 TouMV;
		/// <summary>
		/// 破击权重
		/// </summary>
		public UInt16 ImpMV;
		/// <summary>
		/// 格挡权重
		/// </summary>
		public UInt16 BolMV;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, AttributeWeightData value);

	static AttributeWeightDataManager instance;
	public static AttributeWeightDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new AttributeWeightDataManager();
			}
			return instance;
		}
	}
	AttributeWeightDataManager()
	{
		Byte[] data = Util.ReadSheetFile("AttributeWeightData.dat");
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
			AttributeWeightData val = new AttributeWeightData();
			val.ID = read.ReadUInt16();
			val.HpMV = read.ReadUInt16();
			val.AttMV = read.ReadUInt16();
			val.DefMV = read.ReadUInt16();
			val.AttEXMV = read.ReadUInt16();
			val.DefEXMV = read.ReadUInt16();
			val.SpeMV = read.ReadUInt16();
			val.AccMV = read.ReadUInt16();
			val.DogMV = read.ReadUInt16();
			val.CriMV = read.ReadUInt16();
			val.TouMV = read.ReadUInt16();
			val.ImpMV = read.ReadUInt16();
			val.BolMV = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (AttributeWeightData)de.Value))
				return;
		}
	}

	public AttributeWeightData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("AttributeWeightData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (AttributeWeightData)hashTable[key];
	}

	public List<AttributeWeightData> Get()
	{
		List<AttributeWeightData> data = new List<AttributeWeightData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((AttributeWeightData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
