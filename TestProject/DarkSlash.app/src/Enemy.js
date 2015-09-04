/**
*
* Created by yuan on 14-8-8.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="Entity" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var Enemy = (function (_super) {
    __extends(Enemy, _super);
    Enemy["__ts"]=true;
    function Enemy() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    Enemy.prototype.setKilledPlayerListener = function (listener) {
        this._killedPlayerListener = listener;
    };

    Enemy.prototype.getScore = function () {
        return this._score;
    };

    Enemy.prototype.getSoul = function () {
        return vee.Utils.randomChoice(this._soul);
    };

    Enemy.prototype.getItemProbability = function () {
        return this._itemProbability;
    };

    Enemy.prototype.can_beAttack = function () {
        return (this.getBeAttackState() === 0 /* BREAKABLE */ && this.getState() !== 6 /* HURT */);
    };

    Enemy.prototype.run = function () {
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

        if (this._isPauseRunning(distance)) {
            this.endRun(dir);
            return;
        }

        var offsetX = deltaX === 0 ? deltaX : this._runningSpeed / distance * deltaX;
        var offsetY = deltaY === 0 ? deltaY : this._runningSpeed / distance * deltaY;
        this.setPosition(this._getBoundaryOffset(cc.p(offsetX, offsetY)).pos);
    };
    Enemy.prototype._isPauseRunning = function (distanceToDest) {
        return distanceToDest <= this._attackRange;
    };

    Enemy.prototype.endRun = function (dir) {
        this._readyToAttack(dir);
    };

    Enemy.prototype._readyToAttack = function (dir) {
        this.setState(3 /* READY_ATTACK */);
        this._setPreAttackAnimate(dir);
        var delay = cc.DelayTime.create(this._attackPrepareTime);
        var blade = cc.CallFunc.create(function () {
            var angle = vee.Utils.angleOfLine(this.getPosition(), this._runningDestPos);
            this.attack(angle);
        }, this);
        var seq = cc.Sequence.create(delay, blade);
        seq.setTag(4 /* READY_ATTACK */);
        this.runAction(seq);
    };

    Enemy.prototype._setPreAttackAnimate = function (dir) {
        this._setFlipX(false);
        switch (dir) {
            case vee.Direction.Top:
                this._runAnimate("pre_attack_u");
                break;
            case vee.Direction.Right:
                this._runAnimate("pre_attack_r");
                break;
            case vee.Direction.Bottom:
                this._runAnimate("pre_attack_d");
                break;
            case vee.Direction.Left:
                this._setFlipX(true);
                this._runAnimate("pre_attack_r");
                break;
        }
    };
    Enemy.prototype._setAttackAnimate = function (dir) {
        this._setFlipX(false);
        switch (dir) {
            case vee.Direction.TopLeft:
                this._setFlipX(true);
                this._runAnimate("attack_45_up");
                break;
            case vee.Direction.Top:
                this._runAnimate("attack_up");
                break;
            case vee.Direction.TopRight:
                this._runAnimate("attack_45_up");
                break;
            case vee.Direction.Right:
                this._runAnimate("attack_right");
                break;
            case vee.Direction.BottomRight:
                this._runAnimate("attack_45_down");
                break;
            case vee.Direction.Bottom:
                this._runAnimate("attack_down");
                break;
            case vee.Direction.BottomLeft:
                this._setFlipX(true);
                this._runAnimate("attack_45_down");
                break;
            case vee.Direction.Left:
                this._setFlipX(true);
                this._runAnimate("attack_right");
                break;
        }
    };
    Enemy.prototype.attack = function (angle) {
        this.setState(4 /* ATTACKING */);
        var attackStartPos = vee.Utils.getPointWithAngle(this.getPosition(), this._attackAnchorOffset, angle);
        var offsetPos = vee.Utils.getPointWithAngle(cc.p(0, 0), this._attackRange, angle);
        offsetPos = this._getBoundaryOffset(offsetPos).offset;

        var attackDuration = vee.Utils.distanceBetweenPoints(cc.p(0, 0), offsetPos) / this._attackSpeed;
        var bladeAnimate = cc.CallFunc.create(function () {
            this._attackAnimate(angle);
            this._attackSound();
        }, this);
        var moveBy = cc.MoveBy.create(attackDuration, offsetPos);
        var ease = cc.EaseExponentialOut.create(moveBy);
        var attackEntities = cc.CallFunc.create(function () {
            this._attackEffect(angle, attackDuration);
            this._attackEntities(attackStartPos, cc.pAdd(offsetPos, attackStartPos));
        }, this);
        var bladeFinish = cc.CallFunc.create(function () {
            this._afterAttack();
        }, this);
        var seq = cc.Sequence.create(bladeAnimate, cc.Spawn.create(ease, attackEntities), bladeFinish);
        seq.setTag(5 /* ATTACKING */);
        this.runAction(seq);
    };

    Enemy.prototype._attackEntities = function (startPos, endPos) {
        if (this._killedPlayerListener) {
            this._killedPlayerListener.onLineKilledPlayer(startPos, endPos, this);
        }
    };
    Enemy.prototype._attackAnimate = function (angle) {
        var dir = vee.Direction.getDirectionByAngle(angle, true);
        this._setAttackAnimate(dir);
    };

    Enemy.prototype._afterAttack = function (angle) {
        this.setState(5 /* AFTER_ATTACK */);
        var delay = cc.DelayTime.create(this._afterAttackDuration);
        var callback = cc.CallFunc.create(function () {
            this.setState(1 /* STATIC */);
        }, this);
        var seq = cc.Sequence.create(delay, callback);
        seq.setTag(6 /* AFTER_ATTACK */);
        this.runAction(seq);
    };
    Enemy.prototype._beAttackSound = function () {
        vee.Audio.playEffect("sfx_slash0" + vee.Utils.randomInt(1, 3) + ".mp3");
    };
    Enemy.prototype.bloodEffect = function (callback) {
        var node = cc.BuilderReader.load("efx_blood2.ccbi");
        if (this._ccbNode.getScaleX() < 0) {
            node.setScaleX(0 - node.getScaleX());
        }
        node.animationManager.runAnimationsForSequenceNamed("blood" + vee.Utils.randomInt(2, 6), false);
        node.animationManager.setCompletedAnimationCallback(node, function () {
            callback();
            this.animationManager.setCompletedAnimationCallback(this, null);
        }.bind(node));
        node.setPosition(this._width / 2, this._height / 2);
        this.addChild(node);
    };

    Enemy.prototype.hurt = function (attack, murder) {
        this.setState(6 /* HURT */);
        this.stopAllActions();
        this.killedEffect();
        this._beAttackSound();
        this._runAnimate("dead");
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
            this.bloodEffect(function () {
                this._corpse();
            }.bind(this));
        }
    };

    Enemy.prototype._corpse = function () {
        this._runAnimate("corpse");
        this.setLocalZOrder(-1);
        this._iterateChildSprites(function (sprite) {
            var delay = cc.DelayTime.create(10);
            var fadeOut = cc.FadeOut.create(1);
            var call = cc.CallFunc.create(function () {
                if (this._removeListener && this._removeListener.onEntityRemove) {
                    this._removeListener.onEntityRemove(this);
                }
            }, this);
            sprite.runAction(cc.Sequence.create(delay, fadeOut, call));
        }.bind(this));
    };
    return Enemy;
})(Entity);
