/**
* Created by yuan on 14-8-26.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HelpNodeCtl = (function (_super) {
    __extends(HelpNodeCtl, _super);
    HelpNodeCtl["__ts"]=true;
    function HelpNodeCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
        this._previousMusic = null;
        this._callback = null;
    }
    HelpNodeCtl.prototype.onDidLoadFromCCB = function () {
        vee.Audio.playMusic("bgm_over.mp3");
        this.handleKey(true);
    };

    HelpNodeCtl.prototype.setPreviousMusic = function (m) {
        this._previousMusic = m;
    };

    HelpNodeCtl.prototype.setCallback = function (callback) {
        this._callback = callback;
    };
    HelpNodeCtl.prototype.onOKClicked = function () {
        if (this._previousMusic) {
            vee.Audio.playMusic(this._previousMusic);
        }
        if (typeof this._callback === "function") {
            this._callback();
        } else {
            vee.PopMgr.closeLayerByCtl(this);
        }
    };
    HelpNodeCtl.prototype.onSkipClicked = function () {
        this.onOKClicked();
    };
    HelpNodeCtl.prototype.onKeyBack = function () {
        if (this.btnSkip.getScale() > 0) {
            this.onSkipClicked();
        }
        return true;
    };
    return HelpNodeCtl;
})(vee.Class);
