/**
* Created by yuan on 14-8-7.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="../Item/Item" />
/// <reference path="../Entity/Player" />
/// <reference path="../Entity/Zombie" />
/// <reference path="Manager" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ItemManager = (function (_super) {
    __extends(ItemManager, _super);
    ItemManager["__ts"]=true;
    function ItemManager(containerNode) {
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
        this._itemsAppear = [];
        this._itemsMovingToPlayer = [];
        this._itemsAvailable = [];
        this._containerNode = containerNode;
        this._itemsRecords = {};
    }
    ItemManager.prototype.beAppear = function (item) {
        this._itemsAppear.push(item);
        this._containerNode.addChild(item);
    };

    ItemManager.prototype.removeFadingItem = function (item) {
        this._removeFromList(item, this._itemsAvailable);
        if (item.getParent()) {
            item.removeFromParent();
        }
    };
    ItemManager.prototype.removeMovingItem = function (item) {
        this._removeFromList(item, this._itemsMovingToPlayer);
        if (item.getParent()) {
            item.removeFromParent();
        }
    };
    ItemManager.prototype.beAvailable = function (item) {
        this._removeFromList(item, this._itemsAppear);
        this._itemsAvailable.push(item);
    };
    ItemManager.prototype.beMoving = function (item) {
        this._removeFromList(item, this._itemsAvailable);
        this._itemsMovingToPlayer.push(item);
    };
    ItemManager.prototype.checkPlayerGotItem = function (player, callback, distance) {
        var playerRect = player.getBoundingBox();
        var bigRect = cc.rect(playerRect.x - distance, playerRect.y - distance, playerRect.width + distance * 2, playerRect.height + distance * 2);
        for (var i = 0; i < this._itemsAvailable.length; i++) {
            var s = this._itemsAvailable[i];
            if (cc.rectIntersectsRect(bigRect, s.getBoundingBox())) {
                s.beginMoveToPlayer(player, callback);
            }
        }
    };

    /**
    * Item number should be less than 2 to drop new item.
    * @returns {boolean}
    */
    ItemManager.prototype.isItemNumberValid = function () {
        var count = 0;
        this._iterateChildren(function (item) {
            if (item.getName() !== ITEM_TYPE.SOUL.className) {
                count++;
            }
        }.bind(this), this._itemsAppear);
        this._iterateChildren(function (item) {
            if (item.getName() !== ITEM_TYPE.SOUL.className) {
                count++;
            }
        }.bind(this), this._itemsAvailable);
        return count < 2;
    };

    /**
    * Filter available item according to the item records array.
    * @param deadEntity
    * @param itemArray
    */
    ItemManager.prototype.filterAvailableItem = function (deadEntity, itemArray) {
        var newArr = [];
        itemArray.forEach(function (name, idx, arr) {
            if (ITEM_TYPE[name].appearDurationMS > (vee.Utils.getTimeNow() - this.getRecord(name))) {
                return;
            }
            if (name === ITEM_TYPE.ZOMBIE.className && (deadEntity instanceof ZombieSoul)) {
                return;
            }
            newArr.push(name);
        }, this);
        return newArr;
    };

    ItemManager.prototype.addRecord = function (name, timeStamp) {
        this._itemsRecords[name] = timeStamp;
    };

    /**
    * Return time stamp when last time the item appear.
    * @param name
    * @returns {*}
    */
    ItemManager.prototype.getRecord = function (name) {
        if (this._itemsRecords.hasOwnProperty(name)) {
            return this._itemsRecords[name];
        } else {
            return 0;
        }
    };

    ItemManager.prototype.generate = function (itemName, startPos, count) {
        if (count === 0)
            return;
        this.addRecord(itemName, vee.Utils.getTimeNow());
        var parentSize = this._containerNode.getContentSize();
        var rangeRadius;
        if (count < 10) {
            rangeRadius = count * 40;
        } else {
            rangeRadius = count * 25;
        }
        var xMin = Math.max(startPos.x - rangeRadius, 0);
        var xMax = Math.min(startPos.x + rangeRadius, parentSize.width);
        var yMin = Math.max(startPos.y - rangeRadius, 0);
        var yMax = Math.min(startPos.y + rangeRadius, parentSize.height);
        for (var i = 0; i < count; i++) {
            var toPosX = vee.Utils.randomInt(xMin, xMax);
            var toPosY = vee.Utils.randomInt(yMin, yMax);
            var item = new Item(itemName, startPos, cc.p(toPosX, toPosY), this);
            item.fading();
            this.beAppear(item);
        }
    };
    return ItemManager;
})(Manager);
