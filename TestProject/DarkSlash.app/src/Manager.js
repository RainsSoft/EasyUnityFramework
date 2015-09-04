/**
* Created by yuan on 14-8-15.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="../helper" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Manager = (function (_super) {
    __extends(Manager, _super);
    Manager["__ts"]=true;
    function Manager() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    Manager.getInstance = function () {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    };
    Manager.removeInstance = function () {
        this._instance = null;
    };
    Manager.prototype._getIndex = function (item, list) {
        return list.indexOf(item);
    };
    Manager.prototype._iterateChildren = function (callbackFunc, list) {
        // in case there are items removed from list in
        // the callbackFunc.
        var newList = list.slice();
        newList.forEach(callbackFunc);
    };
    Manager.prototype._removeFromList = function (item, list) {
        var index = this._getIndex(item, list);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            cc.log("no item " + helper.getClassName(item) + " in list");
        }
        return index;
    };
    Manager._instance = null;
    return Manager;
})(cc.Class);
