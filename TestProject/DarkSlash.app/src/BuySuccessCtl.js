/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 1/9/15
 * Time: 11:43 AM
 * To change this template use File | Settings | File Templates.
 */

var BuySuccessCtl = vee.Class.extend({

	spItemIcon : null,
	lbItemName : null,
	_data : null,

	onCreate : function() {

	},

	setData : function(data) {
		this._data = data;
		if (data.type == STORE_ENUM.BuyActionType.CHARACTER) {
			this.spItemIcon.setOpacity(0);
			var ccbiFile = data.icon;
			var node = cc.BuilderReader.load(ccbiFile);
			this.spItemIcon.addChild(node);
			node.setPosition(cc.p(-10,-10));
		} else {
			var iconFile = data.icon;
			this.spItemIcon.initWithFile(iconFile);
		}

		var name = data.name;
		var level = 0;
		if (data.type == STORE_ENUM.BuyActionType.LEVEL) {
			var productData = DataManager.getInstance().getProductData();
			level = productData[data.className];
			name = name + " " + "Lv." + level;
		}
		this.lbItemName.setString(name);
	},

	onConfirmed : function() {
		this.playAnimate("close", function(){
			vee.PopMgr.closeLayer();
		});
	},

	onShare : function() {
		var name = this._data.name;
		if (this._data.type == STORE_ENUM.BuyActionType.LEVEL) {
			var productData = DataManager.getInstance().getProductData();
			var level = productData[this._data.className];
			name = name + " " + "Lv." + level;
		}
		vee.Utils.shareScreen("我在#暗黑斩:英魂#中获得了" + name + "，一起加入这场黑暗华丽的杀戮盛宴吧！"+"http://veewo.com/games/?name=darkslash2cn");
	}
});

BuySuccessCtl.showWithData = function(data) {
	var node = vee.PopMgr.popCCB("res/great.ccbi", true);
	node.controller.setData(data);
}