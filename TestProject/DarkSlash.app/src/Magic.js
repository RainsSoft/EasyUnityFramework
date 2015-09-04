/**
* Created by yuan on 14-8-8.
*/
/// <reference path="DistantEnemy" />
/// <reference path="Missile/FireBall" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Magic = (function (_super) {
    __extends(Magic, _super);
    Magic["__ts"]=true;
    function Magic() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
    }
    Magic.prototype.setRunningDestPos = function (pos) {
        this._runningDestPos = pos;
        if (this.getState() === 3 /* READY_ATTACK */) {
            var angle = vee.Utils.angleOfLine(this.getPosition(), pos);
            var dir = vee.Direction.getDirectionByAngle(angle, true);
            this._setPreAttackAnimate(dir);
        }
    };
    Magic.prototype._readyToAttack = function (dir) {
        this.setState(3 /* READY_ATTACK */);
        var pullBow = cc.CallFunc.create(function () {
            vee.Audio.playEffect("sfx_bow_pull.mp3");
            this._setPreAttackAnimate(dir);
        }.bind(this));
        var delay = cc.DelayTime.create(this._attackPrepareTime);
        var blade = cc.CallFunc.create(function () {
            var angle = vee.Utils.angleOfLine(this.getPosition(), this._runningDestPos);
            this.attack(angle);
        }, this);
        var seq = cc.Sequence.create(pullBow, delay, blade);
        seq.setTag(4 /* READY_ATTACK */);
        this.runAction(seq);
    };
    Magic.prototype.shoot = function (angle) {
        if (!this._missileListener || !this._missileListener.onAddMissile) {
            return;
        }
        var containerSize = this.getParent().getContentSize();
        var longestDistanceOfContainer = Math.sqrt(Math.pow(containerSize.width, 2) * Math.pow(containerSize.height, 2));
        var longestPos = vee.Utils.getPointWithAngle(cc.p(0, 0), longestDistanceOfContainer, angle);

        var fireball = new FireBall(this._missileListener.getMissileActionManager());
        this._missileListener.onAddMissile(fireball);
        fireball.setOwner(this);
        fireball.setPosition(this.getPosition());
        fireball.setRotation(angle);
        var moveTo = cc.MoveTo.create(vee.Utils.distanceBetweenPoints(this.getPosition(), longestPos) / this._attackSpeed, longestPos);
        fireball.runAction(moveTo);
    };
    return Magic;
})(DistantEnemy);
