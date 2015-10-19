using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System;

public enum ProgressbarTypes
{
    Determinate = 0,
    Indeterminate = 1,
}

public enum ProgressbarTextTypes
{
    None = 0,
    Percent = 1,
    Range = 2,
}

public enum ProgressbarDirection
{
    Horizontal = 0,
    Vertical = 1,
}

public class Progressbar : MonoBehaviour
{
    [SerializeField]
    public Text textContent;
    public RectTransform filler;
    public RectTransform fillSlot;
    [SerializeField]
    public GameObject determinateBar;
    [SerializeField]
    public GameObject indeterminateBar;
    [SerializeField]
    public RawImage indeterminateImage;

    [SerializeField]
    public float speed = 0.1f;
    [SerializeField]
    public int max = 100;

    [SerializeField]
    private int _value;
    [SerializeField]
    private ProgressbarDirection _direction = ProgressbarDirection.Horizontal;
    [SerializeField]
    private ProgressbarTypes _type = ProgressbarTypes.Determinate;
    [SerializeField]
    private ProgressbarTextTypes _textType = ProgressbarTextTypes.None;

    Func<Progressbar, string> textFunc = TextPercent;
    IEnumerator currentAnimation;

    [SerializeField]
    public ProgressbarTextTypes TextType
    {
        get
        {
            return _textType;
        }
        set
        {
            _textType = value;
            ToggleTextType();
        }
    }

    public int Value
    {
        get
        {
            return _value;
        }
        set
        {
            if (value > max)
            {
                value = max;
            }
            _value = value;
            UpdateProgressbar();
        }
    }

    public ProgressbarTypes Type
    {
        get
        {
            return _type;
        }
        set
        {
            _type = value;
            ToggleType();
        }
    }

    public bool IsAnimationRun
    {
        get;
        protected set;
    }


    public void Play(int? targetValue = null)
    {
        if (currentAnimation != null)
        {
            StopCoroutine(currentAnimation);
        }

        if (Type == ProgressbarTypes.Indeterminate)
        {
            currentAnimation = IndeterminateAnimation();
        }
        else
        {
            currentAnimation = DeterminateAnimation(targetValue ?? max);
        }
        IsAnimationRun = true;
        StartCoroutine(currentAnimation);
    }

    public void Stop()
    {
        if (IsAnimationRun)
        {
            StopCoroutine(currentAnimation);
            IsAnimationRun = false;
        }
    }

    public void Refresh()
    {
        ToggleType();
        ToggleTextType();
        UpdateProgressbar();
    }

    IEnumerator DeterminateAnimation(int targetValue)
    {
        if (targetValue > max)
        {
            targetValue = max;
        }

        var delta = targetValue - Value;
        if (delta != 0)
        {
            while (true)
            {
                if (delta > 0)
                {
                    _value += 1;
                }
                else
                {
                    _value -= 1;
                }
                UpdateProgressbar();
                if (_value == targetValue)
                {
                    break;
                }

                yield return new WaitForSeconds(speed);
            }
        }
        IsAnimationRun = false;
    }


    IEnumerator IndeterminateAnimation()
    {
        while (true)
        {
            var r = indeterminateImage.uvRect;
            if (_direction == ProgressbarDirection.Horizontal)
            {
                r.x = (Time.time * speed) % 1;
            }
            else
            {
                r.y = (Time.time * speed) % 1;
            }
            indeterminateImage.uvRect = r;
            yield return null;
        } 
    }


    void UpdateProgressbar()
    {
        if ((filler != null) && (fillSlot != null))
        {
            var range = (float)Value / (float)max;

            filler.sizeDelta = (_direction == ProgressbarDirection.Horizontal)
                ? new Vector2(fillSlot.rect.width * range, fillSlot.rect.height)
                : new Vector2(fillSlot.rect.width, fillSlot.rect.height * range);
        }

        UpdateText();
    }

    void UpdateText()
    {
        var text = textFunc(this);
        if (textContent != null) textContent.text = text;
    }

    public static string TextPercent(Progressbar bar)
    {
        return string.Format("{0:P0}", (float)bar.Value / bar.max);
    }
    public static string TextRange(Progressbar bar)
    {
        return string.Format("{0} / {1}", bar.Value, bar.max);
    }
    public static string TextNone(Progressbar bar)
    {
        return string.Empty;
    }

    void ToggleType()
    {
        bool is_deterimate = (_type == ProgressbarTypes.Determinate);
        if (determinateBar != null) determinateBar.gameObject.SetActive(is_deterimate);
        if (indeterminateBar != null) indeterminateBar.gameObject.SetActive(!is_deterimate);
    }

    void ToggleTextType()
    {
        if (TextType == ProgressbarTextTypes.None)
        {
            textFunc = TextNone;
            return;
        }
        if (TextType == ProgressbarTextTypes.Percent)
        {
            textFunc = TextPercent;
            return;
        }
        if (TextType == ProgressbarTextTypes.Range)
        {
            textFunc = TextRange;
            return;
        }
    }
}
