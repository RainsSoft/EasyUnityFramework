using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class MapDescribeDataManager
{
	public class MapDescribeData
	{
		/// <summary>
		/// ID
		/// </summary>
		public UInt16 ID;
		/// <summary>
		/// 关卡目标类型
		/// </summary>
		public Byte AimType;
		/// <summary>
		/// 文字描述
		/// </summary>
		public String AimRP;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt16 key, MapDescribeData value);

	static MapDescribeDataManager instance;
	public static MapDescribeDataManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new MapDescribeDataManager();
			}
			return instance;
		}
	}
	MapDescribeDataManager()
	{
		Byte[] data = Util.ReadSheetFile("MapDescribeData.dat");
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
			MapDescribeData val = new MapDescribeData();
			val.ID = read.ReadUInt16();
			val.AimType = read.ReadByte();
			val.AimRP = read.ReadString();
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
			if (callFun(index, hashTable.Count, (UInt16)de.Key, (MapDescribeData)de.Value))
				return;
		}
	}

	public MapDescribeData Get(UInt16 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("MapDescribeData : Key = " + key + " 未找到! "); 
			return null;
		}
		return (MapDescribeData)hashTable[key];
	}

	public List<MapDescribeData> Get()
	{
		List<MapDescribeData> data = new List<MapDescribeData>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((MapDescribeData)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
