/**
* Created by yuan on 14-8-8.
*/
/// <reference path="../vee.d.ts" />
/// <reference path="../NodeCtl/GameNodeCtl" />
/// <reference path="../NodeCtl/LevelNodeCtl" />
/// <reference path="../NodeCtl/SaveNodeCtl" />
/// <reference path="DataManager" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GAME_STATE;
(function (GAME_STATE) {
    GAME_STATE[GAME_STATE["PLAY"] = 0] = "PLAY";
    GAME_STATE[GAME_STATE["PAUSE"] = 1] = "PAUSE";
    GAME_STATE[GAME_STATE["OVER"] = 2] = "OVER";
    GAME_STATE[GAME_STATE["SAVE"] = 3] = "SAVE";
    GAME_STATE[GAME_STATE["HOME"] = 4] = "HOME";
})(GAME_STATE || (GAME_STATE = {}));

var GameManager = (function (_super) {
    __extends(GameManager, _super);
    GameManager["__ts"]=true;
    function GameManager() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
        this._gameState = 4 /* HOME */;
        this._timeStart = 0;
        this._timeDuration = 0;
        this._savedLife = 0;
        this._failCount = 0;
        this._pauseCount = 0;
        this._adThresholdCount = 2;
    }
    GameManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    };

    GameManager.adjustLeftTop = function (node, parent) {
        if (!parent) {
            parent = node.getParent();
        }
        var nodePos = node.getPosition();
        var parentOffset = parent.getPosition();
        node.setPosition(nodePos.x - parentOffset.x, nodePos.y + parentOffset.y);
    };
    GameManager.adjustRightTop = function (node, parent) {
        if (!parent) {
            parent = node.getParent();
        }
        var nodePos = node.getPosition();
        var parentOffset = parent.getPosition();
        node.setPosition(nodePos.x + parentOffset.x, nodePos.y + parentOffset.y);
    };
    GameManager.adjustTop = function (node, parent) {
        if (!parent) {
            parent = node.getParent();
        }
        var nodePos = node.getPosition();
        var parentOffset = parent.getPosition();
        node.setPositionY(nodePos.y + parentOffset.y);
    };
    GameManager.adjustRight = function (node, parent) {
        if (!parent) {
            parent = node.getParent();
        }
        var nodePos = node.getPosition();
        var parentOffset = parent.getPosition();
        node.setPositionX(nodePos.x + parentOffset.x);
    };
    GameManager.adjustLeft = function (node, parent) {
        if (!parent) {
            parent = node.getParent();
        }
        var nodePos = node.getPosition();
        var parentOffset = parent.getPosition();
        node.setPositionX(nodePos.x - parentOffset.x);
    };
    GameManager.adjustBottom = function (node, parent) {
        if (!parent) {
            parent = node.getParent();
        }
        var nodePos = node.getPosition();
        var parentOffset = parent.getPosition();
        node.setPositionY(nodePos.y - parentOffset.y);
    };
    GameManager.resizeNode = function (node, parent) {
        if (!parent) {
            parent = node.getParent();
        }
        var nodePos = node.getPosition();
        var parentOffset = parent.getPosition();
        node.setPosition(nodePos.x - parentOffset.x, nodePos.y - parentOffset.y);

        var nodeSize = node.getContentSize();
        var newSize = cc.size(nodeSize.width - Math.abs(parentOffset.x) * 2, nodeSize.height - Math.abs(parentOffset.y) * 2);
        node.setContentSize(newSize);
    };
    GameManager.prototype.gameHelp = function (callback, closeMusic) {
        var node = vee.PopMgr.popCCB("help.ccbi", true);
        node.controller.setPreviousMusic(closeMusic);
        node.controller.setCallback(callback);
    };
    GameManager.prototype.gameHome = function () {
        vee.PopMgr.resetScene();
        this._gameState = 4 /* HOME */;
        vee.PopMgr.popCCB("home.ccbi");
    };
    GameManager.prototype.gameStart = function () {
        vee.PopMgr.resetScene();
        this._lyGameOver = null;
        this._lyGamePause = null;
        this._lyGame = vee.PopMgr.popCCB("Game.ccbi");
        this._gameState = 0 /* PLAY */;
        this._savedLife = 0;
        this._timeDuration = 0;
        this._timeStart = (new Date()).getTime();
    };
    GameManager.prototype.gamePause = function () {
        if (!this._lyGame)
            return;
        this._lyGame.controller.onGamePaused();
        this._pauseCount++;
        if (this._pauseCount === this._adThresholdCount) {
            this._pauseCount = 0;
        }
        if (this._lyGame) {
            this._lyGamePause = vee.PopMgr.popCCB("pause.ccbi", true);
        }
        this._gameState = 1 /* PAUSE */;
        this._timeDuration += (new Date()).getTime() - this._timeStart;
    };
    GameManager.prototype.gameResume = function () {
        if (!this._lyGame)
            return;
        this._lyGame.controller.onGameResumed();
        this._lyGamePause = null;
        this._gameState = 0 /* PLAY */;
        this._timeStart = (new Date()).getTime();
    };
    GameManager.prototype.showGameOver = function (soulCount, scoreCtl, killedCount, waveNumber, killedEnemies) {
        vee.PopMgr.resetScene();
        this._gameState = 2 /* OVER */;
        this._lyGame = null;

        var previousLevel = DataManager.getInstance().getPlayerLevel();
        var previousExp = DataManager.getInstance().getPlayerExp();
        var needExp = CHARACTER.soulNeedToReachLevel(previousLevel + 1);

        var currentExp = previousExp + soulCount;

        DataManager.getInstance().setPlayerExp(currentExp);

        // Analytics
        DataManager.getInstance().setKilledEnemies(killedEnemies, killedCount);
        DataManager.getInstance().addGameRound();

        // Soul add
        var doubleBonus = DataManager.getInstance().isDoubleSoul() ? soulCount : 0;
        var soulWithBonus = CHARACTER.soulWithBonus(soulCount, previousLevel) + doubleBonus;
        DataManager.getInstance().addSoul(soulWithBonus);
	    vee.Analytics.logReward(soulWithBonus, "游戏结算");

        // Send game center
        vee.GameCenter.submitScore(scoreCtl.getNumber(), 0);
        this._timeDuration += (new Date()).getTime() - this._timeStart;

        this._lyGameOver = vee.PopMgr.popCCB("over.ccbi");
        this._lyGameOver.controller.setScore(soulCount, scoreCtl, killedEnemies, killedCount);
        this._lyGameOver.controller.setLevel(previousLevel);
        this._lyGameOver.controller.setInitExp(previousExp, needExp);
        this._lyGameOver.controller.setKilled(killedCount);
        this._lyGameOver.controller.setTime(this._timeDuration);
        this._lyGameOver.controller.setSoul(soulWithBonus + soulCount);
        this._lyGameOver.controller.setExp(currentExp, function (levelUpCallback) {
            var isLevelUp = false;
            var currentLevel = previousLevel;
            if (currentExp >= needExp) {
                isLevelUp = true;
                DataManager.getInstance().levelUp();
                currentLevel += 1;
                vee.Analytics.logPlayerLevel(currentLevel);
            }

            var pList = STORE_FUNCTIONS.getToUnlockList();
            var dataForUnlock = DataManager.getInstance().getDataUnlockingStore();
            var unlockedProduct = null;
            pList.forEach(function (p) {
                var lockedResult = STORE_FUNCTIONS.parseLockFilters(p.className, p.lockFilter, dataForUnlock);
                if (!lockedResult.locked) {
                    DataManager.getInstance().upgradeProduct(p.className);
                    unlockedProduct = p;
                }
            }, this);

            var levelAward = CHARACTER.LEVEL_AWARD[currentLevel.toString()];
            if (isLevelUp || unlockedProduct) {
                var levelNodeCtl = (vee.PopMgr.popCCB("level.ccbi", true).controller);
                levelNodeCtl.setLevel(currentLevel);
                if (unlockedProduct) {
                    levelNodeCtl.showItem(unlockedProduct.icon, unlockedProduct.name);
                }
                if (levelAward) {
                    if (levelAward[ITEM_TYPE.SOUL.className]) {
                        DataManager.getInstance().addSoul(levelAward[ITEM_TYPE.SOUL.className]);
	                    vee.Analytics.logReward(levelAward[ITEM_TYPE.SOUL.className], "升级赠送");
                        levelNodeCtl.showSouls(levelAward[ITEM_TYPE.SOUL.className]);
                    }
                }
                levelNodeCtl.showBonus(currentLevel);
                levelNodeCtl.ready();
                levelNodeCtl.setCloseCallback(levelUpCallback);

                this._lyGameOver.controller.updateUnlockSign();
            }
        }.bind(this));

        //analytics services
        var analytics = {
            score: scoreCtl.getNumber().toString(),
            killed: killedCount.toString(),
            time: (this._timeDuration / 1000).toString(),
            saved_life: this._savedLife.toString(),
            wave: waveNumber.toString(),
            soul: soulWithBonus.toString()
        };

        var analyticsKilled = {};
        for (var prop in killedEnemies) {
            if (killedEnemies.hasOwnProperty(prop)) {
                analyticsKilled[prop] = killedEnemies[prop].toString();
            }
        }

        vee.Analytics.logEvent("gameOver", analytics);
        vee.Analytics.logEvent("gameOverKilled", analyticsKilled);
    };
    GameManager.prototype.getGameState = function () {
        return this._gameState;
    };
    GameManager.prototype.gameOver = function () {
        this._failCount++;
        if (this._failCount === this._adThresholdCount) {
            this._failCount = 0;
            if (app.Config.IsInterestialEnabled) {
                vee.Ad.showInterstitialAd();
            }
        }
        this._lyGame.controller.onGameOver();
    };
    GameManager.prototype.showSaveLife = function (wave) {
        this._gameState = 3 /* SAVE */;
        var reviveCtl = (vee.PopMgr.popCCB("death.ccbi").controller);
        var reviveLevel = DataManager.getInstance().getProductData()[STORE_PRODUCT.MagicShopData.REVIVE.className];
        if (this._savedLife < reviveLevel) {
            reviveCtl.setType(0 /* REVIVE */);
        } else {
            reviveCtl.setType(1 /* NO_REVIVE */);
        }
        reviveCtl.setWave(wave);
        reviveCtl.setSoulPrice(wave * 15);
    };
    GameManager.prototype.onSavedLife = function () {
        this._gameState = 0 /* PLAY */;
        this._lyGame.controller.onPlayerRevived();
        this._savedLife++;
    };
    GameManager._instance = null;
    return GameManager;
})(cc.Class);
