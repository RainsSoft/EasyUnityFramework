var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-9-9.
*/
/// <reference path="Missile" />
var Shadow = (function (_super) {
    __extends(Shadow, _super);
    Shadow["__ts"]=true;
    function Shadow(actionManager, scale, liveDuration) {
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
        this._ccbNode = cc.BuilderReader.load("boss4_BlackAttack.ccbi");
        this.collectSpritesFromCCB(this._ccbNode);
        this.setActionManager(actionManager);

        this._ccbNode.animationManager.runAnimationsForSequenceNamed("huxi");
        this.setContentSize(this._ccbNode.getContentSize());
        this.setAnchorPoint(0.5, 0.5);
        this.addChild(this._ccbNode);

        this.setScale(0);
        var open = cc.ScaleTo.create(1, scale);
        var live = cc.DelayTime.create(liveDuration);
        var close = cc.ScaleTo.create(1, 0);
        var finish = cc.CallFunc.create(function () {
            this.remove();
        }, this);
        var seq = cc.Sequence.create(open, live, close, finish);
        this.runAction(seq);
    }
    return Shadow;
})(Missile);
