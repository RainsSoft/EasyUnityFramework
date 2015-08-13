using UnityEngine;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine.Events;
using System;
using System.Linq;

/// <summary>
/// 页签对象
/// </summary>
[Serializable]
public class Tab
{
    public string Name;
    public GameObject TabObject;
}

public class Tabs : MonoBehaviour
{
    /// <summary>
    /// Header容器节点
    /// </summary>
    public Transform containerHeader = null;

    /// <summary>
    /// 激活状态下的Button
    /// </summary>
    public Button activeTabButton = null;

    /// <summary>
    /// 正常状态下的Button
    /// </summary>
    public Button defaultTabButton = null;
    
    /// <summary>
    /// 页容器
    /// </summary>
    [SerializeField]
    protected Tab[] tabObjects = new Tab[] { };

    /// <summary>
    /// 当前页索引
    /// </summary>
    protected int indexLast = -1;

    /// <summary>
    /// 正常状态下的Button容器
    /// </summary>
    protected List<Button> defaultButtons = new List<Button>();

    /// <summary>
    /// 激活状态下的Button容器
    /// </summary>
    protected List<Button> activeButtons = new List<Button>();

    /// <summary>
    /// Button的Handle容器
    /// </summary>
    protected List<UnityAction> callbacks = new List<UnityAction>();

    /// <summary>
    /// [扩展项] 初始化页签按钮设置
    /// </summary>
    protected virtual void InitButton(Button button, int index)
    {
        button.gameObject.SetActive(true);
        var text = button.GetComponentInChildren<Text>();
        if (text) text.text = tabObjects[index].Name;
    }

    /// <summary>
    /// [扩展项] 页签选择方法
    /// </summary> 
    protected virtual void OnSelectTab(string tabName)
    {
        var index = Array.FindIndex(tabObjects, x => x.Name == tabName);
        if (index == -1)
        {
            throw new ArgumentException(string.Format("Tab with name \"{0}\" not found.", tabName));
        }

        tabObjects.ForEach(x => x.TabObject.SetActive(false));
        tabObjects[index].TabObject.SetActive(true);

        defaultButtons.ForEach(x => x.gameObject.SetActive(true));
        defaultButtons[index].gameObject.SetActive(false);

        activeButtons.ForEach(x => x.gameObject.SetActive(false));
        activeButtons[index].gameObject.SetActive(true);
        indexLast = index;
    }
    
    /// <summary>
    /// [扩展项] 被唤醒
    /// </summary> 
    public virtual void Awake()
    {
        if (containerHeader == null)
        {
            throw new NullReferenceException("containerHeader is null. Set object of type GameObject to containerHeader.");
        }
        if (defaultTabButton == null)
        {
            throw new NullReferenceException("DefaultTabButton is null. Set object of type GameObject to DefaultTabButton.");
        }
        if (activeTabButton == null)
        {
            throw new NullReferenceException("ActiveTabButton is null. Set object of type GameObject to ActiveTabButton.");
        }
        defaultTabButton.gameObject.SetActive(false);
        activeTabButton.gameObject.SetActive(false);

        this.UpdateButtons();
    }    

    void UpdateButtons()
    {
        if (tabObjects.Length == 0)
        {
            throw new ArgumentException("TabObjects array is empty. Fill it.");
        }

        defaultButtons.ForEach((x, index) => x.onClick.RemoveListener(callbacks[index]));
        callbacks.Clear();

        CreateButtons();

        tabObjects.ToList().ForEach((x, index) =>
        {
            var tabName = x.Name;
            UnityAction callback = () => OnSelectTab(tabName);
            callbacks.Add(callback);

            defaultButtons[index].onClick.AddListener(callbacks[index]);

        });

        this.indexLast = 0;
        this.OnSelectTab(tabObjects[0].Name);
    }

    //生成button集
    void CreateButtons()
    {
        //实例化
        if (tabObjects.Length > defaultButtons.Count)
        {
            for (var i = defaultButtons.Count; i < tabObjects.Length; i++)
            {
                var defaultButton = Instantiate(this.defaultTabButton) as Button;
                defaultButton.transform.SetParent(this.containerHeader, false);
                Util.FixInstantiated(this.defaultTabButton, defaultButton);
                defaultButtons.Add(defaultButton);

                var activeButton = Instantiate(this.activeTabButton) as Button;
                activeButton.transform.SetParent(this.containerHeader, false);
                Util.FixInstantiated(this.activeTabButton, activeButton);
                activeButtons.Add(activeButton);
            }
        }

        //删除多余的
        if (tabObjects.Length < defaultButtons.Count)
        {
            for (var i = defaultButtons.Count; i > tabObjects.Length; i--)
            {
                Destroy(defaultButtons[i]);
                Destroy(activeButtons[i]);

                defaultButtons.RemoveAt(i);
                activeButtons.RemoveAt(i);
            }
        }

        //初始设置
        defaultButtons.ForEach(InitButton);
        activeButtons.ForEach(InitButton);
    }
}
