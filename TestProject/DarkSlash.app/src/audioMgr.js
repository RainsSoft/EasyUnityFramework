var vee = vee = vee || {};

vee.Audio = {
	event : {
		popLayer : "res/sfx_menu_openwindow.mp3",
		closeLayer : "res/sfx_menu_closewindow.mp3",
		button : "res/sfx_menu_buttonclick.mp3"
	},

	lastBGM : null,

	_isMusicPause : false,
    
    addEventEffect : function(eventName, effectName) {
        this.event[eventName] = effectName;
    },

	addEvents : function(obj) {
		for(var key in obj){
			this.event[key] = obj[key];
		}
	},

	/**
	 *
	 * @param 目前可以传 popLayer, closeLayer, button 三种
	 */
	onEvent : function(e, loop){
		var efx = this.event[e];
		if(efx) {
			if (_.isArray(efx)) {
				var idx = vee.Utils.randomInt(0,efx.length-1);
				return this.playEffect(efx[idx], loop);
			} else return this.playEffect(efx, loop);
		}
	},

	/**
	 *
	 * @param efx
	 */
	playEffect : function(efx, loop){
		if (!this.soundEnabled) return null;
		var a = arguments[1] ? arguments[1] : false;
		return cc.audioEngine.playEffect(efx, a);
	},

	/**
	 *
	 * @param efx
	 */
	stopEffect : function(efx){
		if (efx)
			cc.audioEngine.stopEffect(efx);
	},

	stopAllEffcts : function() {
		cc.audioEngine.stopAllEffects();
	},

	pauseAllEffects : function() {
		cc.audioEngine.pauseAllEffects();
	},

	resumeAllEffects : function(){
		cc.audioEngine.resumeAllEffects();
	},

	/**
	 *
	 * @param m
	 */
	playMusic : function(m) {
		this.lastBGM = m;
		if (!this.musicEnabled) return;
		cc.audioEngine.playMusic(m, true);
	},

    getLastMusic: function(){
        return this.lastBGM;
    },

	playLastMusic : function() {
		if (!this.musicEnabled) return;
		if (this.lastBGM){
			cc.audioEngine.playMusic(this.lastBGM, true);
		}
	},

	stopMusic : function() {
		cc.audioEngine.stopMusic(true);
		this.lastBGM = undefined;
	},

	stopMusicWithSave : function() {
		cc.audioEngine.stopMusic(false);
	},

	pauseMusic : function() {
		cc.audioEngine.pauseMusic();
	},

	resumeMusic : function() {;
		cc.audioEngine.resumeMusic();
	},

	pause : function(){
		this._isMusicPause = true;
		cc.audioEngine.pauseAllEffects();
		cc.audioEngine.pauseMusic();
	},

	resume : function(){
		this._isMusicPause = false;
		cc.audioEngine.resumeAllEffects();
		cc.audioEngine.resumeMusic();
	},

	musicEnabled : true,
	soundEnabled : true,
	setMusicEnabled : function(v) {
		this.musicEnabled = v;
		vee.data.musicEnabled = v;
		if (!v) this.stopMusicWithSave();
		else if (!this._isMusicPause) {
			this.playLastMusic();
		}
	},

	setSoundEnabled : function(v) {
		this.soundEnabled = v;
		vee.data.soundEnabled = v;
		if (!v) this.stopAllEffcts();
		var com = vee.Common.getInstance();
		cc.log("enable : "+v);
		com.setSoundEnabled(v);
	},

	init : function() {
		this.musicEnabled = vee.data.musicEnabled;
		this.soundEnabled = vee.data.soundEnabled;
		var com = vee.Common.getInstance();
        com.setSoundEnabled(this.soundEnabled);
	}
};

vee.soundPopup = function() {
	vee.Audio.onEvent("popLayer");
}

vee.soundCloseLayer = function() {
	vee.Audio.onEvent("closeLayer");
}

vee.soundButton = function() {
	vee.Audio.onEvent("button");
}
