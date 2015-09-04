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
var ShopSoulCtl = (function (_super) {
    __extends(ShopSoulCtl, _super);
    ShopSoulCtl["__ts"]=true;
    function ShopSoulCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
        this._cellNumber = STORE_FUNCTIONS.getArrayOfSoulProducts().length;
    }
    ShopSoulCtl.prototype.tableCellAtIndex = function (table, idx) {
        var data = STORE_FUNCTIONS.getArrayOfSoulProducts()[idx];
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new ShopCell(table, this, this._shopNodeCtl);
        }
        cell.updateInfo(data);
        return cell;
    };
    return ShopSoulCtl;
})(ShopCtl);
