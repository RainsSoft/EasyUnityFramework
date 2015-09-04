/**
* Created by yuan on 14-8-26.
*/
/// <reference path="../vee.d.ts" />
/// <reference path="../appConfig" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameServiceCtl = (function (_super) {
    __extends(GameServiceCtl, _super);
    GameServiceCtl["__ts"]=true;
    function GameServiceCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    GameServiceCtl.prototype.onLoaded = function () {
        this.handleKey(true);
    };
    GameServiceCtl.prototype.onRankClicked = function () {
        vee.GameCenter.showLeaderboard(0);
    };
    GameServiceCtl.prototype.onAchieveClicked = function () {
        vee.GameCenter.showAchievements();
    };
    GameServiceCtl.prototype.onCloseClicked = function () {
        vee.PopMgr.closeLayerByCtl(this);
    };
    GameServiceCtl.prototype.onKeyBack = function () {
        this.onCloseClicked();
        return true;
    };
    return GameServiceCtl;
})(vee.Class);
