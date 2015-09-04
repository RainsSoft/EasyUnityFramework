/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 1/8/15
 * Time: 2:16 PM
 * To change this template use File | Settings | File Templates.
 */

var game = game = game || {};

var HomeSaleBanner = vee.Class.extend({
	PicNames : {
		DOUBLE_SOUL :  "shop/s_icon_soul_vip.png",
		BEST_HERO : "shop/shop_icon_hero_pack_2.png",
		ALL_HERO : "shop/shop_icon_hero_pack.png"
	},

	TimeLines : {
		NORMAL : "normal",
		SALE : "sale"
	},

	spIcon : null,
	lbTime : null,
	lbProductName : null,
	delayTime : 0,
	saleProductInfo : null,

	onEnter : function() {
		this.refreshState();
		game.oSaleBannerCtl = this;
	},

	onExit : function() {
		game.oSaleBannerCtl = null;
	},

	refreshState : function(check) {
		var time = new Date();
		var day = time.getDay();
		var hours = time.getHours();
		if ((day == 5 && hours >= 16) || (day == 6 && hours < 16)) {
			if (DataManager.getInstance().checkUnlockProduct(STORE_PRODUCT.HeroShopData.PALADIN.className) &&
				DataManager.getInstance().checkUnlockProduct(STORE_PRODUCT.HeroShopData.SHADOW.className) )
			{
				this.rootNode.setVisible(false);
			} else {
				this.rootNode.setVisible(true);
			}
			if (check) return;
			// 角色组合
			this.playAnimate(this.TimeLines.SALE);
			this.spIcon.initWithFile(this.PicNames.BEST_HERO);
			this.lbProductName.setString("英雄组合");
			// calc cooldown
			var timeNow = time.getTime();
			if (day == 5) time.setDate(time.getDate()+1);
			time.setHours(16);
			time.setMinutes(0);
			time.setSeconds(0);
			this.delayTime = parseInt((time.getTime() - timeNow) / 1000); // 5 for safe control\
			this.lbTime.setString(this.getTimeStr(this.delayTime));
			vee.Utils.scheduleOnceForTarget(this.lbTime, function(){
				vee.Utils.scheduleCallbackForTarget(this.lbTime, this.schUpdateTime.bind(this), 1);
			}.bind(this), 1);
			this.saleProductInfo = BuyItemAlertCtl.LIGHT_AND_SHADOW_PACK;

		} else if ((day == 6 && hours >= 16) || (day == 0 && hours < 16)) {
			if (DataManager.getInstance().isDoubleSoul()) {
				this.rootNode.setVisible(false);
			} else {
				this.rootNode.setVisible(true);
			}
			if (check) return;
			// 双倍魂半价
			this.playAnimate(this.TimeLines.SALE);
			this.spIcon.initWithFile(this.PicNames.DOUBLE_SOUL);
			this.lbProductName.setString("半价双倍魂");
			// calc cooldown
			var timeNow = time.getTime();
			if (day == 6) time.setDate(time.getDate()+1);
			time.setHours(16);
			time.setMinutes(0);
			time.setSeconds(0);
			this.delayTime = parseInt((time.getTime() - timeNow) / 1000); // 5 for safe control
			this.lbTime.setString(this.getTimeStr(this.delayTime));
			vee.Utils.scheduleOnceForTarget(this.lbTime, function(){
				vee.Utils.scheduleCallbackForTarget(this.lbTime, this.schUpdateTime.bind(this), 1);
			}.bind(this), 1);
			this.saleProductInfo = BuyItemAlertCtl.DOUBLE_HALF;

		} else {
			if (DataManager.getInstance().isHeroPackPurchased() || DataManager.getInstance().isAllHeroUnlocked()) {
				this.rootNode.setVisible(false);
			} else {
				this.rootNode.setVisible(true);
			}
			if (check) return;
			this.playAnimate(this.TimeLines.NORMAL);
			this.spIcon.initWithFile(this.PicNames.ALL_HERO);
			this.lbProductName.setString("荣耀英雄包");
			this.saleProductInfo = STORE_PRODUCT.HeroShopData.HERO_PACK;
		}
	},

	schUpdateTime : function() {
		if (--this.delayTime > 0) {
			this.lbTime.setString(this.getTimeStr(this.delayTime));
			this.refreshState(true);
		} else {
			this.lbTime.setString("00:00:00");
			this.refreshState();
		}
	},

	getTimeStr : function(timestamp) {
		var h = Math.floor(timestamp / 3600);
		var m = Math.floor((timestamp - h * 3600) / 60);
		var s = Math.floor((timestamp - h * 3600 - m * 60));
		var strH = h < 10 ? "0"+h : h;
		var strM = m < 10 ? "0"+m : m;
		var strS = s < 10 ? "0"+s : s;
		return strH + ":" + strM + ":" + strS;
	},

	onBuy : function() {
		BuyItemAlertCtl.show(this.saleProductInfo);
	}
});