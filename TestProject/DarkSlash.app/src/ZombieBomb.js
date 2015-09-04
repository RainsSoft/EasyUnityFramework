/**
* Created by yuan on 14-8-19.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="Enemy" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ZombieBomb = (function (_super) {
    __extends(ZombieBomb, _super);
    ZombieBomb["__ts"]=true;
    function ZombieBomb() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
    }
    ZombieBomb.prototype._getPropsFromCCB = function () {
        this._attackPrepareTime = this._ccbNode.animationManager.getSequenceDuration("pre_attack");
        this._attackRange = this.attackRectNode.getContentSize().width / 2;
    };
    ZombieBomb.prototype.getAttackRect = function () {
        var size = this.attackRectNode.getContentSize();
        var globalPos = this.attackRectNode.getParent().convertToWorldSpace(this.attackRectNode.getPosition());
        return cc.rect(globalPos.x - size.width / 2, globalPos.y - size.height / 2, size.width, size.height);
    };
    ZombieBomb.prototype.can_beAttack = function () {
        return (this.isState(0 /* APPEARING */) || this.isState(2 /* RUNNING */) || this.isState(1 /* STATIC */));
    };
    ZombieBomb.prototype._readyToAttack = function (dir, attackType) {
        this.setState(3 /* READY_ATTACK */);
        this.playAnimate("pre_attack", function () {
            this.attack();
        }.bind(this));
    };
    ZombieBomb.prototype.attack = function () {
        this.setState(4 /* ATTACKING */);
        this.playAnimate("attack", function () {
            this._corpseListener.onEntityCorpse(this);
            this._corpse();
        }.bind(this));
        this._killedPlayerListener.onRectKilledPlayer(this.getAttackRect(), this);
    };
    ZombieBomb.prototype.hurt = function (attack, murder) {
        this.setState(6 /* HURT */);
        this.stopAllActions();
        this.killedEffect();
        this._beAttackSound();
        this._life -= attack;
        if (this._hurtListener && this._hurtListener.onEntityHurt) {
            this._hurtListener.onEntityHurt(this);
        }
        this._readyToAttack(vee.Direction.Top);
    };
    return ZombieBomb;
})(Enemy);
