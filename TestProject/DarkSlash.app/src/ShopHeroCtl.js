var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-8-27.
*/
/// <reference path="ShopCtl" />
var ShopHeroCtl = (function (_super) {
    __extends(ShopHeroCtl, _super);
    ShopHeroCtl["__ts"]=true;
    function ShopHeroCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    ShopHeroCtl.prototype.numberOfCellsInTableView = function (table) {
        return STORE_FUNCTIONS.getArrayOfHeroProducts().length;
    };
    ShopHeroCtl.prototype.tableCellAtIndex = function (table, idx) {
        var data = STORE_FUNCTIONS.getArrayOfHeroProducts()[idx];
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new ShopCell(table, this, this._shopNodeCtl);
        }
        cell.updateInfo(data);
        return cell;
    };
    return ShopHeroCtl;
})(ShopCtl);
