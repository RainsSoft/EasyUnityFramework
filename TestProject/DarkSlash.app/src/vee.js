vee.isFirstPlay = false;
vee.hideListener = {
	event : cc.EventListener.CUSTOM,
	eventName : "game_on_hide",
	callback : function(event){
		app.leave();
		vee.onApplicationDidEnterBackground();
	}
};
vee.showListener = {
	event : cc.EventListener.CUSTOM,
	eventName : "game_on_show",
	callback : function(event){
		vee.Utils.scheduleBack(app.resume);
		vee.onApplicationWillEnterForeground();
	}
};

vee.init = function(){
	var data = vee.Utils.loadObj("VeeData");
	if (!data) {
		vee.isFirstPlay = true;
		vee.saveData();
	} else {
		vee.data = data;
	}

	cc.eventManager.addListener(vee.hideListener, 1);

	cc.eventManager.addListener(vee.showListener, 1);

	vee.Audio.init();
	vee.PopMgr.resetScene();
	app.init(vee.isFirstPlay);

};

//使用 game.init 方法设置 vee.data
vee.data = {
	musicEnabled : true,
	soundEnabled : true,
	adEnabled : true,
	gameCenterEnabled : true
};

vee.saveData = function() {
	vee.Utils.saveObj(vee.data, "VeeData");
};
