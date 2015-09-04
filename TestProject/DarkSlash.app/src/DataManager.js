var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
/// <reference path="../config" />

var CharacterID;
(function (CharacterID) {
    CharacterID[CharacterID["KEVOTHE"] = 0] = "KEVOTHE";
    CharacterID[CharacterID["RYU"] = 1] = "RYU";
    CharacterID[CharacterID["SAKURA"] = 2] = "SAKURA";
    CharacterID[CharacterID["PALADIN"] = 3] = "PALADIN";
    CharacterID[CharacterID["SHADOW"] = 4] = "SHADOW";
})(CharacterID || (CharacterID = {}));
var DataManager = (function (_super) {
    __extends(DataManager, _super);
    DataManager["__ts"]=true;
    function DataManager() {
        (function(){
    if(_super.__ts){
        return function(_this){
            _this.__instanceId = ClassManager.getNewInstanceId();
            _super.apply(_this, Array.prototype.slice.call(arguments,1));
        }
    } else if (typeof _super.prototype.ctor === "function") {
        return function(_this){
            _this.__instanceId = ClassManager.getNewInstanceId();
            _super.prototype.ctor.apply(_this, Array.prototype.slice.call(arguments,1));
        }
    } else {
        return function(_this){
            _this.__instanceId = ClassManager.getNewInstanceId();
        };
    }
}())
(this);
        this._objName = "darkslash";
        this._bestScoreKey = "bestScore";
        this._saveChanceKey = "saveChance";
        this._characterIDKey = "characterID";
        this._soulKey = "soul";
        this._levelKey = "level";
        this._startWaveKey = "startWave";
        this._expKey = "exp";
        this._analyticsKey = "analytics";
        this._productDataKey = "productData";
        this._shopTutKey = "shopTutorial";
        this._showRateKey = "showRate";
	    this._firstHomeKey = "firstHome";
	    this._isShopTutoring = false;
        this._dataObj = null;
        this._cachedCurrentCharacterID = -1;
        this._dataObj = this.loadData() || {};
        this._dataObj = {
            showRate: this.getDefaultValue(this._showRateKey, 0),
            startWave: this.getDefaultValue(this._startWaveKey, 0),
            characterID: this.getDefaultValue(this._characterIDKey, 0 /* KEVOTHE */),
            bestScore: this.getDefaultValue(this._bestScoreKey, 0),
            saveChance: this.getDefaultValue(this._saveChanceKey, 1),
            soul: this.getDefaultValue(this._soulKey, 0),
            level: this.getDefaultValue(this._levelKey, 1),
            exp: this.getDefaultValue(this._expKey, 0),
	        shopTutorial: this.getDefaultValue(this._shopTutKey, 0),
	        firstHome: this.getDefaultValue(this._firstHomeKey, 0),
            productData: this.getDefaultValue(this._productDataKey, {
                REVIVE: -1,
                SAVE_STONE: -1,
                SAVE_STONE_SLOT: 0,
                STAMINA: -1,
                AGILITY: -1,
                DAMAGE: -1,
                KEVOTHE: -1,
                RYU: -1,
                SAKURA: -1,
                PALADIN: -1,
                SHADOW: -1,
                SHIELD: -1,
                POWER: -1,
                STORM: -1,
                MAGNET: -1,
                ZOMBIE: -1,
                TIME: -1,
                DOUBLE: 0,
                HERO_PACK: 0,
	            LIGHT_AND_SHADOW_PACK : 0
            }),
            analytics: this.getDefaultValue(this._analyticsKey, {
                SavedLife: 0,
                KilledCount: 0,
                KilledEnemies: {},
                KilledByEnemies: {},
                PromotionRound: 0,
                GameRound: 0
            })
        };
        this.saveData(this._dataObj);
    }
    DataManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new DataManager();
        }
        return this._instance;
    };

    DataManager.prototype.getDefaultValue = function (key, defaultVal) {
        if (this._dataObj[key] === undefined) {
            return defaultVal;
        } else {
            return this._dataObj[key];
        }
    };

    DataManager.prototype.loadData = function () {
        if (this._dataObj === null) {
            this._dataObj = (vee.Utils.loadObj(this._objName));
        }
        return this._dataObj;
    };

    DataManager.prototype.saveData = function (data) {
        if (data) {
            this._dataObj = data;
            vee.Utils.saveObj(data, this._objName);
        }
    };

    DataManager.prototype.get = function (key) {
        return this.loadData()[key];
    };

    DataManager.prototype.set = function (key, value) {
        var data = this.loadData();
        data[key] = value;
        this.saveData(data);
    };

    DataManager.prototype.getAnalytics = function () {
        return this.get(this._analyticsKey);
    };

    DataManager.prototype.setAnalytics = function (a) {
        this.set(this._analyticsKey, a);
    };

    DataManager.prototype.setKilledEnemies = function (killedEnemies, killedCount) {
        var analytics = this.getAnalytics();
        for (var p in killedEnemies) {
            if (killedEnemies.hasOwnProperty(p)) {
                if (analytics.KilledEnemies[p]) {
                    analytics.KilledEnemies[p] += killedEnemies[p];
                } else {
                    analytics.KilledEnemies[p] = killedEnemies[p];
                }
            }
        }
        analytics.KilledCount += killedCount;

        // PromotionRound
        analytics.PromotionRound = analytics.PromotionRound || 0;
        analytics.PromotionRound++;

        this.setAnalytics(analytics);
    };

    DataManager.prototype.addSavedLife = function () {
        var config = this.getAnalytics();
        config.SavedLife++;
        this.setAnalytics(config);
        return config.SavedLife;
    };

    DataManager.prototype.getDataUnlockingStore = function () {
        var data = this.loadData();
        var unlockData = vee.Utils.copy(data.analytics);
        unlockData.characterLevel = data.level;
        unlockData.soul = data.soul;
        unlockData.productLevel = data.productData;
        return unlockData;
    };

    DataManager.prototype.isShopTutorial = function () {
        return this.get(this._shopTutKey) !== 1;
    };

    DataManager.prototype.setShopTutorial = function () {
        this.set(this._shopTutKey, 1);
    };

	DataManager.prototype.isShopTutoring = function () {
		return this._isShopTutoring;
	};

	DataManager.prototype.setShopTutoring = function (tutoring) {
		this._isShopTutoring = tutoring;
	};

    DataManager.prototype.isShowRate = function () {
        var showRate = this.get(this._showRateKey) !== 1;
        var round = this.getGameRound() === 20;
        var killedSkeleton = this.getAnalytics().KilledEnemies[ENTITY.BossSkeleton._className] > 0;
        return (showRate && (round || killedSkeleton));
    };

    DataManager.prototype.setShowRate = function () {
        this.set(this._showRateKey, 1);
    };

    DataManager.prototype.setSoul = function (soul) {
        this.set(this._soulKey, soul);
    };

    DataManager.prototype.addSoul = function (value) {
        this.setSoul(this.getSoul() + value);
    };

    DataManager.prototype.subSoul = function (value) {
        var sub = this.getSoul() - value;
        if (sub < 0) {
            return false;
        } else {
            this.setSoul(sub);
            return true;
        }
    };

    DataManager.prototype.getSoul = function () {
        return this.get(this._soulKey);
    };

    DataManager.prototype.getBest = function () {
        return this.get(this._bestScoreKey);
    };

    DataManager.prototype.setBest = function (value) {
        this.set(this._bestScoreKey, value);
    };

    DataManager.prototype.getStartWave = function () {
        return this.get(this._startWaveKey);
    };

    DataManager.prototype.setStartWave = function (wave) {
        this.set(this._startWaveKey, Math.max(DataManager.getInstance().getStartWave(), wave));
    };

    DataManager.prototype.getSaveStone = function () {
        return this.get(this._productDataKey)[STORE_PRODUCT.MagicShopData.SAVE_STONE.className + "_SLOT"];
    };

    DataManager.prototype.useSaveStone = function () {
        var number = this.getSaveStone();
        number = Math.max(0, number - 1);
        this.setProductData(STORE_PRODUCT.MagicShopData.SAVE_STONE.className + "_SLOT", number);
    };

    DataManager.prototype.getProductData = function () {
        return this.get(this._productDataKey);
    };

    DataManager.prototype.setProductData = function (name, value) {
        var data = this.get(this._productDataKey);
        data[name] = value;
        this.set(this._productDataKey, data);
    };

    DataManager.prototype.upgradeProduct = function (name) {
        var data = this.get(this._productDataKey);
        data[name]++;
        this.set(this._productDataKey, data);
    };

    DataManager.prototype.unlockAllHeroes = function () {
        var data = this.get(this._productDataKey);
        var hero_classNames = [
            STORE_PRODUCT.HeroShopData.SAKURA.className,
            STORE_PRODUCT.HeroShopData.RYU.className,
            STORE_PRODUCT.HeroShopData.PALADIN.className,
            STORE_PRODUCT.HeroShopData.SHADOW.className
        ];
        hero_classNames.forEach(function (name) {
            data[name] = 1;
        });
        this.set(this._productDataKey, data);
    };

	DataManager.prototype.unlockLightAndShadow = function () {
		var data = this.get(this._productDataKey);
		var hero_classNames = [
			STORE_PRODUCT.HeroShopData.PALADIN.className,
			STORE_PRODUCT.HeroShopData.SHADOW.className
		];
		hero_classNames.forEach(function (name) {
			data[name] = 1;
		});
		this.set(this._productDataKey, data);
	};

	DataManager.prototype.checkUnlockProduct = function(className) {
		var data = this.get(this._productDataKey);
		return data[className] >= 0;
	}

    DataManager.prototype.unlockCharacter = function (characterID) {
        var data = this.get(this._productDataKey);
        var className = CharacterID[characterID];
        data[className] = 1;
        this.set(this._productDataKey, data);
    };

    DataManager.prototype.getPromotionRound = function () {
        var data = this.getAnalytics();
        return data.PromotionRound || 0;
    };

    DataManager.prototype.resetPromotionRound = function () {
        var data = this.getAnalytics();
        data.PromotionRound = 0;
        this.set(this._analyticsKey, data);
    };

    DataManager.prototype.getGameRound = function () {
        var data = this.getAnalytics();
        return data.GameRound || 0;
    };

    DataManager.prototype.addGameRound = function () {
        var data = this.getAnalytics();
        if (data.GameRound) {
            data.GameRound++;
        } else {
            data.GameRound = 1;
        }
        this.set(this._analyticsKey, data);
    };

    DataManager.prototype.setSaveChance = function (value) {
        this.set(this._saveChanceKey, value);
    };

    DataManager.prototype.getSaveChance = function () {
        return this.get(this._saveChanceKey);
    };

    DataManager.prototype.getCurrentCharacterID = function () {
        if (this._cachedCurrentCharacterID < 0) {
            this._cachedCurrentCharacterID = this.get(this._characterIDKey);
        }
        return this._cachedCurrentCharacterID;
    };

    DataManager.prototype.isCharacterSelected = function (className) {
        return CharacterID[className] === this.getCurrentCharacterID();
    };

    DataManager.prototype.setCurrentCharacterName = function (className) {
        this._cachedCurrentCharacterID = CharacterID[className];
        this.set(this._characterIDKey, this._cachedCurrentCharacterID);
    };

    DataManager.prototype.getPlayerLevel = function () {
        return this.get(this._levelKey);
    };

    DataManager.prototype.getPlayerExp = function () {
        return this.get(this._expKey);
    };

    DataManager.prototype.setPlayerExp = function (exp) {
        this.set(this._expKey, exp);
    };

	DataManager.prototype.isFirstAtHome = function() {
		return this.get(this._firstHomeKey) !== 1;
	};

	DataManager.prototype.setFirstAtHome = function() {
		this.set(this._firstHomeKey, 1);
	};

    DataManager.prototype.levelUp = function () {
        var data = this.loadData();
        data.level++;
        data.exp = 0;
        this.saveData(data);
    };

    DataManager.prototype.isDoubleSoul = function () {
        var value = this.getProductData()[STORE_PRODUCT.SoulShopData.DOUBLE.className];
        return value > 0;
    };

    DataManager.prototype.isHeroPackPurchased = function () {
        var value = this.getProductData()[STORE_PRODUCT.HeroShopData.HERO_PACK.className] || 0;
        return value > 0;
    };

	DataManager.prototype.isAllHeroUnlocked = function () {
		if (
			DataManager.getInstance().checkUnlockProduct(STORE_PRODUCT.HeroShopData.RYU.className) &&
			DataManager.getInstance().checkUnlockProduct(STORE_PRODUCT.HeroShopData.SAKURA.className) &&
			DataManager.getInstance().checkUnlockProduct(STORE_PRODUCT.HeroShopData.PALADIN.className) &&
			DataManager.getInstance().checkUnlockProduct(STORE_PRODUCT.HeroShopData.SHADOW.className)
			)
		{
			return true;
		} else {
			return false;
		}
	};
    return DataManager;
})(vee.Class);
