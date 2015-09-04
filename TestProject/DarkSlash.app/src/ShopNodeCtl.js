/**
* Created by yuan on 14-8-19.
*/
/// <reference path="../vee.d.ts" />
/// <reference path="../Shop/ShopCtl" />
/// <reference path="../Shop/ShopHeroCtl" />
/// <reference path="../Shop/ShopMagicCtl" />
/// <reference path="../Shop/ShopSoulCtl" />
/// <reference path="../Manager/DataManager" />
/// <reference path="../UI/HelpMaskLayer" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShopNodeCtl = (function (_super) {
    __extends(ShopNodeCtl, _super);
    ShopNodeCtl["__ts"]=true;
    function ShopNodeCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    Object.defineProperty(ShopNodeCtl.prototype, "CloseCallback", {
        set: function (c) {
            this._closeCallback = c;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ShopNodeCtl.prototype, "soulCtl", {
        get: function () {
            return this._soulCtl;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ShopNodeCtl.prototype, "unlockingData", {
        get: function () {
            if (!this._unlockingData) {
                this._unlockingData = DataManager.getInstance().getDataUnlockingStore();
            }
            return this._unlockingData;
        },
        enumerable: true,
        configurable: true
    });

    ShopNodeCtl.prototype.onDidLoadFromCCB = function () {
        this._shopType = STORE_ENUM.ShopType.Magic;
        this.btnMagic.setHighlighted(true);
        this._soulCtl = vee.ScoreController.registerController(this.lbSoul, DataManager.getInstance().getSoul());
        this.lbLevel.setString(DataManager.getInstance().getPlayerLevel().toString());

        this._tableView = cc.TableView.create(this.getDataSource(), this.lyShop.getContentSize());
        this._tableView.setDelegate(this.getDataSource());
        this._tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this._tableView.reloadData();
        this.lyShop.addChild(this._tableView);

        this.handleKey(true);
        this.queryUnlockNewIcon();
	    DataManager.getInstance().setShopTutoring(false);
	    game.oShop = this;
    };

    ShopNodeCtl.prototype.queryUnlockNewIcon = function () {
        var typeArray = STORE_FUNCTIONS.hasUnlockedProduct();
        this.spHeroNew.visible = false;
        this.spMagicNew.visible = false;
        typeArray.forEach(function (t) {
            switch (t) {
                case STORE_ENUM.ShopType.Hero:
                    this.spHeroNew.visible = true;
                    break;
                case STORE_ENUM.ShopType.Magic:
                    this.spMagicNew.visible = true;
                    break;
            }
        }, this);
    };

    ShopNodeCtl.prototype.setShop = function (type) {
        switch (type) {
            case STORE_ENUM.ShopType.Hero:
                this.onHeroClicked();
                break;
            case STORE_ENUM.ShopType.Magic:
                this.onMagicClicked();
                break;
            case STORE_ENUM.ShopType.Soul:
                this.onSoulClicked();
                break;
        }
    };

    ShopNodeCtl.prototype.showTutorial = function (callback) {
	    DataManager.getInstance().setShopTutoring(true);
        var cell = this._tableView.cellAtIndex(1);
        var pos = cell.btnClick.getParent().convertToWorldSpace(cell.btnClick.getPosition());
        var rect = cell.btnClick.getBoundingBox();
        vee.PopMgr.popLayer(new HelpMaskLayer(
	        vee.Utils.getObjByLanguage("Unlock this magic to enable it.", "购买这个魔法来激活它."),
	        pos, rect.width / 2, callback));
    };

    ShopNodeCtl.prototype.getDataSource = function () {
        switch (this._shopType) {
            case STORE_ENUM.ShopType.Hero:
                if (!this._heroDataSource)
                    this._heroDataSource = new ShopHeroCtl(this);
                return this._heroDataSource;
                break;
            case STORE_ENUM.ShopType.Magic:
                if (!this._magicDataSource)
                    this._magicDataSource = new ShopMagicCtl(this);
                return this._magicDataSource;
                break;
            case STORE_ENUM.ShopType.Soul:
                if (!this._soulDataSource)
                    this._soulDataSource = new ShopSoulCtl(this);
                return this._soulDataSource;
                break;
        }
    };

    ShopNodeCtl.prototype.onClosed = function () {
	    game.oShop = null;
	    if (game.oSaleBannerCtl) game.oSaleBannerCtl.refreshState(true);
        var duration = this.rootNode.animationManager.getSequenceDuration("close");
        this.rootNode.animationManager.runAnimationsForSequenceNamed("close");
        vee.Utils.scheduleOnce(function () {
            if (typeof this._closeCallback === "function") {
                this._closeCallback();
            }
            vee.PopMgr.closeLayerByCtl(this);
        }.bind(this), duration);
    };

    ShopNodeCtl.prototype.onMagicClicked = function () {
        this.btnMagic.setHighlighted(true);
        this.btnHero.setHighlighted(false);
        this.btnSoul.setHighlighted(false);

        if (this._shopType !== STORE_ENUM.ShopType.Magic) {
            this._shopType = STORE_ENUM.ShopType.Magic;
            this._tableView.setDataSource(this.getDataSource());
            this._tableView.setDelegate(this.getDataSource());
            this._tableView.reloadData();
            this.spShopTitle.initWithFile("shop/shop_title_magic.png");
        }
    };

    ShopNodeCtl.prototype.onHeroClicked = function () {
        this.btnMagic.setHighlighted(false);
        this.btnHero.setHighlighted(true);
        this.btnSoul.setHighlighted(false);

        if (this._shopType !== STORE_ENUM.ShopType.Hero) {
            this._shopType = STORE_ENUM.ShopType.Hero;
            this._tableView.setDataSource(this.getDataSource());
            this._tableView.setDelegate(this.getDataSource());
            this._tableView.reloadData();
            this.spShopTitle.initWithFile("shop/shop_title_hero.png");
        }
    };

    ShopNodeCtl.prototype.onSoulClicked = function () {
        this.btnMagic.setHighlighted(false);
        this.btnHero.setHighlighted(false);
        this.btnSoul.setHighlighted(true);

        if (this._shopType !== STORE_ENUM.ShopType.Soul) {
            this._shopType = STORE_ENUM.ShopType.Soul;
            this._tableView.setDataSource(this.getDataSource());
            this._tableView.setDelegate(this.getDataSource());
            this._tableView.reloadData();
            this.spShopTitle.initWithFile("shop/shop_title_souls.png");
        }
    };
    ShopNodeCtl.prototype.onKeyBack = function () {
	    if (DataManager.getInstance().isShopTutoring()) {
		    return true;
	    } else {
		    this.onClosed();
		    return true;
	    }
    };
    return ShopNodeCtl;
})(vee.Class);
