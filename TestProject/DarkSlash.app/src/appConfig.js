/**
* Created by yuan on 14-9-16.
*/
/// <reference path="vee.d.ts" />
/// <reference path="Manager/GameManager" />
var game = game = game || {};
var app;
(function (app) {
    var Config = (function () {
        function Config() {
        }
        Config.AppID = null;
        Config.AppName = "DarkSlash2cn";
        Config.AppAlias = "darkslash2cn";
        Config.AppURL = "";
	    Config.Platforms = {
		    IOS_APPSTORE    : 0,
		    AND_HEGAME      : 1,
		    AND_UNIPLAY     : 2,
		    AND_EGAME       : 3,
		    AND_EGAMEOUT    : 4,
		    AND_MM          : 5,
		    AND_ZPLAY       : 6,
		    AND_ZPLAYMM     : 7
	    };

	    Config.Platform = Config.Platforms.IOS_APPSTORE;

	    Config.getIAPPluginName = function() {
		    if (cc.sys.os == cc.sys.OS_IOS) {
			    return "IAPManager";
		    } else {
			    if (Config.Platform == Config.Platforms.AND_EGAME) {
				    Config.signature = "";
				    return "IAPEGame";
			    } else if (Config.Platform == Config.Platforms.AND_EGAMEOUT) {
				    Config.signature = "";
				    return "IAPEGame";
			    } else if (Config.Platform == Config.Platforms.AND_UNIPLAY) {
				    Config.signature = "";
				    return "IAPUniplay";
			    } else if (Config.Platform == Config.Platforms.AND_HEGAME) {
				    Config.signature = "";
				    return "IAPHeGame";
			    } else if (Config.Platform == Config.Platforms.AND_MM) {
				    return "IAPMM";
			    } else if (Config.Platform == Config.Platforms.AND_ZPLAY) {
				    return "IAPZplay";
			    } else if (Config.Platform == Config.Platforms.AND_ZPLAYMM) {
				    return "IAPZplayMM";
			    }
		    }
	    };
	    Config.IAPPluginName = Config.getIAPPluginName();
	    Config.ArrIAP = [
		    // Apple Store, idx = 0
		    {
			    NonConsumable: {
			    DoubleSouls: "com.veewo.dk2cn.doublesouls",
			    DoubleSoulsHalf: "com.veewo.dk2cn.doublesouls.sale",
			    HeroMystery: "com.veewo.dk2cn.hero.mystery",
			    HeroPaladin: "com.veewo.dk2cn.hero.paladin",
			    HeroSakura: "com.veewo.dk2cn.hero.sakura",
			    HeroPack: "com.veewo.dk2cn.heropack",
			    HeroPack2: "com.veewo.dk2cn.heropack2.sale"
		    },
			    Consumable: {
				    SoulPack1: "com.veewo.dk2cn.soulpack1",
				    SoulPack2: "com.veewo.dk2cn.soulpack2",
				    SoulPack3: "com.veewo.dk2cn.soulpack3",
				    SoulPack4: "com.veewo.dk2cn.soulpack4"
			    }
		    },
		    // HeGame, idx = 1
		    {
			    NonConsumable: {
				    DoubleSouls: "009",
				    DoubleSoulsHalf: "010",
				    HeroMystery: "007",
				    HeroPaladin: "006",
				    HeroSakura: "006",
				    HeroPack: "008",
				    HeroPack2: "011"
			    },
			    Consumable: {
				    SoulPack0: "001",
				    SoulPack1: "002",
				    SoulPack2: "003",
				    SoulPack3: "004",
				    SoulPack4: "005"
			    }
		    },
		    // Uniplay, idx = 2
		    {
			    NonConsumable: {
				    DoubleSouls: "009",
				    DoubleSoulsHalf: "010",
				    HeroMystery: "007",
				    HeroPaladin: "006",
				    HeroSakura: "006",
				    HeroPack: "008",
				    HeroPack2: "011"
			    },
			    Consumable: {
				    SoulPack0: "001",
				    SoulPack1: "002",
				    SoulPack2: "003",
				    SoulPack3: "004",
				    SoulPack4: "005"
			    }
		    },
		    // EGame, idx = 3
		    {
			    NonConsumable: {
				    DoubleSouls: "5123139",
				    DoubleSoulsHalf: "5123140",
				    HeroMystery: "5123137",
				    HeroPaladin: "5123136",
				    HeroSakura: "5123136",
				    HeroPack: "5123138",
				    HeroPack2: "5123141"
			    },
			    Consumable: {
				    SoulPack0: "5123131",
				    SoulPack1: "5123132",
				    SoulPack2: "5123133",
				    SoulPack3: "5123134",
				    SoulPack4: "5123135"
			    }
		    },
		    // EGameOut, idx = 4
		    {
			    NonConsumable: {
				    DoubleSouls: "5118356",
				    DoubleSoulsHalf: "5118357",
				    HeroMystery: "5118354",
				    HeroPaladin: "5118353",
				    HeroSakura: "5118353",
				    HeroPack: "5118355",
				    HeroPack2: "5118358"
			    },
			    Consumable: {
				    SoulPack0: "5118348",
				    SoulPack1: "5118349",
				    SoulPack2: "5118350",
				    SoulPack3: "5118351",
				    SoulPack4: "5118352"
			    }
		    },
		    // MM idx = 5
		    {
			    NonConsumable: {
				    DoubleSouls: "30000887645209",
				    DoubleSoulsHalf: "30000887645210",
				    HeroMystery: "30000887645207",
				    HeroPaladin: "30000887645206",
				    HeroSakura: "30000887645206",
				    HeroPack: "30000887645208",
				    HeroPack2: "30000887645211"
			    },
			    Consumable: {
				    SoulPack0: "30000887645201",
				    SoulPack1: "30000887645202",
				    SoulPack2: "30000887645203",
				    SoulPack3: "30000887645204",
				    SoulPack4: "30000887645205"
			    }
		    },
		    // Zplay idx = 6
		    {
			    NonConsumable: {
				    DoubleSouls: "zplay03400100902",
				    DoubleSoulsHalf: "zplay03400101002",
				    HeroMystery: "zplay03400100702",
				    HeroPaladin: "zplay03400100602",
				    HeroSakura: "zplay03400100602",
				    HeroPack: "zplay03400100802",
				    HeroPack2: "zplay03400101102"
			    },
			    Consumable: {
				    SoulPack0: "zplay03400100103",
				    SoulPack1: "zplay03400100203",
				    SoulPack2: "zplay03400100303",
				    SoulPack3: "zplay03400100403",
				    SoulPack4: "zplay03400100503"
			    }
		    },
		    // ZplayMM idx = 7
		    {
			    NonConsumable: {
				    DoubleSouls: "zplay03400100902",
				    DoubleSoulsHalf: "zplay03400101002",
				    HeroMystery: "zplay03400100702",
				    HeroPaladin: "zplay03400100602",
				    HeroSakura: "zplay03400100602",
				    HeroPack: "zplay03400100802",
				    HeroPack2: "zplay03400101102"
			    },
			    Consumable: {
				    SoulPack0: "zplay03400100103",
				    SoulPack1: "zplay03400100203",
				    SoulPack2: "zplay03400100303",
				    SoulPack3: "zplay03400100403",
				    SoulPack4: "zplay03400100503"
			    }
		    }
	    ];
	    Config.getIAPs = function() {
		    return Config.ArrIAP[Config.Platform];
	    };

	    Config.getPrice = function (arrPrices) {
		    var idx = 1;
		    if (app.Config.Platform == app.Config.Platforms.IOS_APPSTORE) idx = 0;
		    return arrPrices[idx];
	    };

        Config.IAPs = Config.getIAPs();

        Config.LeaderboardIDs = [];

        Config.RateURL = null;

        Config.PromoURL = "http://www.veewo.com";

        Config.PromoChannel = "promo";

        Config.GameCenterPluginName = "SocialGameCenter";
        Config.GameCenterPluginConfig = {};

        Config.SharePluginName = "VeeShare";

        Config.AnalyticsPluginName = "AnalyticsTalkingGame";
        Config.AnalyticsConfig = "DD76227946250AFFC238150967F8116F"; //CBB5B6AB880DA4E27EE984295ADB8C1B

        Config.IAPConfig = {};

        Config.VideoAdPluginName = null;
        Config.VideoAdConfig = null;

        Config.AdBannerPluginName = "AdsMongo";
        Config.AdBannerPluginConfig = {
	        AdMongoID_iPhone: "8e45109f5ce3427699f0fd9b683fee55",
	        AdMongoID_iPad: "a39fdcde6df445e9bccce5f487314795"
        };

	    Config.PromoBannerEnable = false;
	    Config.PromoFullScreenEnable = false;

        Config.AdInterstialPluginName = null;
        Config.AdInterstialPluginCoinfig = {
        };

        Config.IsBannerEnabled = true;
        Config.IsInterestialEnabled = true;

        Config.AchievementIDs = {
            ACH_THIS_IS_DARK_SLASH: '',
            ACH_MAY_PEACE_WITH_YOU: '',
            ACH_WATER_IS_COMING: '',
            ACH_BURNING_YOUR_SOUL: '',
            ACH_ITS_THE_END: ''
        };
        return Config;
    })();
    app.Config = Config;

    var iOS = (function () {
        function iOS() {
        }
        iOS.AppID = "954187872";
        iOS.AnalyticsPluginName = "AnalyticsTalkingGame";
        iOS.AnalysticsPluginConfig = "DD76227946250AFFC238150967F8116F"; //CBB5B6AB880DA4E27EE984295ADB8C1B
        iOS.IAPConfig = {};
        iOS.LeaderboardIDs = [
            "com.veewo.dk2cn.rank"
        ];
	    iOS.AdBannerPluginName = "AdsMongo";
	    iOS.AdBannerPluginConfig = {
		    AdMongoID_iPhone: "8e45109f5ce3427699f0fd9b683fee55",
		    AdMongoID_iPad: "a39fdcde6df445e9bccce5f487314795"
	    };
        return iOS;
    })();

    var android = (function () {
        function android() {
        }
        android.AppID = "com.veewo.darkslash2";
        android.AppDefaultClass = "com/zplay/VeeCommon/VeeCommon";
        android.IAPConfig = {
            "IAPID": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs0wXguyrRymDjBpbRCm3EmrqJz4yHjJk6AI3mcE6CXcYdNeg26b+ONi/IrNfkniw01YsfV18n/Cl8yAw4QYsWqCZ+V37Z4b6GU7JpKIt/PdyGyM5MZzGzJ+QI/O3rJcmb20QZF8iRPHtakEObaEy0MiFEfFFBBl2xT7z2HUu1JuPCEF6V0oPm3JFq85+HXVbQgGHLsRg4tDRaAEqF1Xtx/ybvxuwcEEvxB4bmEeNp1VBEM5x0kZa0/EcqgsWxhjpBfnd4Wq/Jxn/I7AWgtVDXDL57F+wPphRwPwxRDnF8zq4cnHRPUBJwbc+HoMr6NRgPTDB6UYf3aS3V4k29mLBhQIDAQAB"
        };

        android.LeaderboardIDs = ["CgkI_umkh48MEAIQAQ"];

        android.AdInterstialPluginName = "AdsGoogle";
        android.AdInterstialPluginCoinfig = {
            AppGoogleBannerId: "ca-app-pub-4272718464439486/9284417252",
            AppGoogleInterstialId: "ca-app-pub-4272718464439486/1761150457"
        };

        android.IsBannerEnabled = false;
        android.IsInterestialEnabled = true;

        android.AnalyticsPluginName = "AnalyticsTalkingGame";
        android.AnalysticsPluginConfig = "DD76227946250AFFC238150967F8116F"; //CBB5B6AB880DA4E27EE984295ADB8C1B

        android.AchievementIDs = {
            ACH_THIS_IS_DARK_SLASH: 'CgkI_umkh48MEAIQAA',
            ACH_MAY_PEACE_WITH_YOU: 'CgkI_umkh48MEAIQAw',
            ACH_WATER_IS_COMING: 'CgkI_umkh48MEAIQBA',
            ACH_BURNING_YOUR_SOUL: 'CgkI_umkh48MEAIQBQ',
            ACH_ITS_THE_END: 'CgkI_umkh48MEAIQBg'
        };
        return android;
    })();

    function init(isFirstPlay) {
        var config = vee.Utils.getObjByPlatform(iOS, android, {});
        for (var i in config) {
            if (config.hasOwnProperty(i)) {
                Config[i] = config[i];
            }
        }

        if (isFirstPlay) {
            vee.saveData();
        }
        // add your app launch code here
    }
    app.init = init;

    function leave(argument) {
        //will resign focus , save data here
    }
    app.leave = leave;

    function resume(argument) {
        //activated from background
        if (GameManager.getInstance()._gameState === 0 /* PLAY */) {
            vee.Utils.scheduleOnce(function () {
                GameManager.getInstance().gamePause();
            }, 0.2);
        }
    }
    app.resume = resume;
})(app || (app = {}));
