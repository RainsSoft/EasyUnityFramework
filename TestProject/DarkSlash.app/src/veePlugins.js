/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 9/19/14
 * Time: 5:01 PM
 * To change this template use File | Settings | File Templates.
 */

var vee = vee || {};

vee.Share = {
	ShareType : {
		MSG_ONLY : 1,
		IMG_ONLY : 2,
		BOTH : 3
	},

	share : function(msg, fileName, url, shareType) {
		var config = app.Config;
		if (config.SharePluginName) {
			var pi = plugin.PluginManager.getInstance().loadPlugin(config.SharePluginName);
			if (pi) {
				vee.Utils.scheduleOnce(function(){
					this.share({msg : msg, imgPath : fileName, url : url, shareType : ''+shareType});
				}.bind(pi), 0.1);
			} else {
				cc.log("Fail to load Plugin:\t" + config.SharePluginName);
			}
		} else {
			cc.log("load share plugin " + config.SharePluginName + "fail!");
			cc.log("config is : " + config.SharePluginConfig);
		}
	}
};

vee.GameCenter = {
	plugin : null,
	/** @type {vee.VIPValues} */
	buffer : null,

	activate : function() {
        if (!this.plugin){
            vee.data.gameCenterEnabled = true;
            this.plugin = plugin.PluginManager.getInstance().loadPlugin(app.Config.GameCenterPluginName);
            if (this.plugin) {
                this.plugin.configDeveloperInfo(app.Config.GameCenterPluginConfig);
                this.buffer = vee.VIPValues.create(null, "RetnecEmag");
            } else {
                cc.log("Error: No GameCenter Plugin Loaded!");
            }
        }
	},

	submitScore : function(score, leaderBoardIndex, skipBuffer){
		if (this.plugin) {
			var leaderboardID = app.Config.LeaderboardIDs[leaderBoardIndex];
			if (!skipBuffer) {
				this.plugin.submitScore(leaderboardID, score);
				this.buffer.setValue(leaderboardID, score);
				this.buffer.save("RetnecEmag");
			}
		} else {
			cc.log("Plugin gamecenter not found!");
		}
	},

	showLeaderboard : function(leaderBoardIndex) {
		if (this.plugin) {
			if (leaderBoardIndex == undefined || leaderBoardIndex == null) {
				this.buffer.forEachValue(function(key, value){
					this.submitScore(value, key, true);
				}.bind(this));
			} else {
				var leaderboardID = app.Config.LeaderboardIDs[leaderBoardIndex];
				var score = this.buffer.getValue(leaderboardID);
				if (score !== null && score !== undefined) this.submitScore(this.buffer.getValue(leaderboardID), leaderBoardIndex, true);
			}
			this.plugin.showLeaderboard(leaderboardID ? leaderboardID : "");
		} else {
			cc.log("Plugin gamecenter not found!");
		}
	},

    login: function(){
        if (this.plugin){
            this.plugin.callFuncWithParam("login");
        } else {
	        cc.log("Plugin gamecenter not found!");
        }
    },

    unlockAchievement: function(achievementID){
        if (this.plugin){
	        if (_.isNumber(achievementID)) {
		        achievementID = app.Config.Achievements[achievementID];
	        }
            this.plugin.unlockAchievement({
                AchievementID: achievementID
            });
        } else {
	        cc.log("Plugin gamecenter not found!");
        }
    },

    showAchievements: function(){
        if (this.plugin){
            this.plugin.showAchievements();
        } else {
	        cc.log("Plugin gamecenter not found!");
        }
    },

	getPlayerName: function() {
		if (this.plugin) {
			return this.plugin.callStringFuncWithParam("getPlayerName");
		} else {
			cc.log("Plugin gamecenter not found!");
		}
	}
};
