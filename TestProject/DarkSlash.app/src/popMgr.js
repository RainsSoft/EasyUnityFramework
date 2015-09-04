var vee = vee || {};

/** @type {cc.Director} */
vee.Director;

vee.PopMgr = {
	layers : [],

	/** @type {cc.LayerColor} **/
	rootNode : null,
	scheduler : null,

	_root : null,

	/** @type {cc.Scene} */
	currentScene : null,

	/**
	 * @type {cc.size}
	 */
	winSize : { width : 640, height : 960 },
	originOffset : { x : 0, y : 0},

	defalutMaskAlpha : 150,

	PositionType : {
		Top : {x:0.5, y:1.0},
		TopLeft : {x:0, y:1.0},
		TopRight : {x:1, y:1.0},
		Center : {x:0.5, y:0.5},
		Left : {x:0, y:0.5},
		Right : {x:1, y:0.5},
		Bottom : {x:0.5, y:0},
		BottomLeft : {x:0, y:0},
		BottomRight : {x:1.0, y:0}
	},

	getLastLayer : function(){
		var len = this.layers.length;
		return (len ? this.layers[this.layers.length-1] : null);
	},


	/**
	 * 在界面最上面加多一个ccb
	 * @param {String} ccb
	 * @param {bool || {}} isExcludedTouch 是否屏蔽点击事件, 可以传 true/false 或者 传 { alpha : 128 } 这样格式的配置
	 * @param {cc.Layer} parent 指定父节点
	 * @param {vee.PopMgr.PositionType} positionType 位置类型
	 * @param {cc.Point} offset 与指定position的 offset
	 */
	popCCB : function(ccb, isExcludedTouch, owner, positionType, offset) {
		var node = cc.BuilderReader.load(ccb, owner);
		var ret =this.popLayer(node, isExcludedTouch, null, positionType, offset);
		if (!owner && node.controller && _.isFunction(node.controller["onLoaded"])){
			node.controller["onLoaded"]();
		}
		return ret;
	},

	/**
	 * 在界面最上面加多一个层
	 * @param {cc.Layer} node
	 * @param {bool || {alpha : int}} isExcludedTouch 是否屏蔽点击事件
	 * @param {cc.Layer} parent 指定父节点
	 * @param {vee.PopMgr.PositionType} positionType 位置类型
	 * @param {cc.Point} offset 与指定position的 offset
	 */
	popLayer : function(node, isExcludedTouch, parent, positionType, offset) {
		var s = node.getContentSize();
		var ps = parent ? parent.getContentSize() : this.winSize;
		parent = parent ? parent : this.rootNode;
		node.setPosition((ps.width - s.width)/2, (ps.height - s.height)/2);

		var pt = (positionType ? positionType : this.PositionType.Center);
		if (positionType) this.resetLayer(node, positionType, offset, true);

		if (isExcludedTouch) {
			var layer = cc.LayerColor.create(cc.color(0,0,0,0), this.winSize.width, this.winSize.height);
			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: function(touches, event){
					return true;
				}
			}, layer);
			layer.addChild(node);
			layer.controller = node.controller;
			if (node.controller) node.controller.lyMask = layer;
			layer.setOpacity(0);
			if (this.defalutMaskAlpha > 0 && isExcludedTouch.alpha !== 0) {
				layer.runAction(cc.FadeTo.create(0.1, (isExcludedTouch.alpha ? isExcludedTouch.alpha : this.defalutMaskAlpha)));
			}

			node = layer;
		}

		this.layers.push(node);
		parent.addChild(node);

		return node;
	},

	/**
	 *
	 * @param {cc.Node} node
	 * @param {vee.PopMgr.PositionType} positionType
	 * @param {cc.Point} offset 与指定position的 offset
	 * @param {boolean} isShown 如果 node 是在 onDidLoadedFromCCB || onCreate() (parentNode 未添加到 scene 上面的时候) 添加设置 false
	 */
	resetLayer : function(node, positionType, offset, isShown) {
		if (isShown === undefined) isShown = true;
		var parent = node.getParent() || this.rootNode;
		var size = node.getContentSize();
		var anchor = node.getAnchorPoint();
		var parentSize = parent.getContentSize();
		var parentOffset = parent.convertToWorldSpace(cc.p(0,0));
		if (isShown) parentOffset = cc.pSub(parentOffset, this.originOffset);
		var pt = (positionType ? positionType : this.PositionType.Center);
		var nodeOffset = cc.p((anchor.x - pt.x) * size.width, (anchor.y - pt.y) * size.height);

		var pos = cc.p(this.winSize.width * pt.x, this.winSize.height * pt.y);
		pos = vee.Utils.pSub(pos, parentOffset);
		pos = vee.Utils.pAdd(pos, nodeOffset);
		offset = offset || {x:0, y:0};
		pos = vee.Utils.pAdd(pos, offset);
		node.setPosition(pos);
	},

	/**
	 * 调用这个方法 node 必须已经加载在页面上 （onLoaded)
	 * @param {cc.Node} node
	 * @param {vee.PopMgr.PositionType} positionType, 默认居中
	 * @param {cc.Point} offset 与指定position的 offset
	 */
	setNodePos : function(node, positionType, offset) {
		var winSize = cc.p(this.winSize.width, this.winSize.height);
		var pt = (positionType ? positionType : this.PositionType.Center);
		var screenPos = vee.Utils.pMult(pt, winSize);
		if (offset) screenPos = vee.Utils.pAdd(screenPos, offset);
		var pos = node.getParent().convertToNodeSpace(screenPos);
		var anchor = node.getAnchorPoint();
		var size = node.getContentSize();
		var nodeOffset = cc.p((anchor.x - pt.x) * size.width, (anchor.y - pt.y) * size.height);
		node.setPosition(vee.Utils.pAdd(pos, nodeOffset));
	},

	/**
	 * 关闭最上面的 n 个层， 默认关闭 1 个
	 * @param {Number} count
	 */
	closeLayer : function(count){
		count = count || 1;
		count = Math.min(count, this.layers.length);
		while(count){
			count--;
			var layer = this.layers.pop();
			var ctl = layer.controller;
			if (ctl && _.isFunction(ctl.onClosed)) ctl.onClosed();
			if (layer == this.loading) this.loading = null;
			layer.removeFromParent();
		}
	},

    closeLayerByCtl: function(ctl){
        var layers = this.layers.slice();
        for (var i = 0; i < layers.length; i++){
            var node = layers[i];
            if (node.controller === ctl) {
                this.layers.splice(i, 1);
                vee.Utils.callFunction(ctl.onClosed.call(ctl));
                if (node == this.loading) this.loading = null;
                node.removeFromParent();
            }
        }
    },

	closeAll : function(){
		this.scheduler.removeAllChildren();
		this.closeLayer(999);
	},

	resetScene : function(sceneSize, usePhysics){
		if(this.currentScene) {
			//this.closeAll();
			this.currentScene.removeAllChildren();
		}
		this.layers = [];
		vee.Director = cc.director;
		var sSize = (sceneSize ? sceneSize : cc.size(768, 1136));
		this.winSize = vee.Director.getWinSize();
		this.originOffset = cc.p((sSize.width - this.winSize.width)/2, (sSize.height - this.winSize.height)/2);
		var scene;
		if (usePhysics) {
			scene = cc.Scene.createWithPhysics();
//			var world = scene.getPhysicsWorld();
		} else {
			scene = cc.Scene.create();
		}

		var root = cc.Node.create();
		var rNode = cc.LayerColor.create(cc.color(0,0,0,150), this.winSize.width, this.winSize.height);
		var sNode = cc.Node.create();
		rNode.addChild(sNode);
		root.addChild(rNode);
		scene.addChild(root);
		this.rootNode = rNode;
		this.scheduler = sNode;
		this._root = root;
		vee.Director.runScene(scene);

		this.currentScene = scene;

	},

	autoGarbageCollect : function(time) {
		if (!time) time = 5;
		cc.sys.garbageCollect();
		if (!this.currentScene) return;
		vee.Utils.unscheduleAllCallbacksForTarget(this.currentScene);
		vee.Utils.scheduleCallbackForTarget(this.currentScene, function() {
			cc.sys.garbageCollect();
		}, time);
	},

	stopGarbageCollect : function() {
		if (!this.currentScene) return;
		vee.Utils.unscheduleAllCallbacksForTarget(this.currentScene);
	},

	pause : function(node) {
		var pauseNode = (node ? node : this._root)
		if (!pauseNode) return;
		this._pauseNode(pauseNode, true);
	},

	_pauseNode : function(node, recursive) {
//		node.pause();
		if (recursive) {
			var children = node.getChildren();
			for (var i in children){
				this._pauseNode(children[i], true);
			}
		} else node.pause();
	},

	resume : function() {
		if (!this._root) return;
		this._resumeNode(this._root, false);
		this._resumeNode(this.scheduler, true);
		this._root.scheduleOnce(function(){
			this._resumeNode(this.rootNode, true);
		}.bind(this),0.2);
	},

	_resumeNode : function(node, recursive) {
		node.resume();
		if (recursive) {
			var children = node.getChildren();
			for (var i in children){
				this._resumeNode(children[i], true);
			}
		}
	},

	/**
	 *
	 * @param {String} content 文字内容
	 * @param {String} title 标题，默认不显示标题
	 * @param {Function} onConfirm 确定回调
	 * @param {Function/boolean} onClose 可以传 bool 控制是否有关闭按钮，或者直接传 关闭回调 打开关闭按钮
	 * @param {String} btnText 按钮上的文字
	 */
	alert : function(content, title, onConfirm, onClose, btnText){
		if (!VeeAlertbox.shared) {
			vee.PopMgr.popCCB("res/vAlertbox.ccbi", true);
		} else {
        }
		var ctl = VeeAlertbox.shared;
		ctl.setContent(content, title);
		ctl.setBtnText(btnText);
		ctl.setConfirmCallback(onConfirm);
		if (onConfirm && onClose == undefined) {
			ctl.setCloseEnabled(true);
		} else {
			ctl.setCloseEnabled(onConfirm && (onClose === false ? false : true));
			if (onClose) ctl.setCloseCallback(onClose);
		}
		return ctl;
	},

	popLoading : function(callback) {
		if (this.loading) {
			return;
		} else {
			this.loading = this.popCCB("res/vLoading.ccbi", true);
			if (callback) this.loading.controller.setCloseCallback(callback);
		}
	},

	setIsNotShowLyMask : function(isShow){
		this.isNotShowLyMask = isShow;
	}
};

var VeeAlertbox = vee.Class.extend({

	_onConfirmCallback : null,
	_onCloseCallback : null,
	_autoClose : true,

	onCreate : function(){
		this._autoClose = true;
		VeeAlertbox.shared = this;
		this.handleKey(true);
		this.onConfirm = this.onClose;
		this._onClose = this.onClose;
		this.setCloseEnabled(false);
	},

	setAutoClose : function(v){
		this._autoClose = v;
	},

	onConfirm : function(){
		VeeAlertbox.shared = null;
		if (this._autoClose) vee.PopMgr.closeLayer();
		if (this._onConfirmCallback) this._onConfirmCallback(this);
	},

	onClose : function(){
		VeeAlertbox.shared = null;
		if (this._autoClose) vee.PopMgr.closeLayer();
		if (_.isFunction(this._onCloseCallback)) this._onCloseCallback(this);
	},

    onKeyBack: function(){
        this.onClose();
        return true;
    },

	setCloseEnabled : function(v){
		this.btnClose.setVisible(v);
		this.btnClose.setEnabled(v);
	},

	setContent : function(content, title) {
		if (!content) content = "";
		if (!title) title = "";
		this.lbContent.setString(content);
		this.lbContent.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
		this.lbContent.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		this.lbTitle.setString(title);
	},

	setBtnText : function(btnText) {
		if (btnText) {
			this.btnConfirm.setTitleForState(btnText, cc.CONTROL_STATE_NORMAL);
			this.btnConfirm.setTitleForState(btnText, cc.CONTROL_STATE_DISABLED);
		}
	},

	setConfirmCallback : function(callback){
		this._onConfirmCallback = callback;
	},

	setCloseCallback : function(callback){
		this._onCloseCallback = callback;
	}

});

/** @type {VeeAlertbox} */
VeeAlertbox.shared = null;

var VeeLoading = vee.Class.extend({
	_closeCallback : null,
	btnClose : null,

	onLoaded : function() {
        this.handleKey(true);
        if (this.btnClose) {
            this.btnClose.setVisible(false);
            vee.PopMgr.resetLayer(this.btnClose, vee.PopMgr.PositionType.TopRight, cc.p(-100, -100));
        }
	},

	setMaskVisible : function(v){
		if (this.lyMask) {
			this.lyMask.setVisible(v);
		}
	},

	setCloseCallback : function(callback) {
		this._closeCallback = callback;
		if (this.btnClose) this.btnClose.setVisible(true);
	},

	onClose : function() {
		vee.PopMgr.closeLayerByCtl(this);
		if (_.isFunction(this._closeCallback)) this._closeCallback();
	},

    onKeyBack: function(){
        return true;
    }
});
