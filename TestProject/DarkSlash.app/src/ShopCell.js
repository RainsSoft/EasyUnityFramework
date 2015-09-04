/**
* Created by yuan on 14-9-2.
*/
/// <reference path="../vee.d.ts" />
/// <reference path="../config" />
/// <reference path="../appConfig" />
/// <reference path="../Manager/DataManager" />
/// <reference path="../NodeCtl/ShopNodeCtl" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ButtonState;
(function (ButtonState) {
    ButtonState[ButtonState["Lock"] = 0] = "Lock";
    ButtonState[ButtonState["Unlock"] = 1] = "Unlock";
    ButtonState[ButtonState["Upgrade"] = 2] = "Upgrade";
    ButtonState[ButtonState["Buy"] = 3] = "Buy";
    ButtonState[ButtonState["Select"] = 4] = "Select";
    ButtonState[ButtonState["UnSelect"] = 5] = "UnSelect";
    ButtonState[ButtonState["URL"] = 6] = "URL";
    ButtonState[ButtonState["FULL"] = 7] = "FULL";
	ButtonState[ButtonState["Restore"] = 8] = "Restore";
	ButtonState[ButtonState["Exchange"] = 9] = "Exchange";
    ButtonState[ButtonState["None"] = 10] = "None";
})(ButtonState || (ButtonState = {}));

var ShopCell = (function (_super) {
    __extends(ShopCell, _super);
    ShopCell["__ts"]=true;
    function ShopCell(tbv, shopCtl, shopNode) {
        (function(){
    if(_super.__ts){
        return function(_this){
            _this.__instanceId = ClassManager.getNewInstanceId();
            _super.apply(_this, Array.prototype.slice.call(arguments,1));
        }
    } else if (typeof _super.prototype.ctor === "function") {
        return function(_this){
            _this.__instanceId = ClassManager.getNewInstanceId();
            _super.prototype.ctor.apply(_this, Array.prototype.slice.call(arguments,1));
        }
    } else {
        return function(_this){
            _this.__instanceId = ClassManager.getNewInstanceId();
        };
    }
}())
(this);
        this._sLockBtn = "shop/shop_btn_lock.png";
        this._sUnlockBtn = "shop/shop_btn_unlock.png";
        this._sUpgradeBtn = "shop/shop_btn_upgarde.png";
        this._sBuyBtn = "shop/shop_btn_buy.png";
        this._sSelectBtn = "shop/shop_btn_select.png";
        this._sUnselectBtn = "shop/shop_btn_unselect.png";
        this._sUrlBtn = "shop/shop_btn_go.png";
        this._sBG = "shop/shop_list_bg.png";
        this._sBGLock = "shop/shop_list_bg_lock.png";
        this._xSoulPrice = 190;
        this._xPrice = 176;
        this._colorSoul = cc.color(38, 186, 252);
        this._colorMax = cc.color(90, 205, 45);
        this._colorMoney = cc.color(252, 81, 31);
        this._colorLockedName = cc.color(156, 115, 88);
        this._colorUnLockedName = cc.color(253, 174, 42);
        this._btnState = 0 /* Lock */;
        this._priceValue = 0;
        this._tableView = tbv;
        this._shopNodeCtl = shopNode;
        this._shopCtl = shopCtl;
        this._ccbNode = cc.BuilderReader.load("shop_list_normal.ccbi", this);
        this.setContentSize(this._ccbNode.getContentSize());
        this.addChild(this._ccbNode);
    }
    ShopCell.prototype.onClicked = function () {
        var successCallback, failCallback = null;
        switch (this._btnState) {
            case 3 /* Buy */:
                switch (this._productInfo.config.type) {
                    case STORE_ENUM.ConfigType.UPGRADE:
                        successCallback = function () {
                            if (this._productInfo.className === STORE_PRODUCT.HeroShopData.HERO_PACK.className) {
                                DataManager.getInstance().upgradeProduct(this._productInfo.className);
                                if (!DataManager.getInstance().isDoubleSoul()) {
                                    DataManager.getInstance().upgradeProduct(STORE_PRODUCT.SoulShopData.DOUBLE.className);
                                }
                                DataManager.getInstance().unlockAllHeroes();
                                vee.Utils.scheduleOnce(this.updateTable.bind(this), 0.1);
                                this.removeFromParent();
                            } else {
                                DataManager.getInstance().upgradeProduct(this._productInfo.className);
                                this.updateInfo(this._productInfo);
                            }
	                        BuySuccessCtl.showWithData(this._productInfo);
                        }.bind(this);

                        this.buy(this._productInfo.priceType, this._productInfo.className, this._priceValue, successCallback, failCallback);
                        break;
                    case STORE_ENUM.ConfigType.SOUL_PACK:
                        successCallback = function () {
                            this._shopNodeCtl.soulCtl.addNumber(this._productInfo.config.value);
                            DataManager.getInstance().addSoul(this._productInfo.config.value);
	                        vee.Analytics.logReward(this._productInfo.config.value, "购买魂包");
                            this.updateInfo(this._productInfo);
	                        BuySuccessCtl.showWithData(this._productInfo);
                        }.bind(this);

                        this.buy(this._productInfo.priceType, this._productInfo.className, this._priceValue, successCallback, failCallback);
                        break;
                    case STORE_ENUM.ConfigType.SLOT:
                        successCallback = function () {
                            DataManager.getInstance().upgradeProduct(this._productInfo.className + "_SLOT");
                            this.updateInfo(this._productInfo);
	                        BuySuccessCtl.showWithData(this._productInfo);
                        }.bind(this);
                        this.buy(this._productInfo.priceType, this._productInfo.className, this._priceValue, successCallback, failCallback);
                        break;
                }
                break;
            case 2 /* Upgrade */:
                successCallback = function () {
                    DataManager.getInstance().upgradeProduct(this._productInfo.className);
                    this.updateInfo(this._productInfo);
	                BuySuccessCtl.showWithData(this._productInfo);
                }.bind(this);
                this.buy(this._productInfo.priceType, this._productInfo.className, this._priceValue, successCallback, failCallback);
                break;
            case 1 /* Unlock */:
                successCallback = function () {
                    DataManager.getInstance().upgradeProduct(this._productInfo.className);
                    this.updateInfo(this._productInfo);
                    this._shopNodeCtl.queryUnlockNewIcon();
	                BuySuccessCtl.showWithData(this._productInfo);
	                if (DataManager.getInstance().isAllHeroUnlocked()) {
		                this._shopNodeCtl._heroDataSource = new ShopHeroCtl(this._shopNodeCtl);
		                this._shopNodeCtl._shopType = 0;
		                this._shopNodeCtl.onHeroClicked();
	                }
                }.bind(this);
                this.buy(this._productInfo.priceType, this._productInfo.className, this._priceValue, successCallback, failCallback);
                break;
            case 5 /* UnSelect */:
                DataManager.getInstance().setCurrentCharacterName(this._productInfo.className);
                this.updateTable();
                break;
            case 6 /* URL */:
                if (this._productInfo.config.value) {
                    vee.Utils.rateUs();
                }
                break;
            case 8 /* Restore */:
                successCallback = function (idsString) {
                    if (!idsString || idsString === "") {
                        vee.PopMgr.alert(
	                        vee.Utils.getObjByLanguage("No purchases found.", "没有找到商品"),
	                        vee.Utils.getObjByLanguage("Warning", "警告")
                        );
                        return;
                    }

                    var productIDs = idsString.split(",");
                    productIDs = productIDs.filter(function (id) {
                        return id !== "";
                    });
                    if (productIDs.indexOf(app.Config.IAPs.NonConsumable.HeroPack) >= 0) {
                        if (!DataManager.getInstance().isHeroPackPurchased()) {
                            DataManager.getInstance().upgradeProduct(STORE_PRODUCT.HeroShopData.HERO_PACK.className);
                        }
                        if (!DataManager.getInstance().isDoubleSoul()) {
                            DataManager.getInstance().upgradeProduct(STORE_PRODUCT.SoulShopData.DOUBLE.className);
                        }
                        DataManager.getInstance().unlockAllHeroes();
                    } else {
                        productIDs.forEach(function (id) {
                            switch (id) {
                                case app.Config.IAPs.NonConsumable.DoubleSouls:
                                    if (!DataManager.getInstance().isDoubleSoul()) {
                                        DataManager.getInstance().upgradeProduct(STORE_PRODUCT.SoulShopData.DOUBLE.className);
                                    }
                                    break;
                                case app.Config.IAPs.NonConsumable.HeroSakura:
                                    DataManager.getInstance().unlockCharacter(2 /* SAKURA */);
                                    break;
                                case app.Config.IAPs.NonConsumable.HeroPaladin:
                                    DataManager.getInstance().unlockCharacter(3 /* PALADIN */);
                                    break;
                                case app.Config.IAPs.NonConsumable.HeroMystery:
                                    DataManager.getInstance().unlockCharacter(4 /* SHADOW */);
                                    break;
                            }
                        });
                    }
                    this.updateTable();
                    vee.PopMgr.alert(vee.Utils.getObjByLanguage("Restore purchases successfully", "恢复购买成功"), vee.Utils.getObjByLanguage("Success", "成功"));
                }.bind(this);
                failCallback = function () {
                    vee.PopMgr.alert(vee.Utils.getObjByLanguage("Failed to restore purchases.", "恢复购买失败"), vee.Utils.getObjByLanguage("Error", "错误"));
                };
                vee.IAPMgr.restoreProduct(successCallback, failCallback);
                break;
	        case 9 /* EXCHANGE */:
		        ExchangeCodeCtl.show();
		        break;
        }
    };

    ShopCell.prototype.updateTable = function () {
        var offset = this._tableView.getContentOffset();
        this._tableView.reloadData();
        this._tableView.setContentOffset(offset);
    };

    ShopCell.prototype.updateInfo = function (info) {
	    if (!info) return;
        this.setName(info.name);
        this._productInfo = info;
        var lockedResult = STORE_FUNCTIONS.parseLockFilters(info.className, info.lockFilter, this._shopNodeCtl.unlockingData);
        if (lockedResult.locked) {
            this.setNameColor(this._colorLockedName);
            this.setDetail(info.details[0]);
            this.setIcon(info.iconLock);
            if (lockedResult.canUnlock) {
                this.setBtnState(1 /* Unlock */);
            } else {
                this.setBtnState(0 /* Lock */);
            }
            this.lbLevel.visible = false;
            this.spSoul.visible = false;
            this.lbPrice.visible = false;
            this.lbUnlockDetail.visible = false;

            if (lockedResult.lockInfo.soul) {
                this.setSoulPrice(lockedResult.lockInfo.soul);
                this._productInfo.priceType = STORE_ENUM.PriceType.SOUL;
                this._priceValue = lockedResult.lockInfo.soul;
            } else if (lockedResult.lockInfo.money) {
                this.setMoneyPrice(lockedResult.lockInfo.money);
                this._productInfo.priceType = STORE_ENUM.PriceType.MONEY;
                this._priceValue = lockedResult.lockInfo.money;
            }
            if (lockedResult.lockInfo.detail) {
                this.setLockDetail(lockedResult.lockInfo.detail);
            }
        } else {
            this.setNameColor(this._colorUnLockedName);
            var level = DataManager.getInstance().getProductData()[info.className];
            if (level === undefined || level < 0) {
                level = 0;
            }
            var isMax = level === info.max;
            var currentLevelIdx = Math.max(level - 1, 0);
            var nextLevelIdx = level + 1 - 1;
            var maxLevelIdx = info.max - 1;
            if (level > 0) {
                this.setIcon(info.icon);
            } else {
                this.setIcon(info.iconLock);
            }
            this.setDetail(info.details[currentLevelIdx]);
            this.lbUnlockDetail.visible = false;

            this._priceValue = info.prices[Math.min(nextLevelIdx, maxLevelIdx)];

            switch (info.type) {
                case STORE_ENUM.BuyActionType.PERSIST:
                case STORE_ENUM.BuyActionType.PERSIST_ONCE:
                    this.setBtnState(3 /* Buy */);
                    this.setPrice(info.priceType, this._priceValue, isMax, vee.Utils.getObjByLanguage("Purchased", "已购买"));
                    this.lbLevel.visible = false;
                    break;
                case STORE_ENUM.BuyActionType.SLOT:
                    this.setBtnState(3 /* Buy */);
                    var slot = DataManager.getInstance().getProductData()[info.className + "_SLOT"];
                    this.setSlot(slot);
	                isMax = false;
                    this.setPrice(info.priceType, this._priceValue, isMax, vee.Utils.getObjByLanguage("Full", "已满"));
                    break;
                case STORE_ENUM.BuyActionType.INSTANT:
                    this.setBtnState(3 /* Buy */);
                    this.lbLevel.visible = false;
                    this.setPrice(info.priceType, this._priceValue, false, "");
                    break;
                case STORE_ENUM.BuyActionType.LEVEL:
                    if (level === 0)
                        this.setBtnState(1 /* Unlock */);
                    else
                        this.setBtnState(2 /* Upgrade */);
                    this.setLevel(level);
                    this.setPrice(info.priceType, this._priceValue, isMax, vee.Utils.getObjByLanguage("Level Max", "已达最大等级"));
                    break;
                case STORE_ENUM.BuyActionType.URL:
                    this.setBtnState(6 /* URL */);
                    this.lbLevel.visible = false;
                    this.lbPrice.visible = false;
                    this.spSoul.visible = false;
                    break;
                case STORE_ENUM.BuyActionType.LABEL:
                    this.setBtnState(10 /* None */);
                    this.lbLevel.visible = false;
                    this.lbPrice.visible = false;
                    this.spSoul.visible = false;
                    break;
                case STORE_ENUM.BuyActionType.RESTORE:
                    this.setBtnState(8 /* Restore */);
                    this.lbLevel.visible = false;
                    this.lbPrice.visible = false;
                    this.spSoul.visible = false;
                    break;
	            case STORE_ENUM.BuyActionType.EXCHANGE:
		            this.setBtnState(9 /* URL */);
		            this.lbLevel.visible = false;
		            this.lbPrice.visible = false;
		            this.spSoul.visible = false;
		            break;
                case STORE_ENUM.BuyActionType.CHARACTER:
                    var selected = DataManager.getInstance().isCharacterSelected(info.className);
                    if (selected) {
                        this.setBtnState(4 /* Select */);
                    } else {
                        this.setBtnState(5 /* UnSelect */);
                    }
                    this.lbLevel.visible = false;
                    this.spSoul.visible = false;
                    this.lbPrice.visible = false;

                    // Max do not work on characters.
                    isMax = false;
                    break;
            }
            if (isMax && this._btnState !== 10 /* None */) {
                this.setBtnState(7 /* FULL */);
            }
        }
    };

    ShopCell.prototype.buy = function (priceType, className, value, success, fail) {
        var successWrapper = function () {
            this._ccbNode.animationManager.runAnimationsForSequenceNamed("Buy");
            this.psBought.visible = true;
            this.psBought.resetSystem();
            var duration = this.psBought.getDuration();
            this.scheduleOnce(function () {
                this.psBought.visible = false;
            }.bind(this), duration);
            vee.Utils.callFunction(success);
        }.bind(this);
        var failWrapper = function () {
            this._ccbNode.animationManager.runAnimationsForSequenceNamed("No");
            vee.Utils.callFunction(fail);
        }.bind(this);

        switch (priceType) {
            case STORE_ENUM.PriceType.MONEY:
                this.buyWithMoney(value, className, successWrapper, failWrapper);
                break;
            case STORE_ENUM.PriceType.SOUL:
                this.buyWithSoul(value, successWrapper, failWrapper);
                break;
        }
    };
    ShopCell.prototype.buyWithSoul = function (value, success, fail) {
        var soul = DataManager.getInstance().getSoul();
        if (soul >= value) {
            vee.Analytics.logItemPurchase(this._productInfo.className, value);
            DataManager.getInstance().subSoul(value);
            this._shopNodeCtl.soulCtl.setNumber(soul - value);
            vee.Utils.callFunction(success);
        } else {
            vee.Utils.callFunction(fail);
	        if (DataManager.getInstance().isShopTutoring()) {
		        this._shopNodeCtl.rootNode.animationManager.runAnimationsForSequenceNamed("warn");
	        } else {
		        BuyItemAlertCtl.show(STORE_PRODUCT.SoulShopData.SOUL_PACK_3, this);
	        }
        }
    };
    ShopCell.prototype.buyWithMoney = function (value, className, success, fail) {
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
	        case STORE_PRODUCT.SoulShopData.SOUL_PACK_0.className:
		        productID = app.Config.IAPs.Consumable.SoulPack0;
		        isNonConsumable = false;
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
        }
        var orderID = vee.Utils.getTimeNow().toString();
        vee.Analytics.logChargeRequest(orderID, productID, value, "RMB");
        helper.buyProduct(productID, isNonConsumable, function () {
	        vee.Utils.callFunction(success);
            vee.Analytics.logChargeSuccess(orderID);
//            if (vee.data.adEnabled) {
//                vee.Ad.banAd();
//            }
        }.bind(this), function () {
            vee.Utils.callFunction(fail);
            vee.Analytics.logEvent("purchaseFailed", {
                "orderID": ''+orderID,
                "productID": ''+productID
            });
            this._shopNodeCtl.rootNode.animationManager.runAnimationsForSequenceNamed("buywarn");
        }.bind(this));
    };
    ShopCell.prototype.setIcon = function (name) {
        if (this._characterNode) {
            this._characterNode.removeFromParent();
            this._characterNode = null;
        }
        if (/\.ccbi$/.test(name)) {
            this._characterNode = cc.BuilderReader.load(name);
            this._characterNode.setAnchorPoint(0.5, 0.5);
            this._characterNode.setPosition(this.spIcon.getPosition());
            this._characterNode.animationManager.runAnimationsForSequenceNamed("stand");
            this._ccbNode.addChild(this._characterNode);
            this.spIcon.visible = false;
        } else {
            this.spIcon.visible = true;
            this.spIcon.initWithFile(name);
        }
    };
    ShopCell.prototype.setPrice = function (priceType, value, isMax, maxDetail) {
        if (isMax) {
            this.setMaxPrice(maxDetail);
        } else {
            switch (priceType) {
                case STORE_ENUM.PriceType.SOUL:
                    this.setSoulPrice(value);
                    break;
                case STORE_ENUM.PriceType.MONEY:
                    this.setMoneyPrice(value);
                    break;
            }
        }
    };
    ShopCell.prototype.setSoulPrice = function (value) {
        this.spSoul.visible = true;
        this.lbPrice.visible = true;
        this.lbPrice.x = this._xSoulPrice;
        this.lbPrice.setColor(this._colorSoul);
        this.lbPrice.setString(value.toString());
    };
    ShopCell.prototype.setMoneyPrice = function (value) {
        this.spSoul.visible = false;
        this.lbPrice.visible = true;
        this.lbPrice.x = this._xPrice;
	    this.lbPrice.setString("$" + value);
        this.lbPrice.setColor(this._colorMoney);
    };
    ShopCell.prototype.setMaxPrice = function (maxDetail) {
        this.spSoul.visible = false;
        this.lbPrice.visible = true;
        this.lbPrice.x = this._xPrice;
        this.lbPrice.setColor(this._colorMax);
        this.lbPrice.setString(maxDetail);
    };
    ShopCell.prototype.setLockDetail = function (lockDetail) {
        this.lbUnlockDetail.visible = true;
        if (this.lbPrice.visible) {
            this.lbUnlockDetail.x = this.lbPrice.x + this.lbPrice.getBoundingBox().width + 16.4;
            this.lbUnlockDetail.setString(vee.Utils.getObjByLanguage(" or ", "或") + lockDetail + vee.Utils.getObjByLanguage(" to unlock.", "来解锁"));
        } else {
            this.lbUnlockDetail.x = this._xPrice;
            this.lbUnlockDetail.setString(lockDetail + vee.Utils.getObjByLanguage(" to unlock.", "来解锁"));
        }
    };
    ShopCell.prototype.setName = function (name) {
        this.lbName.setString(name);
    };
    ShopCell.prototype.setNameColor = function (c) {
        this.lbName.setColor(c);
    };
    ShopCell.prototype.setDetail = function (d) {
        this.lbDetail.setString(d);
    };
    ShopCell.prototype.setBtnState = function (state) {
        this._btnState = state;
        this.btnClick.visible = true;
        this.btnClick.setEnabled(true);
        this.spBG.initWithFile(this._sBG);
        switch (state) {
            case 0 /* Lock */:
                this.btnClick.setBackgroundSpriteFrameForState(helper.getSpriteFrame(this._sLockBtn), cc.CONTROL_STATE_NORMAL);
                this.btnClick.setEnabled(false);
                this.spBG.initWithFile(this._sBGLock);
                break;
            case 1 /* Unlock */:
                this.btnClick.setBackgroundSpriteFrameForState(helper.getSpriteFrame(this._sUnlockBtn), cc.CONTROL_STATE_NORMAL);
                this.spBG.initWithFile(this._sBGLock);
                break;
            case 2 /* Upgrade */:
                this.btnClick.setBackgroundSpriteFrameForState(helper.getSpriteFrame(this._sUpgradeBtn), cc.CONTROL_STATE_NORMAL);
                break;
            case 3 /* Buy */:
                this.btnClick.setBackgroundSpriteFrameForState(helper.getSpriteFrame(this._sBuyBtn), cc.CONTROL_STATE_NORMAL);
                break;
            case 4 /* Select */:
                this.btnClick.setBackgroundSpriteFrameForState(helper.getSpriteFrame(this._sSelectBtn), cc.CONTROL_STATE_NORMAL);
                this.btnClick.setEnabled(false);
                break;
            case 5 /* UnSelect */:
                this.btnClick.setBackgroundSpriteFrameForState(helper.getSpriteFrame(this._sUnselectBtn), cc.CONTROL_STATE_NORMAL);
                break;
	        case 6 /* URL */:
	        case 8 /* Restore */:
	        case 9 /* Exchange */:
                this.btnClick.setBackgroundSpriteFrameForState(helper.getSpriteFrame(this._sUrlBtn), cc.CONTROL_STATE_NORMAL);
                break;
            case 7 /* FULL */:
                this.btnClick.visible = false;
                this.btnClick.setEnabled(false);
                break;
            case 10 /* None */:
                this.btnClick.visible = false;
                this.btnClick.setEnabled(false);
                this.spBG.initWithFile(this._sBGLock);
                break;
        }
    };
    ShopCell.prototype.setLevel = function (level) {
        if (level < 1) {
            this.lbLevel.visible = false;
        } else {
            this.lbLevel.visible = true;
            this.lbLevel.x = this.lbName.x + this.lbName.getBoundingBox().width + 16.5;
            this.lbLevel.setString("Lv." + level);
        }
    };
    ShopCell.prototype.setSlot = function (has) {
        this.lbLevel.visible = true;
        this.lbLevel.x = this.lbName.x + this.lbName.getBoundingBox().width + 16.5;
        this.lbLevel.setString("(" + has + ")");
    };
    return ShopCell;
})(cc.TableViewCell);
