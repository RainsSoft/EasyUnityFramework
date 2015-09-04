var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-8-8.
*/
/// <reference path="Enemy" />
var Warrior = (function (_super) {
    __extends(Warrior, _super);
    Warrior["__ts"]=true;
    function Warrior() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
    }
    Warrior.prototype._setPreAttackAnimate = function (dir) {
        this._setFlipX(false);
        switch (dir) {
            case vee.Direction.Top:
                this._runAnimate("pre_attack_u");
                break;
            case vee.Direction.Right:
                this._runAnimate("pre_attack_r");
                break;
            case vee.Direction.Bottom:
                this._runAnimate("pre_attack_r");
                break;
            case vee.Direction.Left:
                this._setFlipX(true);
                this._runAnimate("pre_attack_r");
                break;
        }
    };

    Warrior.prototype._attackSound = function () {
        vee.Audio.playEffect("sfx_emy2_attack" + vee.Utils.randomInt(1, 2) + ".mp3");
    };
    return Warrior;
})(Enemy);

var WarriorBlack = (function (_super) {
    __extends(WarriorBlack, _super);
    WarriorBlack["__ts"]=true;
    function WarriorBlack() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
    }
    WarriorBlack.prototype.appear = function () {
        this.setState(0 /* APPEARING */);
        vee.Audio.playEffect("sfx_appear0" + vee.Utils.randomInt(1, 4) + ".mp3");
        this.playAnimate("born", function () {
            this.setState(1 /* STATIC */);
        }.bind(this));
    };
    return WarriorBlack;
})(Warrior);

var WarriorDoom = (function (_super) {
    __extends(WarriorDoom, _super);
    WarriorDoom["__ts"]=true;
    function WarriorDoom() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
    }
    return WarriorDoom;
})(WarriorBlack);
