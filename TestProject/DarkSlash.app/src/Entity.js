/**
* Created by yuan on 14-8-8.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="../config" />
/// <reference path="../helper" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ENTITY_STATE;
(function (ENTITY_STATE) {
    ENTITY_STATE[ENTITY_STATE["APPEARING"] = 0] = "APPEARING";
    ENTITY_STATE[ENTITY_STATE["STATIC"] = 1] = "STATIC";
    ENTITY_STATE[ENTITY_STATE["RUNNING"] = 2] = "RUNNING";
    ENTITY_STATE[ENTITY_STATE["READY_ATTACK"] = 3] = "READY_ATTACK";
    ENTITY_STATE[ENTITY_STATE["ATTACKING"] = 4] = "ATTACKING";
    ENTITY_STATE[ENTITY_STATE["AFTER_ATTACK"] = 5] = "AFTER_ATTACK";
    ENTITY_STATE[ENTITY_STATE["HURT"] = 6] = "HURT";
})(ENTITY_STATE || (ENTITY_STATE = {}));

var ENTITY_ACTION_TAG;
(function (ENTITY_ACTION_TAG) {
    ENTITY_ACTION_TAG[ENTITY_ACTION_TAG["APPEAR"] = 0] = "APPEAR";
    ENTITY_ACTION_TAG[ENTITY_ACTION_TAG["UNBREAKABLE"] = 1] = "UNBREAKABLE";
    ENTITY_ACTION_TAG[ENTITY_ACTION_TAG["KILLED_EFFECT"] = 2] = "KILLED_EFFECT";
    ENTITY_ACTION_TAG[ENTITY_ACTION_TAG["BLOOD_EFFECT"] = 3] = "BLOOD_EFFECT";
    ENTITY_ACTION_TAG[ENTITY_ACTION_TAG["READY_ATTACK"] = 4] = "READY_ATTACK";
    ENTITY_ACTION_TAG[ENTITY_ACTION_TAG["ATTACKING"] = 5] = "ATTACKING";
    ENTITY_ACTION_TAG[ENTITY_ACTION_TAG["AFTER_ATTACK"] = 6] = "AFTER_ATTACK";
    ENTITY_ACTION_TAG[ENTITY_ACTION_TAG["HURT"] = 7] = "HURT";
})(ENTITY_ACTION_TAG || (ENTITY_ACTION_TAG = {}));

var ENTITY_BE_ATTACK_STATE;
(function (ENTITY_BE_ATTACK_STATE) {
    ENTITY_BE_ATTACK_STATE[ENTITY_BE_ATTACK_STATE["BREAKABLE"] = 0] = "BREAKABLE";
    ENTITY_BE_ATTACK_STATE[ENTITY_BE_ATTACK_STATE["UNBREAKABLE"] = 1] = "UNBREAKABLE";
})(ENTITY_BE_ATTACK_STATE || (ENTITY_BE_ATTACK_STATE = {}));

var ATTACK_TYPE;
(function (ATTACK_TYPE) {
    ATTACK_TYPE[ATTACK_TYPE["NONE"] = 0] = "NONE";
    ATTACK_TYPE[ATTACK_TYPE["CLOSE"] = 1] = "CLOSE";
    ATTACK_TYPE[ATTACK_TYPE["DISTANT"] = 2] = "DISTANT";
})(ATTACK_TYPE || (ATTACK_TYPE = {}));

var Entity = (function (_super) {
    __extends(Entity, _super);
    Entity["__ts"]=true;
    function Entity(props, actionManager) {
        (function(){
    if(_super.__ts){
        return function(_this){
            _this.__instanceId = ClassManager.getNewInstanceId();
            _super.apply(_this, Array.prototype.slice.call(arguments,1));
        }
    } else if (typeof _super.prototype.ctor === "function") {
        return function(_this){
            _this.__instanceId = ClassManager.getNewInstanceId();
            _super.prototype.ctor.apply(_this, Array.prototype.slice.call(arguments,1));
        }
    } else {
        return function(_this){
            _this.__instanceId = ClassManager.getNewInstanceId();
        };
    }
}())
(this);
        this._runningDir = vee.Direction.Bottom;
        this._life = 1;
        this._totalLife = 1;
        this._state = 1 /* STATIC */;
        this._beAttackState = 0 /* BREAKABLE */;
        this._originalProps = {};
        this._spritesCache = [];
        this._width = 0;
        this._height = 0;
        this._unbreakableNum = 45;
        var className = helper.getClassName(this);
        var attrs = ENTITY[className];
        for (var k in attrs) {
            if (attrs.hasOwnProperty(k)) {
                this[k] = attrs[k];
            }
        }
        if (props) {
            for (var k in props) {
                if (props.hasOwnProperty(k)) {
                    this[k] = props[k];
                }
            }
        }

        this.setAnchorPoint(0.5, 0.5);
        this.setContentSize(this._width, this._height);
        this.initWithCCBI(this._ccbName);
        this._generateChildSprites(this._ccbNode);

        if (actionManager) {
            this.setActionManager(actionManager);
            this._iterateChildSprites(function (sp) {
                sp.setActionManager(actionManager);
            });
        }
        this._originalProps = attrs;
        this._getPropsFromCCB();
        this._totalLife = this._life;
    }
    Entity.prototype._getPropsFromCCB = function () {
    };

    Entity.prototype._generateChildSprites = function (node) {
        vee.Utils.iterateChildren(node, function (c) {
            if (c instanceof cc.Sprite) {
                this._spritesCache.push(c);
            }
            if (c.getChildrenCount() > 0) {
                this._generateChildSprites(c);
            }
        }.bind(this));
    };

    Entity.prototype._iterateChildSprites = function (callback) {
        for (var i = 0; i < this._spritesCache.length; i++) {
            callback(this._spritesCache[i]);
        }
    };

    Entity.prototype.initWithCCBI = function (ccbFileName) {
        this._ccbNode = cc.BuilderReader.load(ccbFileName, this);
        this._ccbNode.ignoreAnchorPointForPosition(false);
        this._ccbNode.setAnchorPoint(0.5, 0.5);
        this._ccbNode.setPosition(this._width / 2, this._height / 2);
        this.addChild(this._ccbNode);
        this._runAnimate("Default Timeline");
    };

    Entity.prototype.appear = function () {
        this.setState(0 /* APPEARING */);
        var node = cc.BuilderReader.load("smoke.ccbi");
        node.setPosition(cc.p(this.getPositionX(), this.getPositionY()));
        node.setLocalZOrder(10000);
        this.getParent().addChild(node);
        vee.Audio.playEffect("sfx_appear0" + vee.Utils.randomInt(1, 4) + ".mp3");
        node.setAutoRemoveOnFinish(true);
        var appearAction = cc.Sequence.create(cc.DelayTime.create(node.getDuration()), cc.CallFunc.create(function () {
            this.setState(1 /* STATIC */);
        }, this));
        appearAction.setTag(0 /* APPEAR */);
        this.runAction(appearAction);
    };

    Entity.prototype.can_move = function () {
        return (this.getState() === 1 /* STATIC */ || this.getState() === 2 /* RUNNING */);
    };

    Entity.prototype.can_beAttack = function () {
    };

    Entity.prototype._runAnimate = function (name) {
        var runningSequence = this._ccbNode.animationManager.getRunningSequenceName();

        // The same animations cannot break.
        if (runningSequence && runningSequence === name) {
            return;
        }
        this._ccbNode.animationManager.runAnimationsForSequenceNamed(name);
    };

    Entity.prototype.playAnimate = function (name, callback, reset) {
        if (reset === undefined) {
            reset = true;
        }
        this._ccbNode.animationManager.runAnimationsForSequenceNamed(name, reset);
        if (callback) {
            var duration = this._ccbNode.animationManager.getSequenceDuration(name);
            this.scheduleOnce(callback, duration);
        }
    };

    Entity.prototype._getAnimateName = function () {
        var seq = this._ccbNode.animationManager.getRunningSequenceName();
        if (!seq) {
            seq = this._ccbNode.animationManager.getLastCompletedSequenceName();
        }
        return seq;
    };

    Entity.prototype._setRunningAnimate = function (dir) {
        if (this._runningDir === dir) {
            if (this._getAnimateName().indexOf("run") >= 0) {
                return;
            }
        }
        this._runningDir = dir;
        this._setFlipX(false);
        switch (dir) {
            case vee.Direction.Top:
                this._runAnimate("run_up");
                break;
            case vee.Direction.Right:
                this._runAnimate("run_right");
                break;
            case vee.Direction.Bottom:
                this._runAnimate("run_down");
                break;
            case vee.Direction.Left:
                this._setFlipX(true);
                this._runAnimate("run_right");
                break;
        }
    };

    Entity.prototype._setAttackAnimate = function (dir) {
    };

    Entity.prototype._setFlipX = function (bool) {
        var sx = Math.abs(this._ccbNode.getScaleX());
        this._ccbNode.setScaleX(bool ? -sx : sx);
    };

    Entity.prototype.getSize = function () {
        return {
            width: this._width,
            height: this._height };
    };

    Entity.prototype.getLife = function () {
        return this._life;
    };

    Entity.prototype.getTotalLife = function () {
        return this._totalLife;
    };

    Entity.prototype.getState = function () {
        return this._state;
    };

    Entity.prototype.isState = function (state) {
        return state === this._state;
    };

    Entity.prototype.setState = function (STATE) {
        this._state = STATE;
    };

    Entity.prototype.getAttack = function () {
        return this._attack;
    };

    Entity.prototype.getBeAttackState = function () {
        return this._beAttackState;
    };

    Entity.prototype.setBeAttackState = function (STATE) {
        this._beAttackState = STATE;
    };

    Entity.prototype.beBreakable = function (unbreakableDuration) {
        unbreakableDuration = unbreakableDuration ? unbreakableDuration : this._unbreakableDuration;
        var enter = cc.CallFunc.create(function () {
            this.setBeAttackState(1 /* UNBREAKABLE */);
        }, this);
        var exit = cc.CallFunc.create(function () {
            this.setVisible(true);
            this.setBeAttackState(0 /* BREAKABLE */);
        }, this);
        var blink = cc.Blink.create(unbreakableDuration, this._unbreakableNum);
        var breakableAction = cc.Sequence.create(enter, blink, exit);
        breakableAction.setTag(1 /* UNBREAKABLE */);
        this.runAction(breakableAction);
    };

    Entity.prototype.setRemoveListener = function (listener) {
        this._removeListener = listener;
    };

    Entity.prototype.setHurtListener = function (listener) {
        this._hurtListener = listener;
    };

    Entity.prototype.setCorpseListener = function (listener) {
        this._corpseListener = listener;
    };

    Entity.prototype.setEffectListener = function (listener) {
        this._effectListener = listener;
    };

    /** Running **/
    Entity.prototype.setRunningDestPos = function (pos) {
        var thisPos = this.getPosition();
        var distance = vee.Utils.distanceBetweenPoints(pos, thisPos);
        if (distance > Math.max(this._width, this._height)) {
            this._runningDestPos = pos;
        }
    };

    Entity.prototype.run = function () {
    };

    Entity.prototype._isPauseRunning = function (distanceToDest) {
    };

    Entity.prototype.endRun = function (dir) {
    };

    /** Attack **/
    Entity.prototype._readyToAttack = function (dir) {
    };

    Entity.prototype.attack = function (angle) {
    };

    Entity.prototype._attackSound = function () {
    };

    Entity.prototype._beAttackSound = function () {
    };

    Entity.prototype._attackEffect = function (angle, attackDuration) {
    };

    Entity.prototype._attackAnimate = function (angle) {
    };

    Entity.prototype._attackEntities = function (startPos, endPos) {
    };

    Entity.prototype._afterAttack = function (angle) {
    };

    Entity.prototype.bloodEffect = function (callback) {
    };

    Entity.prototype.killedEffect = function () {
        // effect
        var sp = cc.Sprite.create("battle/img_kill_hit.png");
        sp.setRotation(vee.Utils.randomInt(-30, 30));
        var fade = cc.ScaleTo.create(0.3, 0);
        var remove = cc.CallFunc.create(function () {
            this.removeFromParent();
        }, sp);
        sp.setPosition(this.getPosition());
        sp.setLocalZOrder(10000);
        this.getParent().addChild(sp);
        var action = cc.Sequence.create(fade, remove);
        action.setTag(2 /* KILLED_EFFECT */);
        sp.runAction(action);
    };

    Entity.prototype.hurt = function (attack, murder) {
    };
    Entity.prototype._corpse = function () {
    };

    Entity.prototype._getBoundaryOffset = function (offset, destPos) {
        var containerSize = this.getParent().getContentSize();
        var nodePos = this.getPosition();
        if (!destPos) {
            destPos = cc.pAdd(nodePos, offset);
        }

        var nodeWidth = this._width / 2;
        var nodeHeight = this._height / 2;

        destPos.x = Math.max(0 + nodeWidth, destPos.x);
        destPos.x = Math.min(containerSize.width - nodeWidth, destPos.x);

        destPos.y = Math.max(0 + nodeHeight, destPos.y);
        destPos.y = Math.min(containerSize.height - nodeHeight, destPos.y);

        offset = cc.pSub(destPos, nodePos);

        return { offset: offset, pos: destPos };
    };
    return Entity;
})(cc.Node);
