/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 1/9/15
 * Time: 2:46 PM
 * To change this template use File | Settings | File Templates.
 */

var BuyItemAlertCtl = vee.Class.extend({

	lbTitle : null,
	lbContent : null,
	lbName : null,
	lbPrice : null,
	lbDiscount : null,
	spIcon : null,
	psDot : null,

	_shopCtl : null,
	_pdInfo : null,

	onCreate : function() {

	},

	setProductInfo : function(productInfo) {
		this._pdInfo = productInfo;
		this.lbDiscount.setString(" ");
		if (this._pdInfo.className == "SOUL_PACK_3") {
			this.lbTitle.setString("魂不够了");
			this.lbContent.setString("购买"+this._pdInfo.name+"?");
			this.lbName.setString(this._pdInfo.config.value+"魂");
			var discount = vee.Utils.getObjByPlatform("30","20");
			this.lbDiscount.setString("("+discount+"%优惠)");

		} else if (this._pdInfo.className == "SOUL_PACK_2") {
			var sp = this.btnClose.getBackgroundSpriteForState(cc.CONTROL_STATE_NORMAL);
			sp.setColor(cc.color(100, 100, 100));
			this.lbTitle.setString("魂包促销");
			this.lbContent.setString("购买"+this._pdInfo.name);
			this.lbName.setString(this._pdInfo.config.value+"魂");
		} else if (this._pdInfo.className == "SOUL_PACK_1" || this._pdInfo.className == "SOUL_PACK_0") {
			this.lbTitle.setString("魂不够了");
			this.lbContent.setString("购买"+this._pdInfo.name+"?");
			this.lbName.setString(this._pdInfo.config.value+"魂");
		} else if (this._pdInfo.className == "DOUBLE" || this._pdInfo.className == "DOUBLE_HALF") {
			this.lbTitle.setString("购买双倍魂");
			this.lbContent.setString("每场战斗都获得双倍魂");
			this.lbName.setString(this._pdInfo.name);
		} else if (this._pdInfo.className == "HERO_PACK") {
			this.lbTitle.setString("购买商品");
			this.lbContent.setString("解锁所有英雄并拥有双倍魂");
			this.lbName.setString(this._pdInfo.name);
		} else if (this._pdInfo.className == "LIGHT_AND_SHADOW_PACK") {
			this.lbTitle.setString("限时半价");
			this.lbContent.setString("解锁虚空之迷和圣骑士");
			this.lbName.setString(this._pdInfo.name);
		} else {
			this.lbContent.setString("购买商品");
			this.lbName.setString(this._pdInfo.name);
		}
		this.lbPrice.setString("$"+this._pdInfo.prices[0]);
		if (this._pdInfo.className == "DOUBLE_HALF") {
			this.lbDiscount.setString("(50%优惠)");
		} else if (this._pdInfo.className == "LIGHT_AND_SHADOW_PACK") {
			if (cc.sys.os == cc.sys.OS_IOS) {
				this.lbDiscount.setString("(50%优惠)");
			} else {
				this.lbDiscount.setString("(30%优惠)");
			}
		}
		this.spIcon.initWithFile(this._pdInfo.icon);
	},

	setShopCtl :function(shopCtl) {
		this._shopCtl = shopCtl;
	},

	onConfirm : function() {
		var orderID = vee.Utils.getTimeNow().toString();
		var pd = this.getPDID(this._pdInfo.className);
		var productID = pd.productID;
		var isNonConsumable = pd.isNonConsumable;

		var success = null;
		if (this._pdInfo.className == "SOUL_PACK_3" ||
			this._pdInfo.className == "SOUL_PACK_2" ||
			this._pdInfo.className == "SOUL_PACK_1" ||
			this._pdInfo.className == "SOUL_PACK_0") {
			success = function () {
				if (this._shopCtl) {
					this._shopCtl._shopNodeCtl.soulCtl.addNumber(this._pdInfo.config.value);
				}
				DataManager.getInstance().addSoul(this._pdInfo.config.value);
				vee.Analytics.logReward(this._pdInfo.config.value, "购买魂包");
				vee.PopMgr.closeLayer();
				BuySuccessCtl.showWithData(this._pdInfo);
				if (game.oSaleBannerCtl) game.oSaleBannerCtl.refreshState(true);
			}.bind(this);
		} else if (this._pdInfo.className == "HERO_PACK") {
			success = function () {
				DataManager.getInstance().upgradeProduct(this._pdInfo.className);
				if (!DataManager.getInstance().isDoubleSoul()) {
					DataManager.getInstance().upgradeProduct(STORE_PRODUCT.SoulShopData.DOUBLE.className);
				}
				DataManager.getInstance().unlockAllHeroes();
				vee.PopMgr.closeLayer();
				BuySuccessCtl.showWithData(this._pdInfo);
				if (game.oSaleBannerCtl) game.oSaleBannerCtl.refreshState(true);
			}.bind(this);
		} else if (this._pdInfo.className == "LIGHT_AND_SHADOW_PACK") {
			success = function () {
				DataManager.getInstance().upgradeProduct(this._pdInfo.className);
				DataManager.getInstance().unlockLightAndShadow();
				vee.PopMgr.closeLayer();
				BuySuccessCtl.showWithData(this._pdInfo);
				if (game.oSaleBannerCtl) game.oSaleBannerCtl.refreshState(true);
			}.bind(this);
		} else if (this._pdInfo.className == "DOUBLE" || this._pdInfo.className == "DOUBLE_HALF") {
			success = function () {
				if (!DataManager.getInstance().isDoubleSoul()) {
					DataManager.getInstance().upgradeProduct(STORE_PRODUCT.SoulShopData.DOUBLE.className);
				}
				vee.Utils.logObj(this._pdInfo);
				vee.PopMgr.closeLayer();
				BuySuccessCtl.showWithData(this._pdInfo);
				if (game.oSaleBannerCtl) game.oSaleBannerCtl.refreshState(true);
			}.bind(this);
		}
//		vee.Utils.callFunction(success);

		vee.Analytics.logChargeRequest(orderID, productID, this._pdInfo.prices[0], "RMB");
		helper.buyProduct(productID, isNonConsumable, function () {
			vee.Utils.callFunction(success);
			vee.Analytics.logChargeSuccess(orderID);
			if (vee.data.adEnabled) {
				vee.Ad.banAd();
			}
		}.bind(this), function () {
			vee.Analytics.logEvent("purchaseFailed", {
				"orderID": ''+orderID,
				"productID": ''+productID
			});
		}.bind(this));
	},

	onClose : function() {
		this.playAnimate("close", function(){
			vee.PopMgr.closeLayer();
		});
	},

	getPDID : function(className) {
		var productID = "";
		var isNonConsumable = false;
		switch (className) {
			case STORE_PRODUCT.HeroShopData.SAKURA.className:
				productID = app.Config.IAPs.NonConsumable.HeroSakura;
				isNonConsumable = true;
				break;
			case STORE_PRODUCT.HeroShopData.PALADIN.className:
				productID = app.Config.IAPs.NonConsumable.HeroPaladin;
				isNonConsumable = true;
				break;
			case STORE_PRODUCT.HeroShopData.SHADOW.className:
				productID = app.Config.IAPs.NonConsumable.HeroMystery;
				isNonConsumable = true;
				break;
			case STORE_PRODUCT.HeroShopData.HERO_PACK.className:
				productID = app.Config.IAPs.NonConsumable.HeroPack;
				isNonConsumable = true;
				break;
			case STORE_PRODUCT.SoulShopData.DOUBLE.className:
				productID = app.Config.IAPs.NonConsumable.DoubleSouls;
				isNonConsumable = true;
				break;
			case STORE_PRODUCT.SoulShopData.SOUL_PACK_1.className:
				productID = app.Config.IAPs.Consumable.SoulPack1;
				isNonConsumable = false;
				break;
			case STORE_PRODUCT.SoulShopData.SOUL_PACK_2.className:
				productID = app.Config.IAPs.Consumable.SoulPack2;
				isNonConsumable = false;
				break;
			case STORE_PRODUCT.SoulShopData.SOUL_PACK_3.className:
				productID = app.Config.IAPs.Consumable.SoulPack3;
				isNonConsumable = false;
				break;
			case STORE_PRODUCT.SoulShopData.SOUL_PACK_4.className:
				productID = app.Config.IAPs.Consumable.SoulPack4;
				isNonConsumable = false;
				break;
			case "DOUBLE_HALF":
				productID = app.Config.IAPs.NonConsumable.DoubleSoulsHalf;
				isNonConsumable = true;
				break;
			case "LIGHT_AND_SHADOW_PACK":
				productID = app.Config.IAPs.NonConsumable.HeroPack2;
				isNonConsumable = true;
				break;
		}
		return {productID : productID, isNonConsumable : isNonConsumable};
	}
});

BuyItemAlertCtl.show = function(productInfo, shopCtl) {
	var node = vee.PopMgr.popCCB("res/vAlertbox_buy.ccbi", true);
	vee.Utils.logObj(productInfo, "in show");
	node.controller.setProductInfo(productInfo);
	node.controller.setShopCtl(shopCtl);
};

BuyItemAlertCtl.LIGHT_AND_SHADOW_PACK = {
	name: vee.Utils.getObjByLanguage("Glorious Heroes Pack", "英雄组合"),
	className: "LIGHT_AND_SHADOW_PACK",
	type: STORE_ENUM.BuyActionType.PERSIST_ONCE,
	max: 1,
	priceType: STORE_ENUM.PriceType.MONEY,
	prices: [app.Config.getPrice([25,12,12,12,12])],
	lockFilter: [],
	config: {
		type: STORE_ENUM.ConfigType.UPGRADE
	},
	details: [vee.Utils.getObjByLanguage("", "")],
	icon: "shop/shop_icon_hero_pack_2.png",
	iconLock: "shop/shop_icon_hero_pack_2.png"
};

BuyItemAlertCtl.DOUBLE_HALF = {
	className: "DOUBLE_HALF",
	name: vee.Utils.getObjByLanguage("Double Souls", "双倍魂"),
	type: STORE_ENUM.BuyActionType.PERSIST,
	details: [
		vee.Utils.getObjByLanguage("Get double souls in every battle", "每场战斗都能得到双倍的魂。"),
		vee.Utils.getObjByLanguage("Get double souls in every battle", "每场战斗都能得到双倍的魂。")
	],
	max: 1,
	priceType: STORE_ENUM.PriceType.MONEY,
	prices: [app.Config.getPrice([12,6,6,6,6])],
	config: {
		type: STORE_ENUM.ConfigType.UPGRADE
	},
	icon: "shop/s_icon_soul_vip.png",
	iconLock: "shop/s_icon_soul_vip.png",
	lockFilter: []
};

BuyItemAlertCtl.showHome = function() {
	var time = new Date();
	var day = time.getDay();
	var hours = time.getHours();
	if ((day == 5 && hours >= 16) || (day == 6 && hours < 16)) {
		if (DataManager.getInstance().checkUnlockProduct(STORE_PRODUCT.HeroShopData.PALADIN.className) &&
			DataManager.getInstance().checkUnlockProduct(STORE_PRODUCT.HeroShopData.SHADOW.className) )
		{
			BuyItemAlertCtl.show(STORE_PRODUCT.SoulShopData.SOUL_PACK_2);
		} else {
			BuyItemAlertCtl.show(BuyItemAlertCtl.LIGHT_AND_SHADOW_PACK);
		}
	} else if ((day == 6 && hours >= 16) || (day == 0 && hours < 16)) {
		if (DataManager.getInstance().isDoubleSoul()) {
			BuyItemAlertCtl.show(STORE_PRODUCT.SoulShopData.SOUL_PACK_2);
		} else {
			BuyItemAlertCtl.show(BuyItemAlertCtl.DOUBLE_HALF);
		}
	} else {
		if (DataManager.getInstance().isHeroPackPurchased() || DataManager.getInstance().isAllHeroUnlocked()) {
			BuyItemAlertCtl.show(STORE_PRODUCT.SoulShopData.SOUL_PACK_2);
		} else {
			BuyItemAlertCtl.show(STORE_PRODUCT.HeroShopData.HERO_PACK);
		}
	}
}