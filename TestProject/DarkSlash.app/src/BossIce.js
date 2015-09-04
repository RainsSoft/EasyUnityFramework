/**
* Created by yuan on 14-8-20.
*/
/// <reference path="../DistantEnemy" />
/// <reference path="../Enemy" />
/// <reference path="../Missile/IceBall" />
/// <reference path="../Missile/FireBall" />
/// <reference path="../Missile/IcePrick" />
/// <reference path="../Missile/IceFloat" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ICE_BOSS_ATTACK_TYPE;
(function (ICE_BOSS_ATTACK_TYPE) {
    ICE_BOSS_ATTACK_TYPE[ICE_BOSS_ATTACK_TYPE["SHOOT"] = 0] = "SHOOT";
    ICE_BOSS_ATTACK_TYPE[ICE_BOSS_ATTACK_TYPE["FlOAT"] = 1] = "FlOAT";
    ICE_BOSS_ATTACK_TYPE[ICE_BOSS_ATTACK_TYPE["PRICK"] = 2] = "PRICK";
})(ICE_BOSS_ATTACK_TYPE || (ICE_BOSS_ATTACK_TYPE = {}));

var BossIce = (function (_super) {
    __extends(BossIce, _super);
    BossIce["__ts"]=true;
    function BossIce() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
        this._startRunningTimeMS = 0;
        this._currentRunningPos = null;
        this._lastIceBallTimeMS = 0;
        this._lastFloatTimeMS = 0;
        this._lastPrickTimeMS = 0;
    }
    BossIce.prototype.setMissileListener = function (listener) {
        this._missileListener = listener;
    };

    BossIce.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        var now = vee.Utils.getTimeNow();
        this._lastIceBallTimeMS = 0;
        this._lastFloatTimeMS = 0;
        this._lastPrickTimeMS = now;
        this._startRunningTimeMS = 0;
        this._currentRunningPos = helper.getRandomPosition(this.getSize(), this.getParent().getBoundingBox());
    };

    BossIce.prototype.appear = function () {
        this.setState(0 /* APPEARING */);
        this.playAnimate("born", function () {
            this.setState(1 /* STATIC */);
        }.bind(this));
    };
    BossIce.prototype.can_beAttack = function () {
        return (this.getBeAttackState() === 0 /* BREAKABLE */ && this.getState() !== 6 /* HURT */ && this.getState() !== 0 /* APPEARING */);
    };

    BossIce.prototype.runningAvailable = function () {
        var thisPos = this.getPosition();
        var timeToRun = (vee.Utils.getTimeNow() - this._startRunningTimeMS) <= this._runningTime * 1000;
        var distanceToRun = vee.Utils.distancePower2BetweenPoints(this._currentRunningPos, thisPos) > this._runningSpeed * this._runningSpeed;
        return (timeToRun && distanceToRun);
    };

    BossIce.prototype.iceBallAvailable = function () {
        return (vee.Utils.getTimeNow() - this._lastIceBallTimeMS) > this._iceBallSummonDuration * 1000;
    };

    BossIce.prototype.iceFloatAvailable = function () {
        return (vee.Utils.getTimeNow() - this._lastFloatTimeMS) > this._iceFloatSummonDuration * 1000;
    };

    BossIce.prototype.icePrickAvailable = function () {
        return (vee.Utils.getTimeNow() - this._lastPrickTimeMS) > this._icePrickSummonDuration * 1000;
    };

    BossIce.prototype.summonFloat = function (dir) {
        this._lastFloatTimeMS = vee.Utils.getTimeNow();
        this._setAttackAnimate(dir);
        var floatCount = vee.Utils.randomChoice(this._iceFloatCount);
        for (var i = 0; i < floatCount; i++) {
            var float = new IceFloat(this._missileListener.getMissileActionManager());
            this._missileListener.onAddMissile(float);
            float.setOwner(this);
            float.fade(this._iceFloatLiveDuration);
            float.setPosition(helper.getRandomPosition(float.getContentSize(), this._missileListener.getMissileNode().getBoundingBox()));
        }
    };

    BossIce.prototype.summonPrick = function (dir) {
        this._lastPrickTimeMS = vee.Utils.getTimeNow();
        this._setAttackAnimate(dir);
        var prickCount = vee.Utils.randomChoice(this._icePrickCount);
        for (var i = 0; i < prickCount; i++) {
            var indicator = new IcePrickIndicator(this._missileListener.getMissileActionManager(), function (pos) {
                var prick = new IcePrick(this._missileListener.getMissileActionManager());
                prick.setOwner(this);

                // The ccb has an offset which make prick
                // a little bit below than indicator.
                prick.setPosition(pos);
                prick.setLocalZOrder(-1);
                this._missileListener.onAddMissile(prick);
                this._killedPlayerListener.onRectKilledPlayer(prick.getBoundingBox(), this);
            }.bind(this), this._icePrickPrepareTime);
            this._missileListener.onAddMissile(indicator);
            indicator.setOwner(this);
            indicator.setLocalZOrder(-1);
            indicator.setPosition(helper.getRandomPosition(cc.size(76, 156), this._missileListener.getMissileNode().getBoundingBox()));
        }
        vee.Utils.scheduleOnce(function () {
            vee.Audio.playEffect("sfx_icehill.mp3");
        }, this._icePrickPrepareTime);
    };

    BossIce.prototype.summonBall = function (angle, dir) {
        this._lastIceBallTimeMS = vee.Utils.getTimeNow();
        this._setIceBallAttackAnimate(dir);
        var containerSize = this.getParent().getContentSize();
        var longestDistanceOfContainer = Math.sqrt(Math.pow(containerSize.width, 2) * Math.pow(containerSize.height, 2));
        for (var i = 0; i < 3; i++) {
            var longestPos = vee.Utils.getPointWithAngle(cc.p(0, 0), longestDistanceOfContainer, angle - 15 + i * 15);
            var iceBall = new IceBall(this._missileListener.getMissileActionManager());
            this._missileListener.onAddMissile(iceBall);
            iceBall.setOwner(this);
            iceBall.setPosition(this.getPosition());
            iceBall.setRotation(angle);
            var moveTo = cc.MoveTo.create(vee.Utils.distanceBetweenPoints(this.getPosition(), longestPos) / this._attackSpeed, longestPos);
            iceBall.runAction(moveTo);
        }
        vee.Audio.playEffect("sfx_icebolt.mp3");
    };

    BossIce.prototype._setIceBallPreAttackAnimate = function (dir) {
        this._setFlipX(false);
        switch (dir) {
            case vee.Direction.Top:
                this._runAnimate("pre_fireattack_u");
                break;
            case vee.Direction.Right:
                this._runAnimate("pre_fireattack_r");
                break;
            case vee.Direction.Bottom:
                this._runAnimate("pre_fireattack_d");
                break;
            case vee.Direction.Left:
                this._setFlipX(true);
                this._runAnimate("pre_fireattack_r");
                break;
        }
    };

    BossIce.prototype._setIceBallAttackAnimate = function (dir) {
        this._setFlipX(false);
        switch (dir) {
            case vee.Direction.Top:
                this._runAnimate("fireattack_u");
                break;
            case vee.Direction.Right:
                this._runAnimate("fireattack_r");
                break;
            case vee.Direction.Bottom:
                this._runAnimate("fireattack_d");
                break;
            case vee.Direction.Left:
                this._setFlipX(true);
                this._runAnimate("fireattack_r");
                break;
        }
    };

    BossIce.prototype.run = function () {
        if (this.runningAvailable()) {
            var thisPos = this.getPosition();
            var angle = vee.Utils.angleOfLine(thisPos, this._currentRunningPos);
            var nextPos = vee.Utils.getPointWithAngle(thisPos, this._runningSpeed, angle);
            this._setRunningAnimate(vee.Direction.getDirectionByAngle(angle, true));
            nextPos = helper.beInRange(nextPos, this.getSize(), this.getParent().getBoundingBox());
            this.setPosition(nextPos);
        } else if (this.iceBallAvailable()) {
            this._readyToAttack(0 /* SHOOT */);
        } else if (this.iceFloatAvailable()) {
            this._readyToAttack(1 /* FlOAT */);
        } else if (this.icePrickAvailable()) {
            this._readyToAttack(2 /* PRICK */);
        } else {
            this._startRunningTimeMS = vee.Utils.getTimeNow();
            this._currentRunningPos = helper.getRandomPosition(this.getSize(), this.getParent().getBoundingBox());
        }
    };

    BossIce.prototype._readyToAttack = function (attackType) {
        if (!this._runningDestPos)
            return;
        var angle = vee.Utils.angleOfLine(this.getPosition(), this._runningDestPos);
        var dir = vee.Direction.getDirectionByAngle(angle, true);
        var delay, attack, seq;
        switch (attackType) {
            case 1 /* FlOAT */:
                if (this.iceFloatAvailable()) {
                    this.setState(3 /* READY_ATTACK */);
                    this._setPreAttackAnimate(dir);
                    delay = cc.DelayTime.create(this._attackPrepareTime);
                    attack = cc.CallFunc.create(function () {
                        this.toAttack(angle, dir, attackType);
                    }, this);
                    seq = cc.Sequence.create(delay, attack);
                    seq.setTag(4 /* READY_ATTACK */);
                    this.runAction(seq);
                }
                break;
            case 0 /* SHOOT */:
                if (this.iceBallAvailable()) {
                    this.setState(3 /* READY_ATTACK */);
                    this._setIceBallPreAttackAnimate(dir);
                    delay = cc.DelayTime.create(this._iceBallPrepareTime);
                    attack = cc.CallFunc.create(function () {
                        this.toAttack(angle, dir, attackType);
                    }, this);
                    seq = cc.Sequence.create(delay, attack);
                    seq.setTag(4 /* READY_ATTACK */);
                    this.runAction(seq);
                }
                break;
            case 2 /* PRICK */:
                if (this.icePrickAvailable()) {
                    this.setState(3 /* READY_ATTACK */);
                    this._setPreAttackAnimate(dir);
                    delay = cc.DelayTime.create(this._attackPrepareTime);
                    attack = cc.CallFunc.create(function () {
                        this.toAttack(angle, dir, attackType);
                    }, this);
                    seq = cc.Sequence.create(delay, attack);
                    seq.setTag(4 /* READY_ATTACK */);
                    this.runAction(seq);
                }
                break;
        }
    };

    BossIce.prototype.toAttack = function (angle, dir, attackType) {
        this.setState(4 /* ATTACKING */);
        this._attackAnimate(angle);
        var attack = cc.CallFunc.create(function () {
            switch (attackType) {
                case 1 /* FlOAT */:
                    this.summonFloat(dir);
                    break;
                case 2 /* PRICK */:
                    this.summonPrick(dir);
                    break;
                case 0 /* SHOOT */:
                    this.summonBall(angle, dir);
                    break;
            }
        }, this);
        var afterAttack = cc.CallFunc.create(function () {
            this._afterAttack(angle);
        }, this);
        var seq = cc.Sequence.create(attack, afterAttack);
        seq.setTag(5 /* ATTACKING */);
        this.runAction(seq);
    };

    BossIce.prototype.hurt = function (attack, murder) {
        this.setState(6 /* HURT */);
        this.stopAllActions();
        this.killedEffect();
        this._beAttackSound();
        this._life -= attack;
        if (this._hurtListener && this._hurtListener.onEntityHurt) {
            this._hurtListener.onEntityHurt(this);
        }
        if (this._life > 0) {
            var delay = cc.DelayTime.create(this._hurtDuration);
            var call = cc.CallFunc.create(function () {
                this.beBreakable();
                this.setState(1 /* STATIC */);
                this._runAnimate("stand_1");
            }, this);
            var seq = cc.Sequence.create(delay, call);
            seq.setTag(7 /* HURT */);
            this.runAction(seq);
        } else {
            this._corpseListener.onEntityCorpse(this);
            this._corpse();
        }
    };

    BossIce.prototype._corpse = function () {
        this.playAnimate("corpse", function () {
            this.setLocalZOrder(-1);
            if (this._removeListener && this._removeListener.onEntityRemove) {
                this._removeListener.onEntityRemove(this);
            }
        }.bind(this));
    };
    return BossIce;
})(Enemy);
