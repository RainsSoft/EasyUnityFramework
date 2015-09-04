var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-9-17.
*/
/// <reference path="../vee.d.ts" />
var WaveProgressCtl = (function (_super) {
    __extends(WaveProgressCtl, _super);
    WaveProgressCtl["__ts"]=true;
    function WaveProgressCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    WaveProgressCtl.prototype.showBossHP = function () {
        this.lyBossHPProgress.controller.setProgress(1, false);
        this.lyBossHPProgress.runAction(cc.EaseBackOut.create(cc.ScaleTo.create(0.2, 1)));
    };

    WaveProgressCtl.prototype.initBossHP = function (total) {
        this.lyBossHPProgress.controller.reset(1, total);
    };

    WaveProgressCtl.prototype.setBossHP = function (value) {
        this.lyBossHPProgress.controller.setValue(value);
    };

    WaveProgressCtl.prototype.dismissBossHP = function () {
        this.lyBossHPProgress.runAction(cc.EaseBackIn.create(cc.ScaleTo.create(0.2, 0)));
    };

    WaveProgressCtl.prototype.turnHot = function () {
        this.rootNode.animationManager.runAnimationsForSequenceNamed("Hot");
        var duration = this.rootNode.animationManager.getSequenceDuration("Hot");
        this.rootNode.scheduleOnce(this.showBossHP.bind(this), duration);
    };

    WaveProgressCtl.prototype.turnNormal = function () {
        this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");
        this.dismissBossHP();
    };
    return WaveProgressCtl;
})(VeeProgress);
