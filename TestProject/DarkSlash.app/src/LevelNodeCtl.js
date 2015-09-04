var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-9-5.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
var LevelNodeCtl = (function (_super) {
    __extends(LevelNodeCtl, _super);
    LevelNodeCtl["__ts"]=true;
    function LevelNodeCtl() {
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
        this._enabledCount = 0;
    }
    LevelNodeCtl.prototype.onCreate = function () {
        this.lyItem.visible = false;
        this.lyRevive.visible = false;
        this.lySoulBonus.visible = false;
        this.lySouls.visible = false;

        this.rootNode.animationManager.setAutoPlaySequenceId(this.rootNode.animationManager.getSequenceId("open"));
        this.handleKey(true);
    };

    LevelNodeCtl.prototype.ready = function () {
        var containerWidth = this.lySoulBonus.getParent().width;
        var width = this.lySoulBonus.width;
        var count = this._enabledCount;
        var margin = (containerWidth - width * count) / (count + 1);
        var xPos = margin;

        if (this.lySouls.isVisible()) {
            this.lySouls.x = xPos;
            xPos += width + margin;
        }

        if (this.lyItem.isVisible()) {
            this.lyItem.x = xPos;
            xPos += width + margin;
        }

        if (this.lyRevive.isVisible()) {
            this.lyRevive.x = xPos;
            xPos += width + margin;
        }

        if (this.lySoulBonus.isVisible()) {
            this.lySoulBonus.x = xPos;
        }
    };

    LevelNodeCtl.prototype.setLevel = function (level) {
        this.lbLevel.setString(level.toString());
    };

    LevelNodeCtl.prototype.showItem = function (iconName, name) {
        this.lyItem.visible = true;
        this.spItemIcon.initWithFile(iconName);
        this.lbItemName.setString(name);
        this._enabledCount++;
    };

    LevelNodeCtl.prototype.showRevive = function () {
        this.lyRevive.visible = true;
        this._enabledCount++;
    };

    LevelNodeCtl.prototype.setCloseCallback = function (callback) {
        this._closeCallback = callback;
    };

    LevelNodeCtl.prototype.showBonus = function (percentage) {
        this.lySoulBonus.visible = true;
        this.lbSoulBonus.setString("+" + percentage + "%");
        this._enabledCount++;
    };

    LevelNodeCtl.prototype.showSouls = function (value) {
        this.lySouls.visible = true;
        this.lbSouls.setString("+" + value);
        this._enabledCount++;
    };

	LevelNodeCtl.prototype.onConfirmed = function () {
		this.playAnimate("close", function () {
			if (typeof this._closeCallback === "function") {
				this._closeCallback();
			}
			vee.PopMgr.closeLayerByCtl(this);
		}.bind(this));
	};
	LevelNodeCtl.prototype.onShare = function () {
		vee.Utils.shareScreen("我在#暗黑斩:英魂#中升到了"+this.lbLevel.getString()+"级，一起加入这场黑暗华丽的杀戮盛宴吧！"+"http://veewo.com/games/?name=darkslash2cn");
	};
    LevelNodeCtl.prototype.onKeyBack = function () {
        this.onConfirmed();
        return true;
    };
    return LevelNodeCtl;
})(vee.Class);
