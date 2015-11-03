using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;

#if UNITY_EDITOR
using DEBUG = UnityEngine.Debug;
#else
using DEBUG = DebugConsole;
#endif

public class TextSkillManager
{
	public class TextSkill
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
		/// <summary>
		/// 参数
		/// </summary>
		public UInt32 Variable;
		/// <summary>
		/// 技能类型
		/// </summary>
		public UInt32 SkillType;
		/// <summary>
		/// 飞行
		/// </summary>
		public String bullet;
		/// <summary>
		/// 受击
		/// </summary>
		public String shouji;
	}

	private Hashtable hashTable = new Hashtable();
	public delegate bool DelegateProxy_4(int index, int max, UInt32 key, TextSkill value);

	static TextSkillManager instance;
	public static TextSkillManager Instance
	{
		get
		{
			if (instance == null)
			{
				instance = new TextSkillManager();
			}
			return instance;
		}
	}
	TextSkillManager()
	{
		Byte[] data = Util.ReadSheetFile("TextSkill.dat");
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
			TextSkill val = new TextSkill();
			val.ID = read.ReadUInt32();
			val.Hurt = read.ReadUInt32();
			val.Type = read.ReadUInt32();
			val.Bout = read.ReadUInt32();
			val.Variable = read.ReadUInt32();
			val.SkillType = read.ReadUInt32();
			val.bullet = read.ReadString();
			val.shouji = read.ReadString();
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
			if (callFun(index, hashTable.Count, (UInt32)de.Key, (TextSkill)de.Value))
				return;
		}
	}

	public TextSkill Get(UInt32 key)
	{
		if (!hashTable.ContainsKey(key))
		{
			DEBUG.LogError("TextSkill : Key = " + key + " 未找到! "); 
			return null;
		}
		return (TextSkill)hashTable[key];
	}

	public List<TextSkill> Get()
	{
		List<TextSkill> data = new List<TextSkill>();
		foreach (DictionaryEntry de in hashTable)
		{
			data.Add((TextSkill)de.Value);
		}
		return data;
	}
}
// End of Auto Generated Code
