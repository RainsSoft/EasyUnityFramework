using UnityEngine;
using System.Collections;

public interface IState
{
	void Execute(TController tc);
}
