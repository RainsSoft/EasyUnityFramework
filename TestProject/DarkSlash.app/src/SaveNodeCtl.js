var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-8-27.
*/
/// <reference path="../vee.d.ts" />
/// <reference path="../Manager/DataManager" />
/// <reference path="../Manager/GameManager" />
/// <reference path="DeathProgressCtl" />
/// <reference path="ShopNodeCtl" />
var SaveNodeType;
(function (SaveNodeType) {
    SaveNodeType[SaveNodeType["REVIVE"] = 0] = "REVIVE";
    SaveNodeType[SaveNodeType["NO_REVIVE"] = 1] = "NO_REVIVE";
})(SaveNodeType || (SaveNodeType = {}));
var SaveNodeCtl = (function (_super) {
    __extends(SaveNodeCtl, _super);
    SaveNodeCtl["__ts"]=true;
    function SaveNodeCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    SaveNodeCtl.prototype.onLoaded = function () {
        this._progressCtl = this.lyProgress.controller;
        this._progressCtl.setEaseEffectEnabled(true);
        this._soulPriceCtl = vee.ScoreController.registerController(this.lbSoulPrice, 0);
        this.handleKey(true);
    };

    SaveNodeCtl.prototype.setType = function (type) {
        var saveChance = DataManager.getInstance().getSaveChance();
        var seq;
        switch (type) {
            case 0 /* REVIVE */:
                if (saveChance < 1) {
                    seq = "Dead";
                } else {
                    seq = "Save";
                    this.lbSave.setString(saveChance.toString());
                }
                break;
            case 1 /* NO_REVIVE */:
                seq = "NoRevive";
                break;
        }
        this.rootNode.animationManager.runAnimationsForSequenceNamed(seq);
    };

    SaveNodeCtl.prototype.setWave = function (wave) {
        var total = ENEMY_WAVE_CONFIG.waves.length;

        // this is a index and this wave is not finished.
        wave = Math.max(0, wave - 1);
        this._progressCtl.reset(wave / total, total, null, this._progressCtl.onProgressChanged);
        this.lbPercentage.setString(Math.round(wave / total * 100) + "%");
    };
    SaveNodeCtl.prototype.setSoulPrice = function (price) {
        this._soulPriceCtl.setNumber(price);
    };

    SaveNodeCtl.prototype.onSaveClicked = function () {
        // Have extra life
        var saveChance = DataManager.getInstance().getSaveChance();
        if (saveChance > 0) {
            this.close(function () {
                saveChance--;
                vee.Analytics.logEvent("useRevive", { "rest": ''+saveChance });
                DataManager.getInstance().setSaveChance(saveChance);
                GameManager.getInstance().onSavedLife();
            });
        } else {
            if (DataManager.getInstance().subSoul(this._soulPriceCtl.getNumber())) {
                vee.Analytics.logItemPurchase("buyRevive", this._soulPriceCtl.getNumber());
                this.close(function () {
                    GameManager.getInstance().onSavedLife();
                });
            } else {
	            var soulPack = vee.Utils.getObjByPlatform(STORE_PRODUCT.SoulShopData.SOUL_PACK_1,STORE_PRODUCT.SoulShopData.SOUL_PACK_0);
	            BuyItemAlertCtl.show(STORE_PRODUCT.SoulShopData.SOUL_PACK_1);

//                vee.PopMgr.alert(
//	                vee.Utils.getObjByLanguage("Not Enough Soul.", "魂不够"),
//	                vee.Utils.getObjByLanguage("SORRY", "抱歉"),
//	                function () {
//                    var ctl = (vee.PopMgr.popCCB("shop.ccbi", true).controller);
//                    ctl.setShop(STORE_ENUM.ShopType.Soul);
//                });
            }
        }
    };

    SaveNodeCtl.prototype.onCancelClicked = function () {
        vee.Analytics.logEvent("cancelSaveLife", { saveChance: ''+DataManager.getInstance().getSaveChance() });
        this.rootNode.removeFromParent();
        GameManager.getInstance().gameOver();
    };

    SaveNodeCtl.prototype.close = function (callback) {
        this.playAnimate("DeadClose", function () {
            vee.PopMgr.closeLayerByCtl(this);
            if (callback) {
                callback();
            }
        }.bind(this));
    };

    SaveNodeCtl.prototype.onKeyBack = function () {
        this.onCancelClicked();
        return true;
    };
    return SaveNodeCtl;
})(vee.Class);
