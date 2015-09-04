/**
* Created by yuan on 14-9-9.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="Missile" />
var ShadowArrow = (function (_super) {
    __extends(ShadowArrow, _super);
    ShadowArrow["__ts"]=true;
    function ShadowArrow(actionManager) {
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
        this._canBeDestroyed = false;
        this._ccbNode = cc.BuilderReader.load("ShadowArrow.ccbi");
        this.collectSpritesFromCCB(this._ccbNode);
        this.setActionManager(actionManager);

        this.setContentSize(this._ccbNode.getContentSize());
        this._ccbNode.animationManager.runAnimationsForSequenceNamed("huxi");
        this.addChild(this._ccbNode);
        this.setAnchorPoint(0.5, 0);
        vee.Audio.playEffect("sfx_emy_fireball.mp3");
    }
    return ShadowArrow;
})(Missile);
