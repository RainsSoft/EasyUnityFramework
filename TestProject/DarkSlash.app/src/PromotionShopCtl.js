var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-9-21.
*/
/// <reference path="../vee.d.ts" />
/// <reference path="../appConfig" />
/// <reference path="../helper" />
/// <reference path="../Manager/DataManager" />
var PromotionShopCtl = (function (_super) {
    __extends(PromotionShopCtl, _super);
    PromotionShopCtl["__ts"]=true;
    function PromotionShopCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    PromotionShopCtl.prototype.onLoaded = function () {
        this.playAnimate("open");
        this.handleKey(true);
	    if (cc.sys.os === cc.sys.OS_IOS) {
		    this.lbPriceBefore.setString("$ "+ 25);
		    this.lbPriceNow.setString("$ "+ 12);
	    } else {
		    this.lbPriceBefore.setString("$ "+ 12);
		    this.lbPriceNow.setString("$ "+ 6);
	    }
    };

    PromotionShopCtl.prototype.setCloseCallback = function (callback) {
        this._closeCallback = callback;
    };

    PromotionShopCtl.prototype.onGetClicked = function () {
        var orderID = vee.Utils.getTimeNow().toString();
        var productID = app.Config.IAPs.NonConsumable.DoubleSoulsHalf;
        vee.Analytics.logChargeRequest(orderID, productID, BuyItemAlertCtl.DOUBLE_HALF.prices[0], "RMB");
        helper.buyProduct(productID, true, function () {
            vee.Analytics.logChargeSuccess(orderID);
            if (!DataManager.getInstance().isDoubleSoul()) {
                DataManager.getInstance().upgradeProduct(BuyItemAlertCtl.DOUBLE_HALF.className);
            }
        }, function () {
            vee.Analytics.logEvent("purchaseFailed", {
                "orderID": ''+orderID,
                "productID": ''+productID
            });
        }, function(){});
        this.close();
    };
    PromotionShopCtl.prototype.onMissClicked = function () {
        DataManager.getInstance().resetPromotionRound();
        this.close();
    };
    PromotionShopCtl.prototype.close = function () {
        this.playAnimate("close", function () {
            if (typeof this._closeCallback === "function") {
                this._closeCallback();
            }
            vee.PopMgr.closeLayerByCtl(this);
        }.bind(this));
    };
    PromotionShopCtl.prototype.onKeyBack = function () {
        this.onMissClicked();
        return true;
    };
    return PromotionShopCtl;
})(vee.Class);
