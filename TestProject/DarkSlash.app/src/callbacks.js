var vee = vee = vee || {};

vee.onApplicationDidEnterBackground = function() {
	vee.Audio.stopMusicWithSave();
	vee.Audio.pauseAllEffects();
	vee.saveData();
    vee.Analytics.stopSession();
};

vee.onApplicationWillEnterForeground = function() {
	vee.Audio.playLastMusic();
	vee.Audio.resumeAllEffects();
    vee.Analytics.startSession();
};

vee.getConfig = function(key){
	return app.Config[key];
};

vee.configWithUrlData = function(urlData){};

vee.configIAPPrices = function(arrPrices){
	for (var i = 0; i < arrPrices.length; ++i) {
		app.Config.IAPs[i].prices = arrPrices[i];
	}
	vee.data["arrPrices"] = arrPrices;
	vee.saveData();
};

vee.alert = function(title, content){
	vee.PopMgr.alert(content,title);
};

vee.onKeyBack = function(){
	vee.Utils.scheduleOnce(function(){
		VeeQuitBox.show();
	}, 0.2);
};

