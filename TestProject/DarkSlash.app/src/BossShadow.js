var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-9-9.
*/
/// <reference path="../EntityFactory" />
/// <reference path="../../Manager/EnemyManager" />
/// <reference path="../Warrior" />
/// <reference path="../DistantEnemy" />
/// <reference path="../Missile/ShadowArrow" />
/// <reference path="../Missile/Shadow" />
var ShadowAttackType;
(function (ShadowAttackType) {
    ShadowAttackType[ShadowAttackType["ARROW"] = 0] = "ARROW";
    ShadowAttackType[ShadowAttackType["SHADOW"] = 1] = "SHADOW";
    ShadowAttackType[ShadowAttackType["WARRIOR"] = 2] = "WARRIOR";
    ShadowAttackType[ShadowAttackType["BLADE"] = 3] = "BLADE";
    ShadowAttackType[ShadowAttackType["NONE"] = 4] = "NONE";
})(ShadowAttackType || (ShadowAttackType = {}));
var BossShadow = (function (_super) {
    __extends(BossShadow, _super);
    BossShadow["__ts"]=true;
    function BossShadow() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
    }
    BossShadow.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        var now = vee.Utils.getTimeNow();
        this._lastArrowTimeMS = 0;
        this._lastShadowTimeMS = 0;
        this._lastWarriorTimeMS = now;

        this._swordKeeSprite = cc.Sprite.create(this._swordKeeName);
        this._swordKeeSprite.setAnchorPoint(0.5, 0);
        this._swordKeeSprite.setOpacity(0);
        this._effectListener.onAddEffectNode(this._swordKeeSprite);
    };

    BossShadow.prototype.can_beAttack = function () {
        return (this.getBeAttackState() === 0 /* BREAKABLE */ && this.getState() !== 6 /* HURT */ && this.getState() !== 0 /* APPEARING */);
    };

    BossShadow.prototype.appear = function () {
        this.setState(0 /* APPEARING */);
        this.playAnimate("born", function () {
            this.setState(1 /* STATIC */);
        }.bind(this));
    };

    BossShadow.prototype.getGlobalSwordKeePos = function () {
        var parent = this.swordKeePosNode.getParent();
        return parent.convertToWorldSpace(this.swordKeePosNode.getPosition());
    };

    BossShadow.prototype.setMissileListener = function (listener) {
        this._missileListener = listener;
    };

    BossShadow.prototype.shadowAvailable = function () {
        return vee.Utils.getTimeNow() - this._lastShadowTimeMS >= this._shadowDurationMS;
    };
    BossShadow.prototype.arrowAvailable = function () {
        return vee.Utils.getTimeNow() - this._lastArrowTimeMS >= this._arrowDurationMS;
    };
    BossShadow.prototype.warriorAvailable = function () {
        return vee.Utils.getTimeNow() - this._lastWarriorTimeMS >= this._warriorDurationMS;
    };

    BossShadow.prototype.run = function () {
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
        if (attackType !== 4 /* NONE */) {
            this._readyToAttack(dir, attackType);
        }

        var offsetX = deltaX === 0 ? deltaX : this._runningSpeed / distance * deltaX;
        var offsetY = deltaY === 0 ? deltaY : this._runningSpeed / distance * deltaY;
        this.setPosition(this._getBoundaryOffset(cc.p(offsetX, offsetY)).pos);
    };

    BossShadow.prototype.pauseRunningToAttack = function (distance) {
        if (distance <= this._attackRange) {
            if (this.shadowAvailable()) {
                return 1 /* SHADOW */;
            }
            return 3 /* BLADE */;
        } else if (this.arrowAvailable()) {
            return 0 /* ARROW */;
        } else if (this.warriorAvailable()) {
            return 2 /* WARRIOR */;
        }
        return 4 /* NONE */;
    };

    BossShadow.prototype._readyToAttack = function (dir, attackType) {
        this.setState(3 /* READY_ATTACK */);
        var angle = vee.Utils.angleOfLine(this.getPosition(), this._runningDestPos);
        var delay, attack, seq;
        switch (attackType) {
            case 3 /* BLADE */:
                this._setPreAttackAnimate(dir);
                delay = cc.DelayTime.create(this._attackPrepareTime);
                attack = cc.CallFunc.create(function () {
                    var angle = vee.Utils.angleOfLine(this.getPosition(), this._runningDestPos);
                    this.attack(angle);
                }, this);
                seq = cc.Sequence.create(delay, attack);
                seq.setTag(4 /* READY_ATTACK */);
                this.runAction(seq);
                break;
            case 0 /* ARROW */:
                this._runAnimate("fireattack");
                delay = cc.DelayTime.create(this._arrowAttackPrepareTime);
                attack = cc.CallFunc.create(function () {
                    this.shoot(dir, angle);
                }, this);
                seq = cc.Sequence.create(delay, attack);
                seq.setTag(4 /* READY_ATTACK */);
                this.runAction(seq);
                break;
            case 1 /* SHADOW */:
                this._runAnimate("pre_fireattack");
                delay = cc.DelayTime.create(this._shadowAttackPrepareTime);
                attack = cc.CallFunc.create(function () {
                    this.summonShadow(dir, angle);
                }, this);
                seq = cc.Sequence.create(delay, attack);
                seq.setTag(4 /* READY_ATTACK */);
                this.runAction(seq);
                break;
            case 2 /* WARRIOR */:
                this._runAnimate("pre_fireattack");
                delay = cc.DelayTime.create(this._shadowAttackPrepareTime);
                attack = cc.CallFunc.create(function () {
                    this.summonWarrior(dir, angle);
                }, this);
                seq = cc.Sequence.create(delay, attack);
                seq.setTag(4 /* READY_ATTACK */);
                this.runAction(seq);
                break;
        }
    };

    BossShadow.prototype._attackEffect = function (angle, attackDuration) {
        // In case the player is dead during attack.
        if (this.getState() !== 4 /* ATTACKING */) {
            return;
        }
        this._swordKeeSprite.stopAllActions();
        this._swordKeeSprite.setOpacity(255);
        this._swordKeeSprite.setRotation(angle);
        var scaleFactor = this._attackRange / this._swordKeeSprite.getContentSize().height;
        this._swordKeeSprite.setScaleY(0);
        var scale = cc.ScaleTo.create(attackDuration, scaleFactor);
        var ease = cc.EaseExponentialOut.create(scale);
        var fadeOut = cc.FadeOut.create(0.1);
        this._swordKeeSprite.setPosition(this.getGlobalSwordKeePos());
        this._swordKeeSprite.runAction(cc.Sequence.create(ease, fadeOut));
    };

    BossShadow.prototype.shoot = function (dir, angle) {
        if (!this._missileListener) {
            return;
        }
        this.setState(4 /* ATTACKING */);
        this._lastArrowTimeMS = vee.Utils.getTimeNow();
        var containerSize = this.getParent().getContentSize();
        var longestDistanceOfContainer = Math.sqrt(Math.pow(containerSize.width, 2) * Math.pow(containerSize.height, 2));
        for (var i = 0; i < 3; i++) {
            var arrowAngle = angle - 15 + i * 15;
            var longestPos = vee.Utils.getPointWithAngle(cc.p(0, 0), longestDistanceOfContainer, arrowAngle);
            var shadowArrow = new ShadowArrow(this._missileListener.getMissileActionManager());
            this._missileListener.onAddMissile(shadowArrow);
            shadowArrow.setOwner(this);
            shadowArrow.setPosition(this.getPosition());
            shadowArrow.setRotation(arrowAngle);
            var moveTo = cc.MoveTo.create(vee.Utils.distanceBetweenPoints(this.getPosition(), longestPos) / this._attackSpeed, longestPos);
            shadowArrow.runAction(moveTo);
        }

        var delay = cc.DelayTime.create(0.1);
        var afterAttack = cc.CallFunc.create(function () {
            this._afterAttack(angle);
        }, this);

        var seq = cc.Sequence.create(delay, afterAttack);
        seq.setTag(6 /* AFTER_ATTACK */);
        this.runAction(seq);
        vee.Audio.playEffect("sfx_shadow_arrow.mp3");
    };

    BossShadow.prototype.summonShadow = function (dir, angle) {
        this._lastShadowTimeMS = vee.Utils.getTimeNow();
        this.setState(4 /* ATTACKING */);
        var shadowCount = vee.Utils.randomChoice(this._shadowCount);
        for (var i = 0; i < shadowCount; i++) {
            var shadow = new Shadow(this._missileListener.getMissileActionManager(), vee.Utils.randomChoice(this._shadowScale), vee.Utils.randomChoice(this._shadowAttackDuration));
            this._missileListener.onAddMissile(shadow);
            shadow.setOwner(this);
            shadow.setPosition(helper.getRandomPosition(shadow.getContentSize(), this._missileListener.getMissileNode().getBoundingBox()));
        }

        var delay = cc.DelayTime.create(0.1);
        var afterAttack = cc.CallFunc.create(function () {
            this._afterAttack(angle);
        }, this);

        var seq = cc.Sequence.create(delay, afterAttack);
        seq.setTag(6 /* AFTER_ATTACK */);
        this.runAction(seq);
    };

    BossShadow.prototype.summonWarrior = function (dir, angle) {
        this._lastWarriorTimeMS = vee.Utils.getTimeNow();

        var warriorCount = vee.Utils.randomChoice(this._warriorCount);
        for (var i = 0; i < warriorCount; i++) {
            EntityFactory.createEnemy(ENTITY.WarriorDoom._className);
        }

        var delay = cc.DelayTime.create(0.1);
        var afterAttack = cc.CallFunc.create(function () {
            this._afterAttack(angle);
        }, this);
        var seq = cc.Sequence.create(delay, afterAttack);
        seq.setTag(6 /* AFTER_ATTACK */);
        this.runAction(seq);
    };

    BossShadow.prototype.hurt = function (attack, murder) {
        this._swordKeeSprite.stopAllActions();
        this._swordKeeSprite.setOpacity(0);
        _super.prototype.hurt.call(this, attack, murder);
    };
    BossShadow.prototype._corpse = function () {
        this.playAnimate("corpse", function () {
            this.setLocalZOrder(-1);
            if (this._removeListener && this._removeListener.onEntityRemove) {
                this._removeListener.onEntityRemove(this);
            }
        }.bind(this));
    };
    return BossShadow;
})(Warrior);
