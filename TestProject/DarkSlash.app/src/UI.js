var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-8-21.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
var HeartCtl = (function (_super) {
    __extends(HeartCtl, _super);
    HeartCtl["__ts"]=true;
    function HeartCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
        this._enabledCount = 0;
        this._colorRed = { r: 255, g: 56, b: 16 };
        this._colorGray = { r: 66, g: 66, b: 66 };
        this._colorDisabled = { r: 66, g: 66, b: 66, a: 122.5 };
    }
    HeartCtl.prototype.setHeartSpriteNumber = function (totalNumber, enableNumber) {
        this._enabledCount = enableNumber;
        for (var i = 0; i < totalNumber; i++) {
            var spHeart = cc.Sprite.create("battle/ba_icon_heart.png");
            spHeart.setAnchorPoint(0, 0);

            if (i < enableNumber) {
                this.lightenHeart(spHeart);
            } else {
                this.disableHeart(spHeart);
            }

            var width = spHeart.getContentSize().width;
            spHeart.setPosition(i * width * 1.2, 0);

            this.rootNode.addChild(spHeart);
        }
    };
    HeartCtl.prototype.addHeartSprite = function () {
        var spriteCount = this.rootNode.getChildrenCount();
        var spHeart = cc.Sprite.create("battle/ba_icon_heart.png");
        spHeart.setAnchorPoint(0, 0);
        this.lightenHeart(spHeart);
        var width = spHeart.getContentSize().width;
        spHeart.setPosition(spriteCount * width * 1.2, 0);
        this.rootNode.addChild(spHeart);
    };
    HeartCtl.prototype.fullHearts = function () {
        var children = this.rootNode.getChildren();
        for (var i = this._enabledCount - 1; i >= 0; i--) {
            if (cc.colorEqual(children[i].getColor(), this._colorGray)) {
                this.lightenHeart(children[i]);
            }
        }
    };
    HeartCtl.prototype.loseLife = function () {
        var children = this.rootNode.getChildren();
        for (var i = children.length - 1; i >= 0; i--) {
            if (cc.colorEqual(children[i].getColor(), this._colorRed)) {
                this.grayedHeart(children[i]);
                return;
            }
        }
    };
    HeartCtl.prototype.lightenHeart = function (sp) {
        sp.setColor(this._colorRed);
    };
    HeartCtl.prototype.grayedHeart = function (sp) {
        sp.setColor(this._colorGray);
    };
    HeartCtl.prototype.disableHeart = function (sp) {
        sp.setColor(this._colorDisabled);
    };
    return HeartCtl;
})(cc.Class);

var MultiKillsNodeCtl = (function (_super) {
    __extends(MultiKillsNodeCtl, _super);
    MultiKillsNodeCtl["__ts"]=true;
    function MultiKillsNodeCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
    }
    MultiKillsNodeCtl.prototype.setKills = function (value) {
        this.lbKills.setString(value);
    };
    MultiKillsNodeCtl.prototype.show = function (value) {
        this.setKills(value);
        this.rootNode.animationManager.runAnimationsForSequenceNamed("Kills");
    };
    return MultiKillsNodeCtl;
})(cc.Class);
