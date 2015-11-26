using UnityEngine;
using System.Collections;

public class FPSCounter
{
    public float current = 0.0f;

    public float updateInterval = 0.5f;

    float accum = 0; // FPS accumulated over the interval
    int frames = 100; // Frames drawn over the interval
    float timeleft; // Left time for current interval

    float delta;

    public FPSCounter()
    {
        timeleft = updateInterval;
    }

    public IEnumerator Update()
    {
        while (true)
        {
            delta = Time.deltaTime;

            timeleft -= delta;
            accum += Time.timeScale / delta;
            ++frames;

            // Interval ended - update GUI text and start new interval
            if (timeleft <= 0.0f)
            {
                // display two fractional digits (f2 format)
                current = accum / frames;
                timeleft = updateInterval;
                accum = 0.0f;
                frames = 0;
            }

            yield return null;
        }
    }
}