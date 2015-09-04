/**
* Created by yuan on 14-8-8.
*/
/// <reference path="../../cocos2d.d.ts" />
/// <reference path="../../vee.d.ts" />
/// <reference path="../Enemy" />
/// <reference path="../../Manager/MissileManager" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MISSILE_ACTION_TAG;
(function (MISSILE_ACTION_TAG) {
    MISSILE_ACTION_TAG[MISSILE_ACTION_TAG["FLYING"] = 0] = "FLYING";
    MISSILE_ACTION_TAG[MISSILE_ACTION_TAG["BROKEN"] = 1] = "BROKEN";
})(MISSILE_ACTION_TAG || (MISSILE_ACTION_TAG = {}));
var Missile = (function (_super) {
    __extends(Missile, _super);
    Missile["__ts"]=true;
    function Missile() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
        this._canBeDestroyed = false;
        this._spritesCache = [];
    }

    Object.defineProperty(Missile.prototype, "manager", {
        get: function () {
            return this._manager;
        },
        set: function (m) {
            if (!this._manager) {
                this._manager = m;
            }
        },
        enumerable: true,
        configurable: true
    });

    Missile.prototype.collectSpritesFromCCB = function (node) {
        this._generateChildSprites(node);
    };
    Missile.prototype._generateChildSprites = function (node) {
        vee.Utils.iterateChildren(node, function (c) {
            if (c instanceof cc.Sprite) {
                this._spritesCache.push(c);
            }
            if (c.getChildrenCount() > 0) {
                this._generateChildSprites(c);
            }
        }.bind(this));
    };

    Missile.prototype._iterateChildSprites = function (callback) {
        for (var i = 0; i < this._spritesCache.length; i++) {
            callback(this._spritesCache[i]);
        }
    };

    Missile.prototype.setActionManager = function (actionManager) {
        _super.prototype.setActionManager.call(this, actionManager);
        this._iterateChildSprites(function (sp) {
            sp.setActionManager(actionManager);
        });
    };

    Missile.prototype.remove = function () {
        this._manager.removeMissile(this);
    };

    Missile.prototype.setOwner = function (owner) {
        this._owner = owner;
    };
    Missile.prototype.getOwner = function () {
        return this._owner;
    };
    Missile.prototype.canBeDestroyed = function () {
        return this._canBeDestroyed;
    };
    Missile.prototype.destroyed = function (pos) {
    };
    return Missile;
})(cc.Node);
