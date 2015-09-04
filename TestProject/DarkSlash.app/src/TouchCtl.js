var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-8-27.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="GameNodeCtl" />
/// <reference path="../Entity/Player" />
var PlayerController = (function (_super) {
    __extends(PlayerController, _super);
    PlayerController["__ts"]=true;
    function PlayerController() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    PlayerController.prototype.setGameCtl = function (gCtl) {
        this._gameCtl = gCtl;
        this._player = gCtl._player;
    };
    PlayerController.prototype.playerAvailable = function () {
        if (!this._gameCtl) {
            return false;
        }
        if (!this._player) {
            return false;
        }
        return this._player.can_move();
    };
    return PlayerController;
})(cc.Class);

var TouchCtl = (function (_super) {
    __extends(TouchCtl, _super);
    TouchCtl["__ts"]=true;
    function TouchCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
        this._holdDelay = 0.2;
        this._stillHold = false;
        this._enterHold = false;
    }
    TouchCtl.prototype.onGestureBegin = function (context) {
        this._stillHold = true;
        this._enterHold = false;
        vee.Utils.unscheduleCallbackForTarget(this, this._schedule);
        vee.Utils.scheduleOnceForTarget(this, this._schedule, this._holdDelay);
        return true;
    };
    TouchCtl.prototype._schedule = function () {
        if (this._stillHold) {
            this._onHold(this.gestureController);
        }
    };
    TouchCtl.prototype._onHold = function (context) {
        //        if (this.playerAvailable()){
        //            var p = context.getLastPointInWorld();
        //            p = this.rootNode.convertToNodeSpace(p);
        //            this._player.setRunningDestPos(p);
        //            this._player.setState(ENTITY_STATE.RUNNING);
        //        }
        this._enterHold = true;
    };
    TouchCtl.prototype.onGestureLeave = function (context) {
        if (this.playerAvailable()) {
            this._player.endRun();
            if (!this._enterHold) {
                this._onTap(context);
            }
        }
        this._enterHold = false;
        this._stillHold = false;
    };
    TouchCtl.prototype.onGestureMove = function (context, offset) {
        if (!this.playerAvailable() && !this._enterHold) {
            return;
        }
        var p = context.getLastPointInWorld();
        p = this._player.getParent().convertToNodeSpace(p);
        switch (this._player.getState()) {
            case 2 /* RUNNING */:
                this._player.setRunningDestPos(p);
                break;
            case 1 /* STATIC */:
                this._player.setRunningDestPos(p);
                this._player.setState(2 /* RUNNING */);
                break;
        }
    };
    TouchCtl.prototype._onTap = function (context) {
        if (!this.playerAvailable()) {
            return;
        }
        var p = context.getLastPointInWorld();
        p = this._player.getParent().convertToNodeSpace(p);
        var angle = vee.Utils.angleOfLine(this._player.getPosition(), p);
        this._player.attack(angle);
    };
    return TouchCtl;
})(PlayerController);
