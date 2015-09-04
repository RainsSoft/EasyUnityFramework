/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 14-7-15
 * Time: 下午2:25
 * To change this template use File | Settings | File Templates.
 */

vee.GameModule.SceneMgr.openMain = function(){
	this.openGame();
	game.oGame.handleKey(false);
	var node = vee.PopMgr.popCCB(this.mainFile, true);
	game.oMain = node.controller;
}

vee.GameModule.MainLayer.extend({
	onPlay : function(){
		vee.Audio.onEvent("button");
		this.playAnimate("out", function(){
			vee.PopMgr.closeLayer();
			this.afterPlay();
		});
	},

	afterPlay : function(){}
});

vee.GameModule.OverLayer.extend({
	_retried : false,

	onRetry : function(){
		if (this._retried) return;
		this._retried = true;
		vee.Audio.onEvent("button");
		this.beforeRetry();
		this.playAnimate("out", function(){
			vee.PopMgr.closeLayer();
			this.afterRetry();
		});
	},

	afterRetry : function(){
		//reset the game here
	}
});