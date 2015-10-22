using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;
public class CSVReader
{
	public class CSVTable
	{
		private Dict<string, Dict<string, string>> rowTable = new Dict<string, Dict<string, string>> ();


		public void AddRow(string key, Dict<string, string> value)
		{
			if (rowTable.ContainsKey (key))
				return;
			rowTable.Add (key, value);
		}
		
		public string GetVaule(string rowHead, string ColumnHead)
		{
			Dict<string, string> row;
			string value;
			if (rowTable.TryGetValue (rowHead, out row))
			{
				if(row.TryGetValue(ColumnHead, out value))
					return value;
			}
			return null;
		}

		public List<string> GetRow(string key)
		{
			if (!rowTable.ContainsKey (key))
				return null;
			Dict<string, string> row;
			if (rowTable.TryGetValue (key, out row))
			{
				List<string> rowList = new List<string>();

				do
				{
					rowList.Add(row.GetEnumerator().Current.Value);
				}while(row.GetEnumerator().MoveNext());
				return rowList;
			}
			return  null;
		}

	}
	
	private CSVTable table = new CSVTable();


	public CSVReader()
	{
	}

	public void ParserCSV(string content)
	{

		string[] row = content.Split(new char[]{'\n'});
		string[] columnHeads = row[0].Split(new char[]{','});


		for(int i = 1; i < row.Length; i++)
		{
			Dict<string, string> rowDict = new Dict<string, string>();
			string[] column =row[i].Split(new char[]{','});

			for(int j = 0; j < columnHeads.Length; j++)
			{
				if(!String.IsNullOrEmpty(column[j]))
				{
					rowDict.Add(columnHeads[j], column[j]);
				}
				else
				{
					Debug.Log("file error");
				}
			}
			this.table.AddRow(column[0], rowDict);
		}

	}


	public string GetValue(string rowHead, string ColumnHead)
	{
		if (this.table != null)
			return this.table.GetVaule (rowHead, ColumnHead);
		else 
			return null;
	}

}
