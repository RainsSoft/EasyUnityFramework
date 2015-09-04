/**
* Created by yuan on 14-8-20.
*/
/// <reference path="Missile" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var IceBall = (function (_super) {
    __extends(IceBall, _super);
    IceBall["__ts"]=true;
    function IceBall(actionManager) {
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
        this._ccbNode = cc.BuilderReader.load("iceci.ccbi");
        this.collectSpritesFromCCB(this._ccbNode);
        this.setActionManager(actionManager);

        this.setContentSize(this._ccbNode.getContentSize());
        this._ccbNode.animationManager.runAnimationsForSequenceNamed("new");
        this.addChild(this._ccbNode);
        this.setAnchorPoint(0.5, 0);
        vee.Audio.playEffect("sfx_emy_fireball.mp3");
    }
    return IceBall;
})(Missile);
