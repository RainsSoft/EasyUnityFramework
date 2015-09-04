/**
* Created by yuan on 14-8-8.
*/
/// <reference path="Enemy" />
/// <reference path="Missile/Missile" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DistantEnemy = (function (_super) {
    __extends(DistantEnemy, _super);
    DistantEnemy["__ts"]=true;
    function DistantEnemy() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    DistantEnemy.prototype.setMissileListener = function (listener) {
        this._missileListener = listener;
    };

    DistantEnemy.prototype.setRunningDestPos = function (pos) {
        this._runningDestPos = pos;
        if (this.getState() === 3 /* READY_ATTACK */) {
            var angle = vee.Utils.angleOfLine(this.getPosition(), pos);
            var dir = vee.Direction.getDirectionByAngle(angle, true);
            this._setPreAttackAnimate(dir);
        }
    };

    DistantEnemy.prototype.shoot = function (angle) {
    };

    DistantEnemy.prototype.attack = function (angle) {
        if (!this._missileListener || !angle) {
            return;
        }
        this.setState(4 /* ATTACKING */);
        var fire = cc.CallFunc.create(function () {
            this.shoot(angle);
        }, this);
        var shootFinish = cc.CallFunc.create(function () {
            this._afterAttack(angle);
        }, this);
        var seq = cc.Sequence.create(fire, shootFinish);
        seq.setTag(5 /* ATTACKING */);
        this.runAction(seq);
    };
    return DistantEnemy;
})(Enemy);
