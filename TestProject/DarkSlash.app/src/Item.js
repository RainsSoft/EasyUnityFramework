/**
* Created by yuan on 14-8-7.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="../Manager/ItemManager" />
/// <reference path="../config" />
/// <reference path="../Entity/Player" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ITEM_ACTION_TAG;
(function (ITEM_ACTION_TAG) {
    ITEM_ACTION_TAG[ITEM_ACTION_TAG["APPEAR"] = 0] = "APPEAR";
    ITEM_ACTION_TAG[ITEM_ACTION_TAG["DISAPPEAR"] = 1] = "DISAPPEAR";
})(ITEM_ACTION_TAG || (ITEM_ACTION_TAG = {}));

var Item = (function (_super) {
    __extends(Item, _super);
    Item["__ts"]=true;
    function Item(itemType, fromPos, toPos, itemManager) {
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
        this._moveDuration = 1;
        this._spreadDuration = 0.4;
        this._disappearDuration = 3;
        this._blinkDuration = 1;
        this._blinkNum = 90;
        this._totalDt = 0;
        this._itemName = itemType;
        var itemConfig = ITEM_TYPE[itemType];

        this.setContentSize(itemConfig.size);

        this._ccbNode = cc.BuilderReader.load(itemConfig.ccbPath);
        this._ccbNode.setAnchorPoint(0.5, 0.5);
        this._ccbNode.setPosition(itemConfig.size.width / 2, itemConfig.size.height / 2);
        this._ccbNode.animationManager.runAnimationsForSequenceNamed("new");

        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(0.5, 0.5);

        this.addChild(this._ccbNode);

        this.setPosition(fromPos);
        this._itemManager = itemManager;
        var appearAction = cc.Sequence.create(cc.EaseExponentialOut.create(cc.MoveTo.create(this._spreadDuration, toPos)), cc.CallFunc.create(function () {
            this._itemManager.beAvailable(this);
        }, this));
        appearAction.setTag(0 /* APPEAR */);
        this.runAction(appearAction);
    }
    Item.prototype.getName = function () {
        return this._itemName;
    };

    Item.prototype.beginMoveToPlayer = function (player, callback) {
        this._itemManager.beMoving(this);
        this.stopActionByTag(1 /* DISAPPEAR */);
        this.setVisible(true);
        this._player = player;
        this._triggerCallback = callback;
        this.scheduleUpdate();
    };

    Item.prototype.update = function (dt) {
        if (!this._player)
            return;
        this._totalDt += dt;

        var rate = this._totalDt * 2;
        if (rate >= this._moveDuration * 0.7) {
            this.trigger();
            this.unscheduleUpdate();
            this._itemManager.removeMovingItem(this);
            return;
        }
        var midPos = cc.pLerp(this.getPosition(), this._player.getPosition(), this._totalDt * 2 / this._moveDuration);
        this.setPosition(midPos);
    };

    Item.prototype.trigger = function () {
        if (typeof this._triggerCallback === "function") {
            this._triggerCallback(this._itemName);
        }
    };

    Item.prototype.fading = function () {
        if (this._player)
            return;
        var remove = cc.Sequence.create(cc.DelayTime.create(this._disappearDuration), cc.Blink.create(this._blinkDuration, this._blinkNum), cc.CallFunc.create(function () {
            this.unscheduleUpdate();
            this._itemManager.removeFadingItem(this);
        }, this));
        remove.setTag(1 /* DISAPPEAR */);
        this.runAction(remove);
    };
    return Item;
})(cc.Node);
