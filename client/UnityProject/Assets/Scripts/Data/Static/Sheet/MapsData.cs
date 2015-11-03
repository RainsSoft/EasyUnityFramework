using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class MapsDataManager
{
	public class MapsData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 所属区域
		/// </summary>
		public Byte Area;
		/// <summary>
		/// 关卡名
		/// </summary>
		public String LevelName;
		/// <summary>
		/// 关卡类型
		/// </summary>
		public Byte LevelType;
		/// <summary>
		/// 关卡图标
		/// </summary>
		public String LevelIcon;
		/// <summary>
		/// 关卡x坐标
		/// </summary>
		public Byte LevelX;
		/// <summary>
		/// 关卡y坐标
		/// </summary>
		public Byte LevelY;
		/// <summary>
		/// 普通
		/// </summary>
		public UInt16 Common;
		/// <summary>
		/// 困难
		/// </summary>
		public UInt16 Difficulty;
		/// <summary>
		/// 英雄
		/// </summary>
		public UInt16 Hero;
		/// <summary>
		/// 关卡目标A
		/// </summary>
		public Byte LevelAimA;
		/// <summary>
		/// 关卡目标B
		/// </summary>
		public Byte LevelAimB;
		/// <summary>
		/// 关卡目标C
		/// </summary>
		public Byte LevelAimC;
		/// <summary>
		/// 关卡奖励
		/// </summary>
		public UInt16 LevelAward;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, MapsData value);

	static MapsDataManager instance;
	public static MapsDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new MapsDataManager();
			}
			return instance;
		}
	}
	MapsDataManager()
	{
		Byte[] data = Util.ReadSheetFile("MapsData.dat");
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
			MapsData val = new MapsData();
			val.ID = read.ReadUInt16();
			val.Area = read.ReadByte();
			val.LevelName = read.ReadString();
			val.LevelType = read.ReadByte();
			val.LevelIcon = read.ReadString();
			val.LevelX = read.ReadByte();
			val.LevelY = read.ReadByte();
			val.Common = read.ReadUInt16();
			val.Difficulty = read.ReadUInt16();
			val.Hero = read.ReadUInt16();
			val.LevelAimA = read.ReadByte();
			val.LevelAimB = read.ReadByte();
			val.LevelAimC = read.ReadByte();
			val.LevelAward = read.ReadUInt16();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (MapsData)de.Value))
				return;
		}
	}

	public MapsData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("MapsData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (MapsData)hashTable[key];
	}

	public List<MapsData> Get()
	{
		List<MapsData> data = new List<MapsData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((MapsData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
