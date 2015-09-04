/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 14-4-7
 * Time: 下午12:11
 * To change this template use File | Settings | File Templates.
 */

var vee = vee || {};
var game = game || {};

/** @type {vee.GameModule.GameLayer} */
game.oGame = null;
/** @type {vee.GameModule.MainLayer} */
game.oMain = null;
/** @type {vee.ScoreController} */
game.oScore = null;

vee.GameModule = {};
vee.GameModule.GlobalContext = this;

vee.GameModule.SceneMgr = {

	helpFile : "res/veeHelpLayer.ccbi",
	mainFile : "res/veeMainLayer.ccbi",
	gameFile : "res/veeGameLayer.ccbi",
	overFile : "res/veeOverLayer.ccbi",

	openMain : function(){
		vee.soundButton();
		vee.PopMgr.closeAll();
		game.oGame = null;
		var node = vee.PopMgr.popCCB(this.mainFile, true);
		game.oMain = node.controller;
		game.oMain.handleKey(true);
	},

	openHelp : function(){
		vee.soundPopup();
		var node = vee.PopMgr.popCCB(this.helpFile, true);
		node.controller.handleKey(true);
	},

	openGame : function(){
		vee.soundButton();
		vee.PopMgr.closeAll();
		game.oMain = null;
		var node = vee.PopMgr.popCCB(this.gameFile);
		game.oGame = node.controller;
		game.oGame.handleKey(true);
	},

	openOver : function(){
		var ctlOver = vee.PopMgr.popCCB(this.overFile, true).controller;

		if (game.oScore && ctlOver.lbScore) {
			ctlOver.lbScore.setString(game.oScore.getNumber());
		}
	},

	isPlaying : function() {
		return (game.oGame && game.oGame.isPlaying());
	},

	quitGame : function(){
		this.openMain();
	}
}
















vee.GameModule.MainLayer = {
	extend : function(obj) {
		veeMainLayer = veeMainLayer.extend(obj);
		cc.BuilderReader.registerController("veeMainLayer", veeMainLayer);
	},

	_popUps : 0,
	_lySetting : null,

	/** @expose */
	onRank : function() {
		vee.soundButton();
		if (!app.Config.LeaderboardIDs) return;
		if (app.Config.LeaderboardIDs.length > 1)
			vee.Utils.showLeaderBoard();
		else vee.Utils.showLeaderboard(app.Config.LeaderboardIDs[0]);
	},

	setEnableSetting : function(v){
		if (!v) this.settingFile = null;
		else this.settingFile = v;
	},

	settingFile : "res/veeSetting.ccbi",
	/** @expose */
	onSetting : function() {
		this._popUps++;
		vee.soundButton();
		vee.PopMgr.popCCB(this.settingFile, true, this);
		this.afterSetting();
	},
	afterSetting : function(){},

	/** @expose */
	onHelp : function() {
		this._popUps++;
		vee.soundButton();
		vee.GameModule.SceneMgr.openHelp();
	},

	afterClose : function(){},
	// for lySetting & lyHelp
	/** @expose */
	onClose : function() {
		if (this._popUps > 0) {
			vee.soundCloseLayer();
			vee.PopMgr.closeLayer();
			this._popUps--;
			this.afterClose();
			return true;
		}
		return false;
	},

	beforePlay : function() {
	},

	/** @expose */
	onPlay : function() {
		vee.soundButton();
		var canNotPlay = this.beforePlay();
		if(canNotPlay) return;
		vee.GameModule.SceneMgr.openGame();
	},

	/** @expose */
	onRate : function() {
		vee.soundButton();
		vee.Utils.rate();
	},

	onKeyBack : function(){
		if (!this.onClose()) {
			vee.onKeyBack();
		}
	},

	onKeyMenu : function(){
		if (this.settingFile && this._popUps == 0) this.onSetting();
	}
};

var veeMainLayer = vee.Class.extend(vee.GameModule.MainLayer);
cc.BuilderReader.registerController("veeMainLayer", veeMainLayer);

















vee.GameModule.GameLayer = {
	extend : function(obj) {
		veeGameLayer = veeGameLayer.extend(obj);
		cc.BuilderReader.registerController("veeGameLayer", veeGameLayer);
	},

	onCreate : function() {
		if (this.lbScore) {
			game.oScore = vee.ScoreController.registerController(this.lbScore, 0);
		}
	},

	_bIsPause : false,
	_bIsGameOver : false,

	isPlaying : function() {
		return (!this._bIsPause);
	},

	onKeyMenu : function() {
		if (this._bIsGameOver) return false;
		if (!this._bIsPause) {
			this.onPause();
			return true;
		}
		return false;
	},

	onKeyBack : function() {
		if (this._bIsGameOver) return false;
		if (this._bIsPause) {
			this.onResume();
			return true;
		} else {
			this.onPause();
			return true;
		}
		return false;
	},

	pauseFile : "res/veePause.ccbi",
	beforePause : function() {
		return true;
	},

	/** @expose */
	onPause : function() {
		if (!this.beforePause()) return;
		vee.soundPopup();
		vee.PopMgr.pause(this.rootNode);
//		vee.Audio.pause();
		vee.PopMgr.popCCB(this.pauseFile, true, this);
		this._bIsPause = true;
		this.afterPause();
//		vee.Audio.pauseMusic();
	},
	afterPause : function(){},

	beforeResume : function() {},

	/** @expose */
	onResume : function() {
		this.beforeResume();
		vee.soundCloseLayer();
		vee.PopMgr.resume();
//		vee.Audio.resume();
		vee.PopMgr.closeLayer();
		this._bIsPause = false;
		vee.Audio.resume();
		this.afterResume();
	},

	afterResume : function(){},

	beforeRetry : function(){},

	/** @expose */
	onRetry: function() {
		var canNotRetry = this.beforeRetry();
		vee.PopMgr.resume();
		vee.Audio.resume();
		vee.soundButton();
		if(canNotRetry) return;
		vee.GameModule.SceneMgr.openGame();
	},

	beforeGameOver : function() {},
	gameOver : function() {
		this.beforeGameOver();
		vee.GameModule.SceneMgr.openOver();
		this._bIsPause = true;
		this._bIsGameOver = true;
	},

	/** @expose */
	onHelp : function() {
		vee.GameModule.SceneMgr.openHelp();
	},

	/** @expose */
	onClose : function() {
		if (this._bIsPause) {
			vee.PopMgr.closeLayer();
		}
	},

	beforeQuit : function() {},

	/** @expose */
	onQuit : function() {
		this.beforeQuit();
		cc.director.resume();
		vee.Audio.resume();
		vee.soundButton();
		vee.GameModule.SceneMgr.quitGame();
	},

	popLayer : function(){
		this._popUps++;
	},
	closeLayer : function(){
		this.onClose();
	}
};

var veeGameLayer = vee.Class.extend(vee.GameModule.GameLayer);
cc.BuilderReader.registerController("veeGameLayer", veeGameLayer);












vee.GameModule.HelpLayer = {
	extend : function(obj) {
		veeHelpLayer = veeHelpLayer.extend(obj);
		cc.BuilderReader.registerController("veeHelpLayer", veeHelpLayer);
	},

	/** @type {cc.LayerColor} */
	lyContent : null,

	onLoaded : function() {
		if (this.lyContent) {
			var num = this.lyContent.getChildrenCount();
			vee.PagingController.registerController(this.lyContent, num);
			this.lyContent.pagingController.setSensitivity(1.2);
		}
		this.afterLoaded();
	},
	afterLoaded : function(){
	},

	/** @expose */
	onClose : function(){
		vee.soundCloseLayer();
		vee.PopMgr.closeLayer();
	},

	onKeyBack : function(){
		this.onClose();
	}

};

var veeHelpLayer = vee.Class.extend(vee.GameModule.HelpLayer);
cc.BuilderReader.registerController("veeHelpLayer", veeHelpLayer);



















vee.GameModule.OverLayer = {
	extend : function(obj) {
		veeOverLayer = veeOverLayer.extend(obj);
		cc.BuilderReader.registerController("veeOverLayer", veeOverLayer);
	},

	/** @type {cc.Label} */
	/** @expose */
	lbScore : null,

	beforeRetry : function() {},
	/** @expose */
	onRetry : function() {
		var canNotRetry = this.beforeRetry();
		if(canNotRetry) return;
		vee.GameModule.SceneMgr.openGame();
	},

	beforeNextLevel : function() {},
	/** @expose */
	onNextLevel : function() {
		this.beforeNextLevel();
		vee.GameModule.SceneMgr.openGame();
	},

	beforeQuit : function() {},
	/** @expose */
	onQuit : function() {
		this.beforeQuit();
		vee.GameModule.SceneMgr.quitGame();
	},

	getShareContent : function() { return "请重载 getShareContent 方法设置分享内容"; },
	beforeShare : function() {},
	/** @expose */
	onShare : function() {
		this.beforeShare();
		vee.Utils.shareScreen(this.getShareContent());
		this.afterShare();
	},
	afterShare : function(){}
};

var veeOverLayer = vee.Class.extend(vee.GameModule.OverLayer);
cc.BuilderReader.registerController("veeOverLayer", veeOverLayer);
