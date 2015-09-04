/**
* Created by yuan on 14-8-21.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../cocos2d.d.ts" />
/// <reference path="../../vee.d.ts" />
/// <reference path="Missile" />
var IcePrick = (function (_super) {
    __extends(IcePrick, _super);
    IcePrick["__ts"]=true;
    function IcePrick(actionManager) {
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
        this._ccbNode = cc.BuilderReader.load("ice_hill2.ccbi");
        this.collectSpritesFromCCB(this._ccbNode);
        this.setActionManager(actionManager);

        this._ccbNode.animationManager.runAnimationsForSequenceNamed("new");

        this.setContentSize(this._ccbNode.getContentSize());
        this.setAnchorPoint(0.5, 0.5);
        this.addChild(this._ccbNode);

        var duration = this._ccbNode.animationManager.getSequenceDuration("new");
        this.scheduleOnce(this.remove, duration);
    }
    return IcePrick;
})(Missile);

var IcePrickIndicator = (function (_super) {
    __extends(IcePrickIndicator, _super);
    IcePrickIndicator["__ts"]=true;
    function IcePrickIndicator(actionManager, func, duration) {
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
        this._ccbNode = cc.BuilderReader.load("ice_hill.ccbi");
        this.collectSpritesFromCCB(this._ccbNode);
        this.setActionManager(actionManager);

        this._ccbNode.animationManager.runAnimationsForSequenceNamed("new");
        this.setContentSize(this._ccbNode.getContentSize());
        this.setAnchorPoint(0.5, 0.5);
        this.addChild(this._ccbNode);
        this.scheduleOnce(function () {
            func(this.getPosition());
            this.remove();
        }.bind(this), duration);
    }
    return IcePrickIndicator;
})(Missile);
