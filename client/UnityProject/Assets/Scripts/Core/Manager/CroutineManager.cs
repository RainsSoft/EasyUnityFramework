using UnityEngine;  
using System.Collections;
using UnityEngine.Events;

public class CroutineManager : MonoBehaviour
{
    public void Initialize() { }

    public Task StartTask(IEnumerator coroutine, bool autoStart = true, UnityAction finishedHandle = null)
    {
        var r = new Task(coroutine);
        r.FinishedHandle = finishedHandle;
        if (autoStart) r.Start();
        return new Task(coroutine);
    }  

	public class Task  
	{
        public bool Running { get { return running; } }

		public bool Paused { get { return paused; } }

        public bool Stopped { get { return stopped; } }

        public UnityAction FinishedHandle = null;

		IEnumerator coroutine;  
		bool running;  
		bool paused;  
		bool stopped;

        public Task(IEnumerator c)  
		{  
			coroutine = c;  
		}
		
		public void Pause()  
		{  
			paused = true;  
		}  
		
		public void Unpause()  
		{  
			paused = false;  
		}  
		
		public void Start()  
		{  
			running = true;
            gate.CroutineManager.StartCoroutine(CallWrapper());  
		}  
		
		public void Stop()  
		{  
			stopped = true;  
			running = false;  
		}  
		
		IEnumerator CallWrapper()  
		{  
			yield return null;  
			IEnumerator e = coroutine;  
			while(running)
            {  
				if(paused) 
                {
                    yield return null;  
                }
				else
                {  
					if(e != null && e.MoveNext())
                    {  
						yield return e.Current;  
					}  
					else 
                    {  
						running = false;  
					}  
				}  
			}

            if (FinishedHandle != null) FinishedHandle(); 
		}  
	}  
}  
