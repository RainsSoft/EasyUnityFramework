/**
* Created by yuan on 14-8-28.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="../Manager/DataManager" />
/// <reference path="ShopCell" />
/// <reference path="../NodeCtl/ShopNodeCtl" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShopCtl = (function (_super) {
    __extends(ShopCtl, _super);
    ShopCtl["__ts"]=true;
    function ShopCtl(shopNodeCtl) {
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
        this._cellSize = cc.size(800, 146);
        this._cellNumber = 0;
        this._shopNodeCtl = shopNodeCtl;
        //        STORE_FUNCTIONS.getArrayOfSoulProducts().forEach(function(data){
        //            var cell = new ShopCell(null, this, this._shopNodeCtl);
        //            cell.updateInfo(data);
        //        }, this);
        //        STORE_FUNCTIONS.getArrayOfMagicProducts().forEach(function(data){
        //            var cell = new ShopCell(null, this, this._shopNodeCtl);
        //            cell.updateInfo(data);
        //        }, this);
        //        STORE_FUNCTIONS.getArrayOfHeroProducts().forEach(function(data){
        //            var cell = new ShopCell(null, this, this._shopNodeCtl);
        //            cell.updateInfo(data);
        //        }, this);
    }
    ShopCtl.prototype.tableCellSizeForIndex = function (table, idx) {
        return this._cellSize;
    };
    ShopCtl.prototype.numberOfCellsInTableView = function (table) {
        return this._cellNumber;
    };
    ShopCtl.prototype.tableCellAtIndex = function (table, idx) {
    };
    ShopCtl.prototype.tableCellTouched = function (table, cell) {
    };
    return ShopCtl;
})(cc.Class);
