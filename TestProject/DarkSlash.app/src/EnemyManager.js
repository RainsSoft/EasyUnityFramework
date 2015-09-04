var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-8-15.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="Manager" />
/// <reference path="../Entity/Enemy" />
var EnemyManager = (function (_super) {
    __extends(EnemyManager, _super);
    EnemyManager["__ts"]=true;
    function EnemyManager(containerNode, positionRangeNode) {
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
        this._containerNode = containerNode;
        this._positionNode = positionRangeNode;
        this._liveEnemyList = [];
        this._deadEnemyList = [];
    }
    EnemyManager.prototype.addEnemy = function (enemy) {
        this._containerNode.addChild(enemy);
        this._liveEnemyList.push(enemy);

        enemy.setPosition(helper.getRandomPosition(enemy.getSize(), this._positionNode.getBoundingBox()));

        // appear needs enemy's parent
        // and put this line under addChild
        enemy.appear();
    };

    EnemyManager.prototype.getLiveCount = function () {
        return this._liveEnemyList.length;
    };

    EnemyManager.prototype.removeEnemy = function (enemy) {
        this._removeFromList(enemy, this._deadEnemyList);
        if (enemy.getParent()) {
            enemy.removeFromParent();
        }
    };

    EnemyManager.prototype.enemyCorpse = function (enemy) {
        this._removeFromList(enemy, this._liveEnemyList);
        this._deadEnemyList.push(enemy);
    };

    EnemyManager.prototype.iterateLive = function (func) {
        this._iterateChildren(func, this._liveEnemyList);
    };
    return EnemyManager;
})(Manager);
