var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-8-8.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="Enemy" />
var Zombie = (function (_super) {
    __extends(Zombie, _super);
    Zombie["__ts"]=true;
    function Zombie() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    Zombie.prototype._attackSound = function () {
        vee.Audio.playEffect("sfx_emy1_attack" + vee.Utils.randomInt(1, 2) + ".mp3");
    };
    return Zombie;
})(Enemy);

var ZombieSoul = (function (_super) {
    __extends(ZombieSoul, _super);
    ZombieSoul["__ts"]=true;
    function ZombieSoul() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    return ZombieSoul;
})(Zombie);

var ZombieCrazy = (function (_super) {
    __extends(ZombieCrazy, _super);
    ZombieCrazy["__ts"]=true;
    function ZombieCrazy() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    return ZombieCrazy;
})(Zombie);
