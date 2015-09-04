/**
 * Created by yuan on 14-8-7.
 */
/// <reference path="cocos2d.d.ts" />
/// <reference path="vee.d.ts" />
/// <reference path="Manager/DataManager" />
var ENTITY = {
    Player: {
        _ccbName: "c_player4.ccbi",
        _className: "Player",
        _runningIndicatorAnchorY: -2,
        _reviveUnbreakableDuration: 4,
        _itemRange: 40,
        _runningSpeed: 9,//10,11,12,13
        _attackAnchorOffset: 30,        
        _attackRange: 270,//270,290,310,330
        _attackSpeed: 1000,//1000,1100,1200,1300
        _afterAttackDuration: 0.05,
        _hurtDuration: 0.2,
        _unbreakableDuration: 2,
        _life: 1,
        _width: 40,
        _height: 70,
        _attack: 1,


        _swordKeeName: "efx/efx_p_sword_1.png",
        _particleCCB: null

    },
    Zombie: {
        _ccbName: "c_foe1.ccbi",
        _className: "Zombie",
        _runningSpeed: 2,
        _attackPrepareTime: 2,
        _attackRange: 100,
        _attackSpeed: 500,
        _attackAnchorOffset: 10,
        _afterAttackDuration: 0.5,
        _hurtDuration: 0.5,
        _unbreakableDuration: 1,
        _score: 1,
        _life: 1,
        _width: 48,
        _height: 82,
        _soul: [0,1],
        _attack: 1,
        _itemProbability: 0.15,

        _displayName: vee.Utils.getObjByLanguage("Zombie", "僵尸")
    },
    ZombieCrazy: {
        _ccbName: "c_foe9.ccbi",
        _className: "ZombieCrazy",
        _runningSpeed: 5,
        _attackPrepareTime: 0.5,
        _attackRange: 120,
        _attackSpeed: 500,
        _attackAnchorOffset: 10,
        _afterAttackDuration: 0.3,
        _hurtDuration: 0.5,
        _unbreakableDuration: 0.4,
        _score: 3,
        _life: 3,
        _width: 48,
        _height: 82,
        _soul: [1],
        _attack: 1,
        _itemProbability: 0.2,

        _displayName: vee.Utils.getObjByLanguage("Crazy Zombie", "疯狂僵尸")
    },
    ZombieBomb: {
        _ccbName: "c_foe4.ccbi",
        _className: "ZombieBomb",
        _runningSpeed: 2,
        _attackPrepareTime: 0,
        _attackRange: 20,
        _score: 1,
        _life: 1,
        _width: 48,
        _height: 82,
        _soul: [1,2],
        _attack: 1,
        _itemProbability: 0.2,

        _displayName: vee.Utils.getObjByLanguage("Bomb Zombie", "爆炸僵尸")
    },
    ZombieSoul: {
        _ccbName: "c_foe0.ccbi",
        _className: "ZombieSoul",
        _runningSpeed: 2,
        _attackPrepareTime: 3,
        _attackRange: 50,
        _attackSpeed: 300,
        _attackAnchorOffset: 10,
        _afterAttackDuration: 0.5,
        _hurtDuration: 0.5,
        _unbreakableDuration: 1,
        _score: 0,
        _life: 1,
        _width: 48,
        _height: 82,
        _soul: [2],
        _attack: 0,
        _itemProbability: 0.1,

        _displayName: vee.Utils.getObjByLanguage("Blue Zombie", "魂僵尸")
    },
    Warrior: {
        _ccbName: "c_foe2.ccbi",
        _className: "Warrior",
        _runningSpeed: 4,
        _attackPrepareTime: 1.6,
        _attackRange: 160,
        _attackSpeed: 500,
        _afterAttackDuration: 0.5,
        _hurtDuration: 0.5,
        _unbreakableDuration: 1,
        _score: 2,
        _life: 1,
        _attackAnchorOffset: 10,
        _width: 48,
        _height: 82,
        _soul: [0,1,1],
        _attack: 1,
        _itemProbability: 0.2,


        _displayName: vee.Utils.getObjByLanguage("Warrior", "武士")
    },
    WarriorBlack: {
        _ccbName: "c_foe5.ccbi",
        _className: "WarriorBlack",
        _runningSpeed: 5,
        _attackPrepareTime: 1.5,
        _attackRange: 150,
        _attackSpeed: 500,
        _afterAttackDuration: 0.6,
        _hurtDuration: 0.5,
        _unbreakableDuration: 0.5,
        _score: 3,
        _life: 2,
        _attackAnchorOffset: 10,
        _width: 48,
        _height: 82,
        _soul: [1,2,2],
        _attack: 1,
        _itemProbability: 0.25,


        _displayName: vee.Utils.getObjByLanguage("Black Warrior", "黑武士")
    },
    WarriorDoom: {
        _ccbName: "c_foe8.ccbi",
        _className: "WarriorDoom",
        _runningSpeed: 6,
        _attackPrepareTime: 1.0,
        _attackRange: 170,

        _attackSpeed: 500,
        _afterAttackDuration: 0.6,
        _hurtDuration: 0.3,
        _unbreakableDuration: 0.5,
        _score: 5,
        _life: 4,
        _attackAnchorOffset: 10,
        _width: 48,
        _height: 82,
        _soul: [2,3,3,4],
        _attack: 1,
        _itemProbability: 0.3,


        _displayName: vee.Utils.getObjByLanguage("Doom Warrior", "末日武士")
    },
    Archer: {
        _ccbName: "c_foe3.ccbi",
        _className: "Archer",
        _runningSpeed: 3,
        _attackPrepareTime: 1.8,
        _attackRange: 400,
        _attackSpeed: 400,
        _afterAttackDuration: 1,
        _unbreakableDuration: 1,
        _hurtDuration: 0.5,
        _score: 2,
        _life: 1,
        _width: 48,
        _height: 82,
        _soul: [0,1,1,2],
        _attack: 1,
        _itemProbability: 0.3,


        _displayName: vee.Utils.getObjByLanguage("Archer", "弓手")
    },
    Magic: {
        _ccbName: "c_foe6.ccbi",
        _className: "Magic",
        _runningSpeed: 3,
        _attackPrepareTime: 1.5,
        _attackRange: 400,
        _attackSpeed: 300,
        _afterAttackDuration: 1.5,
        _hurtDuration: 0.5,
        _unbreakableDuration: 1,
        _score: 3,
        _life: 1,
        _width: 48,
        _height: 82,
        _soul: [1,1,1,2],
        _attack: 1,
        _itemProbability: 0.3,


        _displayName: vee.Utils.getObjByLanguage("Wizard", "巫师")
    },
    BossSkeleton: {
        _ccbName: "c_foe_boss.ccbi",
        _className: "BossSkeleton",
        _runningSpeed: 7,
        _fireballAttackRange: 1000,
        _fireballDurationMS: 5000,
        _fireballAttackPrepareTime: 0.4,
        _attackPrepareTime: 0.3,
        _attackRange: 100,
        _attackSpeed: 500,
        _afterAttackDuration: 0.4,
        _hurtDuration: 0.3,
        _unbreakableDuration: 1,
        _score: 8,
        _life: 7,
        _attackAnchorOffset: 10,
        _width: 80,
        _height: 90,
        _soul: [14,16,18],
        _attack: 1,
        _itemProbability: 1,

        _displayName: vee.Utils.getObjByLanguage("Skeleton King", "骷髅王")
    },
    BossFire: {
        _ccbName: "c_foe_boss2.ccbi",
        _className: "BossFire",
        _runningSpeed: 6,
        _fireballAttackRange: 1000,
        _fireballDurationMS: 2500,
        _fireballAttackPrepareTime: 0.5,
        _attackPrepareTime: 0.5,
        _attackRange: 200,
        _attackSpeed: 500,
        _afterAttackDuration: 0.4,
        _hurtDuration: 0.3,
        _unbreakableDuration: 1,
        _score: 10,
        _life: 14,
        _attackAnchorOffset: 10,
        _width: 120,
        _height: 120,
        _soul: [20,25,30],
        _attack: 1,
        _itemProbability: 1,


        _displayName: vee.Utils.getObjByLanguage("Flame Devil", "炎魔")
    },
    BossIce: {
        _ccbName: "c_foe_boss3.ccbi",
        _className: "BossIce",
        _runningSpeed: 4,

        _runningTime: 1,
        _iceBallSummonDuration: 3,
        _iceBallPrepareTime: 0.5,

        _iceFloatSummonDuration: 5,
        _iceFloatLiveDuration: 5,

        _icePrickSummonDuration: 4,
        _icePrickPrepareTime: 1,

        _iceFloatCount: [2, 3],
        _icePrickCount: [4, 5],

        _attackPrepareTime: 0.3,
        _attackRange: 200,
        _attackSpeed: 500,
        _afterAttackDuration: 0.4,
        _hurtDuration: 0.3,
        _unbreakableDuration: 1,
        _score: 15,
        _life: 24,
        _attackAnchorOffset: 10,
        _width: 120,
        _height: 120,
        _soul: [35,40,45],
        _attack: 1,
        _itemProbability: 1,


        _displayName: vee.Utils.getObjByLanguage("Frozen Demon", "冰魂")
    },

    BossShadow: {
        _ccbName: "c_foe_boss4.ccbi",
        _className: "BossShadow",
        _runningSpeed: 6,

        _swordKeeName: "efx/efx_p_sword_boss.png",
        _arrowDurationMS: 4000,
        _arrowAttackPrepareTime: 0.3,
        _shadowDurationMS: 7000,
        _shadowAttackPrepareTime: 0.2,
        _shadowAttackDuration: [5, 6],
        _shadowScale: [1.2, 1.4, 1.6],
        _shadowCount: [3, 4],
        _warriorCount: [1, 2],
        _warriorDurationMS: 8000,

        _attackPrepareTime: 0.5,
        _attackRange: 200,
        _attackSpeed: 600,
        _afterAttackDuration: 0.4,
        _hurtDuration: 0.3,
        _unbreakableDuration: 1,
        _score: 20,
        _life: 80,
        _attackAnchorOffset: 10,
        _width: 40,
        _height: 70,
        _soul: [60],
        _attack: 1,
        _itemProbability: 1,

        _displayName: vee.Utils.getObjByLanguage("Dark Lord", "暗影领主")
    }
};

var CHARACTER = {
    LEVEL_AWARD: {
        "2": {
            "SOUL": 50
        },
        "3": {
            "SOUL": 60
        },
        "4": {
            "SOUL": 70
        },
        "5": {
            "SOUL": 80
        },
        "6": {
            "SOUL": 90
        },
        "7": {
            "SOUL": 100
        },
        "8": {
            "SOUL": 110
        },
        "9": {
            "SOUL": 120
        },
        "10": {
            "SOUL": 130
        },
        "11": {
            "SOUL": 140
        },
        "12": {
            "SOUL": 150
        },
        "13": {
            "SOUL": 160
        },
        "14": {
            "SOUL": 170
        },
        "15": {
            "SOUL": 180
        },
        "16": {
            "SOUL": 190
        },
        "17": {
            "SOUL": 200
        },
        "18": {
            "SOUL": 210
        },
        "19": {
            "SOUL": 220
        },
        "20": {
            "SOUL": 230
        },
        "21": {
            "SOUL": 240
        },
        "22": {
            "SOUL": 250
        },
        "23": {
            "SOUL": 260
        },
        "24": {
            "SOUL": 270
        },
        "25": {
            "SOUL": 280
        },
        "26": {
            "SOUL": 290
        },
        "27": {
            "SOUL": 300
        },
        "28": {
            "SOUL": 310
        },
        "29": {
            "SOUL": 320
        },
        "30": {
            "SOUL": 330
        },
        "31": {
            "SOUL": 340
        },
        "32": {
            "SOUL": 350
        },
        "33": {
            "SOUL": 360
        },
        "34": {
            "SOUL": 370
        },
        "35": {
            "SOUL": 380
        },
        "36": {
            "SOUL": 390
        },
        "37": {
            "SOUL": 400
        },
        "38": {
            "SOUL": 410
        },
        "49": {
            "SOUL": 420
        },
        "40": {
            "SOUL": 430
        },
        "41": {
            "SOUL": 440
        },
        "42": {
            "SOUL": 450
        }
    },

    getCharacterValue: function(id){
        var className;
        [ STORE_PRODUCT.HeroShopData.KEVOTHE.className,
            STORE_PRODUCT.HeroShopData.RYU.className,
            STORE_PRODUCT.HeroShopData.SAKURA.className,
            STORE_PRODUCT.HeroShopData.PALADIN.className,
            STORE_PRODUCT.HeroShopData.SHADOW.className
        ].forEach(function(name){
                if (CharacterID[name] === id){
                    className = name;
                }
            }
        );
        return STORE_PRODUCT.HeroShopData[className].config.value;
    },
    getAttributeValue: function(className){
        var arr = STORE_PRODUCT.HeroShopData[className].config.value;
        var level = DataManager.getInstance().getProductData()[className];
        if (level < 1) {
            return null;
        }
        return arr[level - 1];
    },
    soulNeedToReachLevel: function(level){
        if (level <= 2) {
            return 0;
        } else if (level > 43){
            return 4300;
        }
        /**
         var arg1 = 1.124;
         var arg2 = 0.011;
         var arg = arg1 - arg2;
         **/
        var arg = 1.113;
        var base = 50;
        return Math.ceil(base * Math.pow(arg, level - 2))
    },
    soulWithBonus: function(soulDelta, level){
        return Math.round(soulDelta * level / 100);
    }
};

var ITEM_TYPE = {
    SOUL: {
        className: "SOUL",
        ccbPath: "efx_soul.ccbi",
        size: {
            width: 20,
            height: 24
        },
        appearDurationMS: 0,
        config: []
    },
    MAGNET: {
        className: "MAGNET",
        ccbPath: "ui_pull.ccbi",
        size: {
            width: 42,
            height: 42
        },
        appearDurationMS: 0,
        config: [
            [150, 4], //300,4 - 300,6 - 450,8
            [200, 6],
            [250, 8]
        ]
    },
    TIME: {
        className: "TIME",
        ccbPath: "ui_time.ccbi",
        size: {
            width: 42,
            height: 42
        },
        appearDurationMS: 16000,
        config: [4, 5, 6] //3.4.5
    },
    ZOMBIE: {
        className: "ZOMBIE",
        ccbPath: "ui_zombie.ccbi",
        size: {
            width: 42,
            height: 42
        },
        appearDurationMS: 6000,
        config: [
            [5, ENTITY.ZombieSoul._className], //5,10,15
            [8, ENTITY.ZombieSoul._className],
            [12, ENTITY.ZombieSoul._className]
        ]
    },
    SHIELD: {
        className: "SHIELD",
        ccbPath: "ui_sheild.ccbi",
        size: {
            width: 36,
            height: 42
        },
        config: [4, 5, 6], //4.5.6
        appearDurationMS: 4000
    },
    POWER: {
        className: "POWER",
        ccbPath: "ui_power.ccbi",
        size: {
            width: 42,
            height: 42
        },
        appearDurationMS: 6000,
        config: [
            [
                4, {
                _attackRange: 330,//340,370,400
                _attackSpeed: 1400,//1500,1700,1900
                _afterAttackDuration: 0,
                _runningSpeed: 15
                //_attack:2
            }],
            [
                5, {
                _attackRange: 360,
                _attackSpeed: 1700,
                _afterAttackDuration: 0.01,
                _runningSpeed: 15
                //_attack:3
            }],
            [
                6, {
                _attackRange: 400,
                _attackSpeed: 1900,
                _afterAttackDuration: 0.01,
                _runningSpeed: 15
                //_attack:4
            }]]
    },
    STORM: {
        className: "STORM",
        ccbPath: "ui_bomb.ccbi",
        size: {
            width: 42,
            height: 42
        },
        appearDurationMS: 0,
        // [attack, scale]
        config: [
            [1, 1.2],
            [2, 1.2],
            [2, 1.3]
        ]//1, 1.2, 1.3
    },
    // Adjust every item probablity.
    getItemProbability: function(numOfUnlockItems){
        var config = {
            1: 0.3,
            2: 0.3,
            3: 0.5,
            4: 0.7,
            5: 0.8,
            6: 1
        };
        return config[numOfUnlockItems];
    },
    getAvailableItems: function(){
        var pList = DataManager.getInstance().getProductData();
        var itemList = [];
        vee.Utils.forEach([
                ITEM_TYPE.MAGNET.className,
                ITEM_TYPE.POWER.className,
                ITEM_TYPE.STORM.className,
                ITEM_TYPE.TIME.className,
                ITEM_TYPE.SHIELD.className,
                ITEM_TYPE.ZOMBIE.className
            ], function(name){
            if (pList[name] > 0){
                itemList.push(name);
            }
        });
        return itemList;
    },

    getMagnetValue: function () {
        var config = this._getConfig(this.MAGNET.className);
        return {
            range: config[0],
            duration: config[1]
        };
    },
    getZombieValue: function () {
        var config = this._getConfig(this.ZOMBIE.className);
        return {
            count: config[0],
            className: config[1]
        };
    },
    getTimeValue: function () {
        var config = this._getConfig(this.TIME.className);
        return { duration: config };
    },
    getShieldValue: function () {
        var config = this._getConfig(this.SHIELD.className);
        return { duration: config };
    },
    getStormValue: function () {
        var config = this._getConfig(this.STORM.className);
        return { attack: config[0], range: config[1] };
    },
    getPowerValue: function () {
        var config = this._getConfig(this.POWER.className);
        return {
            duration: config[0],
            props: config[1]
        };
    },
    _getConfig: function (itemName) {
        var level = DataManager.getInstance().getProductData()[itemName];
        vee.Utils.logObj([itemName, level], "道具等级");
        return this[itemName].config[level - 1];
    }
};

var STORE_FUNCTIONS = {
    getUnlockKillEnemy: function(killedObj, needKilledNumber) {
        return function (info) {
            var killed;
            var displayName;
            if (!killedObj){
                killed = info.KilledCount;
                displayName = vee.Utils.getObjByLanguage("demons", "恶魔");
            } else {
                killed = info.KilledEnemies[killedObj._className] || 0;
                displayName = killedObj._displayName;
            }
            var unlocked = killed >= needKilledNumber;
            if (unlocked) {
                return {
                    locked: false,
                    detail: "",
                    canUnlock: false,
                    lockType: STORE_ENUM.LockType.KILL,
                    lockValue: 0
                }
            } else {
                return {
                    locked: true,
                    detail: vee.Utils.getObjByLanguage("Kill ", "杀死") + killed + "/" + needKilledNumber + vee.Utils.getObjByLanguage(" ", "") + displayName,
                    canUnlock: false,
                    lockType: STORE_ENUM.LockType.KILL,
                    lockValue: 0
                }
            }
        };
    },

    getUnlockLevel: function(needLevel) {
        return function (info) {
            var unlocked = info.characterLevel >= needLevel;
            if (unlocked) {
                return {
                    locked: false,
                    detail: "",
                    canUnlock: false,
                    lockType: STORE_ENUM.LockType.LEVEL,
                    lockValue: 0
                }
            } else {
                return {
                    locked: true,
                    detail: vee.Utils.getObjByLanguage("Reach level ", "达到等级") + needLevel,
                    canUnlock: false,
                    lockType: STORE_ENUM.LockType.LEVEL,
                    lockValue: 0
                }
            }
        };
    },
    getPurchaseSoul: function(needSoul) {
        return function (info) {
            return {
                locked: true,
                detail: "",
                canUnlock: true,
                lockType: STORE_ENUM.LockType.SOUL,
                lockValue: needSoul
            };
        };
    },
    getPurchaseDollar: function(needDollar){
        return function(info){
            return {
                locked: true,
                detail: "",
                canUnlock: true,
                lockType: STORE_ENUM.LockType.MONEY,
                lockValue: needDollar
            }
        };
    },
    parseLockFilters:function(className, lockFilters, unlockingData) {
        if (unlockingData.productLevel[className] >= 0 || lockFilters.length === 0){
            return {locked: false, canUnlock:true, lockTypes: [], lockInfo: {detail: "", soul: 0, money: 0}};
        }
        var lockInfo = {};
        var lockTypes = [];
        var detail = null;
        var locked = false;
        var canUnlock = false;
        for (var i = 0; i < lockFilters.length; i++){
            var func = lockFilters[i];
            var resultInfo = func(unlockingData);
            locked = locked || resultInfo.locked;
            canUnlock = canUnlock || resultInfo.canUnlock;

            lockTypes.push(resultInfo.lockType);
            switch (resultInfo.lockType){
                case STORE_ENUM.LockType.SOUL:
                    lockInfo["soul"] = resultInfo.lockValue;
                    break;
                case STORE_ENUM.LockType.MONEY:
                    lockInfo["money"] = resultInfo.lockValue;
                    break;
                case STORE_ENUM.LockType.KILL:
                case STORE_ENUM.LockType.KILL_BY:
                case STORE_ENUM.LockType.LEVEL:
                    lockInfo["detail"] = resultInfo.detail;
                    break;
            }
        }
        return {
            locked: locked,
            canUnlock: canUnlock,
            lockTypes: lockTypes,
            lockInfo: lockInfo
        }
    },

    _arrayOfSoulProducts: null,
    _arrayOfMagicProducts: null,
    _arrayOfHeroProducts: null,
    _OriginalHeroProductsLength: 0,
    getArrayOfSoulProducts: function(){
        if (!this._arrayOfSoulProducts){
            this._arrayOfSoulProducts = vee.Utils.getValues(STORE_PRODUCT.SoulShopData);
        }
	    if (cc.sys.os === cc.sys.OS_IOS) {
		    var record = STORE_PRODUCT.SoulShopData.SOUL_PACK_0;
		    var index = this._arrayOfSoulProducts.indexOf(record);
		    if (index > -1){
			    this._arrayOfSoulProducts.splice(index, 1);
		    }
		    var isShowExchange = vee.Utils.launchAppById("zplay_showexchange");
		    if (!isShowExchange) {
			    var record = STORE_PRODUCT.SoulShopData.EXCHANGE;
			    var index = this._arrayOfSoulProducts.indexOf(record);
			    if (index > -1){
				    this._arrayOfSoulProducts.splice(index, 1);
			    }
		    }
	    } else {
		    var record = STORE_PRODUCT.SoulShopData.RESTORE;
		    var index = this._arrayOfSoulProducts.indexOf(record);
		    if (index > -1){
			    this._arrayOfSoulProducts.splice(index, 1);
		    }
		    record = STORE_PRODUCT.SoulShopData.RATE;
		    index = this._arrayOfSoulProducts.indexOf(record);
		    if (index > -1){
			    this._arrayOfSoulProducts.splice(index, 1);
		    }
		    var isShowExchange = vee.Utils.launchAppById("zplay_showexchange");
		    if (!isShowExchange) {
			    var record = STORE_PRODUCT.SoulShopData.EXCHANGE;
			    var index = this._arrayOfSoulProducts.indexOf(record);
			    if (index > -1){
				    this._arrayOfSoulProducts.splice(index, 1);
			    }
		    }
	    }
        return this._arrayOfSoulProducts;
    },
    getArrayOfMagicProducts: function(){
        if (!this._arrayOfMagicProducts){
            this._arrayOfMagicProducts = vee.Utils.getValues(STORE_PRODUCT.MagicShopData);
        }
        return this._arrayOfMagicProducts;
    },
    getArrayOfHeroProducts: function(){
        if (!this._arrayOfHeroProducts){
            this._arrayOfHeroProducts = vee.Utils.getValues(STORE_PRODUCT.HeroShopData);
            this._OriginalHeroProductsLength = this._arrayOfHeroProducts.length;
        }
        if ((DataManager.getInstance().isHeroPackPurchased() || DataManager.getInstance().isAllHeroUnlocked()) && this._OriginalHeroProductsLength === this._arrayOfHeroProducts.length){
            var record = STORE_PRODUCT.HeroShopData.HERO_PACK;
            var index = this._arrayOfHeroProducts.indexOf(record);
            if (index > -1){
                this._arrayOfHeroProducts.splice(index, 1);
            }
        }
        return this._arrayOfHeroProducts;
    },
    getToUnlockList: function() {
        var returnArr = [];
        var productsLevel = DataManager.getInstance().getProductData();
        var arrayOfProducts = this.getArrayOfHeroProducts().concat(this.getArrayOfMagicProducts()).concat(this.getArrayOfSoulProducts());
        vee.Utils.forEach(arrayOfProducts, function (p) {
            if (p.lockFilter && p.lockFilter.length > 0 && productsLevel[p.className] < 0) {
                returnArr.push(p);
            }
        }, this);
        return returnArr;
    },
    hasUnlockedProduct: function(){
        var productsLevel = DataManager.getInstance().getProductData();
        var typeOfUnlocked = [];
        vee.Utils.forEach(this.getArrayOfHeroProducts(), function (p) {
            if (p.type !== STORE_ENUM.BuyActionType.CHARACTER &&
                p.type !== STORE_ENUM.BuyActionType.PERSIST_ONCE &&
                productsLevel[p.className] === 0) {
                typeOfUnlocked.push(STORE_ENUM.ShopType.Hero);
                return false;
            }
        }, this);
        vee.Utils.forEach(this.getArrayOfMagicProducts(), function (p) {
            if (productsLevel[p.className] === 0) {
                typeOfUnlocked.push(STORE_ENUM.ShopType.Magic);
                return false;
            }
        }, this);
        return typeOfUnlocked;
    },
    getExtraHeartCount: function(){
        var valueArray = STORE_PRODUCT.HeroShopData.STAMINA.config.value;
        return valueArray[valueArray.length - 1]._life;
    }
};
var STORE_ENUM = {
    PriceType: {
        SOUL: 0,
        MONEY: 1,
        NONE: 2,
        LOCK: 3
    },
    BuyActionType: {
        LEVEL: 0,
        CHARACTER: 1,
        SLOT: 2,
        INSTANT: 3,
        PERSIST: 4,
        PERSIST_ONCE: 5,
        URL: 6,
        LABEL: 7,
        RESTORE: 8,
	    EXCHANGE: 9
    },
    ConfigType: {
        UPGRADE: 0,
        SOUL_PACK: 1,
        SLOT: 2
    },
    LockType: {
        LEVEL: 0,
        KILL: 1,
        KILL_BY: 2,
        SOUL: 3,
        MONEY: 4
    },
    ShopType: {
        Magic: 0,
        Hero: 1,
        Soul: 2
    }
};
var STORE_PRODUCT = {
    SoulShopData: {
        DOUBLE: {
            className: "DOUBLE",
            name: vee.Utils.getObjByLanguage("Double Souls", "双倍魂"),
            type: STORE_ENUM.BuyActionType.PERSIST,
            details: [
                vee.Utils.getObjByLanguage("Get double souls in every battle", "每场战斗都能得到双倍的魂。"),
	            vee.Utils.getObjByLanguage("Get double souls in every battle", "每场战斗都能得到双倍的魂。")
            ],
            max: 1,
            priceType: STORE_ENUM.PriceType.MONEY,
            prices: [app.Config.getPrice([25,12,12,12,12])],//[ 3.99],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE
            },
            icon: "shop/s_icon_soul_vip.png",
            iconLock: "shop/s_icon_soul_vip.png",
            lockFilter: []
        },
	    /* SOUL_PACK_0 is android only */
	    SOUL_PACK_0: {
		    className: "SOUL_PACK_0",
		    name: vee.Utils.getObjByLanguage("Tiny Souls Pack", "新手魂包"),
		    type: STORE_ENUM.BuyActionType.INSTANT,
		    details: [
			    vee.Utils.getObjByLanguage("Get 1250 souls.", "获得1250魂。")
		    ],
		    max: 1,
		    priceType: STORE_ENUM.PriceType.MONEY,
		    prices: [
			    app.Config.getPrice([0,2,2,2,2])
			],//[ 0.99],
		    config: {
			    type: STORE_ENUM.ConfigType.SOUL_PACK,
			    value: 1250
		    },
		    icon: "shop/s_icon_soul_0.png",
		    iconLock: "shop/s_icon_soul_0.png",
		    lockFilter: []
	    },
        SOUL_PACK_1: {
            className: "SOUL_PACK_1",
            name: vee.Utils.getObjByLanguage("Simple Souls Pack", "小魂包"),
            type: STORE_ENUM.BuyActionType.INSTANT,
            details: [
	            vee.Utils.getObjByPlatform(
		            vee.Utils.getObjByLanguage("Get 2000 souls.", "获得2000魂。"),
		            vee.Utils.getObjByLanguage("Get 3900 souls (5% extra).", "获得3900魂(5%优惠)。")
	            )
            ],
            max: 1,
            priceType: STORE_ENUM.PriceType.MONEY,
            prices: [
	            app.Config.getPrice([12,6,6,6,6])
            ],//[ 1.99 ],
            config: {
                type: STORE_ENUM.ConfigType.SOUL_PACK,
                value: vee.Utils.getObjByPlatform(2000,3900)
            },
            icon: "shop/s_icon_soul_1.png",
            iconLock: "shop/s_icon_soul_1.png",
            lockFilter: []
        },
        SOUL_PACK_2: {
            className: "SOUL_PACK_2",
            name: vee.Utils.getObjByLanguage("Large Souls Pack", "大魂包"),
            type: STORE_ENUM.BuyActionType.INSTANT,
            details: [
	            vee.Utils.getObjByPlatform(
		            vee.Utils.getObjByLanguage("Get 8800 souls (15% extra).", "获得8800魂 (15%优惠)。"),
		            vee.Utils.getObjByLanguage("Get 8600 souls (15% extra).", "获得8600魂 (15%优惠)。")
	            )
            ],
            max: 1,
            priceType: STORE_ENUM.PriceType.MONEY,
            prices: [
	            app.Config.getPrice([40,12,12,12,12])
            ],//[ 5.99 ],
            config: {
                type: STORE_ENUM.ConfigType.SOUL_PACK,
                value: vee.Utils.getObjByPlatform(8800,8600)
            },
            icon: "shop/s_icon_soul_2.png",
            iconLock: "shop/s_icon_soul_2.png",
            lockFilter: []
        },
        SOUL_PACK_3: {
            className: "SOUL_PACK_3",
            name: vee.Utils.getObjByLanguage("Great Souls Pack", "超大魂包"),
            type: STORE_ENUM.BuyActionType.INSTANT,
            details: [
	            vee.Utils.getObjByPlatform(
		            vee.Utils.getObjByLanguage("Get 20000 souls (30% extra).", "获得20000魂 (30%优惠)。"),
		            vee.Utils.getObjByLanguage("Get 15000 souls (20% extra).", "获得15000魂 (20%优惠)。")
	            )
            ],
            max: 1,
            priceType: STORE_ENUM.PriceType.MONEY,
            prices: [
	            app.Config.getPrice([88,20,20,20,20])
            ],//[ 12.99 ],
            config: {
                type: STORE_ENUM.ConfigType.SOUL_PACK,
                value: vee.Utils.getObjByPlatform(20000,15000)
            },
            icon: "shop/s_icon_soul_3.png",
            iconLock: "shop/s_icon_soul_3.png",
            lockFilter: []
        },
        SOUL_PACK_4: {
            className: "SOUL_PACK_4",
            name: vee.Utils.getObjByLanguage("Super Souls Pack", "传说魂包"),
            type: STORE_ENUM.BuyActionType.INSTANT,
            details: [
	            vee.Utils.getObjByPlatform(
		            vee.Utils.getObjByLanguage("Get 75000 souls (50% extra).", "获得75000魂 (50%优惠)。"),
		            vee.Utils.getObjByLanguage("Get 24400 souls (30% extra).", "获得24400魂 (30%优惠)。")
	            )
            ],
            max: 1,
            priceType: STORE_ENUM.PriceType.MONEY,
            config: {
                type: STORE_ENUM.ConfigType.SOUL_PACK,
                value: vee.Utils.getObjByPlatform(75000,24400)
            },
            prices: [
	            app.Config.getPrice([258,30,30,30,30])
            ],//[ 39.99 ],
            icon: "shop/s_icon_soul_4.png",
            iconLock: "shop/s_icon_soul_4.png",
            lockFilter: []
        },
        RATE: {
            className: "RATE",
            name: vee.Utils.getObjByLanguage("Love it? Rate it!", "喜欢就评价一下吧~"),
            type: STORE_ENUM.BuyActionType.URL,
            details: [
                vee.Utils.getObjByLanguage("Your support is our motivation.", "你的支持是我们最大的动力。")
            ],
            max: 1,
            priceType: STORE_ENUM.PriceType.NONE,
            prices: [0],
            config: {value: "http://www.veewo.com"},
            icon: "shop/s_icon_rate.png",
            iconLock: "shop/s_icon_rate.png",
            lockFilter: []
        },
	    EXCHANGE: {
		    className: "EXCHANGE",
		    name: vee.Utils.getObjByLanguage("Gift Code", "兑换码"),
		    type: STORE_ENUM.BuyActionType.EXCHANGE,
		    details: [
			    vee.Utils.getObjByLanguage("Get your trophy, hero!", "领取你的战利品吧，英雄！")
		    ],
		    max: 1,
		    priceType: STORE_ENUM.PriceType.NONE,
		    prices: [0],
		    config: {},
		    icon: "shop/s_icon_gift.png",
		    iconLock: "shop/s_icon_gift.png",
		    lockFilter: []
	    },
	    /* RESTORE Only in ios */
        RESTORE: {
            className: "RESTORE",
            name: vee.Utils.getObjByLanguage("Restore Purchase", "恢复购买"),
            type: STORE_ENUM.BuyActionType.RESTORE,
            details: [
                vee.Utils.getObjByLanguage("Recall all your memories.", "重唤你的记忆。")
            ],
            max: 1,
            priceType: STORE_ENUM.PriceType.NONE,
            prices: [0],
            config: {},
            icon: "shop/s_icon_restore.png",
            iconLock: "shop/s_icon_restore.png",
            lockFilter: []
        }
//        REMOVE_AD: {
//            className: "REMOVE_AD",
//            name: "Remove ADs",
//            type: STORE_ENUM.BuyActionType.LABEL,
//            details: [
//                "Make any purchases to disable ADs. :)"
//            ],
//            max: 1,
//            priceType: STORE_ENUM.PriceType.NONE,
//            prices: [0],
//            config: {},
//            icon: "shop/s_icon_removead.png",
//            iconLock: "shop/s_icon_removead.png",
//            lockFilter: []
//        }
    },

    HeroShopData: {
        STAMINA: {
            name: vee.Utils.getObjByLanguage("Stamina", "体力"),
            className: "STAMINA",
            type: STORE_ENUM.BuyActionType.LEVEL,
            max: 4,
            lockFilter: [STORE_FUNCTIONS.getUnlockLevel(6)],
            priceType: STORE_ENUM.PriceType.SOUL,
            prices: [350, 950, 1440, 2800],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE,
                value: [
                    {_life: 1},
                    {_life: 2},
                    {_life: 3},
                    {_life: 4}
                ]
            },
            details: [
	            vee.Utils.getObjByLanguage("You have 1 extra heart.", "拥有1个额外的生命。"),
	            vee.Utils.getObjByLanguage("You have 2 extra hearts.", "拥有2个额外的生命。"),
	            vee.Utils.getObjByLanguage("You have 3 extra hearts.", "拥有3个额外的生命。"),
	            vee.Utils.getObjByLanguage("You have 4 extra hearts.", "拥有4个额外的生命。")
            ],
            icon: "shop/s_icon_hero_life.png",
            iconLock: "shop/s_icon_hero_life_lock.png"
        },
        DAMAGE: {
            name: vee.Utils.getObjByLanguage("Damage", "力量"),
            className: "DAMAGE",
            type: STORE_ENUM.BuyActionType.LEVEL,
            max: 3,
            lockFilter: [STORE_FUNCTIONS.getUnlockLevel(12)],
            priceType: STORE_ENUM.PriceType.SOUL,
            prices: [750, 1800, 3400],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE,
                value: [
                    {_attack: 1},
                    {_attack: 2},
                    {_attack: 3}
                ]

            },
            details: [
	            vee.Utils.getObjByLanguage("You can deal 2 damage", "你的攻击可以造成2点伤害。"),
				vee.Utils.getObjByLanguage("You can deal 3 damage", "你的攻击可以造成3点伤害。"),
				vee.Utils.getObjByLanguage("You can deal 4 damage", "你的攻击可以造成4点伤害。")
            ],
            icon: "shop/s_icon_hero_attack.png",
            iconLock: "shop/s_icon_hero_attack_lock.png"
        },
        AGILITY: {
            name: vee.Utils.getObjByLanguage("Agility", "敏捷"),
            className: "AGILITY",
            type: STORE_ENUM.BuyActionType.LEVEL,
            max: 3,
            lockFilter: [STORE_FUNCTIONS.getUnlockLevel(16)],
            priceType: STORE_ENUM.PriceType.SOUL,
            prices: [1200, 2100, 3200],
            config: {
            type: STORE_ENUM.ConfigType.UPGRADE,
            value: [
                   {_attackSpeed: 100,
                    _attackRange: 20},
                   {_attackSpeed: 200,
                    _attackRange: 40},
                   {_attackSpeed: 300,
                    _attackRange: 60}
                ]
            },
            details: [
	            vee.Utils.getObjByLanguage("You attack faster and longer.", "攻击速度更快, 距离更长。"),
	            vee.Utils.getObjByLanguage("You attack faster and longer.", "攻击速度更快, 距离更长。"),
	            vee.Utils.getObjByLanguage("You attack faster and longer.", "攻击速度更快, 距离更长。")
            ],
            icon: "shop/s_icon_hero_range.png",
            iconLock: "shop/s_icon_hero_range_lock.png"
            },
        KEVOTHE: {
            name: vee.Utils.getObjByLanguage("Kevo", "科沃"),
            className: "KEVOTHE",
            type: STORE_ENUM.BuyActionType.CHARACTER,
            priceType: STORE_ENUM.PriceType.LOCK,
            prices: [0],
            max: 1,
            lockFilter: [],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE,
                value: {
                    _ccbName: "c_player1.ccbi",
                    _swordKeeName: "efx/efx_p_sword_1.png"
                }
            },
            details: vee.Utils.getArrayOfObj(2, vee.Utils.getObjByLanguage("I am the legend.", "我就是传奇。")),
            icon: "shop_hero_1.ccbi",
            iconLock: "shop_hero_1.ccbi"
        },
        RYU: {
            name: vee.Utils.getObjByLanguage("Ryu", "隆"),
            className: "RYU",
            type: STORE_ENUM.BuyActionType.CHARACTER,
            max: 1,
            priceType: STORE_ENUM.PriceType.LOCK,
            prices: [0],
            lockFilter: [
                STORE_FUNCTIONS.getPurchaseSoul(2000)
             ],

            config: {
                type: STORE_ENUM.ConfigType.UPGRADE,
                value: {
                    _ccbName: "c_player2.ccbi",
                    _swordKeeName: "efx/efx_p_sword_2.png",
                    _attackSpeed: 950,
                    _runningSpeed: 9,
                    _attackRange: 290
                }
            },
            details: vee.Utils.getArrayOfObj(2, vee.Utils.getObjByLanguage("My sword is burning.", "吾剑将燃尽黑暗。")),
            icon: "shop_hero_2.ccbi",
            iconLock: "shop_hero_2.ccbi"
        },
        SAKURA: {
            name: vee.Utils.getObjByLanguage("Sakura", "樱"),
            className: "SAKURA",
            type: STORE_ENUM.BuyActionType.CHARACTER,
            max: 1,
            priceType: STORE_ENUM.PriceType.LOCK,
            prices: [0],
            lockFilter: [
	            app.Config.getPrice([
		            STORE_FUNCTIONS.getPurchaseDollar(12),
		            STORE_FUNCTIONS.getPurchaseDollar(6),
		            STORE_FUNCTIONS.getPurchaseDollar(6),
		            STORE_FUNCTIONS.getPurchaseDollar(6),
		            STORE_FUNCTIONS.getPurchaseDollar(6)])//1.99
            ],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE,
                value: {
                    _ccbName: "c_player3.ccbi",
                    _swordKeeName: "efx/efx_p_sword_3.png",
                    _attackSpeed: 1100,
                    _runningSpeed: 11,
                    _attackRange: 250
                }
            },
            details: vee.Utils.getArrayOfObj(2, vee.Utils.getObjByLanguage("Fast as the wind.", "妩媚如水, 迅捷如风。")),
            icon: "shop_hero_3.ccbi",
            iconLock: "shop_hero_3.ccbi"
        },
        PALADIN: {
            name: vee.Utils.getObjByLanguage("Paladin", "圣骑士"),
            className: "PALADIN",
            type: STORE_ENUM.BuyActionType.CHARACTER,
            max: 1,
            priceType: STORE_ENUM.PriceType.LOCK,
            prices: [0],
            lockFilter: [
	            app.Config.getPrice([
		            STORE_FUNCTIONS.getPurchaseDollar(18),
		            STORE_FUNCTIONS.getPurchaseDollar(6),
		            STORE_FUNCTIONS.getPurchaseDollar(6),
		            STORE_FUNCTIONS.getPurchaseDollar(6),
		            STORE_FUNCTIONS.getPurchaseDollar(6)])//2.99
            ],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE,
                value: {
                    _ccbName: "c_player5.ccbi",
                    _swordKeeName: "efx/efx_p_sword_5.png",
                    _runningSpeed: 9,
                    _attackSpeed: 950,
                    _life: 2
                }
            },
            details: vee.Utils.getArrayOfObj(2, vee.Utils.getObjByLanguage("Light guardian! Have an extra heart.", "光之守护者! 拥有额外的生命值。")),
            icon: "shop_hero_4.ccbi",
            iconLock: "shop_hero_4.ccbi"
        },
        SHADOW: {
            name: vee.Utils.getObjByLanguage("Mystery", "虚空之迷"),
            className: "SHADOW",
            type: STORE_ENUM.BuyActionType.CHARACTER,
            max: 1,
            priceType: STORE_ENUM.PriceType.LOCK,
            prices: [0],
            lockFilter: [
	            app.Config.getPrice([
		            STORE_FUNCTIONS.getPurchaseDollar(30),
		            STORE_FUNCTIONS.getPurchaseDollar(12),
		            STORE_FUNCTIONS.getPurchaseDollar(12),
		            STORE_FUNCTIONS.getPurchaseDollar(12),
		            STORE_FUNCTIONS.getPurchaseDollar(12)])//4.99
            ],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE,
                value: {
                    _ccbName: "c_player4.ccbi",
                    _swordKeeName: "efx/efx_p_sword_4.png",
                    _attack: 2,
                    _particleCCB: "c_player4_lizi.ccbi"
                }
            },
            details: vee.Utils.getArrayOfObj(2, vee.Utils.getObjByLanguage("Revive once automatic. +1 Damage.", "远古之魂...自动复活一次, 攻击力+1。")),
            icon: "shop_hero_5.ccbi",
            iconLock: "shop_hero_5.ccbi"
        },
        HERO_PACK: {
            name: vee.Utils.getObjByLanguage("Glorious Heroes Pack", "荣耀英雄包"),
            className: "HERO_PACK",
            type: STORE_ENUM.BuyActionType.PERSIST_ONCE,
            max: 1,
            priceType: STORE_ENUM.PriceType.MONEY,
            prices: [
	            app.Config.getPrice([68,30,30,30,30])//[9.99]
			],
            lockFilter: [],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE
            },
            details: [vee.Utils.getObjByLanguage("Get all heroes and Double Souls!", "解锁所有的英雄并拥有双倍魂！")],
            icon: "shop/shop_icon_hero_pack.png",
            iconLock: "shop/shop_icon_hero_pack.png"
        }
    },

    MagicShopData: {
        SAVE_STONE: {
            className: "SAVE_STONE",
            name: vee.Utils.getObjByLanguage("Save Stone", "灵魂石"),
            type: STORE_ENUM.BuyActionType.SLOT,
            details: [
	            vee.Utils.getObjByLanguage("Game start from Stage 3.", "游戏直接从关卡3开始"),
	            vee.Utils.getObjByLanguage("Game start from Stage 4.", "游戏直接从关卡4开始"),
	            vee.Utils.getObjByLanguage("Game start from Stage 5.", "游戏直接从关卡5开始")
//	            vee.Utils.getObjByLanguage("Game start from Stage 6.", "游戏直接从关卡6开始")
            ],
            max: 3,
            priceType: STORE_ENUM.PriceType.SOUL,
            prices: [100, 200, 300],
            config: {
                type: STORE_ENUM.ConfigType.SLOT
            },
            icon: "shop/s_icon_magic_stone.png",
            iconLock: "shop/s_icon_magic_stone_lock.png",
            lockFilter: [STORE_FUNCTIONS.getUnlockKillEnemy(ENTITY.BossSkeleton, 1)]
        },
        REVIVE: {
            className: "REVIVE",
            name: vee.Utils.getObjByLanguage("Redemption", "救赎"),
            type: STORE_ENUM.BuyActionType.LEVEL,
            details: [
	            vee.Utils.getObjByLanguage("You can revive for 1 time.", "你可以在战斗中复活1次。"),
	            vee.Utils.getObjByLanguage("You can revive for 2 times.", "你可以在战斗中复活2次。"),
	            vee.Utils.getObjByLanguage("You can revive for 3 times.", "你可以在战斗中复活3次。")
            ],
            max: 3,
            priceType: STORE_ENUM.PriceType.SOUL,
            prices: [50, 1250, 4000],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE
            },
            icon: "shop/s_icon_magic_revive.png",
            iconLock: "shop/s_icon_magic_revive_lock.png",
            lockFilter: [STORE_FUNCTIONS.getUnlockLevel(2)]
        },
        MAGNET: {
            className: "MAGNET",
            name: vee.Utils.getObjByLanguage("Magic Magnet", "磁力场"),
            type: STORE_ENUM.BuyActionType.LEVEL,
            details: [
	            vee.Utils.getObjByLanguage("Attract souls in small range.", "自动收集小范围内的魂。"),
	            vee.Utils.getObjByLanguage("Attract souls in medium range.", "自动收集中等范围内的魂。"),
	            vee.Utils.getObjByLanguage("Attract souls in large range.", "自动收集大范围内的魂。")
                ],
            max: 3,
            priceType: STORE_ENUM.PriceType.SOUL,
            prices: [
                200,
                650,
                1700
            ],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE
            },
            icon: "shop/s_icon_magic_pull.png",
            iconLock: "shop/s_icon_magic_pull_lock.png",
            lockFilter: [STORE_FUNCTIONS.getUnlockLevel(4)]
        },
        SHIELD: {
            className: "SHIELD",
            name: vee.Utils.getObjByLanguage("Light Shield", "光之盾"),
            type: STORE_ENUM.BuyActionType.LEVEL,
            details: [
	            vee.Utils.getObjByLanguage("You are immune for 4 sec.", "保护你在4秒内不受到伤害。"),
	            vee.Utils.getObjByLanguage("You are immune for 5 sec.", "保护你在5秒内不受到伤害。"),
	            vee.Utils.getObjByLanguage("You are immune for 6 sec.", "保护你在6秒内不受到伤害。")
            ],
            max: 3,
            priceType: STORE_ENUM.PriceType.SOUL,
            prices: [
                450,
                1100,
                2000
            ],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE
            },
            icon: "shop/s_icon_magic_shield.png",
            iconLock: "shop/s_icon_magic_shield_lock.png",
            lockFilter: [STORE_FUNCTIONS.getUnlockLevel(8)]
        },
        POWER: {
            className: "POWER",
            name: vee.Utils.getObjByLanguage("Frenzy Power", "狂暴之力"),
            type: STORE_ENUM.BuyActionType.LEVEL,
            details: [
	            vee.Utils.getObjByLanguage("Increase your ability for 4 sec.", "燃烧你的小宇宙! 持续4秒。"),
	            vee.Utils.getObjByLanguage("Increase your ability for 5 sec.", "燃烧你的小宇宙! 持续5秒。"),
	            vee.Utils.getObjByLanguage("Increase your ability for 6 sec.", "燃烧你的小宇宙! 持续6秒。")
            ],
            max: 3,
            priceType: STORE_ENUM.PriceType.SOUL,
            prices: [
                550,
                1450,
                2400
            ],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE
            },
            icon: "shop/s_icon_magic_power.png",
            iconLock: "shop/s_icon_magic_power_lock.png",
            lockFilter: [STORE_FUNCTIONS.getUnlockLevel(10)]
        },
        STORM: {
            className: "STORM",
            name: vee.Utils.getObjByLanguage("Blade Storm", "剑刃风暴"),
            type: STORE_ENUM.BuyActionType.LEVEL,
            details: [
                vee.Utils.getObjByLanguage("Kill demons in small range.", "释放一个小范围的刀剑旋风。"),
	            vee.Utils.getObjByLanguage("Kill demons in large range.", "释放一个中等范围的刀剑旋风。"),
	            vee.Utils.getObjByLanguage("Increase damage and range.", "释放一个大范围的刀剑旋风。")
            ],
            max: 3,
            priceType: STORE_ENUM.PriceType.SOUL,
            prices: [
                1000,
                1900,
                3000
            ],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE
            },
            icon: "shop/s_icon_magic_blade.png",
            iconLock: "shop/s_icon_magic_blade_lock.png",
            lockFilter: [STORE_FUNCTIONS.getUnlockLevel(14)]
        },
        ZOMBIE: {
            className: "ZOMBIE",
            name: vee.Utils.getObjByLanguage("Zombie Show", "僵尸狂欢"),
            type: STORE_ENUM.BuyActionType.LEVEL,
            details: [
	            vee.Utils.getObjByLanguage("Get a little surprise.", "给平凡的生活加些小惊喜。"),
	            vee.Utils.getObjByLanguage("Get a bug surprise.", "生活总是需要一些变化!"),
	            vee.Utils.getObjByLanguage("Get a huge surprise.", "来参加这个疯狂的派对!")
            ],
            max: 3,
            priceType: STORE_ENUM.PriceType.SOUL,
            prices: [
                1350,
                2200,
                3000
            ],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE
            },
            icon: "shop/s_icon_magic_zombie.png",
            iconLock: "shop/s_icon_magic_zombie_lock.png",
            lockFilter: [STORE_FUNCTIONS.getUnlockLevel(18)]
        },
        TIME: {
            className: "TIME",
            name: vee.Utils.getObjByLanguage("Time Freeze", "时间静止"),
            type: STORE_ENUM.BuyActionType.LEVEL,
            details: [
	            vee.Utils.getObjByLanguage("All demons slow down for 3 sec.", "减慢所有恶魔的动作, 持续3秒。"),
	            vee.Utils.getObjByLanguage("All demons slow down for 4 sec.", "减慢所有恶魔的动作, 持续4秒。"),
	            vee.Utils.getObjByLanguage("All demons slow down for 5 sec.", "减慢所有恶魔的动作, 持续5秒。")
            ],
            max: 3,
            priceType: STORE_ENUM.PriceType.SOUL,
            prices: [
                1550,
                2600,
                3500
            ],
            config: {
                type: STORE_ENUM.ConfigType.UPGRADE
            },
            icon: "shop/s_icon_magic_time.png",
            iconLock: "shop/s_icon_magic_time_lock.png",
            lockFilter: [STORE_FUNCTIONS.getUnlockLevel(20)]
        }
    }
};

var GAME_CONFIG = {
    getScore: function (numOfKilled, enemyScore, combo) {
        if (combo < 1) {
            cc.log("combo should be greater than 0");
        }
        if (enemyScore === 0){
            return 0;
        }

        /**
         ROUND(abs(log(
         怪物分+(combo数-1)^坡度系数
         )
         )*
         (combo数-1)^(1/combo数)+怪物分+(怪物分^群杀系数+1)*是否群杀)
         **/
        var isMulti = numOfKilled > 1 ? 1 : 0;
        var k = 4;
        var m = 0.2;
        var score = Math.abs(Math.log(enemyScore + Math.pow(combo - 1, k)) / Math.log(10)) * Math.pow(combo - 1, 1 / combo) + enemyScore + (Math.pow(enemyScore, m) + 1) * isMulti;

        score = Math.round(score);
        return score;
    },
    getShakeScreenLevel: function (combo) {
        var ret = 0;
        if (combo >= 0) {
            ret = 2;
        }
        if (combo >= 5) {
            ret = 3;
        }
        if (combo >= 10) {
            ret = 4;
        }
        if (combo >= 20) {
            ret = 4;
        }
        return ret;
    },
    comboInterval: 1
};

var ENEMY_WAVE_CONFIG = {
    gameStartWave: 1,
    nextAppear: function (enemyCountNow, maxEnemyThisWave, waveNumber, enemyIdx) {
        return (enemyCountNow / maxEnemyThisWave) * 3;
    },
    getChapter: function (newWaveIndex) {
        var ret = -1;
        switch (newWaveIndex) {
            case 0:
                ret = 1;
                break;
            case 7:
                ret = 2;
                break;
            case 14:
                ret = 3;
                break;
            case 22:
                ret = 4;
                break;
            case 30:
                ret = 5;
                break;
            case 40:
                ret = 6;
                break;
        }
        return ret;
    },
    bossWaves: [],
    getWavePercent: function (thisWaveIndex) {
        if (this.bossWaves.length < 1) {
            for (var i = 0; i < this.waves.length; i++) {
                var wave = this.waves[i];

                // integer wave is boss wave
                if (parseInt(wave.wave) === wave.wave) {
                    this.bossWaves.push(i);
                }
            }
        }
        var lastBossWave = 0;
        var nextBossWave = 0;
        for (var j = 0; j < this.bossWaves.length; j++) {
            if (thisWaveIndex <= this.bossWaves[j]) {
                if (j > 0) {
                    lastBossWave = this.bossWaves[j - 1];
                }
                nextBossWave = this.bossWaves[j];
                break;
            }
        }

        var percent = 0;
        // thisWaveIndex is too large
        if (nextBossWave - lastBossWave === 0){
            percent = 1;
        } else {
            percent = (thisWaveIndex - lastBossWave) / (nextBossWave - lastBossWave);
        }
        return {
            percent: percent,
            bossWave: thisWaveIndex === nextBossWave
        };
    },
    type: {
        0: ENTITY.ZombieSoul._className,
        1: ENTITY.Zombie._className,
        2: ENTITY.Warrior._className,
        3: ENTITY.WarriorBlack._className,
        4: ENTITY.Archer._className,
        5: ENTITY.Magic._className,
        6: ENTITY.BossSkeleton._className,
        7: ENTITY.BossFire._className,
        8: ENTITY.WarriorDoom._className,
        9: ENTITY.ZombieBomb._className,
        10: ENTITY.BossIce._className,
        11: ENTITY.ZombieCrazy._className,
        12: ENTITY.BossShadow._className
    },
    waves: [
        {
            wave: 0.1,
            score: 0,
            enemies: [1, 1, 1, 1],
            flag: "clean",
            wait: 2 },
        {
            wave: 1.1,
            score: 0,
            enemies: [1, 1, 1, 1, 1, 1, 2],
            flag: "clean",
            wait: 0 },
        {
            wave: 1.2,
            score: 8,
            enemies: [1, 1, [1, 2], 2, 2, 1],
            flag: "score",
            wait: 0 },
        {
            wave: 1.3,
            score: 18,
            enemies: [1, [1, 2], 1, 1, 2, 2],
            flag: "score",
            wait: 0 },
        {
            wave: 1.5,
            score: 24,
            enemies: [1, [1, 2], 2, 2, 2, 1, 4],
            flag: "score",
            wait: 0 },
        {
            wave: 1.6,
            score: 32,
            enemies: [2, 1, 1, [2, 4]],
            flag: "score",
            wait: 0 },
        {
            wave: 7,
            score: 12,
            enemies: [8, 3, 4, 4],
            //[3, 3, 3, [2, 4]],
            flag: "clean",
            wait: 2 },
        {
            wave: 2.1,
            score: 0,
            enemies: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            flag: "clean",
            wait: 3 },
        {
            wave: 2.2,
            score: 1,
            enemies: [[1, 2], 2, 1, 2, 2, [1, 2], 4],
            flag: "score",
            wait: 0 },
        {
            wave: 2.3,
            score: 60,
            enemies: [1, [1, 2], 2, 2, 2, [2, 3], 4, 4, 3],
            flag: "score",
            wait: 0 },
        {
            wave: 2.4,
            score: 75,
            enemies: [1, [1, 2], 2, 2, 2, [2, 3], 4, 4, [3, 5]],
            flag: "score",
            wait: 0 },
        {
            wave: 2.5,
            score: 90,
            enemies: [1, [1, 2], 2, 2, [2, 4], 4, 5, 3],
            flag: "score",
            wait: 0 },
        {
            wave: 2.6,
            score: 120,
            enemies: [2, 2, 2, 2, 2],
            flag: "score",
            wait: 0 },
        {
            wave: 14,
            score: 20,
            enemies: [6, 2, 2, 2, 2],
            flag: "clean",
            wait: 2.5 },
        {
            wave: 3.1,
            score: 0,
            enemies: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
            flag: "clean",
            wait: 3 },
        {
            wave: 3.2,
            score: 1,
            enemies: [2, 2, 1, [2, 1], [2, 3], 4, 2, [4, 5], 9],
            flag: "score",
            wait: 0 },
        {
            wave: 3.3,
            score: 80,
            enemies: [2, 1, 3, 2, 2, 9, 4, [4, 5], 3, 3, 9, 2, 5],
            flag: "score",
            wait: 0 },
        {
            wave: 3.4,
            score: 90,
            enemies: [2, 2, 3, 3, 9, 2, 3, 3, 4, 4, 4, 5],
            flag: "score",
            wait: 0 },
        {
            wave: 3.5,
            score: 100,
            enemies: [2, 2, 2, 3, 9, 3, 3, 3, 4, 4, 9, 5, 5],
            flag: "score",
            wait: 0 },
        {
            wave: 3.6,
            score: 110,
            enemies: [2, 2, 2, 3, 3, 2, 3, 3, 2, 9, 4, 4, 5, 5],
            flag: "score",
            wait: 0 },
        {
            wave: 3.7,
            score: 120,
            enemies: [2, 2, 2, 2, 2, 2, 9, 2],
            flag: "score",
            wait: 0 },
        {
            wave: 22,
            score: 18,
            enemies: [7, [2, 3], 2, 1, 1],
            flag: "clean",
            wait: 3 },
        {
            wave: 4.1,
            score: 0,
            enemies: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 9, 9],
            flag: "score",
            wait: 3 },
        {
            wave: 4.2,
            score: 30,
            enemies: [3, 3, 3, 8, 3, 3, 4, 4, 9, 4, 5],
            flag: "score",
            wait: 0 },
        {
            wave: 4.3,
            score: 160,
            enemies: [2, 2, 3, 9, 3, 3, 8, 3, 3, 4, 4, 5],
            flag: "score",
            wait: 0 },
        {
            wave: 4.4,
            score: 180,
            enemies: [3, 3, 3, 3, 8, 3, 2, 4, 4, 5, 5, 9],
            flag: "score",
            wait: 0 },
        {
            wave: 4.5,
            score: 200,
            enemies: [3, 2, 3, 3, 5, 3, 3, 4, 5, 5, 8],
            flag: "score",
            wait: 0 },
        {
            wave: 4.6,
            score: 220,
            enemies: [3, 2, 3, 3, 3, 9, 4, 4, 5, 5, 8, 8],
            flag: "score",
            wait: 0 },
        {
            wave: 4.7,
            score: 240,
            enemies: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 5, 4, 4],
            flag: "clean",
            wait: 0 },
        {
            wave: 30,
            score: 0,
            enemies: [10, 5, 3],
            flag: "clean",
            wait: 3 },
        {
            wave: 5.1,
            score: 0,
            enemies: [1, 1, 1, 1, 1, 1, 1],
            flag: "clean",
            wait: 3 },
        {
            wave: 5.2,
            score: 0,
            enemies: [11, 11, 11, 11, 11, 11, 11, 11, 11, 9, 11, 9, 11, 9, 11],
            flag: "clean",
            wait: 0 },
        {
            wave: 5.3,
            score: 0,
            enemies: [8, 11, 8, 11, 5, 8, 5, 5, 9, 5, 5, 8, 11],
            flag: "score",
            wait: 0 },
        {
            wave: 5.4,
            score: 240,
            enemies: [6, 8, 8, 8, 11, 5, 5, 5, 4, 5, 6],
            flag: "clean",
            wait: 0 },
        {
            wave: 5.5,
            score: 260,
            enemies: [11, 11, 9, 11, 8, 8, 9, 5, 5, 11, 8, 8],
            flag: "score",
            wait: 0 },
        {
            wave: 5.6,
            score: 300,
            enemies: [8, 9, 11, 9, 5, 5, 5, 8, 7, 11, 9],
            flag: "clean",
            wait: 0 },
        {
            wave: 5.7,
            score: 0,
            enemies: [4, 4, 5, 5, 11, 4, 4, 11, 5, 5, 4, 4, 11, 5, 5],
            flag: "score",
            wait: 0 },
        {
            wave: 5.8,
            score: 240,
            enemies: [11, 11, 11, 11, 5, 11, 8, 11, 9, 11, 5, 5, 11, 11, 11, 9, 11],
            flag: "clean",
            wait: 0 },
        {
            wave: 39,
            score: 0,
            enemies: [12],
            flag: "clean",
            wait: 5 },
            {
            wave: 6.1,
            score: 1000,
            enemies: [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 7, 8, 9 ,10, 11],
            flag: "score",
            wait: 10
            }
    ]
};

ENEMY_WAVE_CONFIG.bossWave = {};
ENEMY_WAVE_CONFIG.bossWave[ENTITY.WarriorDoom._className] = 7;
ENEMY_WAVE_CONFIG.bossWave[ENTITY.BossSkeleton._className] = 14;
ENEMY_WAVE_CONFIG.bossWave[ENTITY.BossFire._className] = 22;
ENEMY_WAVE_CONFIG.bossWave[ENTITY.BossIce._className] = 30;
ENEMY_WAVE_CONFIG.bossWave[ENTITY.BossShadow._className] = 39;
ENEMY_WAVE_CONFIG.lastBoss = ENTITY.BossShadow._className;
