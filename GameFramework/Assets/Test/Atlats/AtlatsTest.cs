using UnityEngine;
using System.Collections;
using UnityEngine.UI;
public class AtlatsTest : MonoBehaviour
{
    public Image i1;
    public Image i2;
    public Image i3;
    public Image i4;
    Sprite s1;
    Sprite s2;
    Sprite s3;
    Sprite s4;

    public void UseImage()
    {
        //assetbundle
        loadSprite("i0", i1);
        loadSprite("i1", i2);
        loadSprite("i2", i3);
        loadSprite("i3", i4);

        //not assetbundle
        //s2 = loadSprite("i1");
        //s3 = loadSprite("i2");
        //s4 = loadSprite("i3");

        //i1.sprite = s1;
        //i1.SetNativeSize();
        //i2.sprite = s2;
        //i2.SetNativeSize();
        //i3.sprite = s3;
        //i3.SetNativeSize();
        //i4.sprite = s4;
        //i4.SetNativeSize();
    }

    private void loadSprite(string spriteName, Image x)
    {
        //assetbundle 
        Facade.GetAssetLoadManager().LoadSprite(spriteName, (s) =>
        {
            x.sprite = s;
        });
        //not assetbundle
        //return Resources.Load<Sprite>(spriteName);
    }
}
