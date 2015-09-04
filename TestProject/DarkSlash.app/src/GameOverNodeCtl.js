/**
* Created by yuan on 14-8-19.
*/
/// <reference path="../vee.d.ts" />
/// <reference path="../Manager/DataManager" />
/// <reference path="../Manager/GameManager" />
/// <reference path="../appConfig" />
/// <reference path="ShopNodeCtl" />
/// <reference path="PromotionShopCtl" />
/// <reference path="../UI/HelpMaskLayer" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameOverNodeCtl = (function (_super) {
    __extends(GameOverNodeCtl, _super);
    GameOverNodeCtl["__ts"]=true;
    function GameOverNodeCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
        this._killedTotalNumber = 0;
        this._gotBest = false;
        this._progressDuration = 2;
    }
    GameOverNodeCtl.prototype.onLoaded = function () {
	    if (cc.sys.os == cc.sys.OS_IOS) {
		    vee.Utils.scheduleOnce(function() {
			    vee.Ad.showInterstitialAd();
		    }, 1);
	    }
        vee.Audio.playMusic("bgm_over.mp3");
        this._progressCtl = (this.lyProgress.controller);
        this.updateDoublePurchased();
        this.updateUnlockSign();
        this.handleKey(true);
    };
    GameOverNodeCtl.prototype.updateUnlockSign = function () {
        this.spNew.visible = STORE_FUNCTIONS.hasUnlockedProduct().length > 0;
    };
    GameOverNodeCtl.prototype.setBossKilled = function (killedEnemies) {
        if (killedEnemies[ENTITY.BossSkeleton._className]) {
            var ccb = cc.BuilderReader.load("Boss.ccbi");
            ccb.animationManager.runAnimationsForSequenceNamed("boss1");
            ccb.setPosition(this.spBossSkeleton.getPosition());
            this.spBossSkeleton.getParent().addChild(ccb);
        }
        if (killedEnemies[ENTITY.BossFire._className]) {
            var ccb2 = cc.BuilderReader.load("Boss.ccbi");
            ccb2.animationManager.runAnimationsForSequenceNamed("boss2");
            ccb2.setPosition(this.spBossFlame.getPosition());
            this.spBossFlame.getParent().addChild(ccb2);
        }
        if (killedEnemies[ENTITY.BossIce._className]) {
            var ccb3 = cc.BuilderReader.load("Boss.ccbi");
            ccb3.animationManager.runAnimationsForSequenceNamed("boss3");
            ccb3.setPosition(this.spBossIce.getPosition());
            this.spBossIce.getParent().addChild(ccb3);
        }
        if (killedEnemies[ENTITY.BossShadow._className]) {
            var ccb4 = cc.BuilderReader.load("Boss.ccbi");
            ccb4.animationManager.runAnimationsForSequenceNamed("boss4");
            ccb4.setPosition(this.spBossShadow.getPosition());
            this.spBossShadow.getParent().addChild(ccb4);
        }
    };

    GameOverNodeCtl.prototype.setScore = function (soulCount, scoreCtl, killedEnemies, killedNumber) {
        this._scoreCtl = scoreCtl;
        this._killedEnemies = killedEnemies;
        this.setBossKilled(killedEnemies);
        this._killedTotalNumber = killedNumber;
        var bestScore = DataManager.getInstance().getBest();
        if (scoreCtl.getNumber() > bestScore) {
            this._gotBest = true;
            DataManager.getInstance().setBest(scoreCtl.getNumber());
            this.rootNode.animationManager.runAnimationsForSequenceNamed("dead_best");
            this.lbBestScore.setString(scoreCtl.getNumber().toString());
        }
        this.lbBestScore.setString(bestScore.toString());
        this.lbScore.setString(scoreCtl.getNumber().toString());
        this.lbKilled.setString(soulCount.toString());
    };

    GameOverNodeCtl.prototype.setKilled = function (killed) {
        this.lbKilled.setString(killed.toString());
    };
    GameOverNodeCtl.prototype.setTime = function (time_ms) {
        this.lbTime.setString(vee.Utils.formatTimeWithSecond(Math.floor(time_ms / 1000)));
    };
    GameOverNodeCtl.prototype.setSoul = function (soul) {
        this.lbSoul.setString(soul.toString());
    };
    GameOverNodeCtl.prototype.setInitExp = function (exp, total) {
        if (total === 0) {
            total = 1;
            exp = 0;
        }
        this._progressCtl.reset(exp / total, total);
        this._progressCtl.setEaseEffectEnabled(false);
    };
    GameOverNodeCtl.prototype.setExp = function (exp, callback) {
        if (this._progressCtl.getMaxValue() === 1) {
            exp = 1;
        }
        this._progressCtl.setRunOutSpeed(this._progressDuration);
        this._progressCtl.setValue(exp, true);
        this._progressCtl._callback = function () {
            var afterProgressCallback = function () {
                this.showTutorial();
                var promotionShopCtl = this.showPromotionShop();
                if (promotionShopCtl) {
                    promotionShopCtl.setCloseCallback(function () {
                        this.showRateUs();
                    }.bind(this));
                } else {
                    this.showRateUs();
                }
            }.bind(this);

            // level up
	        this.btnDouble.setVisible(false);
            if (this._progressCtl.getProgress() >= 1) {
                this.lbLevel.setString(this._level + 1);
                this._progressCtl._callback = null;
                this._progressCtl.setProgress(0);
                callback(function () {
                    this.lyBtns.setScale(1);
                    this.lyBtns.visible = false;
                    afterProgressCallback();
                    this.lyBtns.setScale(0);
                    this.lyBtns.visible = true;
                    this.lyBtns.runAction(cc.EaseBackOut.create(cc.ScaleTo.create(0.5, 1)));
                    this.btnDouble.runAction(cc.sequence(
	                    cc.show(),
	                    cc.EaseBackOut.create(cc.ScaleTo.create(0.5, 1)),
	                    cc.callFunc(this.showBtnDoubleEffect.bind(this)))
                    );
                }.bind(this));
            } else {
                this.lyBtns.runAction(cc.Sequence.create(cc.EaseBackOut.create(cc.ScaleTo.create(0.5, 1)), cc.CallFunc.create(afterProgressCallback)));
	            this.btnDouble.runAction(cc.sequence(
		            cc.show(),
		            cc.EaseBackOut.create(cc.ScaleTo.create(0.5, 1)),
		            cc.callFunc(this.showBtnDoubleEffect.bind(this)))
	            );
            }
        }.bind(this);
    };

	GameOverNodeCtl.prototype.showBtnDoubleEffect = function() {
		if (!this.spDouble.visible) {
			// show effect
			var sp = this.psVip;
			var arrP = [];
			arrP.push(cc.p(685, 307));
			arrP.push(cc.p(699, 292));
			arrP.push(cc.p(781, 292));
			arrP.push(cc.p(793, 306));
			arrP.push(cc.p(783, 322));
			arrP.push(cc.p(699, 322));
			arrP.push(cc.p(685, 307));

			sp.setPosition(arrP[0]);
			var arrAct = [];
			for (var i = 0; i < arrP.length - 1; ++i) {
				var dur = vee.Utils.distanceBetweenPoints(arrP[i], arrP[i+1]) * 0.005;
				var act = cc.moveTo(dur, arrP[i+1]);
				arrAct.push(act);
			}

			sp.runAction(cc.repeatForever(cc.sequence(arrAct)));

			var ms = new cc.MotionStreak(0.4, 1, 3, cc.color(248,174,46), "res/efx/efx_white.png");
			this.rootNode.addChild(ms);
			ms.setPosition(arrP[0]);

			var sp1 = this.psVip1;
			arrP = [];
			arrP.push(cc.p(793, 306));
			arrP.push(cc.p(783, 322));
			arrP.push(cc.p(699, 322));
			arrP.push(cc.p(685, 307));
			arrP.push(cc.p(699, 292));
			arrP.push(cc.p(781, 292));
			arrP.push(cc.p(793, 306));

			sp1.setPosition(arrP[0]);
			arrAct = [];
			for (var i = 0; i < arrP.length - 1; ++i) {
				var dur = vee.Utils.distanceBetweenPoints(arrP[i], arrP[i+1]) * 0.005;
				var act = cc.moveTo(dur, arrP[i+1]);
				arrAct.push(act);
			}

			sp1.runAction(cc.repeatForever(cc.sequence(arrAct)));

			var ms1 = new cc.MotionStreak(0.4, 1, 3, cc.color(248,174,46), "res/efx/efx_white.png");
			this.rootNode.addChild(ms1);
			ms1.setPosition(arrP[0]);

			vee.Utils.scheduleCallbackForTarget(this.rootNode, function() {
				ms.setPosition(sp.getPosition());
				ms1.setPosition(sp1.getPosition());
			});
		}
	};

    GameOverNodeCtl.prototype.showTutorial = function () {
        if (DataManager.getInstance().isShopTutorial()) {
            var pos = this.btnShop.getParent().convertToWorldSpace(this.btnShop.getPosition());
            vee.PopMgr.popLayer(new HelpMaskLayer(vee.Utils.getObjByLanguage("Upgrade your hero.", "升级你的英雄!"), pos, this.btnShop.getBoundingBox().width / 2));
        }
    };

    GameOverNodeCtl.prototype.showPromotionShop = function () {
	    var isDoubleSoul = DataManager.getInstance().isDoubleSoul();
        var promotionRound = DataManager.getInstance().getPromotionRound();

	    if (isDoubleSoul) return;

        //it would open when during 7 to 15 rounds.
        //and it will open definitely on 15 if there's none during 7 to 14 rounds.
        var ctl = null;
        if (promotionRound >= 7 && promotionRound < 15) {
            if (vee.Utils.randomInt(7, 15) === 7) {
	            if (isDoubleSoul) BuyItemAlertCtl.show(STORE_PRODUCT.SoulShopData.SOUL_PACK_2);
                else ctl = (vee.PopMgr.popCCB("Gift.ccbi", true).controller);
            }
        } else if (promotionRound >= 15) {
	        if (isDoubleSoul) BuyItemAlertCtl.show(STORE_PRODUCT.SoulShopData.SOUL_PACK_2);
            else ctl = (vee.PopMgr.popCCB("Gift.ccbi", true).controller);
        }
        return ctl;
    };

    GameOverNodeCtl.prototype.showRateUs = function () {
        if (DataManager.getInstance().isShowRate() && cc.sys.os === cc.sys.OS_IOS) {
            DataManager.getInstance().setShowRate();
            vee.PopMgr.popCCB("Rate.ccbi", true);
        }
    };

    GameOverNodeCtl.prototype.setLevel = function (level) {
        this._level = level;
        this.lbLevel.setString(level.toString());
        if (DataManager.getInstance().isDoubleSoul()) {
            this.lbSoulBonus.setString("+" + (level + 100) + "%");
        } else {
            this.lbSoulBonus.setString("+" + level + "%");
        }
    };

    GameOverNodeCtl.prototype.updateDoublePurchased = function () {
        if (DataManager.getInstance().isDoubleSoul()) {
            this.spDouble.visible = true;
            this.btnDouble.removeFromParent();
        } else {
            this.spDouble.visible = false;
        }
    };

    GameOverNodeCtl.prototype.onPlayClicked = function () {
        GameManager.getInstance().gameStart();
    };

    GameOverNodeCtl.prototype.onShopClicked = function () {
        var ctl = (vee.PopMgr.popCCB("shop.ccbi", true).controller);
        if (DataManager.getInstance().isShopTutorial()) {
            ctl.showTutorial(function () {
                DataManager.getInstance().setShopTutorial();
            });
        }
        ctl.CloseCallback = function () {
            this.updateUnlockSign();
            this.updateDoublePurchased();
        }.bind(this);
    };

    GameOverNodeCtl.prototype.onDoubleClicked = function () {
	    BuyItemAlertCtl.show(STORE_PRODUCT.SoulShopData.DOUBLE);
//        var ctl = (vee.PopMgr.popCCB("shop.ccbi", true).controller);
//        ctl.setShop(STORE_ENUM.ShopType.Soul);
//        ctl.CloseCallback = function () {
//            this.updateUnlockSign();
//            this.updateDoublePurchased();
//        }.bind(this);
    };

    GameOverNodeCtl.prototype.onShareClicked = function () {
        var numOfTotalKilled = this._killedTotalNumber;
        var killedSkeleton = this._killedEnemies[ENTITY.BossSkeleton._className] > 0;
        var killedFlame = this._killedEnemies[ENTITY.BossFire._className] > 0;
        var killedIce = this._killedEnemies[ENTITY.BossIce._className] > 0;
        var killedShadow = this._killedEnemies[ENTITY.BossShadow._className] > 0;

        var lang = cc.sys.language;
        var desc;
        var kill_desc = "";
        if (lang === cc.sys.LANGUAGE_CHINESE) {
            if (killedShadow) {
                kill_desc = "杀掉了暗影领主";
            } else if (killedIce) {
                kill_desc = "杀掉了冰魂";
            } else if (killedFlame) {
                kill_desc = "杀掉了炎魔";
            } else if (killedSkeleton) {
                kill_desc = "杀掉了骷髅王";
            } else {
                kill_desc = "杀掉了" + numOfTotalKilled + "个恶魔";
            }
            if (this._gotBest) {
                desc = "新纪录！我在#暗黑斩:英魂#里" + kill_desc + "，获得最高分" + this._scoreCtl.getNumber() + "分！有人能挑战我吗！";
            } else {
                desc = "哈哈！我在#暗黑斩:英魂#里" + kill_desc + "，获得了" + this._scoreCtl.getNumber() + "分！";
            }
        } else {
            if (killedShadow) {
                kill_desc = "have killed " + ENTITY.BossShadow._displayName;
            } else if (killedIce) {
                kill_desc = "have killed " + ENTITY.BossIce._displayName;
            } else if (killedFlame) {
                kill_desc = "have killed " + ENTITY.BossFire._displayName;
            } else if (killedSkeleton) {
                kill_desc = "have killed " + ENTITY.BossSkeleton._displayName;
            } else {
                kill_desc = "have killed " + numOfTotalKilled + " demons";
            }
            if (this._gotBest) {
                desc = "New record! I " + kill_desc + " in #DarkSlash: Hero , and scored " + this._scoreCtl.getNumber() + "!";
            } else {
                desc = "LOL! I " + kill_desc + " in #DarkSlash: Hero , and scored " + this._scoreCtl.getNumber() + "!";
            }
        }
        vee.Utils.shareScreen(desc+"http://veewo.com/games/?name=darkslash2cn", this.rootNode);
    };

    GameOverNodeCtl.prototype.onKeyBack = function () {
        GameManager.getInstance().gameHome();
        return true;
    };
    return GameOverNodeCtl;
})(vee.Class);
