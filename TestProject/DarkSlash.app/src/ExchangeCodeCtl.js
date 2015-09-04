/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 1/13/15
 * Time: 11:26 AM
 * To change this template use File | Settings | File Templates.
 */

var ExchangeCodeCtl = vee.Class.extend({
	lyInput : null,
	textInput : null,

	onCreate : function() {
		this.textInput = cc.EditBox.create(this.lyInput.getContentSize(), "res/empty_block.png");
		this.textInput.setAnchorPoint(cc.p(0,0));
		this.lyInput.addChild(this.textInput);
	},

	onConfirm : function() {
		vee.PopMgr.popLoading();
		vee.Utils.logKey(this.textInput);
		var exCode = this.textInput.getString();
		if (!exCode) {
			exCode = "noCode";
		}
		vee.Utils.launchAppById("zplay_exchangecode:"+exCode);
	},

	onClose : function() {
		this.playAnimate("close", function(){
			vee.PopMgr.closeLayer();
		});
	}
});

ExchangeCodeCtl.show = function() {
	vee.PopMgr.popCCB("res/exchangeCode.ccbi", true);
}