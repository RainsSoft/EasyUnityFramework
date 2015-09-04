var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-9-18.
*/
/// <reference path="../vee.d.ts" />
/// <reference path="../NodeCtl/HelpHandCtl" />
var HelpMaskLayer = (function (_super) {
    __extends(HelpMaskLayer, _super);
    HelpMaskLayer["__ts"]=true;
    function HelpMaskLayer(helpText, triggerPosition, triggerRadius, triggerCallback) {
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
        this._triggerPosition = this.convertToNodeSpace(triggerPosition);
        this._triggerRadius = triggerRadius;
        this._triggerCallback = triggerCallback;
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this._handleTouchBegan.bind(this),
            onTouchMoved: function () {
            },
            onTouchEnded: function () {
            },
            onTouchCancelled: function () {
            }
        });
        cc.eventManager.addListener(listener, this);
        this.setContentSize(cc.winSize);
        var hand = cc.BuilderReader.load("help_hand.ccbi");
        var handCtl = (hand.controller);
        handCtl.setPosition(this._triggerPosition);
        handCtl.setText(helpText);

        this.addChild(hand);
    }
    HelpMaskLayer.prototype._handleTouchBegan = function (touch, event) {
        if (cc.pDistance(touch.getLocation(), this._triggerPosition) <= this._triggerRadius) {
            if (typeof this._triggerCallback === "function") {
                this._triggerCallback();
            }
            this.scheduleOnce(this.removeFromParent.bind(this), 0.5);
            return false;
        }
        return true;
    };

    HelpMaskLayer.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
        cc.eventManager.removeListeners(this);
    };
    return HelpMaskLayer;
})(cc.Node);
