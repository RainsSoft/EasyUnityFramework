using UnityEngine;
using System.Collections;

[ExecuteInEditMode]
public class TweenTest : MonoBehaviour
{
    public AnimationCurve curve = new AnimationCurve();
    public GameObject go;

    public Vector3 point0;
    public Vector3 point1;
    public Vector3 point2;
    public Vector3 point3;
    public Vector3 point4;
	// Use this for initialization
	void Print () 
    {
        for(int i = 0; i < curve.keys.Length; i++)
        {
            Debug.Log("key [" + i + "]:");
            Debug.Log("time:" + curve.keys[i].time);
            Debug.Log("value:" + curve.keys[i].value);
            Debug.Log("inTangent:" + curve.keys[i].inTangent);
            Debug.Log("outTangent:" + curve.keys[i].outTangent);
            Debug.Log("tangentMode:" + curve.keys[i].tangentMode);
            Debug.Log(" ");
        }
	}


    
    void Start()
    {
        Keyframe[] ks = new Keyframe[3];
        ks[0] = new Keyframe(0, 0);
        ks[0].outTangent = 80;
        ks[1] = new Keyframe(1, 1);
        ks[1].inTangent = 0;

      //ks[2] = new Keyframe(8, 0);
      //ks[2].inTangent = 90;
        
        curve = new AnimationCurve(ks);
        curve.postWrapMode = WrapMode.PingPong;


    }

    void Update()
    {
        transform.position = new Vector3(0, curve.Evaluate(Time.time), 0);
    }


    void OnDrawGizmos()
    {
        Vector3 pointInterp = Vector3.zero;

        //pointInterp = MathAssist.BasicCurve(point0, point1, Time.time);
        Vector3[] points = new Vector3[] { point0, point1, point2, point3, point4 };
        pointInterp = MathAssist.GeneralBezierEvaluate(points, Time.time);
        Gizmos.color = Color.red;
        Gizmos.DrawLine(point0, pointInterp);
        //var rGo = GameObject.Instantiate(go);
       // rGo.transform.localPosition = pointInterp;
        
    }
}
