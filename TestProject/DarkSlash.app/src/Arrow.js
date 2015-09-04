var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-8-8.
*/
/// <reference path="Missile" />
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    Arrow["__ts"]=true;
    function Arrow(actionManager) {
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
        this._canBeDestroyed = true;
        this._ccbNode = cc.Sprite.createWithSpriteFrameName("img_arrow.png");
        this.actionManager = actionManager;
        this._ccbNode.actionManager = actionManager;

        this.setContentSize(this._ccbNode.getContentSize());
        this._ccbNode.setPosition(this._ccbNode.getContentSize().width / 2, this._ccbNode.getContentSize().height / 2);
        this.addChild(this._ccbNode);
        this.setAnchorPoint(0.5, 0);
        vee.Audio.playEffect("sfx_bow_fire.mp3");
    }
    Arrow.prototype.destroyed = function (thisPos) {
        this.stopActionByTag(0 /* FLYING */);
        var layer = this.getParent();
        var broken1 = cc.Sprite.createWithSpriteFrameName("img_arrow_broken.png");
        var broken2 = cc.Sprite.createWithSpriteFrameName("img_arrow_broken.png");
        broken1.setPosition(thisPos);
        broken2.setPosition(thisPos);
        layer.addChild(broken1);
        layer.addChild(broken2);
        var jump1 = cc.JumpTo.create(0.5, cc.p(thisPos.x + vee.Utils.randomInt(-20, -10), thisPos.y), vee.Utils.randomInt(5, 15), 1);
        var rotate1 = cc.RotateBy.create(0.5, -360);
        var rotate2 = cc.RotateBy.create(0.5, 360);

        var jump2 = cc.JumpTo.create(0.5, cc.p(thisPos.x + vee.Utils.randomInt(10, 20), thisPos.y), vee.Utils.randomInt(5, 15), 1);
        var remove1 = cc.CallFunc.create(function () {
            this.removeFromParent();
        }, broken1);
        var remove2 = cc.CallFunc.create(function () {
            this.removeFromParent();
        }, broken2);
        vee.Audio.playEffect("sfx_bow_hit.mp3");
        var seq1 = cc.Sequence.create(cc.Spawn.create(jump1, rotate1), remove1);
        var seq2 = cc.Sequence.create(cc.Spawn.create(jump2, rotate2), remove2);
        seq1.setTag(1 /* BROKEN */);
        broken1.runAction(seq1);
        seq2.setTag(1 /* BROKEN */);
        broken2.runAction(seq2);
        this.remove();
    };
    return Arrow;
})(Missile);
