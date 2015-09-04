/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 14-7-7
 * Time: 下午3:18
 * To change this template use File | Settings | File Templates.
 */

var VeeTransition = vee.Class.extend({

	_in : function(){
		this.playAnimate("out", function(){
			this.rootNode.removeFromParent();
		})
	},

	_out : function(callback){
		this.playAnimate("in", function(){
			this.rootNode.removeFromParent();
			callback();
		})
	}
});

var vee = vee = vee || {};

vee.Transition = {};

vee.Transition.pop = function(ccb, pos){
	var node = cc.BuilderReader.load(ccb);
	var lyTouch = cc.LayerGradient.create(cc.color(0,0,0,150),cc.color(0,0,0,150));
	lyTouch.setOpacity(0);
	node.addChild(lyTouch);
	if (pos) node.setPosition(pos);
	else vee.PopMgr.resetLayer(node, vee.PopMgr.PositionType.Center, cc.p(0,0), true);
	vee.PopMgr.rootNode.addChild(node);
	return node;
};

vee.Transition.in = function(ccb, pos){
	var node = this.pop(ccb, pos);
	node.controller._in();
};

vee.Transition.out = function(ccb, callback, pos){
	var node = this.pop(ccb, pos);
	node.controller._out(callback);
};