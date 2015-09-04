var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-9-24.
*/
/// <reference path="../vee.d.ts" />
var RateCtl = (function (_super) {
    __extends(RateCtl, _super);
    RateCtl["__ts"]=true;
    function RateCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    RateCtl.prototype.onLoaded = function () {
        this.handleKey(true);
    };
    RateCtl.prototype.onRateClicked = function () {
        vee.Utils.rateUs();
	    vee.PopMgr.closeLayerByCtl(this);
    };

    RateCtl.prototype.onRefuseClicked = function () {
        vee.PopMgr.closeLayerByCtl(this);
    };
    RateCtl.prototype.onKeyBack = function () {
        this.onRefuseClicked();
        return true;
    };
    return RateCtl;
})(vee.Class);
