/**
* Created by yuan on 14-8-25.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var WhirlWindEffect = (function (_super) {
    __extends(WhirlWindEffect, _super);
    WhirlWindEffect["__ts"]=true;
    function WhirlWindEffect() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
        this._proportion = 1;
        this._attack = 1;
    }
    WhirlWindEffect.prototype.getAttack = function () {
        return this._attack;
    };
    WhirlWindEffect.prototype.setAttack = function (a) {
        this._attack = a;
    };

    WhirlWindEffect.prototype.setProperties = function (props) {
        this._proportion = props["range"];
        this.rootNode.setScale(this._proportion);
    };

    WhirlWindEffect.prototype.getWorldRect = function () {
        var pos = this.spWind.getParent().convertToWorldSpace(this.spWind.getPosition());
        var size = this.spWind.getBoundingBox();
        return cc.rect(pos.x - size.width / 2, pos.y - size.height / 2, size.width, size.height);
    };

    WhirlWindEffect.prototype.play = function () {
        this.playAnimate("new", function () {
            this.rootNode.removeFromParent();
        }.bind(this));
    };
    return WhirlWindEffect;
})(vee.Class);
