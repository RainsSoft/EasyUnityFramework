
var vee = vee = vee || {};

vee.Ad = {
	adBanner : null,
	adInterstitial : null,
	adVideo : null,
	adPluginLoaded : false,
    debug: false,
	isInReview : true,
	adBannerPos : null,
	_callback : null,
	_apiVersion : 1,
	_adSize : 0,
	_from : null,
	_bannerEnabled : false,
	_interstitialEnabled : false,

	receiveConfig : function(data){
		if (data.err || data.error) return;
		vee.Utils.saveObj(data, "adConfig");

		this._bannerEnabled = data.IsBannerEnabled;
		this._interstitialEnabled = data.IsInterestialEnabled;
	},

	/**
	 * 根据插件名加载插件
	 * @param pluginName
	 * @param config
	 * @returns {*}
	 */
	loadPlugin : function(pluginName, config) {
		if (vee.data.adEnabled && pluginName && config) {
			var pi = plugin.PluginManager.getInstance().loadPlugin(pluginName);
			if (pi) {
//				pi.setDebugMode(this.debug);
				pi.configDeveloperInfo(config);
				cc.log("Load Plugin:\t" + pluginName + " OK!");
			} else {
				cc.log("Ad ERROR : Fail to load Plugin:\t" + pluginName);
			}
		} else {
			cc.log("load plugin " + pluginName + "fail!");
			cc.log("vee.data.adEnabled is : " + vee.data.adEnabled);
			cc.log("pluginName is : " + pluginName);
			cc.log("config is : " + config);
		}
		return pi;
	},

	/**
	 * 加载全部插件
	 * @param callback
	 */
	loadPlugins : function(callback) {
		/** @type {app.Config} */
		var config = this.getConfig();
		this._bannerEnabled = config.IsBannerEnabled;
		this._interstitialEnabled = config.IsInterestialEnabled;
		if (config.AdBannerPluginName) {
			var pi = this.loadPlugin(config.AdBannerPluginName, config.AdBannerPluginConfig);
			if (config.IsBannerEnabled) this.adBanner = pi;
			if (config.IsInterestialEnabled) this.adInterstitial = this.adBanner;
		}
		if (config.AdInterstialPluginName && config.IsInterestialEnabled) {
			var pi = this.loadPlugin(config.AdInterstialPluginName, config.AdInterstialPluginCoinfig);
			if (pi) this.adInterstitial = pi;
		}
		if (config.AdVideoPluginName) {
			this.adVideo = this.loadPlugin(config.AdVideoPluginName, config.AdVideoPluginConfig);
		}
		if (callback) callback();
	},

	/**
	 * 显示横幅广告
	 * @param {vee.Ad.Position} pos
	 */
	showBannerAd : function(pos){
		if (!vee.data.adEnabled || !this._bannerEnabled) return;
		if (this.adBanner){
			if (pos != undefined) this.adBannerPos = pos;
			this.adBanner.showAds(
				{type : vee.Ad.Type.BANNER, size : String(this._adSize) },
				this.adBannerPos);
		} else {
			cc.log("Ad ERROR : No banner plugin found!");
		}
	},

	/**
	 * 隐藏横幅广告
	 */
	hideBannerAd : function(){
		if (this.adBanner){
			this.adBanner.hideAds({type : String(vee.Ad.Type.BANNER)});
		}
	},

	/**
	 * 显示视频广告
	 * @param callback
	 */
	showVideoAd : function(callback) {
		if (vee.Ad.adVideo) {
			vee.Ad.adVideo.isWaittingCache = true;

			vee.PopMgr.popLoading(function(){
				vee.Ad.adVideo.isWaittingCache = false;
			});
			vee.Audio.stopMusic();
			vee.Audio.pauseAllEffects();
			vee.Ad.adVideo._callback = callback;
			if (!vee.Ad.adVideo.listener) {
				vee.Ad.adVideo.listener = {
					onPlayerGetPoints : function(pPlugin, num, itemID){
						if (callback) {
							vee.Ad.adVideo._callback(pPlugin, num, itemID);
						}
					},
					onAdsResult : function(code){
						if (code == vee.Ad.AdsResult.AdsNotReady) {
						}
						if (code == vee.Ad.AdsResult.AdsShown) {
							vee.PopMgr.closeLayer();
						}
						cc.log("vee.Ad.adVideo.isWaittingCache       " + vee.Ad.adVideo.isWaittingCache);
						if (code == vee.Ad.AdsResult.AdsReceived && !vee.Ad.adVideo.isWaittingCache) {
							vee.Ad.adVideo.showAds({}, 1);
						}
						if (code == vee.Ad.AdsResult.AdsDismissed) {
							vee.Audio.playLastMusic();
							vee.Audio.resumeAllEffects();
						}
					}
				};
				vee.Ad.adVideo.setListener(vee.Ad.adVideo.listener);
			}


			vee.Ad.adVideo.showAds({}, 1);
		} else {
			cc.log("Ad ERROR : No video plugin found!");
		}
	},

	/**
	 * 显示插屏广告
	 */
	showInterstitialAd : function(dismissCallback, notRetryCallback){
		if (!vee.data.adEnabled || !this._interstitialEnabled) {
			if(notRetryCallback){
				notRetryCallback();
			}
			return;
		}
		if (null !== this.adInterstitial){
			if (!this.adInterstitial.listener) {
				this.adInterstitial.listener = {
					onAdsResult : function(code){
						if (code == vee.Ad.AdsResult.AdsDismissed) {
							if(dismissCallback){
								vee.Utils.scheduleOnce(dismissCallback, 0.2);
							}
						}
						if(code == vee.Ad.AdsResult.AdsNotReady){
							if(notRetryCallback){
								vee.Utils.scheduleOnce(notRetryCallback, 0.2);
							}
						}
					}
				};
				this.adInterstitial.setListener(this.adInterstitial.listener);
			}

			this.adInterstitial.showAds({type : vee.Ad.Type.FULLSCREEN, size : String(this._adSize) }, 1);
		} else {
			cc.log("Ad ERROR : No interstitial plugin found!");
		}
	},

	activate : function(callback, version) {
		if (version) this._apiVersion = version;
		else this._apiVersion = 1;
		if (vee.data.adEnabled) {
			vee.Ad.loadPlugins(callback);
		} else return;
	},

	banAd : function(){
		vee.data.adEnabled = false;
		vee.Ad.hideBannerAd();
		vee.saveData();
	},

	getConfig : function(){
		var config = vee.Utils.loadObj("adConfig");
		if (!config) config = app.Config;
		return config;
	},

	/**
	 * @param {String}strId 用于保存计数的唯一标识字符串
	 * @param {Number}countLimit 计数 >= countLimit 便显示广告
	 */
	showFullScreenAd : function(strId, countLimit) {
		var count = parseInt(vee.data["FullScreenAdFor"+strId]);
		if (count || count == 0) {
			if (count >= countLimit) {
				vee.data["FullScreenAdFor"+strId] = 0;
				vee.saveData();
				vee.Ad.showInterstitialAd();
				return true;
			} else {
				vee.data["FullScreenAdFor"+strId] = ++count;
			}
		} else {
			vee.data["FullScreenAdFor"+strId] = 0;
			vee.saveData();
			vee.Ad.showFullScreenAd(strId, countLimit);
		}
		return false;
	}
};

vee.Ad.Type = {
	BANNER: "0",
	FULLSCREEN: "1"
};

vee.Ad.Position = {
    Center: 0,
	Top : 1,
	TopLeft : 2,
	TopRight : 3,
	Bottom : 4,
	BottomLeft : 5,
	BottomRight : 6,
	Left : 7,
    Right: 8
};

vee.Ad.AdsResult = {
	AdsReceived        : 0,
	AdsShown           : 1,
	AdsDismissed       : 2,
	PointsSpendSucceed : 3,
	PointsSpendFailed  : 4,
	NetworkError       : 5,
	UnknownError       : 6,
	VideoStart         : 7,
	VideoComplete      : 8,
	AdsNotReady        : 9
};
