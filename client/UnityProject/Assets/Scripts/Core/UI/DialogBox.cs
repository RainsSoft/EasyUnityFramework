using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;
using System.Collections.Generic;
using System;

public class DialogBox : MonoBehaviour, ITemplatable
{
    [SerializeField]
    Button defaultButton;

    public Button DefaultButton
    {
        get { return defaultButton; }
        set { defaultButton = value; }
    }

    [SerializeField]
    Text titleText;

    public Text TitleText
    {
        get { return titleText; }
        set { titleText = value; }
    }

    [SerializeField]
    Text contentText;

    public Text ContentText
    {
        get { return contentText; }
        set { contentText = value; }
    }

    [SerializeField]
    Image dialogIcon;

    public Image Icon
    {
        get { return dialogIcon;  }
        set { dialogIcon = value; }
    }

    bool isTemplate = true;
    public bool IsTemplate 
    {
        get { return isTemplate; }
        set { isTemplate = value; }
    }

    public string TemplateName { get; set; }

    int? modalKey;
    Stack<Button> buttonsCache = new Stack<Button>();
    Dictionary<string, Button> buttonsInUse = new Dictionary<string, Button>();
    Dictionary<string, UnityAction> buttonsActions = new Dictionary<string, UnityAction>();
    public static UITemplates<DialogBox> Templates = new UITemplates<DialogBox>();

    /// <summary>
    ///  Show DialogBox
    /// </summary>
    public void Show(DialogActions buttons = null,
                     string title = null,
                     string message = null,
                     string focusButton = null,
                     Vector3? position = null,
                     Sprite icon = null,

                     bool modal = true,
                     Sprite modalSprite = null,
                     Color? modalColor = null,

                     Canvas canvas = null)
    {
        //setting default value
        if (position == null) position = new Vector3(0, 0, 0);
        if (modalColor == null) modalColor = new Color(0, 0, 0, 0.2f);
        if ((title != null) && (TitleText != null)) TitleText.text = title;
        if ((message != null) && (ContentText != null)) contentText.text = message;
        if ((icon != null) && (Icon != null)) Icon.sprite = icon;

        var parent = (canvas != null) ? canvas.transform : gate.MessageCanvas;

        transform.SetParent(parent, false);

        if (modal) modalKey = ModleLayer.Open(this, modalSprite, modalColor);
        else modalKey = null;


        transform.SetAsLastSibling();

        transform.localPosition = (Vector3)position;
        gameObject.SetActive(true);

        CreateButtons(buttons, focusButton);
    }

    /// <summary>
    /// Hide DialogBox
    /// </summary>
    public void Hide()
    {
        if (modalKey != null)
        {
            ModleLayer.Close((int)modalKey);
        }

        Return();
    }

    void CreateButtons(DialogActions buttons, string focusButton)
    {
        defaultButton.gameObject.SetActive(false);

        if (buttons == null)
        {
            return;
        }

        buttons.ForEach(x =>
        {
            var button = GetButton();

            UnityAction callback = () =>
            {
                if (x.Value())
                {
                    Hide();
                }
            };

            buttonsInUse.Add(x.Key, button);
            buttonsActions.Add(x.Key, callback);

            button.gameObject.SetActive(true);
            button.transform.SetAsLastSibling();

            var text = button.GetComponentInChildren<Text>();
            if (text)
            {
                text.text = x.Key;
            }

            button.onClick.AddListener(buttonsActions[x.Key]);

            if (x.Key == focusButton)
            {
                button.Select();
            }
        });
    }

    Button GetButton()
    {
        if (buttonsCache.Count > 0)
        {
            return buttonsCache.Pop();
        }

        var button = Instantiate(DefaultButton) as Button;

        Util.FixInstantiated(DefaultButton, button);
        button.transform.SetParent(DefaultButton.transform.parent, false);
        return button;
    }

    void Return()
    {
        Templates.ReturnCache(this);

        DeactivateButtons();
        ResetParametres();
    }

    void DeactivateButtons()
    {
        buttonsInUse.ForEach(x =>
        {
            x.Value.gameObject.SetActive(false);
            x.Value.onClick.RemoveListener(buttonsActions[x.Key]);
            buttonsCache.Push(x.Value);
        });

        buttonsInUse.Clear();
        buttonsActions.Clear();
    }

    void ResetParametres()
    {
        var template = Templates.Get(TemplateName);

        if ((TitleText != null) && (template.TitleText != null))
        {
            TitleText.text = template.TitleText.text;
        }
        if ((ContentText != null) && (template.ContentText != null))
        {
            ContentText.text = template.ContentText.text;
        }
        if ((Icon != null) && (template.Icon != null))
        {
            Icon.sprite = template.Icon.sprite;
        }
    }

    void Awake()
    {
        if (IsTemplate)
        {
            gameObject.SetActive(false);
        }
    }

    void OnDestroy()
    {
        if (!IsTemplate)
        {
            return;
        }

        if (TemplateName != null)
        {
            Templates.Delete(TemplateName);
        }
    }

    static public DialogBox Template(string template)
    {
        return Templates.Instance(template);
    }

    static public bool Close()
    {
        return true;
    }

#if UNITY_EDITOR
    [UnityEditor.MenuItem("GameObject/UI/Dialog Template")]
    static void CreateObject()
    {
        EditorExtends.CreateObject("Assets/OriginalRes/Prefabs/GUI/Widgets/DialogTemplate.prefab");
    }
#endif
}
