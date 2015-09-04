/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 14-3-19
 * Time: 下午4:35
 * To change this template use File | Settings | File Templates.
 */

var vee = vee = vee || {};

vee.IAPMgr = {
	iapPlugin : null,
    activate: function(){
        if (!this.iapPlugin){
            var pluginName = app.Config.IAPPluginName;
            this.iapPlugin = plugin.PluginManager.getInstance().loadPlugin(pluginName);
            if (this.iapPlugin && app.Config.IAPConfig){
	            var developerInfos;
	            if (app.Config.IAPs) {
		            var iapid = app.Config.IAPConfig.IAPID ? app.Config.IAPConfig.IAPID : "";
		            var productIDs = "";
		            var len = app.Config.IAPs.length;
		            for (var i = 0; i < len; ++i) {
			            productIDs += app.Config.IAPs[i].ProductID;
			            if (i != len - 1) {
				            productIDs += ",";
			            }
		            }
		            developerInfos = {
			            IAPID : iapid,
			            ProductIDs : productIDs
		            };
	            } else {
		            developerInfos = app.Config.IAPConfig;
	            }
                this.iapPlugin.configDeveloperInfo(developerInfos);
	            this.iapPlugin.setListener({
		            successCallback : null,
		            failCallback : null,
		            cheatCallback : null,
		            _isPurchasing : true,
		            onPayResult : function(code, price){
			            var arrPrices = price.split(",");
			            vee.configIAPPrices(arrPrices);
		            }
	            });
                var debug = vee.Utils.isDebugMode();
                this.iapPlugin.setDebugMode(debug);
            }
            if (!this.iapPlugin) {
                this.iapPlugin = null;
            }
        }
    },

	/** @private */
	_purchase : function(info, successCallback, failCallback, cheatCallback) {
        this.activate();
		if (!this.iapPlugin) {
            cc.log("无法找到 plugin");
            if (failCallback){
                failCallback("Loading Purchase Function Error!");
            } else {
                vee.PopMgr.alert("Loading Purchase Function Error!", "PURCHASE FAIL");
            }
            return;
		}

        var listener = {
			successCallback : successCallback,
            failCallback : failCallback,
			cheatCallback : cheatCallback,
			_isPurchasing : true,
			onPayResult : function(code, msg){
				if (this._isPurchasing){
					vee.PopMgr.closeLayer();
					this._isPurchasing = false;
				}
					if (code == plugin.ProtocolIAP.PayResultCode.PaySuccess) {
						cc.log("plugin.ProtocolIAP.PayResultCode.PaySuccess");
						this.successCallback(msg);
				} else if (code == plugin.ProtocolIAP.PayResultCode.PayCheat) {
					vee.Utils.scheduleBack(function () {
						if (this.cheatCallback) this.cheatCallback(msg);
						else cc.log("this.cheatCallback is undefined");
					}.bind(this));
				} else if (this.failCallback){
                    vee.Utils.scheduleBack(function() {
                        this.failCallback(msg);
                    }.bind(this));
                } else {
					cc.log("payresult");
                    vee.Utils.scheduleBack(function() {
                        vee.PopMgr.alert(msg, "PURCHASE FAIL");
                    }.bind(this));
				}
			}
		};
		this.iapPlugin.setListener(listener);
		this.iapPlugin.iapListener = listener;
		vee.PopMgr.popLoading();
        this.iapPlugin.payForProduct(info);
	},

	/**
	 *
	 * @param {game.Config.iOS.IAPs} idx
	 * @param {Function} successCallback
     * @param {Function} failCallback
	 */
	buyProduct : function(idx, successCallback, failCallback, cheatCallback) {
		var productInfo = app.Config.IAPs[idx];
		this._purchase(productInfo, successCallback, failCallback, cheatCallback);
	},

    /**
     * Alipay use this since there's no product id.
     * @param {Function} successCallback
     * @param {Function} failCallback
     */
    buyProductWithCustomParams: function(params, successCallback, failCallback){
        this._purchase(params, successCallback, failCallback);
    },

	restoreProduct : function(successCallback, failCallback) {
		this._purchase({
			ProductID : "Restore"
		}, successCallback, failCallback);
	}
};

var VeeRestorePurchaseButton = vee.Class.extend({
	/** @expose */
	btnRestore : null,
	onCreate : function() {
		cc.log("purchaseButton\t" + cc.sys.os);
		var shouldShowBtn = false;
		for (var i = 0; i < app.Config.IAPs.length; ++i) {
			var nonConsumable = app.Config.IAPs[i].NonConsumable;
			if (nonConsumable == "true") {
				shouldShowBtn = true;
				break;
			}
		}
		this.rootNode.setVisible(shouldShowBtn);
		this.btnRestore.setEnabled(shouldShowBtn);
	},

	onRestore : function() {
		vee.IAPMgr.restoreProduct(VeeRestorePurchaseButton.callback);
		vee.Audio.onEvent("button");
	}
});
cc.BuilderReader.registerController("VeeRestorePurchaseButton", VeeRestorePurchaseButton);

VeeRestorePurchaseButton.registerCallback = function(callback){
	VeeRestorePurchaseButton._callback = callback;
}

/**
 * @param {String} productID
 */
VeeRestorePurchaseButton.callback = function(productID) {
	if (productID == app.Config.IAPs[0].ProductID) {
//		vee.Ad.banAd();
		vee.PopMgr.alert("Purchase success, AD's been remvoed.", "Success");
		if (VeeRemoveAdButton.shared) {
			VeeRemoveAdButton.shared.update();
		}
	}
	if (VeeRestorePurchaseButton._callback) {
		VeeRestorePurchaseButton._callback(productID);
	}
};

var VeeRemoveAdButton = vee.Class.extend({
	/** @expose */
	btnRemoveAd : null,
	onCreate : function() {
		VeeRemoveAdButton.shared = this;
		this.update();
	},

	onExit : function() {
		VeeRemoveAdButton.shared = null;
	},

	update : function() {
		if (!vee.data.adEnabled) {
			this.rootNode.setVisible(false);
			this.btnRemoveAd.setEnabled(false);
		}
	},

	/** @expose */
	onRemoveAd : function() {
		vee.IAPMgr.buyProduct(0, function(){
//			vee.Ad.banAd();
			this.rootNode.setVisible(false);
			this.btnRemoveAd.setEnabled(false);
			vee.PopMgr.alert("Purchase success, AD's been remvoed.", "Success");
		}.bind(this));
		vee.Audio.onEvent("button");
	}
});
cc.BuilderReader.registerController("VeeRemoveAdButton", VeeRemoveAdButton);

/** @type {VeeRemoveAdButton} */
VeeRemoveAdButton.shared = null;

