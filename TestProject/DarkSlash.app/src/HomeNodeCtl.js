/**
* Created by yuan on 14-8-26.
*/
/// <reference path="../vee.d.ts" />
/// <reference path="../helper" />
/// <reference path="../Manager/GameManager" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HomeNodeCtl = (function (_super) {
    __extends(HomeNodeCtl, _super);
    HomeNodeCtl["__ts"]=true;
    function HomeNodeCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    HomeNodeCtl.prototype.onDidLoadFromCCB = function () {

    };
    HomeNodeCtl.prototype.showGameServiceButton = function () {
//        this.btnRank.setBackgroundSpriteFrameForState(helper.getSpriteFrame("home/home_btn_google.png"), cc.CONTROL_STATE_NORMAL);
//        this.btnRank.setBackgroundSpriteFrameForState(helper.getSpriteFrame("home/home_btn_google_on.png"), cc.CONTROL_STATE_HIGHLIGHTED);
    };
	HomeNodeCtl.prototype.onLoaded = function() {
		if (cc.sys.os == cc.sys.ANDROID) {
			var isShowExchange = vee.Utils.launchAppById("zplay_showexchange");
			if (!isShowExchange) {
				this.btnExchange.setVisible(false);
			}
		}
		var isShowAnnounce = vee.Utils.launchAppById("zplay_showannounce");
		if (!isShowAnnounce) {
			this.btnVeewo.setVisible(false);
		}

		vee.Audio.playMusic("bgm_main.mp3");
		if (cc.sys.os === cc.sys.OS_IOS) {
			var scl9Nor = cc.Scale9Sprite.create("res/home_btn_rank.png");
			var scl9Sel = cc.Scale9Sprite.create("res/home_btn_rank_on.png");
			this.btnExchange.setBackgroundSpriteForState(scl9Nor, cc.CONTROL_STATE_NORMAL);
			this.btnExchange.setBackgroundSpriteForState(scl9Sel, cc.CONTROL_STATE_HIGHLIGHTED);
		}

		if (
			app.Config.Platform == app.Config.Platforms.AND_EGAME ||
			app.Config.Platform == app.Config.Platforms.AND_EGAMEOUT ||
			app.Config.Platform == app.Config.Platforms.AND_HEGAME
//			app.Config.Platform == app.Config.Platforms.AND_UNIPLAY
			)
		{
			this.nodeTopLeft.setVisible(true);
		} else {
			this.nodeTopLeft.setVisible(false);
		}

		if (app.Config.Platform == app.Config.Platforms.AND_EGAME) {
			this.btnRate.setVisible(true);
		} else {
			this.btnRate.setVisible(false);
		}

		this.handleKey(true);
		vee.PopMgr.setNodePos(this.nodeTopRight, vee.PopMgr.PositionType.TopRight);
		vee.PopMgr.setNodePos(this.nodeTopLeft, vee.PopMgr.PositionType.TopLeft);
		this.nodeTopRight.setPositionX(1070);
		this.playAnimate("New");
		if (DataManager.getInstance().isFirstAtHome()) {
			this.nodeTopRight.setVisible(false);
			DataManager.getInstance().setFirstAtHome();
		}
	};
    HomeNodeCtl.prototype.onPlayClicked = function () {
	    if (vee.data["helpHasShown"]) {
		    GameManager.getInstance().gameStart();
	    } else {
		    GameManager.getInstance().gameHelp(function () {
			    GameManager.getInstance().gameStart();
		    });
		    vee.data["helpHasShown"] = 1;
		    vee.saveData();
	    }
    };
    HomeNodeCtl.prototype.onRankClicked = function () {
        if (cc.sys.os === cc.sys.OS_IOS) {
            vee.GameCenter.showLeaderboard(0);
        } else {
            vee.PopMgr.popCCB("Google_play.ccbi", true);
        }
    };
    HomeNodeCtl.prototype.onRateClicked = function () {
	    if (app.Config.Platform == app.Config.Platforms.AND_EGAME || app.Config.Platform == app.Config.Platforms.AND_EGAMEOUT) {
		    VeeAbout.show();
	    } else {
		    vee.Utils.rateUs();
	    }
    };
    HomeNodeCtl.prototype.onVeewoClicked = function () {
        vee.Utils.launchAppById("zplay_announcement");
    };
    HomeNodeCtl.prototype.onShopClicked = function () {
        vee.PopMgr.popCCB("shop.ccbi", true);
    };
	HomeNodeCtl.prototype.onExchangeCode = function () {
		if (cc.sys.os === cc.sys.OS_IOS) {
			vee.GameCenter.showLeaderboard();
		} else {
			ExchangeCodeCtl.show();
		}
	};
	HomeNodeCtl.prototype.onMoreGame = function() {
		vee.Utils.launchAppById("thirdparty_moregame");
	};
    HomeNodeCtl.prototype.onKeyBack = function () {

	    if (app.Config.Platform == app.Config.Platforms.AND_EGAME ||
		    app.Config.Platform == app.Config.Platforms.AND_EGAMEOUT ||
		    app.Config.Platform == app.Config.Platforms.AND_HEGAME)
	    {
		    vee.Utils.launchAppById("thirdparty_exitgame");
	    }
	    else
	    {
		    if (game.isHomeKeyBack) {
			    vee.PopMgr.closeLayer();
			    game.isHomeKeyBack = false;
		    } else {
			    vee.PopMgr.alert(
				    vee.Utils.getObjByLanguage("Are you sure to quit?", "您要退出遊戲嗎？"),
				    vee.Utils.getObjByLanguage("QUIT", "退出遊戲"),
				    function(){
					    // Confirm callback
					    vee.Utils.launchAppById("thirdparty_exitgame");
				    },
				    function(){
					    // Close callback
					    game.isHomeKeyBack = false;
				    });
			    game.isHomeKeyBack = true;
		    }
	    }
        return true;
    };
    return HomeNodeCtl;
})(vee.Class);
