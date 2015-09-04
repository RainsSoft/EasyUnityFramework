/**
* Created by yuan on 14-8-26.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="../Manager/GameManager" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GamePauseNodeCtl = (function (_super) {
    __extends(GamePauseNodeCtl, _super);
    GamePauseNodeCtl["__ts"]=true;
    function GamePauseNodeCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
        this._retryContent = vee.Utils.getObjByLanguage(
	        "Are you sure to retry?\nYou will lose the game progress.",
	        "     你确定要重来吗？\n你此刻的进程将会丢失。"
        );
        this._quitContent = vee.Utils.getObjByLanguage(
	        "Are you sure to quit?\nYou will lose the game progress.",
	        "     你确定要退出吗？\n你此刻的进程将会丢失。"
        );
    }
    GamePauseNodeCtl.prototype.onLoaded = function () {
        this.handleKey(true);
    };
    GamePauseNodeCtl.prototype.onPlayClicked = function () {
        GameManager.getInstance().gameResume();
        vee.PopMgr.closeLayerByCtl(this);
        vee.Analytics.logEvent("pauseToPlay");
    };
    GamePauseNodeCtl.prototype.onRetryClicked = function () {
	    this._quitTitle = vee.Utils.getObjByLanguage("RETRY?", "重来?");
        vee.PopMgr.alert(this._retryContent, this._quitTitle, function () {
            GameManager.getInstance().gameStart();
            vee.Analytics.logEvent("pauseToRetry");
        }.bind(this));
    };
    GamePauseNodeCtl.prototype.onQuitClicked = function () {
	    this._quitTitle = vee.Utils.getObjByLanguage("QUIT?", "退出?");
        vee.PopMgr.alert(this._quitContent, this._quitTitle, function () {
            GameManager.getInstance().gameHome();
            vee.Analytics.logEvent("pauseToQuit");
        }.bind(this));
    };
    GamePauseNodeCtl.prototype.onHelpClicked = function () {
        vee.Analytics.logEvent("pauseToHelp");
        GameManager.getInstance().gameHelp(null, vee.Audio.getLastMusic());
    };
    GamePauseNodeCtl.prototype.onKeyBack = function () {
        this.onPlayClicked();
        return true;
    };
    return GamePauseNodeCtl;
})(vee.Class);
