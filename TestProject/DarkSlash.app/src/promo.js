/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 14-5-8
 * Time: 上午11:44
 * To change this template use File | Settings | File Templates.
 */

var vee = vee = vee || {};

vee.Promo = {
	isActivated : false,
	_moreGameBanner : null,
	usedIconId : [],

	hideMoreGameBanner : function() {
		if (this._moreGameBanner) {
			this._moreGameBanner.setVisible(false);
		}
	},

	showMoreGameBanner : function() {
		if (this._moreGameBanner) {
			this._moreGameBanner.setVisible(true);
		}
	},

	adConfig : {
		index : null,
		alias : null,
		image : null,
		banner : null,
		icon : null,
		id : null,
		desc : null,
		name : null,
		priority : null
	},

	activate : function(onlyGameList) {
		var promoChannel = app.Config.PromoChannel;
		if (!promoChannel) {
			return;
		}

		this.isActivated = true;
		vee.Utils.downloadFileFromURL("http://veewo.com/promo/"+promoChannel+"_latest.json", function(data){

			if (data.error) return;

			var promoChannel = app.Config.PromoChannel;
			var version = data.v;
			if (data.v != vee.data.promoVersion) {
				vee.Utils.downloadFileFromURL("http://veewo.com/promo/"+promoChannel+"_" + data.v + ".json", function(data){
					var config = data.apps;
					vee.data.promoVersion = version;
					vee.saveData();
					for (var i in config) {
						var adConfig = config[i];

						if (!onlyGameList) {
							var arrImageUrl = adConfig.image.split("/");
							var imageFileName = adConfig.alias + "_" + arrImageUrl[arrImageUrl.length - 1];
							vee.Common.getInstance().downloadImage(adConfig.image, imageFileName);

							var arrBannerUrl = adConfig.banner.split("/");
							var bannerFileName = adConfig.alias + "_" + arrBannerUrl[arrBannerUrl.length - 1];
							vee.Common.getInstance().downloadImage(adConfig.banner, bannerFileName);
						}

						var arrIconUrl = adConfig.icon.split("/");
						var iconFileName = adConfig.alias + "_" + arrIconUrl[arrIconUrl.length - 1];
						vee.Common.getInstance().downloadImage(adConfig.icon, iconFileName);

						if (adConfig.id == app.Config.AppID) {
							config.splice(i, 1);
						}
					}
					vee.Utils.saveObj(config, "promoList");
				});
			}
			if (!vee.isFirstPlay && !onlyGameList) {
				VeeMoreGameFullScreen.show();
			}
		});
	},

	getGameList : function(){
		var ret = vee.Utils.loadObj("promoList");
		if (!ret) {
			if (jsb.fileUtils.isFileExist("res/offlineConfig.json")) {
				var str = jsb.fileUtils.getStringFromFile("res/offlineConfig.json");
				ret = JSON.parse(str);
				ret = vee.Utils.getObjByPlatform(ret.data.ios, ret.data.android, []);
			}
		}
		return ret;
	},

	getIconAdConfig : function() {
		var gameList = this.getGameList();
		for (var i = 0; i < gameList.length; ++i) {
			var config = gameList[i];
			var hasUsed = false;
			for (var j = 0; j < this.usedIconId.length; ++j) {
				if (this.usedIconId == config.id) {
					hasUsed = true;
					break;
				}
			}
			if (!hasUsed) {
				this.usedIconId.push(config.id);
				return config;
			}
		}
		return null;
	},

	removeUsedIconId : function(id) {
		for (var i = 0; i < this.usedIconId.length; ++i) {
			if (id == this.usedIconId[i]) {
				this.usedIconId.splice(i,1);
				break;
			}
		}
	},

	/**
	 * @returns {vee.Promo.adConfig}
	 */
	getAdConfig : function(){
		var ret = null;
		var config = this.getGameList();
		if (!config) return null;

		var alias = app.Config.AppAlias;
		var i = 0;
		var ran = vee.Utils.randomInt(0,100);
		var current = -1;
		while(1){
			if (config[i].alias != alias){
				if (ran < config[i].priority) {
					ret = config[i];
					break;
				}
				else ran -= config[i].priority;
			} else {
				current = i;
			}
			i++;
			if (i == config.length) i = (current == 0 ? 1 : 0);
		}
		return ret;
	}
};

var VeeMoreGameButton = vee.Class.extend({

	onCreate : function() {
		if (!vee.Promo.isActivated || !vee.data.adEnabled) {
			this.rootNode.setVisible(false);
		}
	},

	/** @expose */
	onMoreGame : function() {
		VeeGameList.show();
	}
});
cc.BuilderReader.registerController("VeeMoreGameButton", VeeMoreGameButton);

var VeeGameIcon = vee.Class.extend({
	/** @expose */
	nodeContainer : null,

	adConfig : null,
	btnIcon : null,

	onCreate : function() {
		if (!vee.data.adEnabled) {
			this.rootNode.removeFromParent();
			return;
		}

		var clipper = cc.ClippingNode.create();
		clipper.setContentSize(0, 0);
		clipper.setAnchorPoint(  cc.p(0.5, 0.5) );
		clipper.setInverted(true);
		clipper.setAlphaThreshold(0.05);
		this.nodeContainer.addChild(clipper);

		var scl9BtnPic = cc.Scale9Sprite.create("res/banner_icon_veewo.png");
		var btn = cc.ControlButton.create("", "res/banner_icon_veewo.png", 30);
		clipper.addChild(btn);

		btn.setBackgroundSpriteForState(scl9BtnPic, 1);
		btn.setContentSize(scl9BtnPic.getContentSize());
		btn.setPreferredSize(scl9BtnPic.getPreferredSize());
		btn.setScale(76/btn.getPreferredSize().width);
		btn.setZoomOnTouchDown(false);
		this.btnIcon = btn;

		var stencil = cc.Sprite.create("res/banner_icon_cover.png");
		stencil.setScale(78/stencil.getContentSize().width);
		stencil.setPosition(cc.p(btn.getPosition()));
		clipper.setStencil(stencil);

		this.adConfig = vee.Promo.getIconAdConfig();
		if (this.adConfig) {
			var arrUrl = this.adConfig.icon.split("/");
			var _fileName = this.adConfig.alias + "_" + arrUrl[arrUrl.length - 1];
			vee.Common.getInstance().downloadImage(this.adConfig.icon, _fileName, function(fileName){
				if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + fileName)) {
					var scl9new = cc.Scale9Sprite.create(jsb.fileUtils.getWritablePath() + fileName);
					var btnGet = this.btnIcon;
					if (btnGet) {
						btnGet.setContentSize(scl9new.getContentSize());
						btnGet.setPreferredSize(scl9new.getPreferredSize());
						btnGet.setScale(76/btnGet.getPreferredSize().width);
						btnGet.setBackgroundSpriteForState(scl9new, 1);
						btn.addTargetWithActionForControlEvents(this, function(sender, state){
							vee.soundButton();
							vee.Utils.showAppById(this.adConfig.id);
						}.bind(this), cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
					}
				} else {
					cc.log("Promo banner image not exist!");
				}
			}.bind(this));
		}
	},

	onExit : function() {
		vee.Promo.removeUsedIconId(this.adConfig.id);
	}
});
cc.BuilderReader.registerController("VeeGameIcon", VeeGameIcon);

var VeeMoreGameBanner = VeeMoreGameButton.extend({
	/** @type {VeeMoreGameButton} */

	/** @expose */
	btnMoreGame : null,
	/** @expose */
	spDots : null,

	adConfig : null,

	onCreate : function() {
		if (!vee.data.adEnabled || vee.Ad.adBanner || !vee.Promo.isActivated) {
			this.rootNode.removeFromParent();
			return;
		}

		vee.Promo._moreGameBanner = this.rootNode;

		var tag = this.rootNode.getTag();
		if (tag == vee.Ad.Position.Top) {
			vee.PopMgr.resetLayer(this.rootNode, vee.PopMgr.PositionType.Top, cc.p(0,0), true);
		} else if (tag == vee.Ad.Position.Bottom) {
			vee.PopMgr.resetLayer(this.rootNode, vee.PopMgr.PositionType.Bottom, cc.p(0,0), true);
		}

		if (!vee.Promo.isActivated) return;
		this.adConfig = vee.Promo.getAdConfig();

		if (this.adConfig) {
			var arrUrl = this.adConfig.banner.split("/");
			var _fileName = this.adConfig.alias + "_" + arrUrl[arrUrl.length - 1];
			vee.Common.getInstance().downloadImage(this.adConfig.banner, _fileName, function(fileName){
				if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + fileName)) {
					var spBanner = cc.Sprite.create(jsb.fileUtils.getWritablePath() + fileName);
					spBanner.setPosition(this.rootNode.getContentSize().width/2, this.rootNode.getContentSize().height/2);
					this.rootNode.addChild(spBanner);
				} else {
					cc.log("Promo banner image not exist!");
				}
			}.bind(this));
		}
	},

	onBannerTouched : function() {
		vee.soundButton();
		if (this.adConfig) {
			vee.Utils.showAppById(this.adConfig.id);
		} else {
			VeeGameList.show();
		}
	}
});
cc.BuilderReader.registerController("VeeMoreGameBanner", VeeMoreGameBanner);

var VeeQuitBox = vee.Class.extend({
	/** @type {cc.Sprite} */
	/** @expose */
	spAd : null,
	/** @expose */
	spBtnLight : null,

	/** @type {cc.Node} */
	/** @expose */
	nodeContainer : null,
	/** @expose */
	nodeBtnContainer : null,
	/** @expose */
	nodeTextContainer : null,

	/** @type {cc.ControlButton} */
	/** @expose */
	btnAds : null,
	/** @expose */
	btnConfirm : null,
	/** @expose */
	btnMoreGame : null,
	/** @expose */
	btnClose : null,

	/** @type {cc.LabelTTF} */
	/** @expose */
	lbTitle : null,

	config : null,
	enableDownload : true,
	_canTouch : false,

	onCreate : function() {
		VeeQuitBox.hasShow = true;

		this.playAnimate("show");
		var winSize = vee.Director.getWinSize();
		this.btnAds.setPosition(cc.p(winSize.width/2, winSize.height/2));
		this.btnAds.setPreferredSize(winSize);
		this.spAd.setPosition(cc.p(winSize.width/2, winSize.height/2));
		this.nodeContainer.setPosition(cc.p((this.nodeContainer.getContentSize().width - winSize.width)/2,(this.nodeContainer.getContentSize().height - winSize.height)/2));

		var isHorizontal = winSize.width > winSize.height ? true : false;
		if (isHorizontal)
		{
			this.nodeTextContainer.setContentSize(500, 122);
			this.nodeBtnContainer.setContentSize(122, winSize.height);
			this.nodeBtnContainer.setPosition(cc.p(winSize.width - this.nodeBtnContainer.getContentSize().width, 0));
			this.spBtnLight.setPosition(cc.p(this.nodeBtnContainer.getContentSize().width, this.nodeBtnContainer.getContentSize().height/2));
			this.spBtnLight.setRotation(-90);

			var offsetY = (winSize.height - 50) / 4;
			for (var i = 1; i < 4; ++i) {
				var node = this.nodeBtnContainer.getChildByTag(i);
				if (node) {
					node.setPosition(cc.p(this.nodeBtnContainer.getContentSize().width/2, offsetY*i+ 25));
				}
			}

			var btnPos = this.nodeBtnContainer.getPosition();
			this.nodeBtnContainer.setPositionX(winSize.width);
			this.nodeBtnContainer.runAction(cc.EaseExponentialOut.create(cc.moveTo(0.5, btnPos)));
		}
		else
		{
			vee.Ad.hideBannerAd();
			this.nodeTextContainer.setContentSize(winSize.width, 122);
			this.nodeTextContainer.setPosition(cc.p(0, winSize.height - this.nodeTextContainer.getContentSize().height));
			this.nodeBtnContainer.setContentSize(winSize.width, 122);
			this.nodeBtnContainer.setPosition(cc.p(0,0));
			this.spBtnLight.setPosition(cc.p(this.nodeBtnContainer.getContentSize().width/2, 0));
			this.spBtnLight.setRotation(0);

			var offsetX = (winSize.width - 50) / 4;
			for (var i = 1; i < 4; ++i) {
				var node = this.nodeBtnContainer.getChildByTag(i);
				if (node) {
					node.setPosition(cc.p(offsetX*i + 25, this.nodeBtnContainer.getContentSize().height/2));
				}
			}

			var btnPos = this.nodeBtnContainer.getPosition();
			this.nodeBtnContainer.setPositionY(-this.nodeBtnContainer.getContentSize().height);
			this.nodeBtnContainer.runAction(cc.EaseExponentialOut.create(cc.moveTo(0.5, btnPos)));
		}

		this.nodeTextContainer.setPosition(cc.p(0, winSize.height - this.nodeTextContainer.getContentSize().height));
		this.lbTitle.setPosition(cc.p(this.nodeTextContainer.getContentSize().width/2, this.nodeTextContainer.getContentSize().height/2));

		var textPos = this.nodeTextContainer.getPosition();
		this.nodeTextContainer.setPositionY(winSize.height + this.nodeTextContainer.getContentSize().height);
		this.nodeTextContainer.runAction(cc.EaseExponentialOut.create(cc.moveTo(0.5, textPos)));

		this.spAd.setOpacity(0);
		this.spAd.runAction(cc.EaseExponentialOut.create(cc.fadeTo(0.5, 255)));

		if (VeeQuitBox.enableDownload) {
			var config = vee.Promo.getAdConfig();
			if (config) {
				var arrUrl = config.image.split("/");
				var _fileName = config.alias + "_" +  arrUrl[arrUrl.length - 1];
				this.config = config;
				vee.Common.getInstance().downloadImage(config.image, _fileName, function(fileName){
					var fullPath = jsb.fileUtils.getWritablePath() + fileName;
					if (jsb.fileUtils.isFileExist(fullPath)) {
						if (this.spAd) {
							this.spAd.runAction(cc.sequence(
								cc.FadeOut(0.1),
								cc.callFunc(function() {
									this._canTouch = true;
									this.spAd.initWithFile(jsb.fileUtils.getWritablePath() + fileName);
								}.bind(this)),
								cc.FadeIn(0.1)
							));
						}
					} else {
						cc.log("Promo quit box image not exist!");
					}
				}.bind(this));
			}
		}
		this.handleKey(true);
	},

	/** @expose */
	onConfirm : function() {
		vee.Director.end();
	},

	/** @expose */
	onClose : function() {
		if (app.Config.IsBannerEnabled) {
			vee.Ad.showBannerAd();
		}
		VeeQuitBox.hasShow = false;
		vee.PopMgr.closeLayer();
	},

	onKeyBack: function(){
		this.onClose();
		return true;
	},

	/** @expose */
	onMoreGame : function() {
		VeeGameList.show();
	},

	/** @expose */
	onAdClick : function() {
		if (!this._canTouch) return;
		if (this.config) {
			vee.Utils.showAppById(this.config.id);
		} else {
			var url = app.Config.PromoURL
			vee.Utils.openURL(url);
		}
	},

	setMsg : function(title, content) {

	}
});
cc.BuilderReader.registerController("VeeQuitBox", VeeQuitBox);

VeeQuitBox.enableDownload = true;

VeeQuitBox.show = function() {
	if (VeeQuitBox.hasShow) return;
	if (vee.Promo.isActivated && vee.data.adEnabled) {
		vee.PopMgr.popCCB("vQuit.ccbi", true);
	} else {
		var ctl = vee.PopMgr.alert(
			vee.Utils.getObjByLanguage("Are you sure to quit?", "您要退出遊戲嗎？"),
			vee.Utils.getObjByLanguage("QUIT", "退出遊戲"),
			function(){
				// Confirm callback
				vee.Director.end();
			},
			function(){
				// Close callback
			});
	}
};

var VeeMoreGameFullScreen = vee.Class.extend({
	/** @expose */
	spShow : null,
	/** @expose */
	btnAd : null,
	/** @expose */
	btnClose : null,
	/** @expose */
	nodeContainer : null,
	_winSize : null,
	_adConfig : null,
	_canTouch : false,

	onCreate : function() {
		this.handleKey(true);
		this._winSize = vee.Director.getWinSize();
		this.nodeContainer.setPosition(cc.p((this.nodeContainer.getContentSize().width - this._winSize.width)/2,(this.nodeContainer.getContentSize().height - this._winSize.height)/2));
		this.spShow.setPosition(cc.p(this._winSize.width / 2, this._winSize.height / 2));
		this.btnAd.setPosition(this.spShow.getPosition());
		this.btnAd.setContentSize(this._winSize);
		this.btnClose.setPosition(cc.p(this._winSize.width - this.btnClose.getContentSize().width/2 - 10, this._winSize.height - this.btnClose.getContentSize().height/2 - 10));
		this.spShow.setOpacity(0);
		this.spShow.runAction(cc.EaseExponentialOut.create(cc.fadeTo(0.3, 255)));
		this.randAd();
	},

	randAd : function() {
		this._adConfig = vee.Promo.getAdConfig();
		if (this._adConfig) {
			var arrUrl = this._adConfig.image.split("/");
			var _fileName = this._adConfig.alias + "_" + arrUrl[arrUrl.length - 1];
			vee.Common.getInstance().downloadImage(this._adConfig.image, _fileName, function(fileName){
				if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + fileName)) {
					this.spShow.runAction(cc.sequence(
						cc.FadeOut(0.1),
						cc.callFunc(function() {
							this._canTouch = true;
							this.spShow.initWithFile(jsb.fileUtils.getWritablePath() + fileName);
						}.bind(this)),
						cc.FadeIn(0.1)
					));
				} else {
					cc.log("Promo full screen image not exist!");
				}
			}.bind(this));
		}
	},

	onKeyBack: function(){
		this.onCloseLayer();
		return true;
	},

	/** @expose */
	onAdTouch : function() {
		if (this._canTouch) {
			vee.PopMgr.closeLayerByCtl(this);
			vee.Utils.showAppById(this._adConfig.id);
		}
	},

	/** @expose */
	onCloseLayer : function() {
		vee.PopMgr.closeLayerByCtl(this);
	}
});
cc.BuilderReader.registerController("VeeMoreGameFullScreen", VeeMoreGameFullScreen);

VeeMoreGameFullScreen.show = function() {
	if (!vee.Promo.isActivated || !app.Config.PromoFullScreenEnable || !vee.data.adEnabled) {
		return;
	}
	vee.PopMgr.popCCB("res/vMoreGameFullScreen.ccbi", true);
}

var VeeGameList = vee.Class.extend({
	/** @expose */
	nodeContainer : null,
	/** @expose */
	btnMoreGame : null,
	/** @expose */
	btnClose : null,
	/** @expose */
	spLogo : null,
	/** @expose */
	spLine : null,
	/** @expose */
	nodeTBVContainer : null,

	onCreate : function() {

	},

	onLoaded : function() {
		this.handleKey(true);
		var winSize = vee.Director.getWinSize();
		this.nodeContainer.setPosition(cc.p(vee.PopMgr.originOffset.x - 100, vee.PopMgr.originOffset.y));
		this.nodeContainer.setContentSize(winSize);
		this.btnMoreGame.setPosition(cc.p(this.btnMoreGame.getContentSize().width/2 + 10, winSize.height - this.btnMoreGame.getContentSize().height/2));
		this.btnClose.setPosition(cc.p(winSize.width - this.btnClose.getContentSize().width/2 - 10, winSize.height - this.btnClose.getContentSize().height/2));
		this.spLogo.setPosition(cc.p(winSize.width/2, this.btnMoreGame.getPositionY()));
		this.spLine.setPosition(cc.p(winSize.width/2, winSize.height - this.btnMoreGame.getContentSize().height));
		this.spLine.setScaleX((winSize.width-40)/this.spLine.getContentSize().width);
		this.spLine.setLocalZOrder(1);
		this.nodeTBVContainer.setPosition(cc.p(20,50));
		this.nodeTBVContainer.setContentSize(winSize.width - 40, winSize.height - 50 - this.btnMoreGame.height+1);

		var gameList = vee.Promo.getGameList();
		if (gameList) {
			var tbv = VeeTableViewController.createTableView(this.nodeTBVContainer.getContentSize(), "res/vGameListCell.ccbi", gameList.length, gameList);
			this.nodeTBVContainer.addChild(tbv);
		}

		var pos = this.nodeContainer.getPosition();
		this.nodeContainer.setPositionY(-this.nodeContainer.getContentSize().height);
		this.nodeContainer.runAction(cc.EaseExponentialOut.create(cc.moveTo(0.5, pos)));
	},

	/** @expose */
	onClose : function() {
		this.nodeContainer.runAction(cc.sequence(
			cc.EaseExponentialOut.create(cc.moveTo(0.3, cc.p(this.nodeContainer.getPositionX(),-this.nodeContainer.getContentSize().height))),
			cc.callFunc(function(){
				vee.PopMgr.closeLayerByCtl(this);
			}.bind(this))
		));
	},

	/** @expose */
	onMoreGame : function() {
		var url = app.Config.PromoURL
		vee.Utils.openURL(url);
	},

	onKeyBack : function() {
		this.onClose();
		return true;
	}
});
cc.BuilderReader.registerController("VeeGameList", VeeGameList);

VeeGameList.show = function() {
	vee.PopMgr.popCCB("res/vGameList.ccbi", true, null, null, null, false);
};

var VeeGameListCell = VeeTableCellController.extend({
	/** @type {cc.Spite} */
	/** @expose */
	spLine : null,
	/** @expose */
	spIcon : null,

	/** @type {cc.Label} */
	/** @expose */
	lbName : null,
	/** @expose */
	lbDesc : null,

	/** @type {cc.ControlButton} */
	/** @expose */
	btnOK : null,

	/** @type {cc.Node} */
	/** @expose */
	nodeLeft : null,
	/** @expose */
	nodeRight : null,

	_config : null,

	onCreate : function() {
		var winSize = vee.Director.getWinSize();
		this.nodeRight.setPositionX(winSize.width - 40);
		this.spLine.setScaleX((winSize.width-40)/this.spLine.getContentSize().width);
		this.spLine.setPositionX((winSize.width-40)/2);
	},

	onLoaded : function() {
	},

	updateIndex : function(idx, dataSource){
		this._config = dataSource[idx];
		this.lbName.setString(vee.Utils.getObjByLanguage(this._config.name));
		this.lbDesc.setString(vee.Utils.getObjByLanguage(this._config.desc));
		var scl9BtnPic = null;
		if (vee.Utils.checkIsInstalledApp(this._config.id)) {
			scl9BtnPic = cc.Scale9Sprite.create("res/glist_btn_play.png");
		} else {
			scl9BtnPic = cc.Scale9Sprite.create("res/glist_btn_install.png");
		}
		this.btnOK.setBackgroundSpriteForState(scl9BtnPic, 1);

		var arrUrl = this._config.icon.split("/");
		var _fileName = this._config.alias + "_" + arrUrl[arrUrl.length - 1];
		vee.Common.getInstance().downloadImage(this._config.icon, _fileName, function(fileName){
			if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + fileName)) {
				this.spIcon.initWithFile(jsb.fileUtils.getWritablePath() + fileName);
				this.spIcon.setScale(116/this.spIcon.getContentSize().width);
			} else {
				cc.log("Promo game list icon not exist!");
			}
		}.bind(this));
	},

	onOK : function() {
		if (!vee.Utils.launchAppById(this._config.id)) {
			vee.Utils.showAppById(this._config.id);
		}
	}
});
cc.BuilderReader.registerController("VeeGameListCell", VeeGameListCell);

