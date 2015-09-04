/**
* Created by yuan on 14-8-8.
*/
/// <reference path="../vee.d.ts" />
/// <reference path="../Entity/Entity" />
/// <reference path="../Entity/Enemy" />
/// <reference path="../Entity/Player" />
/// <reference path="../Entity/Missile/Arrow" />
/// <reference path="../Entity/Missile/FireBall" />
/// <reference path="../Entity/Missile/IceBall" />
/// <reference path="../Entity/Missile/IceFloat" />
/// <reference path="../Entity/Missile/IcePrick" />
/// <reference path="../Entity/Missile/ShadowArrow" />
/// <reference path="../Entity/Missile/Shadow" />
/// <reference path="../Entity/Boss/BossFire" />
/// <reference path="../Entity/EntityFactory" />
/// <reference path="../Manager/GameManager" />
/// <reference path="../Manager/ItemManager" />
/// <reference path="../Manager/EnemyManager" />
/// <reference path="../Manager/MissileManager" />
/// <reference path="../helper" />
/// <reference path="TouchCtl" />
/// <reference path="WaveProgressCtl" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameNodeCtl = (function (_super) {
    __extends(GameNodeCtl, _super);
    GameNodeCtl["__ts"]=true;
    function GameNodeCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
        this._killedCount = 0;
        this._player = null;
        this._hurtEnemiesOfLastSlash = [];
        this._playerTotalHeart = 0;
        this._addEnemyDT = 0;
        this._waveIndex = -1;
        this._waveMaxEnemies = -1;
        this._waveIdArr = [];
        this._waveIdArrIdx = 0;
        // record score when this wave begins
        // used for calculating delta score for waves
        this._thisWaveScore = 0;
        this._comboCtl = null;
        this._heartCtl = null;
        this._waveProgressCtl = null;
        this._multiKillsCtl = null;
        this._scoreCtl = null;
        this._currentSoulNumber = 0;
        this._totalSoulCtl = null;
        this._enemyTimeScale = 1;
        this._currentBoss = null;
        this._shadowRevive = 0;
        this._enemyUpdateDT = 0;
    }
    GameNodeCtl.prototype.onLoaded = function () {
        GameManager.resizeNode(this.lyCanvas, this.rootNode);
        GameManager.resizeNode(this.lyEnemy, this.rootNode);
        GameManager.resizeNode(this.lyMissile, this.rootNode);
        GameManager.resizeNode(this.lyEffect, this.rootNode);
        GameManager.resizeNode(this.lyItem, this.rootNode);
        vee.Utils.iterateChildren(this.lyMask, function (e) {
            if (e.isFlippedY()) {
                GameManager.adjustBottom(e, this.rootNode);
            } else {
                GameManager.adjustTop(e, this.rootNode);
            }
        }.bind(this));
        GameManager.adjustLeftTop(this.lyScore, this.rootNode);
        GameManager.adjustRightTop(this.lyPause, this.rootNode);
        GameManager.adjustTop(this.lyTop, this.rootNode);
        GameManager.adjustTop(this.lyEdgeTop, this.rootNode);
        GameManager.adjustTop(this.lyChapter, this.rootNode);
        GameManager.adjustTop(this.lyMultiKills, this.rootNode);
        GameManager.adjustLeft(this.lyEdgeLeft, this.rootNode);
        GameManager.adjustBottom(this.lyEdgeBottom, this.rootNode);
        GameManager.adjustRight(this.lyEdgeRight, this.rootNode);
        GameManager.adjustLeft(this.lyCombo, this.rootNode);

        this._comboCtl = this.lyCombo.controller;
        this._heartCtl = this.lyHeart.controller;
        this._multiKillsCtl = this.lyMultiKills.controller;
        this._waveProgressCtl = this.lyProgress.controller;
        this._waveProgressCtl.reset(0, 100, function (p) {
            if (this.progress <= 0.1) {
                this.spHeader.setOpacity(0);
            } else {
                if (this.spHeader.getOpacity() === 0) {
                    this.spHeader.runAction(cc.FadeIn.create(0.3));
                }
            }
        }.bind(this._waveProgressCtl));
        this._enemyActionManager = new cc.ActionManager();

        // js binding auto releases the actionManager,
        // use lyEnemy to preserve it.
        // when lyEnemy is removed it will be released.
        this.lyEnemy.setActionManager(this._enemyActionManager);

        this._enemyManager = new EnemyManager(this.lyEnemy, this.lyEnemyAppear);
        this._itemManager = new ItemManager(this.lyItem);
        this._missileManager = new MissileManager(this.lyMissile);

        EntityFactory.init(this, this._enemyActionManager, this._enemyManager);

        this.beforeGameBegin();

        // after beforeGameBegin, since need player
        this.enableController();

        // Change background bg
        this._currentBGNumber = vee.Utils.randomInt(1, 5);
        var bgName = "big/ba_bg_" + this._currentBGNumber + ".jpg";
        this.spBG.initWithFile(bgName);
        this.spBGOver.initWithFile(bgName);
        this.handleKey(true);
    };

    GameNodeCtl.prototype.enableController = function () {
        if (this._gestureContext) {
            this._gestureContext.unregister();
        }
        var touchDelegate = new TouchCtl();
        this._gestureContext = vee.GestureController.registerController(this.lyTouch, touchDelegate);
        touchDelegate.setGameCtl(this);
    };

    GameNodeCtl.prototype.addScore = function (score) {
        this._thisWaveScore += score;
        this._scoreCtl.addNumber(score);
    };

    GameNodeCtl.prototype.addKilled = function () {
        this.setKilled(this._killedCount + 1);
    };

    GameNodeCtl.prototype.setKilled = function (killed) {
        this._killedCount = killed;
        this.lbKilled.setString(this._killedCount.toString());
    };

    GameNodeCtl.prototype.initBossHP = function (total) {
        this.lbBossHP.stopAllActions();
        this.lbBossHP.runAction(cc.FadeIn.create(1));
        this.setBossHP(total, total);
        this._waveProgressCtl.initBossHP(total);
    };
    GameNodeCtl.prototype.dismissBossHP = function () {
        this.lbBossHP.stopAllActions();
        this.lbBossHP.runAction(cc.FadeOut.create(1));
        this._waveProgressCtl.dismissBossHP();
    };
    GameNodeCtl.prototype.setBossHP = function (value, total) {
        this.lbBossHP.setString(value + "/" + total);
        this._waveProgressCtl.setBossHP(value);
    };

    GameNodeCtl.prototype.shakeScreen = function (level) {
        if (level >= 1 && level <= 4) {
            this.playAnimate("Wave" + level);
        }
    };

    GameNodeCtl.prototype.timeFreezeMaskShow = function () {
        vee.Utils.iterateChildren(this.lyMask, function (e) {
            e.stopAllActions();
            e.runAction(cc.FadeTo.create(0.5, 255 * 0.8));
        }.bind(this));
    };

    GameNodeCtl.prototype.timeFreezeMaskDisappear = function () {
        vee.Utils.iterateChildren(this.lyMask, function (e) {
            e.stopAllActions();
            e.runAction(cc.FadeOut.create(0.5));
        }.bind(this));
    };

    GameNodeCtl.prototype.comboMiss = function () {
        this._comboCtl.missCombo();
    };

    GameNodeCtl.prototype.comboAdd = function () {
        this._comboCtl.addCombo();
        vee.Utils.unscheduleCallbackForTarget(this, this.comboMiss);
        vee.Utils.scheduleOnceForTarget(this, this.comboMiss, GAME_CONFIG.comboInterval);
    };

    GameNodeCtl.prototype.beforeGameBegin = function () {
        vee.Audio.stopMusic();
        this._scoreCtl = vee.ScoreController.registerController(this.lbScore, 0);
        this._currentSoulNumber = 0;
        this._totalSoulCtl = vee.ScoreController.registerController(this.lbSoul, DataManager.getInstance().getSoul());

        this.setKilled(0);
        this._killedEnemies = {};
        this._killedEnemiesHistory = DataManager.getInstance().getAnalytics().KilledEnemies;
        this._hurtEnemiesOfLastSlash = [];

        var playerAttribute = vee.Utils.copy(ENTITY.Player);

        // read character
        var characterValue = CHARACTER.getCharacterValue(DataManager.getInstance().getCurrentCharacterID());
        for (var p in characterValue) {
            if (characterValue.hasOwnProperty(p)) {
                playerAttribute[p] = characterValue[p];
            }
        }

        // read agility
        var agilityValue = CHARACTER.getAttributeValue(STORE_PRODUCT.HeroShopData.AGILITY.className);
        if (agilityValue) {
            for (var p in agilityValue) {
                if (agilityValue.hasOwnProperty(p)) {
                    playerAttribute[p] += agilityValue[p];
                }
            }
        }

        // read damage
        var damageValue = CHARACTER.getAttributeValue(STORE_PRODUCT.HeroShopData.DAMAGE.className);
        if (damageValue) {
            for (p in damageValue) {
                if (damageValue.hasOwnProperty(p)) {
                    playerAttribute[p] += damageValue[p];
                }
            }
        }

        this._player = EntityFactory.createPlayer(ENTITY.Player._className, playerAttribute);
        this._playerTotalHeart = this._player.getLife();

        // read heart
        var heartValue = CHARACTER.getAttributeValue(STORE_PRODUCT.HeroShopData.STAMINA.className);
        if (heartValue) {
            this._playerTotalHeart += heartValue._life;
        }

        var extraHeart = STORE_FUNCTIONS.getExtraHeartCount();
        this._heartCtl.setHeartSpriteNumber(this._player.getLife() + extraHeart, this._playerTotalHeart);

        this._player._life = this._playerTotalHeart;

        this.lyCanvas.addChild(this._player);
        this._player.setPosition(this.lyCanvas.getContentSize().width / 2, this.lyCanvas.getContentSize().height / 2 + this._player.getContentSize().height / 2);
        this._player._runAnimate("born");

        this.playAnimate("Open", function () {
            this.onGameBegin();
        }.bind(this));
    };

    GameNodeCtl.prototype.onGameBegin = function () {
        vee.Audio.playMusic('bgm_battle.mp3');
        if (DataManager.getInstance().getSaveStone() > 0) {
            DataManager.getInstance().useSaveStone();
            vee.Analytics.logItemUse(STORE_PRODUCT.MagicShopData.SAVE_STONE.className);
            this._waveIndex = DataManager.getInstance().getStartWave() - 2;
        } else {
            this._waveIndex = ENEMY_WAVE_CONFIG.gameStartWave - 2;
        }
        this._gameStartWaveIndex = this._waveIndex;
        this._waveIdArr = [];
        this._waveIdArrIdx = 0;
        this._waveMaxEnemies = 0;
        vee.Utils.scheduleCallbackForTarget(this, this.update, cc.director.getAnimationInterval(), cc.REPEAT_FOREVER);
    };

    GameNodeCtl.prototype.onGameOver = function () {
        vee.Audio.stopMusic();
        vee.Utils.unscheduleCallbackForTarget(this, this.update);
        GameManager.getInstance().showGameOver(this._currentSoulNumber, this._scoreCtl, this._killedCount, this._waveIndex, this._killedEnemies);
    };

	GameNodeCtl.prototype.onExit = function() {
		vee.Utils.unscheduleCallbackForTarget(this, this.update);
	};

	GameNodeCtl.prototype.onGamePaused = function () {
        vee.Utils.schedulePauseTarget(this);
        this._player.pause();
		vee.Audio.pause();
    };

    GameNodeCtl.prototype.onGameResumed = function () {
        vee.Utils.scheduleResumeTarget(this);
        this._player.resume();
	    vee.Audio.resume();
	    vee.Audio.playLastMusic();
    };
    GameNodeCtl.prototype.onAddEffectNode = function (node, zorder) {
        if (zorder) {
            this.lyEffect.addChild(node, zorder);
        } else {
            this.lyEffect.addChild(node);
        }
    };

    GameNodeCtl.prototype.onPauseClicked = function () {
	    vee.Utils.scheduleOnce(function() {
		    vee.Ad.showInterstitialAd();
	    }, 0.5);
        GameManager.getInstance().gamePause();
    };

    GameNodeCtl.prototype.onKeyBack = function () {
        GameManager.getInstance().gamePause();
        return true;
    };

    GameNodeCtl.prototype.update = function (dt) {
        this._enemyActionManager.update(dt * this._enemyTimeScale);
        this.updateEnemyAppears(dt);
        this.updateEnemiesState(dt * this._enemyTimeScale);
        this.updatePlayerState(dt);
        this.updateMissileKillPlayer(dt);
        this.updateEffectKillEnemy(dt);
    };

    GameNodeCtl.prototype.showChapter = function (newWaveIndex) {
        var chapter = ENEMY_WAVE_CONFIG.getChapter(newWaveIndex);
        if (chapter > 0) {
            this.lyChapter.controller.showNewChapter(chapter);
            if (newWaveIndex !== (this._gameStartWaveIndex + 1)) {
                var bgName;
                if (newWaveIndex === ENEMY_WAVE_CONFIG.bossWave[ENTITY.BossShadow._className] - 1) {
                    bgName = "big/ba_bg_0.jpg";
                } else {
                    var bgNumbers = [1, 2, 3, 4, 5];
                    bgNumbers.splice(this._currentBGNumber - 1, 1);
                    bgName = "big/ba_bg_" + vee.Utils.randomChoice(bgNumbers) + ".jpg";
                }
                this.spBGOver.initWithFile(bgName);
                this.spBGOver.setOpacity(0);
                var call = cc.CallFunc.create(function () {
                    this.spBG.initWithFile(bgName);
                }, this);
                this.spBGOver.runAction(cc.Sequence.create(cc.FadeIn.create(2), call));
            }
        }
    };

    GameNodeCtl.prototype.addEnemy = function (dt) {
        this._addEnemyDT += dt;
        var enemyCount = this._enemyManager.getLiveCount();
        var nextAppearTime = ENEMY_WAVE_CONFIG.nextAppear(enemyCount, this._waveMaxEnemies, this._waveIndex, this._waveIdArrIdx);
        if (this._addEnemyDT < nextAppearTime) {
            return;
        }
        if (enemyCount >= this._waveMaxEnemies) {
            return;
        }
        this._addEnemyDT = 0;

        var waveFlag = ENEMY_WAVE_CONFIG.waves[this._waveIndex].flag;

        var enemyID = this._waveIdArr[this._waveIdArrIdx];
        if (waveFlag === "clean") {
            // if this wave is marked clean, the index will not refresh to 0 and do not add
            // new enemy.
            if (this._waveIdArrIdx === this._waveIdArr.length) {
                return;
            } else {
                this._waveIdArrIdx++;
            }
        } else if (waveFlag === "score") {
            this._waveIdArrIdx = (this._waveIdArrIdx + 1) % this._waveIdArr.length;
        }

        var enemy = EntityFactory.waveCreate(enemyID);

        // set current boss
        var boss_names = [
            ENTITY.WarriorDoom._className,
            ENTITY.BossSkeleton._className,
            ENTITY.BossFire._className,
            ENTITY.BossIce._className,
            ENTITY.BossShadow._className
        ];
        boss_names.forEach(function (name) {
            if (this._waveIndex === ENEMY_WAVE_CONFIG.bossWave[name] - 1) {
                if (boss_names.indexOf(helper.getClassName(enemy)) >= 0) {
                    this._currentBoss = enemy;
                    this.initBossHP(enemy.getLife());
                }
            }
        }, this);
    };

    GameNodeCtl.prototype.waveFinished = function () {
        return this._enemyManager.getLiveCount() === 0 && this._waveIdArrIdx === this._waveIdArr.length;
    };

    GameNodeCtl.prototype.updateEnemyAppears = function (dt) {
        if (this._waveIndex < ENEMY_WAVE_CONFIG.waves.length - 1) {
            var flag;
            if (this._waveIndex === this._gameStartWaveIndex) {
                this._thisWaveScore = Infinity;
                flag = "score";
            } else
                flag = ENEMY_WAVE_CONFIG.waves[this._waveIndex].flag;

            var nextWave = ENEMY_WAVE_CONFIG.waves[this._waveIndex + 1];
            if ((flag === "score" && this._thisWaveScore >= nextWave.score) || (flag === "clean" && this.waveFinished())) {
                this._waveIndex++;
                var wavePercent = ENEMY_WAVE_CONFIG.getWavePercent(this._waveIndex);
                if (wavePercent.bossWave) {
                    this._waveProgressCtl.turnHot();
                    this._waveProgressCtl.setProgress(1, true);
                    vee.Audio.playEffect("sfx_boss_show.mp3");
                } else {
                    this._waveProgressCtl.turnNormal();
                    this._waveProgressCtl.setProgress(wavePercent.percent, true);
                }
                this._waveIdArr = nextWave.enemies;
                this._waveIdArrIdx = 0;
                this._waveMaxEnemies = this._waveIdArr.length;
                this.showChapter(this._waveIndex);
                this._thisWaveScore = 0;

                dt = -(this._addEnemyDT + nextWave.wait);
            }
        }

        this.addEnemy(dt);
    };

    GameNodeCtl.prototype.updateMissileKillPlayer = function (dt) {
        var containerSize = this.lyMissile.getContentSize();
        var player = this._player;
        this._missileManager.iterateMissiles(function (weapon) {
            if (weapon instanceof Arrow) {
                var arrow = weapon;
                var endPos = arrow.getPosition();
                var angle = arrow.getRotation();
                var height = arrow.getContentSize().height;
                var headPos = vee.Utils.getPointWithAngle(endPos, height, angle);
                var centerPos = vee.Utils.getPointWithAngle(endPos, height / 2, angle);
                if (vee.Utils.lineIntersectRect(headPos, endPos, player.getBoundingBox())) {
                    if (player.getState() === 4 /* ATTACKING */) {
                        arrow.destroyed(centerPos);
                    } else if (player.can_beAttack()) {
                        arrow.remove();
                        player.hurt(1, arrow);
                    }
                } else if (headPos.x <= 0 || headPos.y <= 0 || headPos.x >= containerSize.width || headPos.y >= containerSize.height) {
                    arrow.destroyed(centerPos);
                }
            } else if (weapon instanceof FireBall || weapon instanceof IceBall || weapon instanceof ShadowArrow) {
                var fireball = weapon;
                var pos = fireball.getPosition();
                if (cc.rectIntersectsRect(fireball.getBoundingBox(), player.getBoundingBox())) {
                    if (player.can_beFireAttack()) {
                        fireball.remove();
                        player.hurt(1, fireball);
                    }
                } else if (pos.x <= 0 || pos.y <= 0 || pos.x >= containerSize.width || pos.y >= containerSize.height) {
                    fireball.remove();
                }
            } else if (weapon instanceof IceFloat || weapon instanceof IcePrick || weapon instanceof Shadow) {
                var iceFloat = weapon;
                if (cc.rectIntersectsRect(iceFloat.getBoundingBox(), player.getBoundingBox())) {
                    if (player.can_beFireAttack()) {
                        player.hurt(1, iceFloat);
                    }
                }
            }
        }.bind(this));
    };

    GameNodeCtl.prototype.updatePlayerState = function (dt) {
        var p = this._player;

        if (p.getState() === 2 /* RUNNING */) {
            p.showIndicator();
        } else {
            p.hideIndicator();
        }
        this._itemManager.checkPlayerGotItem(p, this.onPlayerGetItem.bind(this), p.getItemRange());
        switch (p.getState()) {
            case 2 /* RUNNING */:
                p.run();
                break;
            case 4 /* ATTACKING */:
                var start = p.getGlobalSwordKeeStartPos();
                var end = p.getGlobalSwordKeePos();
                this._enemyManager.iterateLive(function (enemy) {
                    if (vee.Utils.lineIntersectRect(start, end, enemy.getBoundingBox()) && enemy.can_beAttack()) {
                        if (p.getAttack() >= enemy.getLife()) {
                            this.addKilled();
                        }
                        enemy.hurt(p.getAttack(), p);
                        this.comboAdd();
                        this.shakeScreen(GAME_CONFIG.getShakeScreenLevel(this._comboCtl.getCombo()));
                        this._hurtEnemiesOfLastSlash.push({ score: enemy.getScore() });
                    }
                }.bind(this));
                break;
            case 5 /* AFTER_ATTACK */:
                if (this._hurtEnemiesOfLastSlash.length > 0) {
                    for (var j = 0; j < this._hurtEnemiesOfLastSlash.length; j++) {
                        var eScore = this._hurtEnemiesOfLastSlash[j].score;
                        var score = GAME_CONFIG.getScore(this._hurtEnemiesOfLastSlash.length, eScore, this._comboCtl.getCombo());
                        this.addScore(score);
                    }
                    if (this._hurtEnemiesOfLastSlash.length >= 3) {
                        this._multiKillsCtl.show(this._hurtEnemiesOfLastSlash.length);
                    }
                }
                break;
        }
        if (p.getState() !== 4 /* ATTACKING */) {
            this._hurtEnemiesOfLastSlash = [];
        }
    };

    GameNodeCtl.prototype.updateEnemiesState = function (dt) {
        this._enemyUpdateDT += dt;
        if (this._enemyUpdateDT < cc.director.getAnimationInterval()) {
            return;
        }
        this._enemyUpdateDT = 0;

        var playerPos = this._player.getPosition();
        if (!playerPos) {
            return;
        }
        this._enemyManager.iterateLive(function (enemy) {
            switch (enemy.getState()) {
                case 2 /* RUNNING */:
                    enemy.setRunningDestPos(playerPos);
                    enemy.run();
                    break;
                case 3 /* READY_ATTACK */:
                    enemy.setRunningDestPos(playerPos);
                    break;
                case 4 /* ATTACKING */:
                    if (enemy instanceof BossFire) {
                        if (cc.rectIntersectsRect(enemy.getWorldAttackBoundingBox(), this._player.getBoundingBox()) && this._player.can_beFireAttack()) {
                            this._player.hurt(enemy.getAttack(), enemy);
                        }
                    }
                    break;
                case 1 /* STATIC */:
                    enemy.setRunningDestPos(playerPos);
                    enemy.setState(2 /* RUNNING */);
                    break;
            }
        }.bind(this));
    };

    GameNodeCtl.prototype.updateEffectKillEnemy = function (dt) {
        this.lyEffect.getChildren().forEach(function (node, idx, arr) {
            if (node.controller && (typeof node.controller.getWorldRect === "function")) {
                this._enemyManager.iterateLive(function (e) {
                    if (e.can_beAttack() && cc.rectIntersectsRect(node.controller.getWorldRect(), e.getBoundingBox())) {
                        this.addScore(e.getScore());
                        if (1 >= e.getLife()) {
                            this.addKilled();
                        }
                        e.hurt(node.controller.getAttack(), this._player);
                        this.comboAdd();
                        this.shakeScreen(GAME_CONFIG.getShakeScreenLevel(this._comboCtl.getCombo()));
                    }
                }.bind(this));
            }
        }, this);
    };

    GameNodeCtl.prototype.onPlayerRevived = function () {
        this._totalSoulCtl.setNumber(DataManager.getInstance().getSoul());
        this._player.setLocalZOrder(10000);
        this._player._ccbNode.animationManager.runAnimationsForSequenceNamed("revive", true);
        var duration = this._player._ccbNode.animationManager.getSequenceDuration("revive");
        this._player.runAction(cc.Sequence.create(cc.DelayTime.create(duration), cc.CallFunc.create(function () {
            var hurtEnemies = [];
            this._enemyManager.iterateLive(function (enemy) {
                if (enemy.can_beAttack()) {
                    if (1 >= enemy._life) {
                        this.addKilled();
                    }
                    enemy.hurt(1, this._player);
                    this.comboAdd();
                    this.shakeScreen(GAME_CONFIG.getShakeScreenLevel(this._comboCtl.getCombo()));
                    hurtEnemies.push({ score: enemy.getScore() });
                }
            }.bind(this));
            if (hurtEnemies.length > 0) {
                for (var i = 0; i < hurtEnemies.length; i++) {
                    var eScore = hurtEnemies[i].score;
                    var score = GAME_CONFIG.getScore(hurtEnemies.length, eScore, this._comboCtl.getCombo());
                    this.addScore(score);
                }
                if (hurtEnemies.length >= 3) {
                    this._multiKillsCtl.show(hurtEnemies.length);
                }
            }
            this._player.beBreakable(this._player._reviveUnbreakableDuration);
            this._player.setState(1 /* STATIC */);
            this._heartCtl.fullHearts();
            this._player._life = this._playerTotalHeart;
        }, this)));
    };

    GameNodeCtl.prototype.onPlayerGetItem = function (itemName) {
        var effectNode;
        switch (itemName) {
            case ITEM_TYPE.SOUL.className:
                var soulEffect = cc.BuilderReader.load("efx_soul_txt.ccbi");
                soulEffect.animationManager.runAnimationsForSequenceNamed("new");
                soulEffect.animationManager.setCompletedAnimationCallback(soulEffect, function () {
                    soulEffect.animationManager.setCompletedAnimationCallback(soulEffect, null);
                    soulEffect.removeFromParent();
                });
                soulEffect.setAnchorPoint(0.5, 0.5);
                soulEffect.setPosition(this._player.getPosition());
                soulEffect.x = soulEffect.x + vee.Utils.randomInt(-50, 50);
                vee.Audio.playEffect("sfx_getsoul_" + vee.Utils.randomInt(1, 4) + ".mp3");
                this.lyEffect.addChild(soulEffect);
                this._currentSoulNumber++;
                this._totalSoulCtl.addNumber(1);
                this._player.enableItem(itemName);
                break;
            case ITEM_TYPE.ZOMBIE.className:
                var value = ITEM_TYPE.getZombieValue();
                var count = value.count;
                vee.Audio.playEffect("sfx_magic_zombie.mp3");
                for (var i = 0; i < count; i++) {
                    EntityFactory.createEnemy(value.className);
                }
                break;
            case ITEM_TYPE.STORM.className:
                effectNode = cc.BuilderReader.load("efx_bomb.ccbi");
                var stormValue = ITEM_TYPE.getStormValue();
                effectNode.controller.play();
                effectNode.controller.setAttack(stormValue.attack);
                effectNode.controller.setProperties({ range: stormValue.range });
                break;
            case ITEM_TYPE.TIME.className:
                var timeValue = ITEM_TYPE.getTimeValue();
                this.onTimeFreeze(timeValue.duration);
                this._player.enableItem(itemName);
                break;
            default:
                this._player.enableItem(itemName);
        }
        if (effectNode) {
            effectNode.setAnchorPoint(0.5, 0.5);
            var playerPos = this._player.getPosition();
            effectNode.setPosition(playerPos);
            this.lyEffect.addChild(effectNode);
        }
    };

    GameNodeCtl.prototype.onTimeFreeze = function (duration) {
        this.onTimeRestore();
        vee.Utils.unscheduleCallbackForTarget(this, this.onTimeRestore);
        vee.Utils.scheduleOnceForTarget(this, this.onTimeRestore, duration);
        this._enemyTimeScale = 0.3;
        this.timeFreezeMaskShow();
        this.playAnimate("Time Freeze");
        vee.Audio.pauseMusic();
    };
    GameNodeCtl.prototype.onTimeRestore = function () {
        this._enemyTimeScale = 1;
        vee.Audio.resumeMusic();
        this.timeFreezeMaskDisappear();
    };

    GameNodeCtl.prototype.onAddMissile = function (a) {
        this._missileManager.addMissile(a);
        a.manager = this._missileManager;
    };

    GameNodeCtl.prototype.getMissileActionManager = function () {
        return this._enemyActionManager;
    };

    GameNodeCtl.prototype.getMissileNode = function () {
        return this.lyMissile;
    };

    GameNodeCtl.prototype.onLineKilledPlayer = function (startPos, endPos, murder) {
        if (this._player && this._player.can_beAttack()) {
            if (vee.Utils.lineIntersectRect(startPos, endPos, this._player.getBoundingBox())) {
                this._player.hurt(murder.getAttack(), murder);
                return 1;
            }
        }
        return 0;
    };

    GameNodeCtl.prototype.onRectKilledPlayer = function (rect, murder) {
        if (this._player && this._player.can_beAttack()) {
            if (cc.rectIntersectsRect(rect, this._player.getBoundingBox())) {
                this._player.hurt(murder.getAttack(), murder);
                return 1;
            }
        }
        return 0;
    };
    GameNodeCtl.prototype.onRectKilledEnemy = function (rect, murder) {
        this._enemyManager.iterateLive(function (enemy) {
            if (cc.rectIntersectsRect(rect, enemy.getBoundingBox())) {
                if (enemy.can_beAttack()) {
                    this.addScore(enemy.getScore());
                    if (1 >= enemy.getLife()) {
                        this.addKilled();
                    }
                    enemy.hurt(1, murder);
                    this.comboAdd();
                    this.shakeScreen(GAME_CONFIG.getShakeScreenLevel(this._comboCtl.getCombo()));
                }
            }
        }.bind(this));
    };

    GameNodeCtl.prototype.onEntityRemove = function (e) {
        var className = helper.getClassName(e);
        if (e instanceof Player) {
            if (DataManager.getInstance().getCurrentCharacterID() === 4 /* SHADOW */) {
                if (this._shadowRevive < 1) {
                    this._shadowRevive++;
                    this.onPlayerRevived();
                    return;
                }
            }

            // First time die
            vee.GameCenter.unlockAchievement(app.Config.AchievementIDs.ACH_THIS_IS_DARK_SLASH);
            DataManager.getInstance().setSoul(this._totalSoulCtl.getNumber());
            GameManager.getInstance().showSaveLife(this._waveIndex);
            return;
        }
        if (e instanceof Enemy) {
            if (this._killedEnemies[className]) {
                this._killedEnemies[className]++;
            } else {
                this._killedEnemies[className] = 1;
            }

            var countOfKilled = this._killedEnemies[className] + (this._killedEnemiesHistory[className] || 0);
            if (countOfKilled === 1) {
                switch (className) {
                    case ENTITY.BossSkeleton._className:
                        vee.GameCenter.unlockAchievement(app.Config.AchievementIDs.ACH_MAY_PEACE_WITH_YOU);
                        break;
                    case ENTITY.BossFire._className:
                        vee.GameCenter.unlockAchievement(app.Config.AchievementIDs.ACH_WATER_IS_COMING);
                        break;
                    case ENTITY.BossIce._className:
                        vee.GameCenter.unlockAchievement(app.Config.AchievementIDs.ACH_BURNING_YOUR_SOUL);
                        break;
                    case ENTITY.BossShadow._className:
                        vee.GameCenter.unlockAchievement(app.Config.AchievementIDs.ACH_ITS_THE_END);
                        break;
                }
                if (className === ENTITY.BossSkeleton._className || className === ENTITY.BossFire._className || className === ENTITY.BossIce._className) {
                    var seq = "show";
                    if (className === ENEMY_WAVE_CONFIG.lastBoss) {
                        seq = "fin";
                    }
                    var wave = ENEMY_WAVE_CONFIG.bossWave[className];
	                if (wave < DataManager.getInstance().getStartWave()) {
		                return;
	                }
                    var node = cc.BuilderReader.load("unlock_save_stone.ccbi");
                    node.animationManager.runAnimationsForSequenceNamed(seq);
                    node.scheduleOnce(node.removeFromParent.bind(node), node.animationManager.getSequenceDuration(seq));
                    this.rootNode.addChild(node);
                    DataManager.getInstance().setStartWave(wave + 1);
                    var stoneLevel = DataManager.getInstance().getProductData()[STORE_PRODUCT.MagicShopData.SAVE_STONE.className];
                    if (stoneLevel < 0) {
                        stoneLevel = 1;
                    } else if (stoneLevel < 3) {
                        stoneLevel++;
                    }
                    DataManager.getInstance().setProductData(STORE_PRODUCT.MagicShopData.SAVE_STONE.className, stoneLevel);
                }
            }
        }

        this._enemyManager.removeEnemy(e);
    };

    GameNodeCtl.prototype.onEntityCorpse = function (e) {
        if (e instanceof Enemy) {
            this._enemyManager.enemyCorpse(e);
        }
    };
    GameNodeCtl.prototype.onEntityHurt = function (e) {
        if (e instanceof Player) {
            this.lyHurt.animationManager.runAnimationsForSequenceNamed("show");
            this._heartCtl.loseLife();
//            GameNodeCtl.prototype.showHitStop(e, 0.01);// Player hurt
        } else if (e instanceof Enemy) {
            if (e === this._currentBoss) {
                if (e.getLife() < 1) {
                    this.dismissBossHP();
                    this._currentBoss = null;
	                GameNodeCtl.prototype.showHitStop(e, 0.05); // Boss dead
                } else {
                    this.setBossHP(e.getLife(), e.getTotalLife());
	                GameNodeCtl.prototype.showHitStop(e, 0.00164); // Boss hurt
                }
            } else {
//	            GameNodeCtl.prototype.showHitStop(e, 0.00164); // Monster hurt
            }
            if (e.getLife() < 1) {
                this._itemManager.generate(ITEM_TYPE.SOUL.className, e.getPosition(), e.getSoul());
                if (this._itemManager.isItemNumberValid()) {
                    var numberOfUnlockItems = ITEM_TYPE.getAvailableItems().length;
                    var random = Math.random();
                    var probability = e.getItemProbability() * ITEM_TYPE.getItemProbability(numberOfUnlockItems);
                    if (random <= probability) {
                        var itemName = vee.Utils.randomChoice(this._itemManager.filterAvailableItem(e, ITEM_TYPE.getAvailableItems()));

                        // May get undefined from filtered result.
                        if (itemName) {
                            this._itemManager.generate(itemName, e.getPosition(), 1);
                        }
                    }
                }
            }
        }
    };
	GameNodeCtl.prototype.showHitStop = function(obj, time) {
		obj.getScheduler().setTimeScale(0.05);
		vee.Utils.scheduleOnce(function(){
			obj.getScheduler().setTimeScale(1);
		}.bind(this),time);
	};
    return GameNodeCtl;
})(vee.Class);
