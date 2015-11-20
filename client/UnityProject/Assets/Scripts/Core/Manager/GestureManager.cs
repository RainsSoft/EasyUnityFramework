using UnityEngine;
using System.Collections;
using UnityEngine.Events;

public class GestureManager : MonoBehaviour
{
    public delegate void onBegin();
    public delegate void onEnd();

    /// <summary>
    /// Tap 手势: 手势结束点与手势起始点50个屏幕坐标范围内的点击事件
    /// </summary>
    /// <param name="distance">tap点与手势起始点的距离</param>
    public delegate void onTap(float distance);

    /// <summary>
    /// Move 手势: 移动中....
    /// </summary>
    /// <param name="offset"> 与上一个Move的偏移值</param>
    public delegate void onMove(Vector2 offset);

    /// <summary>
    /// Drag 手势: 拖拽中....
    /// </summary>
    /// <param name="offset"> 与手势起始点的偏移</param>
    public delegate void onDrag(Vector2 offset);

    /// <summary>
    /// Swap 手势: 手势结束点与手势起始点50个屏幕坐标范围以上且滑动速度超过0.5个时间单位的点击事件
    /// </summary>
    /// <param name="angle">滑动形成的线条的顺时针角度</param>
    /// <param name="distance">滑动距离</param>
    public delegate void onSwipe(double angle, float distance);

    public event onBegin OnGestureBegin;
    public event onEnd OnGestureEnd;
    public event onTap OnGestureTap;
    public event onMove OnGestureMove;
    public event onDrag OnGestureDrag;
    public event onSwipe OnGestureSwipe;

    public Vector2 LastPoint
    {
        get { return lastPoint; }
    }

    public Vector2 BeginPoint
    {
        get { return beginPoint; }
    }

    bool useTouch;
    bool useMouse;
    Vector2 beginPoint;
    Vector2 lastPoint;
    float timeBegin;

    void Awake()
    {
        if (Application.platform == RuntimePlatform.Android || 
            Application.platform == RuntimePlatform.IPhonePlayer)
        {
            useTouch = true;
            useMouse = false;
        }
        else
        {
            useMouse = true;
            useTouch = false;
        }
    }

    void Update()
    {
        if (useTouch) ProcessTouches ();
		else if (useMouse) ProcessMouse();
    }

    void ProcessTouches()
    {
        if (Input.touchCount <= 0) return;
        var touch = Input.GetTouch(0);
        var pos = new Vector2(touch.position.x, touch.position.y);
        switch (touch.phase)
        {
            case TouchPhase.Began:
                HandleTouchBegin(pos);
                break;
            case TouchPhase.Moved:
                HandleTouchMove(pos);
                break;
            case TouchPhase.Ended:
                HandleTouchEnd(pos);
                break;
            case TouchPhase.Canceled:
                HandleTouchEnd(pos);
                break;
        }
    }

    void ProcessMouse()
    {
        if (Input.GetMouseButtonDown(0))
        {
            var pos = new Vector2(Input.mousePosition.x, Input.mousePosition.y);
            HandleTouchBegin(pos);
        }
        else if (Input.GetMouseButton(0))
        {
            var pos = new Vector2(Input.mousePosition.x, Input.mousePosition.y);
            HandleTouchMove(pos);
        }
        else if (Input.GetMouseButtonUp(0))
        {
            var pos = new Vector2(Input.mousePosition.x, Input.mousePosition.y);
            HandleTouchEnd(pos);
        }
    }

    public void HandleGestureTap(float distance)
    {
        if (OnGestureTap == null) return;
        OnGestureTap.Invoke(distance);
    }

    public void HandleGestureMove(Vector2 point)
    {
        if (OnGestureMove == null) return;
        var offset = new Vector2(point.x - lastPoint.x, point.y - lastPoint.y);
        OnGestureMove.Invoke(offset);
    }

    public void HandleGestureDrag(Vector2 point)
    {
        if (OnGestureDrag == null) return;
        var offset = new Vector2(point.x - beginPoint.x, point.y - beginPoint.y);
        OnGestureDrag.Invoke(offset);
    }

    public void HandleGestureSwipe(Vector2 point, float distance)
    {
        if (OnGestureSwipe == null) return;
        var angle = MathAssist.AngleOfLine(beginPoint, point);
        OnGestureSwipe.Invoke(angle, distance);
    }

    public void HandleGestureBegin()
    {
        if (OnGestureBegin == null) return;
        OnGestureBegin.Invoke();
    }

    public void HandleGestureEnd()
    {
        if (OnGestureEnd == null) return;
        OnGestureEnd.Invoke();
    }


    void HandleTouchBegin(Vector2 position)
    {
        beginPoint = position;
        lastPoint = beginPoint;
        timeBegin = Time.realtimeSinceStartup;
        HandleGestureBegin();
    }

    void HandleTouchMove(Vector2 position)
    {
        HandleGestureMove(position);
        HandleGestureDrag(position);
        lastPoint = position;
    }

    void HandleTouchEnd(Vector2 position)
    {
        HandleGestureMove(position);
        HandleGestureDrag(position);

        var distance = Vector2.Distance(beginPoint, position);
        if (distance < 50)
            HandleGestureTap(distance);
        else if (distance >= 50 && (distance / GetGestureDuration() > 0.5))
            HandleGestureSwipe(position, distance);
        HandleGestureEnd();
    }

    float GetGestureDuration()
    {
        return Time.realtimeSinceStartup - timeBegin;
    }

}
