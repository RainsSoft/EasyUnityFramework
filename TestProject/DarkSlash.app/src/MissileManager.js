/**
* Created by yuan on 14-8-18.
*/
/// <reference path="Manager" />
/// <reference path="../Entity/Missile/Missile" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MissileManager = (function (_super) {
    __extends(MissileManager, _super);
    MissileManager["__ts"]=true;
    function MissileManager(containerNode) {
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
        this._missileList = [];
        this._containerNode = containerNode;
    }
    MissileManager.prototype.addMissile = function (missile) {
        this._missileList.push(missile);
        this._containerNode.addChild(missile);
    };

    MissileManager.prototype.removeMissile = function (missile) {
        this._removeFromList(missile, this._missileList);
        if (missile.getParent()) {
            missile.removeFromParent();
        }
    };
    MissileManager.prototype.iterateMissiles = function (callback) {
        this._iterateChildren(callback, this._missileList);
    };
    return MissileManager;
})(Manager);
