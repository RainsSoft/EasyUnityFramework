var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-8-21.
*/
/// <reference path="../../cocos2d.d.ts" />
/// <reference path="../../vee.d.ts" />
/// <reference path="Missile" />
var IceFloat = (function (_super) {
    __extends(IceFloat, _super);
    IceFloat["__ts"]=true;
    function IceFloat(actionManager) {
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
        this._ccbNode = cc.BuilderReader.load("iceball.ccbi");
        this.collectSpritesFromCCB(this._ccbNode);
        this.setActionManager(actionManager);
        this._ccbNode.animationManager.runAnimationsForSequenceNamed("born");
        this.addChild(this._ccbNode);
        this.setContentSize(this._ccbNode.getContentSize());
        this.setAnchorPoint(0.5, 0.5);
    }
    IceFloat.prototype.fade = function (duration) {
        var deadDuration = this._ccbNode.animationManager.getSequenceDuration("dead");
        this.runAction(cc.Sequence.create(cc.DelayTime.create(duration), cc.CallFunc.create(function () {
            this._ccbNode.animationManager.runAnimationsForSequenceNamed("dead");
        }, this), cc.DelayTime.create(deadDuration), cc.CallFunc.create(function () {
            this.remove();
        }, this)));
    };
    return IceFloat;
})(Missile);
