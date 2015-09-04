var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-8-8.
*/
/// <reference path="BossSkeleton" />
var BossFire = (function (_super) {
    __extends(BossFire, _super);
    BossFire["__ts"]=true;
    function BossFire() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    BossFire.prototype.can_beAttack = function () {
        return (this.getBeAttackState() === 0 /* BREAKABLE */ && this.getState() !== 6 /* HURT */ && this.getState() !== 0 /* APPEARING */);
    };

    BossFire.prototype._attackEntities = function () {
        vee.Audio.playEffect("sfx_boss2_firering.mp3");
    };
    return BossFire;
})(BossSkeleton);
