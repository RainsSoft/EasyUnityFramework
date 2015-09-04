/**
* Created by yuan on 14-8-8.
*/
/// <reference path="Entity" />
/// <reference path="../appConfig" />
/// <reference path="../helper" />
/// <reference path="../config" />
/// <reference path="../NodeCtl/GameNodeCtl" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EffectZOrder;
(function (EffectZOrder) {
    EffectZOrder[EffectZOrder["Node"] = 0] = "Node";
    EffectZOrder[EffectZOrder["Particle"] = 1] = "Particle";
    EffectZOrder[EffectZOrder["Blood"] = 2] = "Blood";
    EffectZOrder[EffectZOrder["ItemEffect"] = 3] = "ItemEffect";
})(EffectZOrder || (EffectZOrder = {}));

var ItemTag;
(function (ItemTag) {
    ItemTag[ItemTag["Magnet"] = 0] = "Magnet";
    ItemTag[ItemTag["Shield"] = 1] = "Shield";
    ItemTag[ItemTag["Power"] = 2] = "Power";
    ItemTag[ItemTag["Time"] = 3] = "Time";
})(ItemTag || (ItemTag = {}));

var Player = (function (_super) {
    __extends(Player, _super);
    Player["__ts"]=true;
    function Player() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
        this._itemRange = 50;
        this._powerFields = [];
        this._itemEnabledArr = {};
        this._globalSwordKeeStartPos = null;
        this._swordKeeCrazeName = "efx/efx_fz_sword.png";
    }
    Player.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this._runningIndicator = cc.Sprite.create("#ba_img_direction.png");
        this._runningIndicator.setPosition(this.width / 2, this.height / 2);
        this._runningIndicator.setAnchorPoint(0.5, this._runningIndicatorAnchorY);
        this.hideIndicator();
        this.addChild(this._runningIndicator);

        this.setSwordKeeSprite(this._swordKeeName);
        //        this.setParticle(this._particleCCB);
    };

    //    setParticle(particleCCB: string){
    //        if (particleCCB){
    //            this._particleNode = cc.BuilderReader.load(particleCCB);
    //            this._particleNode.setAnchorPoint(0.5, 0.5);
    //            this._particleNode.setPosition(this.width/2, this.height/2);
    //            this.addChild(this._particleNode, EffectZOrder.Particle);
    //        }
    //    }
    Player.prototype.setSwordKeeSprite = function (name) {
        var opacity;
        if (!this._swordKeeSprite) {
            opacity = 0;
            this._swordKeeSprite = cc.Sprite.create(name);
            this._effectListener.onAddEffectNode(this._swordKeeSprite);
        } else {
            opacity = this._swordKeeSprite.getOpacity();
            this._swordKeeSprite.initWithFile(name);
        }
        this._swordKeeSprite.setAnchorPoint(0.5, 0);
        this._swordKeeSprite.setOpacity(opacity);
    };

    Player.prototype.getGlobalSwordKeePos = function () {
        var parent = this.swordKeePosNode.getParent();
        return parent.convertToWorldSpace(this.swordKeePosNode.getPosition());
    };
    Player.prototype.getGlobalSwordKeeStartPos = function () {
        return this._globalSwordKeeStartPos;
    };

    /** Item **/
    Player.prototype.getItemRange = function () {
        return this._itemRange;
    };
    Player.prototype.disableShieldEffect = function (dt) {
        this._itemEnabledArr[ITEM_TYPE.SHIELD.className] = null;
        var effect = this.getChildByTag(1 /* Shield */);
        if (effect) {
            // remove instantly
            if (dt === -1) {
                effect.removeFromParent();
            } else {
                var duration = effect.animationManager.getSequenceDuration("end");
                effect.animationManager.runAnimationsForSequenceNamed("end");
                effect.scheduleOnce(function () {
                    effect.removeFromParent();
                }, duration);
            }
        }
    };
    Player.prototype.disableMagnetEffect = function (dt) {
        this._itemEnabledArr[ITEM_TYPE.MAGNET.className] = null;
        this._itemRange = this._originalProps["_itemRange"];
        var effect = this.getChildByTag(0 /* Magnet */);
        if (effect) {
            effect.removeFromParent();
        }
    };
    Player.prototype.disablePowerEffect = function (dt) {
        this.setSwordKeeSprite(this._swordKeeName);

        this._itemEnabledArr[ITEM_TYPE.POWER.className] = null;
        while (this._powerFields.length > 0) {
            var field = this._powerFields.pop();
            this[field] = this._originalProps[field];
        }
        var effect = this.getChildByTag(2 /* Power */);
        if (effect) {
            effect.removeFromParent();
        }
    };
    Player.prototype.disableTimeEffect = function (dt) {
        this._itemEnabledArr[ITEM_TYPE.TIME.className] = null;
        var effect = this.getChildByTag(3 /* Time */);
        if (effect) {
            effect.removeFromParent();
        }
    };

    Player.prototype.isItemEnabled = function (itemName) {
        return this._itemEnabledArr[itemName];
    };
    Player.prototype.enableItem = function (itemName) {
        var effectNode = null;
        switch (itemName) {
            case ITEM_TYPE.SOUL.className:
                effectNode = cc.BuilderReader.load("efx_getsoul.ccbi");
                effectNode.animationManager.runAnimationsForSequenceNamed("new");
                var duration = effectNode.animationManager.getSequenceDuration("new");
                this.scheduleOnce(function () {
                    effectNode.removeFromParent();
                }, duration);
                break;
            case ITEM_TYPE.SHIELD.className:
                effectNode = cc.BuilderReader.load("efx_sheild.ccbi");
                effectNode.animationManager.runAnimationsForSequenceNamed("new2");
                effectNode.setTag(1 /* Shield */);

                this.disableShieldEffect(-1);
                this.unschedule(this.disableShieldEffect);
                this.scheduleOnce(this.disableShieldEffect, ITEM_TYPE.getShieldValue().duration);
                break;
            case ITEM_TYPE.MAGNET.className:
                var value = ITEM_TYPE.getMagnetValue();
                effectNode = cc.BuilderReader.load("efx_pull.ccbi");
                effectNode.animationManager.runAnimationsForSequenceNamed("new");
                effectNode.setTag(0 /* Magnet */);

                this.disableMagnetEffect();
                this.unschedule(this.disableMagnetEffect);
                this.scheduleOnce(this.disableMagnetEffect, value.duration);
                this._itemRange = value.range;
                break;
            case ITEM_TYPE.POWER.className:
                effectNode = cc.BuilderReader.load("efx_power.ccbi");
                effectNode.animationManager.runAnimationsForSequenceNamed("new");
                effectNode.setTag(2 /* Power */);
                var powerValue = ITEM_TYPE.getPowerValue();
                this.disablePowerEffect();
                this.unschedule(this.disablePowerEffect);
                this.setSwordKeeSprite(this._swordKeeCrazeName);
                this.scheduleOnce(this.disablePowerEffect, powerValue.duration);
                for (var p in powerValue.props) {
                    if (powerValue.props.hasOwnProperty(p)) {
                        this[p] = powerValue.props[p];
                        this._powerFields.push(p);
                    }
                }
                break;
            case ITEM_TYPE.TIME.className:
                effectNode = cc.BuilderReader.load("efx_time.ccbi");
                effectNode.animationManager.runAnimationsForSequenceNamed("new");
                effectNode.setTag(3 /* Time */);
                var timeValue = ITEM_TYPE.getTimeValue();
                this.disableTimeEffect();
                this.unschedule(this.disableTimeEffect);
                this.scheduleOnce(this.disableTimeEffect, timeValue.duration);
                break;
        }
        if (effectNode) {
            effectNode.setAnchorPoint(0.5, 0.5);
            if (itemName === ITEM_TYPE.SOUL.className) {
                effectNode.setPosition(this._width / 2, 0);
            } else {
                effectNode.setPosition(this._width / 2, this._height / 2);
            }
            this.addChild(effectNode, 3 /* ItemEffect */);
        }

        // Put on bottom.
        this._itemEnabledArr[itemName] = true;
    };

    /** EndItem **/
    Player.prototype.can_beAttack = function () {
        return (this.getState() !== 6 /* HURT */ && this.getState() !== 4 /* ATTACKING */ && this.getBeAttackState() === 0 /* BREAKABLE */ && !this.isItemEnabled(ITEM_TYPE.SHIELD.className));
    };

    Player.prototype.can_beFireAttack = function () {
        return (this.getState() !== 6 /* HURT */ && this.getBeAttackState() === 0 /* BREAKABLE */ && !this.isItemEnabled(ITEM_TYPE.SHIELD.className));
    };

    Player.prototype._setStandAnimate = function (dir) {
        this._setFlipX(false);
        switch (dir) {
            case vee.Direction.Top:
                this._runAnimate("stand_up");
                break;
            case vee.Direction.Right:
                this._runAnimate("stand_right");
                break;
            case vee.Direction.Bottom:
                this._runAnimate("stand_down");
                break;
            case vee.Direction.Left:
                this._setFlipX(true);
                this._runAnimate("stand_right");
                break;
        }
    };

    Player.prototype._setAttackAnimate = function (angle) {
        var dir = Math.floor(((360 + angle + 11.25) % 360) / 22.5);
        this._setFlipX(false);
        switch (dir) {
            case 0:
                this._runAnimate("attack_up");
                break;
            case 1:
                this._runAnimate("attack_22_up");
                break;
            case 2:
                this._runAnimate("attack_45_up");
                break;
            case 3:
                this._runAnimate("attack_66_up");
                break;
            case 4:
                this._runAnimate("attack_right");
                break;
            case 5:
                this._runAnimate("attack_22_down");
                break;
            case 6:
                this._runAnimate("attack_45_down");
                break;
            case 7:
                this._runAnimate("attack_66_down");
                break;
            case 8:
                this._runAnimate("attack_down");
                break;
            case 9:
                this._setFlipX(true);
                this._runAnimate("attack_66_down");
                break;
            case 10:
                this._setFlipX(true);
                this._runAnimate("attack_45_down");
                break;
            case 11:
                this._setFlipX(true);
                this._runAnimate("attack_22_down");
                break;
            case 12:
                this._setFlipX(true);
                this._runAnimate("attack_right");
                break;
            case 13:
                this._setFlipX(true);
                this._runAnimate("attack_66_up");
                break;
            case 14:
                this._setFlipX(true);
                this._runAnimate("attack_45_up");
                break;
            case 15:
                this._setFlipX(true);
                this._runAnimate("attack_22_up");
                break;
        }
    };

    Player.prototype._isPauseRunning = function (distanceToDest) {
        return distanceToDest <= this._runningSpeed;
    };

    Player.prototype.run = function () {
        // Since this.setRunningDestPos may not set a position.
        if (!this._runningDestPos) {
            return;
        }
        var nodePos = this.getPosition();
        var distance = vee.Utils.distanceBetweenPoints(nodePos, this._runningDestPos);

        var angleOfDir = vee.Utils.angleOfLine(nodePos, this._runningDestPos);
        var dir4 = vee.Direction.getDirectionByAngle(angleOfDir, true);
        this._setRunningAnimate(dir4);

        this._runningIndicator.setRotation(angleOfDir);

        if (this._isPauseRunning(distance)) {
            this.endRun(dir4);
            return;
        }
        var destPos = vee.Utils.getPointWithAngle(nodePos, this._runningSpeed, angleOfDir);
        destPos = this._getBoundaryOffset(null, destPos).pos;
        this.setPosition(destPos);
    };

    Player.prototype.hideIndicator = function () {
        if (this._runningIndicator) {
            var opacity = this._runningIndicator.getOpacity();
            if (opacity > 0) {
                this._runningIndicator.setOpacity(Math.max(opacity - 20, 0));
            }
        }
    };

    Player.prototype.showIndicator = function () {
        if (this._runningIndicator) {
            var opacity = this._runningIndicator.getOpacity();
            if (opacity < 255) {
                this._runningIndicator.setOpacity(Math.min(opacity + 20, 255));
            }
        }
    };

    Player.prototype.endRun = function (dir) {
        this.setState(1 /* STATIC */);
        this._runAnimate("stand_down");
    };

    Player.prototype._readyToAttack = function (dir) {
        var angle = vee.Utils.angleOfLine(this.getPosition(), this._runningDestPos);
        this.attack(angle);
    };

    Player.prototype.attack = function (angle) {
        this.setState(4 /* ATTACKING */);

        var offsetPos = vee.Utils.getPointWithAngle(cc.p(0, 0), this._attackRange, angle);

        // fix offset
        offsetPos = this._getBoundaryOffset(offsetPos).offset;

        // fix angle
        angle = vee.Utils.angleOfLine(cc.p(0, 0), offsetPos);

        var attackDuration = vee.Utils.distanceBetweenPoints(cc.p(0, 0), offsetPos) / this._attackSpeed;
        var bladeAnimate = cc.CallFunc.create(function () {
            this._attackAnimate(angle);
            this._globalSwordKeeStartPos = this.getGlobalSwordKeePos();
        }, this);
        var moveBy = cc.MoveBy.create(attackDuration, offsetPos);
        var ease = cc.EaseExponentialOut.create(moveBy);
        var attackEntities = cc.CallFunc.create(function () {
            this._attackSound();
            this._attackEffect(angle, attackDuration);
        }, this);
        var bladeFinish = cc.CallFunc.create(function () {
            this._afterAttack(angle);
        }, this);
        var seq = cc.Sequence.create(bladeAnimate, cc.Spawn.create(ease, attackEntities), bladeFinish);
        seq.setTag(5 /* ATTACKING */);
        this.runAction(seq);
    };

    Player.prototype._attackSound = function () {
        vee.Audio.playEffect("sfx_dash0" + vee.Utils.randomInt(1, 2) + ".mp3");
    };

    Player.prototype._attackAnimate = function (angle) {
        this._setAttackAnimate(angle);
    };

    Player.prototype._attackEffect = function (angle, attackDuration) {
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

    Player.prototype._afterAttack = function (angle) {
        var dir = vee.Direction.getDirectionByAngle(angle, true);
        this.setState(5 /* AFTER_ATTACK */);
        var delay = cc.DelayTime.create(this._afterAttackDuration);
        var callback = cc.CallFunc.create(function () {
            this.setState(1 /* STATIC */);
            this._setStandAnimate(dir);
        }, this);
        var seq = cc.Sequence.create(delay, callback);
        seq.setTag(6 /* AFTER_ATTACK */);
        this.runAction(seq);
    };

    Player.prototype._beAttackSound = function () {
        if (DataManager.getInstance().getCurrentCharacterID() === 2 /* SAKURA */) {
            vee.Audio.playEffect("sfx_skura_death.mp3");
        } else {
            vee.Audio.playEffect("sfx_death01.mp3");
        }
        vee.Audio.playEffect("sfx_slash0" + vee.Utils.randomInt(1, 3) + ".mp3");
    };

    Player.prototype.bloodEffect = function (callback) {
        var node = cc.BuilderReader.load("efx_blood.ccbi");
        node.setPosition(this.getPosition());
        node.setLocalZOrder(2 /* Blood */);
        this.getParent().addChild(node);
        node.setAutoRemoveOnFinish(true);
        var duration = node.getDuration();
        var seq = cc.Sequence.create(cc.DelayTime.create(duration), cc.CallFunc.create(function () {
            callback();
        }));
        seq.setTag(3 /* BLOOD_EFFECT */);
        this.runAction(seq);
    };

    Player.prototype.hurt = function (attack, murder) {
        this.setState(6 /* HURT */);
        vee.Analytics.logEvent("hurtBy", { name: ''+helper.getClassName(murder) });
        this.stopAllActions();
        this.killedEffect();
        this._swordKeeSprite.stopAllActions();
        this._swordKeeSprite.setOpacity(0);
        this._runAnimate("be hit");
        this._life -= attack;
        this._beAttackSound();
        if (this._hurtListener && this._hurtListener.onEntityHurt) {
            this._hurtListener.onEntityHurt(this);
        }
        if (this._life > 0) {
            var delay = cc.DelayTime.create(this._hurtDuration);
            var call = cc.CallFunc.create(function () {
                this.beBreakable();
                this.setState(1 /* STATIC */);
                this._runAnimate("stand_down");
            }, this);
            var seq = cc.Sequence.create(delay, call);
            seq.setTag(7 /* HURT */);
            this.runAction(seq);
        } else {
            this.stopActionByTag(7 /* HURT */);
            this.stopActionByTag(2 /* KILLED_EFFECT */);
            this.bloodEffect(this._corpse.bind(this));
        }
    };

    Player.prototype._corpse = function () {
        if (this._removeListener && this._removeListener.onEntityRemove) {
            this._removeListener.onEntityRemove(this);
        }
    };
    return Player;
})(Entity);
