using UnityEngine;
using System.Collections;
using DG.Tweening;
public class PlayerController : MonoBehaviour
{

    Animator animator;
    GestureManager g;

    float attackRange = 1;
    float attackSpeed = 5;

    void Start()
    {
        animator = GetComponent<Animator>();
        g = GameObject.Find("BattleController").GetComponent<GestureManager>();
        g.OnGestureTap += OnGestureTap;
        g.OnGestureMove += OnGestureMove;

    }

    void OnGestureTap(float distance)
    {
        Vector2 start = Camera.main.WorldToScreenPoint(transform.position);
        Vector2 end = g.LastPoint;
        var angle = MathAssist.AngleOfLine(start, end);
        Attack(angle);
    }

    void OnGestureMove(Vector2 offset)
    {

    }


    void SetAttackAnimate(double angle)
    {
        var dir = (int)Mathf.Floor((float)(((360 + angle + 11.25) % 360) / 22.5));
        switch (dir)
        {
            case 0: //attack_up
                animator.SetInteger("Dir", 5);
                break;
            case 1: //attack_22_up
                break;
            case 2: //attack_45_up
                break;
            case 3: //attack_66_up
                break;
            case 4: //attack_right
                animator.SetInteger("Dir", 3);
                break;
            case 5: //attack_22_down
                break;
            case 6: //attack_45_down
                break;
            case 7: //attack_66_down
                break;
            case 8: //attack_down
                animator.SetInteger("Dir", 2);
                break;
            case 9: //attack_66_down
                break;
            case 10: //attack_45_down
                break;
            case 11: //attack_22_down
                break;
            case 12: //attack_left
                animator.SetInteger("Dir", 1);
                break;
            case 13: //attack_66_up
                break;
            case 14: //attack_45_up
                break;
            case 15: //attack_22_up
                break;
        }
    }

    void Attack(double angle)
    {
        var offectPos = MathAssist.PointWithAngle(Vector2.zero, attackRange, (float)angle);

        var attackDuration = Vector2.Distance(Vector2.zero, offectPos) / attackSpeed;

        var targetPos = offectPos + new Vector2(transform.position.x, transform.position.y);

        transform.DOLocalMove(targetPos, attackDuration).SetEase(Ease.OutExpo).OnComplete(() =>
        {
            animator.SetInteger("Dir", 0);
        });
        SetAttackAnimate(angle);
    }

    public void AttackEnd()
    {

    }

    public void Run()
    {

    }

    public void RunEnd()
    {

    }


    public enum Direction
    {
        Origin = 0,
        TopLeft = 1,
        Top = 2,
        TopRight = 3,
        Right = 4,
        BottomRight = 5,
        Bottom = 6,
        BottomLeft = 7,
        Left = 8,
    }
}