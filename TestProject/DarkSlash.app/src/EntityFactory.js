/**
*
* Created by yuan on 14-8-8.
*/
/// <reference path="../config" />
/// <reference path="../helper" />
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="../NodeCtl/GameNodeCtl" />
var EntityFactory = (function () {
    function EntityFactory() {
    }
    EntityFactory.init = function (gameCtl, actionManager, enemyManager) {
        this._gameCtl = gameCtl;
        this._actionManager = actionManager;
        this._enemyManager = enemyManager;
    };
    EntityFactory.createEnemy = function (entityName, props) {
        var EntityClass = helper.getClass(entityName);
        var entity = new EntityClass(props, this._actionManager);

        if (typeof entity.setMissileListener === "function") {
            entity.setMissileListener(this._gameCtl);
        }
        entity.setKilledPlayerListener(this._gameCtl);
        entity.setCorpseListener(this._gameCtl);
        entity.setEffectListener(this._gameCtl);
        entity.setRemoveListener(this._gameCtl);
        entity.setHurtListener(this._gameCtl);
        if (entity instanceof Enemy) {
            this._enemyManager.addEnemy(entity);
        }
        return entity;
    };
    EntityFactory.createPlayer = function (entityName, props) {
        var EntityClass = helper.getClass(entityName);
        var entity = new EntityClass(props);
        entity.setCorpseListener(this._gameCtl);
        entity.setEffectListener(this._gameCtl);
        entity.setRemoveListener(this._gameCtl);
        entity.setHurtListener(this._gameCtl);
        return entity;
    };
    EntityFactory.waveCreate = function (idOrArray, props) {
        var entityName;
        if (typeof idOrArray === "number") {
            entityName = ENEMY_WAVE_CONFIG.type[idOrArray];
        } else if (Array.isArray(idOrArray)) {
            var realID = vee.Utils.randomChoice(idOrArray);
            entityName = ENEMY_WAVE_CONFIG.type[realID];
        }
        return this.createEnemy(entityName, props);
    };
    return EntityFactory;
})();
