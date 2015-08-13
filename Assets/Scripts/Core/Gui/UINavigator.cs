using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using DG.Tweening;


public class UINavigator : MonoBehaviour
{
    public enum TopNavigatorType
    {
        Not,
        Title,
        Info,
    }

    public RectTransform panelTopBarInfo = null;
    public RectTransform panelTopBarTitle = null;
    public RectTransform panelBottomBar = null;

    public Button btnBack = null;
    public Button btnSetting = null;
    public Button btnSettingOnInfo = null;
    public Button btnClose = null;
    public Button btnSupport = null;
    public Button btnRoleInfo = null;
    public Button btnMap = null;

    public Text texTitle = null;

    public Image imgWave1 = null;
    public Image imgWave2 = null;
    public Image imgHealthPoint = null;
    public Image imgStamina = null;

    private TopNavigatorType topNavTypeCur = TopNavigatorType.Not;
    private bool isBottomShow = false;

    private CanvasGroup cgTopBarInfo = null;
    private CanvasGroup cgTopBarTitle = null;
    private CanvasGroup cgBottomBar = null;

    private Tween twnText = null;

    private float speed = -10f;
    private float length;
    private float staminaMax = 1000f;

    private void Awake()
    {
        btnBack.onClick.AddListener(OnBack);
        btnSetting.onClick.AddListener(OnSetting);
        btnSettingOnInfo.onClick.AddListener(OnSetting);
        btnClose.onClick.AddListener(OnClose);
        btnSupport.onClick.AddListener(OnSupport);
        btnRoleInfo.onClick.AddListener(OnRoleInfo);
        btnMap.onClick.AddListener(OnMap);


        this.cgTopBarInfo = this.panelTopBarInfo.gameObject.AddComponent<CanvasGroup>();
        this.cgTopBarTitle = this.panelTopBarTitle.gameObject.AddComponent<CanvasGroup>();
        this.cgBottomBar = this.panelBottomBar.gameObject.AddComponent<CanvasGroup>();
    } 
    
    private void Start()
    {
        this.twnText = this.texTitle.DOFade(0.0f, AppConst.TweenAnimationDuration).SetLoops(-1, LoopType.Yoyo).Pause();
    }

    void FixedUpdate()
    {  
        UpdatePicPosition(imgWave1);
        UpdatePicPosition(imgWave2);
    }

    public void UseTitleNavigator(string title, bool isNeedBottom = true)
    {
        if (this.texTitle.text != title)
            this.texTitle.text = title;

        if(this.isBottomShow != isNeedBottom)
        {
            if (isNeedBottom)
                this.ShowBottomNavigator(false);
            else
                this.UnShowBottomNavigator();
            this.isBottomShow = isNeedBottom;
        }

        if (!(this.topNavTypeCur == TopNavigatorType.Title))
        {
            this.ShowTopNavigator(TopNavigatorType.Title);
            this.topNavTypeCur = TopNavigatorType.Title;
        }
    }

    public void UseInfoNavigator(bool isNeedBottom = true)
    {
        if (this.isBottomShow != isNeedBottom)
        {
            if (isNeedBottom)
                this.ShowBottomNavigator(false);
            else
                this.UnShowBottomNavigator();
            this.isBottomShow = isNeedBottom;
        }

        if (!(this.topNavTypeCur == TopNavigatorType.Info))
        {
            this.ShowTopNavigator(TopNavigatorType.Info);
            this.topNavTypeCur = TopNavigatorType.Info;
        }
    }

    public void UseBottomNavigator()
    {
        if (!this.isBottomShow)
        {
            this.ShowBottomNavigator(true);
            this.isBottomShow = true;
        }

        if (!(this.topNavTypeCur == TopNavigatorType.Not))
        {
            this.ShowTopNavigator(TopNavigatorType.Not);
            this.topNavTypeCur = TopNavigatorType.Not;
        }
    }

    //当打开settingpanel 时隐藏 setting 按钮 当关闭settingpanel 时显示setting 按钮
    public void SetSettingBarShow()
    {
        this.btnSetting.gameObject.SetActive(!btnSetting.gameObject.activeSelf);
    }

    private void ShowTopNavigator(TopNavigatorType type)
    {
       
        if (type == TopNavigatorType.Title)
        {
            if (this.panelTopBarInfo.gameObject.activeSelf)
                this.panelTopBarInfo.gameObject.SetActive(false);

            if (!this.panelTopBarTitle.gameObject.activeSelf)
            {
                this.panelTopBarTitle.gameObject.SetActive(true);
                this.cgTopBarTitle.alpha = 0.0f;
                this.cgTopBarTitle.DOFade(1.0f, AppConst.TweenAnimationDuration);
            }

            if (this.twnText != null && !this.twnText.IsPlaying())
                this.twnText.Play();

            if (this.btnClose.gameObject.activeSelf)
                this.btnClose.gameObject.SetActive(false);
        }
        else if (type == TopNavigatorType.Info)
        {
            if (this.panelTopBarTitle.gameObject.activeSelf)
                this.panelTopBarTitle.gameObject.SetActive(false);

            if (!this.panelTopBarInfo.gameObject.activeSelf)
            {
                this.panelTopBarInfo.gameObject.SetActive(true);
                this.cgTopBarInfo.alpha = 0.0f;
                this.cgTopBarInfo.DOFade(1.0f, AppConst.TweenAnimationDuration);
            }

            if (this.twnText != null && this.twnText.IsPlaying())
                this.twnText.Pause();

            if (this.btnClose.gameObject.activeSelf)
                this.btnClose.gameObject.SetActive(false);

            InnitHealthInfo();//加载人物的信息
        }
        else if (type == TopNavigatorType.Not)
        {
            this.UnShowTopNavigator();

            if (this.twnText != null && this.twnText.IsPlaying())
                this.twnText.Pause();

            if (!this.btnClose.gameObject.activeSelf)
                this.btnClose.gameObject.SetActive(true);
        }
    }

    private void ShowBottomNavigator(bool bNeedClose)
    {
        this.panelBottomBar.gameObject.SetActive(true);
        this.cgBottomBar.alpha = 0.0f;
        this.cgBottomBar.DOFade(1.0f, AppConst.TweenAnimationDuration);
    }

    private void UnShowBottomNavigator()
    {
        if (this.panelBottomBar.gameObject.activeSelf)
            this.panelBottomBar.gameObject.SetActive(false);
    }

    private void UnShowTopNavigator()
    {
        if (this.panelTopBarTitle.gameObject.activeSelf)
            this.panelTopBarTitle.gameObject.SetActive(false);

        if (this.panelTopBarInfo.gameObject.activeSelf)
            this.panelTopBarInfo.gameObject.SetActive(false);
    }

    private void OnRoleInfo()
    {
    }

    private void OnBack() 
    {
        Facade.GetPanelManager().PopPanel();
    }

    private void OnClose() 
    {
        Application.Quit();
    }

    //健康信息波形图滚动的实现
    private void UpdatePicPosition(Image img)
    {   
        if(img != null)
        {
           //用差值运算来改变位置 第一个参数 是当前位置 第二个参数是用当前位置信息的x值加上（移动速度*时间间隔）的新的位置，第三个参数是差值运算的速度
           img.gameObject.GetComponent<RectTransform>().localPosition = Vector3.Lerp(img.gameObject.GetComponent<RectTransform>().localPosition, new Vector3   (img.gameObject.GetComponent<RectTransform>().localPosition.x + speed * Time.deltaTime, img.gameObject.GetComponent<RectTransform>().localPosition.y, img.gameObject.GetComponent<RectTransform>().localPosition.z), 5);
           Vector3 Postion = img.gameObject.GetComponent<RectTransform>().localPosition;
           if (Postion.x <= -length)
           {
              Postion.x = length;
              img.gameObject.GetComponent<RectTransform>().localPosition = Postion;
           }
        }
    }

    //初始化人物健康信息
    private void InnitHealthInfo()
    {   
        //获取子对象
      //  string objName = "ImageWave1";
      //  imgWave1 = Util.Get<Image>(this.gameObject, objName);
      //  objName = "ImageWave2";
      //  imgWave2 = Util.Get<Image>(this.gameObject, objName);
      //  objName = "ImageBar 2";
      //  imgHealthPoint = Util.Get<Image>(this.gameObject, objName);
      // objName = "ImageBar 6";
      //  imgStamina = Util.Get<Image>(this.gameObject, objName);

        //设置角色健康信息，以不同的颜色的图片对应不同阶段健康状况。
        float healthRate = 0f;
        float.TryParse(RuntimeData.RoleInfo.HealthPinot, out healthRate);
        healthRate = (healthRate / 1000f);//此处血量暂定1000

        string sName = "RoleInfo/";

        if (healthRate >= 0.75)
            sName += "ui_roleinfo_image1";
        else if (healthRate >= 0.5)
            sName += "ui_roleinfo_image1_green";
        else if (healthRate >= 0.25)
            sName += "ui_roleinfo_image1_yellow";
        else
            sName += "ui_roleinfo_image1_red";

        Facade.GetAssetLoadManager().LoadSprite(sName, (sp) =>
        {
            if (sp != null) imgHealthPoint.sprite = sp;
        });
        length = imgWave1.transform.GetComponent<RectTransform>().rect.width; //获取滚动图片的宽度

        //疲劳度 
        float stamina = 0.0f;
        float.TryParse(RuntimeData.RoleInfo.Stamina, out stamina);
        float ImgStaminaWidth = this.imgStamina.preferredWidth;
        if (staminaMax > stamina && stamina >= 0)
        {
            imgStamina.rectTransform.SetPositionX(-((staminaMax - stamina) / staminaMax) * ImgStaminaWidth);
        }
        else if (staminaMax == stamina)
        {
            imgStamina.rectTransform.SetPositionX(0);
        }
    }

    private void OnMap() { }
    private void OnSetting() 
    {
        //Facade.GetPanelManager().EnterPanel(typeof(SettingPanel)); 
    }
    private void OnSupport() 
    {
    }
}
