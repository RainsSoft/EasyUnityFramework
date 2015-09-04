/**
* Created by yuan on 14-8-7.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ComboCtl = (function (_super) {
    __extends(ComboCtl, _super);
    ComboCtl["__ts"]=true;
    function ComboCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
        this._combo = 0;
        this._initialCombo = 0;
        this._showThreadhold = 2;
    }
    ComboCtl.prototype.onDidLoadFromCCB = function () {
        this.missCombo();
    };
    ComboCtl.prototype.getCombo = function () {
        return this._combo;
    };
    ComboCtl.prototype.setCombo = function (combo) {
        this._combo = combo;
        this.lbCombo.setString(combo);
        this.lbCombo2.setString(combo);
    };
    ComboCtl.prototype.missCombo = function () {
        this.setCombo(this._initialCombo);
        this.rootNode.setVisible(false);
    };
    ComboCtl.prototype.addCombo = function () {
        this.setCombo(this._combo + 1);
        if (this._combo >= this._showThreadhold) {
            this.rootNode.setVisible(true);
            if (this._combo === this._showThreadhold) {
                this.playAnimate("new", null, true);
                return;
            }
            if (this._combo < 10) {
                this.playAnimate("up", null, true);
                return;
            }
            if (this._combo < 20) {
                this.playAnimate("up10", null, true);
                return;
            }
            if (this._combo < 30) {
                this.playAnimate("up20", null, true);
                return;
            }
            this.playAnimate("up30", null, true);
        }
    };
    return ComboCtl;
})(vee.Class);
