using UnityEngine;
using System.Collections;

public class TController : MonoBehaviour
{
	public IState curState{ get; private set; }

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		curState.Execute (this);
	}

	public void ChangeState(IState newState)
	{
		curState = newState;
	}
}
