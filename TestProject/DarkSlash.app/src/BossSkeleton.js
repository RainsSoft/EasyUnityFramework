var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-8-8.
*/
/// <reference path="../DistantEnemy" />
/// <reference path="../Enemy" />
/// <reference path="../Missile/FireBall" />
var BossSkeleton = (function (_super) {
    __extends(BossSkeleton, _super);
    BossSkeleton["__ts"]=true;
    function BossSkeleton() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
        this._lastFireballTimeMS = 0;
    }
    BossSkeleton.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this._lastFireballTimeMS = (new Date()).getTime();
    };

    BossSkeleton.prototype.appear = function () {
        this.setState(0 /* APPEARING */);
        this.playAnimate("born", function () {
            this.setState(1 /* STATIC */);
        }.bind(this));
    };

    BossSkeleton.prototype.can_beAttack = function () {
        return (this.getBeAttackState() === 0 /* BREAKABLE */ && this.getState() !== 6 /* HURT */ && this.getState() !== 0 /* APPEARING */);
    };

    BossSkeleton.prototype.fireballAvailable = function () {
        var now = (new Date()).getTime();
        return (now - this._lastFireballTimeMS) > this._fireballDurationMS;
    };

    BossSkeleton.prototype.setMissileListener = function (listener) {
        this._missileListener = listener;
    };

    BossSkeleton.prototype.getWorldAttackBoundingBox = function () {
        var rect = this.attackArea.getBoundingBox();
        var worldPos = this.attackArea.getParent().convertToWorldSpace(cc.p(rect.x, rect.y));
        rect.y = worldPos.y;

        // if turned left then adjust rect x
        if (this._ccbNode.getScaleX() < 0) {
            rect.x = worldPos.x - rect.width;
        } else {
            rect.x = worldPos.x;
        }
        return rect;
    };

    BossSkeleton.prototype._setFireballPreAttackAnimate = function (dir) {
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

    BossSkeleton.prototype._setFireballPosAttackAnimate = function (dir) {
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

    BossSkeleton.prototype.run = function () {
        // Since this.setRunningDestPos may not set a position.
        if (!this._runningDestPos) {
            return;
        }
        var nodePos = this.getPosition();
        var distance = vee.Utils.distanceBetweenPoints(nodePos, this._runningDestPos);

        var deltaX = this._runningDestPos.x - nodePos.x;
        var deltaY = this._runningDestPos.y - nodePos.y;

        var angleOfDir = vee.Utils.angleOfLine(cc.p(0, 0), cc.p(deltaX, deltaY));
        var dir = vee.Direction.getDirectionByAngle(angleOfDir, true);

        this._setRunningAnimate(dir);
        var attackType = this.pauseRunningToAttack(distance);
        if (attackType !== 0 /* NONE */) {
            this._readyToAttack(dir, attackType);
        }

        var offsetX = deltaX === 0 ? deltaX : this._runningSpeed / distance * deltaX;
        var offsetY = deltaY === 0 ? deltaY : this._runningSpeed / distance * deltaY;
        this.setPosition(this._getBoundaryOffset(cc.p(offsetX, offsetY)).pos);
    };

    BossSkeleton.prototype.pauseRunningToAttack = function (distance) {
        if (distance <= this._attackRange) {
            return 1 /* CLOSE */;
        } else if (distance <= this._fireballAttackRange && this.fireballAvailable()) {
            return 2 /* DISTANT */;
        }
        return 0 /* NONE */;
    };

    BossSkeleton.prototype._readyToAttack = function (dir, attackType) {
        this.setState(3 /* READY_ATTACK */);
        var delay, attack, seq;
        switch (attackType) {
            case 1 /* CLOSE */:
                this._setPreAttackAnimate(dir);
                delay = cc.DelayTime.create(this._attackPrepareTime);
                attack = cc.CallFunc.create(function () {
                    var angle = vee.Utils.angleOfLine(this.getPosition(), this._runningDestPos);
                    this.attack(dir, angle);
                }, this);
                seq = cc.Sequence.create(delay, attack);
                seq.setTag(4 /* READY_ATTACK */);
                this.runAction(seq);
                break;
            case 2 /* DISTANT */:
                this._setFireballPreAttackAnimate(dir);
                delay = cc.DelayTime.create(this._fireballAttackPrepareTime);
                attack = cc.CallFunc.create(function () {
                    var angle = vee.Utils.angleOfLine(this.getPosition(), this._runningDestPos);
                    this.shoot(dir, angle);
                }, this);
                seq = cc.Sequence.create(delay, attack);
                seq.setTag(4 /* READY_ATTACK */);
                this.runAction(seq);
                break;
        }
    };

    BossSkeleton.prototype.attack = function (angle) {
        this.setState(4 /* ATTACKING */);
        var bladeAnimate = cc.CallFunc.create(function () {
            this._attackAnimate(angle);
        }, this);
        var attackEntities = cc.CallFunc.create(function () {
            this._attackEntities();
        }, this);
        var bladeFinish = cc.CallFunc.create(function () {
            this._afterAttack();
        }, this);
        var seq = cc.Sequence.create(bladeAnimate, cc.DelayTime.create(10 / 60), attackEntities, bladeFinish);
        seq.setTag(5 /* ATTACKING */);
        this.runAction(seq);
    };

    BossSkeleton.prototype._attackEntities = function () {
        if (this._killedPlayerListener) {
            this._killedPlayerListener.onRectKilledPlayer(this.getWorldAttackBoundingBox(), this);
            vee.Audio.playEffect("sfx_boss1_attack.mp3");
        }
    };

    BossSkeleton.prototype.shoot = function (dir, angle) {
        if (!this._missileListener) {
            return;
        }
        this.setState(4 /* ATTACKING */);
        this._lastFireballTimeMS = (new Date()).getTime();
        var containerSize = this.getParent().getContentSize();
        var longestDistanceOfContainer = Math.sqrt(Math.pow(containerSize.width, 2) * Math.pow(containerSize.height, 2));
        for (var i = 0; i < 3; i++) {
            var longestPos = vee.Utils.getPointWithAngle(cc.p(0, 0), longestDistanceOfContainer, angle - 15 + i * 15);
            var fireball = new FireBall(this._missileListener.getMissileActionManager());
            this._missileListener.onAddMissile(fireball);
            fireball.setOwner(this);
            fireball.setPosition(this.getPosition());
            fireball.setRotation(angle);
            var moveTo = cc.MoveTo.create(vee.Utils.distanceBetweenPoints(this.getPosition(), longestPos) / this._attackSpeed, longestPos);
            fireball.runAction(moveTo);
        }

        var delay = cc.DelayTime.create(0.1);
        var postAttack = cc.CallFunc.create(function () {
            this._setFireballPosAttackAnimate(dir);
        }, this);
        var afterAttack = cc.CallFunc.create(function () {
            this._afterAttack(angle);
        }, this);

        var seq = cc.Sequence.create(postAttack, delay, afterAttack);
        seq.setTag(6 /* AFTER_ATTACK */);
        this.runAction(seq);
        vee.Audio.playEffect("sfx_bow_fire.mp3");
    };

    BossSkeleton.prototype.bloodEffect = function (callback) {
        callback();
    };

    BossSkeleton.prototype._corpse = function () {
        this.playAnimate("corpse", function () {
            this.setLocalZOrder(-1);
            if (this._removeListener && this._removeListener.onEntityRemove) {
                this._removeListener.onEntityRemove(this);
            }
        }.bind(this));
    };
    return BossSkeleton;
})(Enemy);
