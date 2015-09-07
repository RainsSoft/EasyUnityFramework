using UnityEngine;
using System.Collections;
using System;

public class MathUtil
{
    /// <summary>
    /// 判断两条直线是否相交.
    /// </summary>
    public bool lineIntersectLine(Vector2 start1, Vector2 end1, Vector2 start2, Vector2 end2)
    {
        float s1_x, s1_y, s2_x, s2_y;
        s1_x = end1.x - start1.x;
        s1_y = end1.y - start1.y;

        s2_x = end2.x - start2.x;
        s2_y = end2.y - start2.y;

        var s = (-s1_y * (start1.x - start2.x) + s1_x * (start1.y - start2.y)) / (-s2_x * s1_y + s1_x * s2_y);
        var t = (s2_x * (start1.y - start2.y) - s2_y * (start1.x - start2.x)) / (-s2_x * s1_y + s1_x * s2_y);

        return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
    }

    /// <summary>
    /// 判断直线和圆是否相交.
    /// </summary>
    public bool LineIntersectCircle(Vector2 start, Vector2 end, Vector2 circlePoint, float circleRadius)
    {
        var squaredDistance = PointToLineDistanceSqr(circlePoint, start, end);
        return circleRadius * circleRadius >= squaredDistance;
    }

    /// <summary>
    /// 判断直线是否和矩形相交
    /// </summary>
    public bool LineIntersectRect(Vector2 start, Vector2 end, Rect rect)
    {
        var p1 = new Vector2(rect.x, rect.y);
        var p2 = new Vector2(rect.x + rect.width, rect.y);
        var p3 = new Vector2(rect.x + rect.width, rect.y + rect.height);
        var p4 = new Vector2(rect.x, rect.y + rect.height);

        Vector2[,] lines = new Vector2[4, 2]{
        {p1, p2},
        {p2, p3},
        {p3, p4},
        {p4, p1}};

        for (var i = 0; i < lines.Length; i++)
        {
            if (lineIntersectLine(start, end, lines[i, 0], lines[i, 1]))
                return true;
        }

        return false;
    }

    /// <summary>
    ///  计算点到直线的距离的平方.
    /// </summary>
    public float PointToLineDistanceSqr(Vector2 point, Vector2 start, Vector2 end)
    {
        float l2 = DistanceSqr(start, end);
        if (l2 == 0) return DistanceSqr(point, start);
        var t = ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / l2;
        if (t < 0) return DistanceSqr(point, start);
        if (t > 1) return DistanceSqr(point, end);
        return this.DistanceSqr(point, new Vector2(
            (start.x + t * (end.x - start.x)),
            (start.y + t * (end.y - start.y))
            ));
    }

    /// <summary>
    /// 两点距离的平方
    /// </summary>
    public float DistanceSqr(Vector2 one, Vector2 two)
    {
        float distance = Vector2.Distance(one, two);
        return distance * distance;
    }

    /// <summary>
    /// 获取一条线的角度
    /// </summary>
    public double AngleOfLine(Vector2 start, Vector2 end)
    {
        var x = end.x - start.x;
        var y = end.y - start.y;
        if (x == 0)
        {
            return y > 0 ? 0 : 180;
        }
        var flat = (x > 0 ? 1 : -1);
        var rads = Math.Acos(y / Math.Sqrt(x * x + y * y));
        var degree = flat * RadianToDegree(rads);
        if (degree < 0)
        {
            degree += 360;
        }
        return degree;
    }

    /// <summary>
    /// 两条线之间的角度
    /// </summary>
    public double AngleBetweenLines(Vector2 start1, Vector2 end1, Vector2 start2, Vector2 end2)
    {
        var a = end1.x - start1.x;
        var b = end1.y - start1.y;
        var c = end2.x - start2.x;
        var d = end2.y - start2.y;

        if ((a == 0 && b == 0) || (c == 0 && d == 0))
        {
            return 0;
        }

        var rads = Math.Acos(((a * c) + (b * d)) / ((Math.Sqrt(a * a + b * b)) * (Math.Sqrt(c * c + d * d))));
        return RadianToDegree(rads);
    }

    public Vector2 PointWithAngle(Vector2 point, float distance, float angle)
    {
        var radian = angle * Math.PI / 180;
        var deltaX = Math.Sin(radian) * distance;
        var deltaY = Math.Cos(radian) * distance;
        Vector2 dest = new Vector2((float)(point.x + deltaX), (float)(point.y + deltaY));
        return dest;
    }
    public double RadianToDegree(double radian)
    {
        return radian * (180 / Math.PI);
    }
}
