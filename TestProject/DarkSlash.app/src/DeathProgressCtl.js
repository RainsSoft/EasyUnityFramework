var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-9-11.
*/
/// <reference path="../vee.d.ts" />
/// <reference path="../config" />
var DeathProgressCtl = (function (_super) {
    __extends(DeathProgressCtl, _super);
    DeathProgressCtl["__ts"]=true;
    function DeathProgressCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    DeathProgressCtl.prototype.onDidLoadFromCCB = function () {
        _super.prototype.onDidLoadFromCCB.call(this);
        this._spIcons = [this.spSkeleton, this.spFlame, this.spIce, this.spShadow];
        this._bossWave = [
            ENEMY_WAVE_CONFIG.bossWave[ENTITY.BossSkeleton._className] - 1,
            ENEMY_WAVE_CONFIG.bossWave[ENTITY.BossFire._className] - 1,
            ENEMY_WAVE_CONFIG.bossWave[ENTITY.BossIce._className] - 1,
            ENEMY_WAVE_CONFIG.bossWave[ENTITY.BossShadow._className] - 1
        ];
        this._spIcons.forEach(function (sp, index) {
            sp.x = this.getPositionXOfProgress(this._bossWave[index] / ENEMY_WAVE_CONFIG.waves.length);
        }, this);
    };

    DeathProgressCtl.prototype.onProgressChanged = function () {
        var value = this.getValue();
        this._spIcons.forEach(function (sp, index) {
            if (value >= this._bossWave[index]) {
                sp.initWithFile("death/death_icon_boss" + (index + 1) + "_on.png");
            }
        }, this);
    };
    return DeathProgressCtl;
})(VeeProgress);
