var vee = vee = vee || {}

vee.Class = cc.Class.extend({
	_rootNode_onEnter : null,
	_rootNode_onExit : null,
    onDidLoadFromCCB: function(){
	    this._rootNode_onEnter = this.rootNode.onEnter;
	    this._rootNode_onExit = this.rootNode.onExit;
	    this.rootNode.onEnter = this._onEnter.bind(this);
	    this.rootNode.onExit = this._onExit.bind(this);
	    this.rootNode.animationManager.setCompletedAnimationCallback(this._animationCompleted.bind(this));
	    this.onCreate();
    },

	onCreate : function(){
	},

	/**
	 * 只有在 vee.PopMgr.PopCCB 弹出的页面才会执行 onLoaded 方法 和 onClosed 方法
	 */
	/** @expose */
	onLoaded : function(){},
	onClosed : function(){},

	/**
	 * To be implemented.
	 */
	onExit : function(){},
	onEnter : function(){},

	_onEnter : function(){
		this._rootNode_onEnter.call(this.rootNode);
		this.onEnter();
	},

    _onExit: function(){
	    this.onExit();
	    this.handleKey(false);
	    this.rootNode.animationManager.setCompletedAnimationCallback(function(){});
	    this._rootNode_onExit.call(this.rootNode);
    },

	_isAnimating : false,
	isAnimating : function(){
		return this._isAnimating;
	},

	_animationName : null,
	getLastAnimationName : function(){
		return this._animationName;
	},

	_animationCompleted : function(){
		this._isAnimating = false;
		if (this._animationCallback) this._animationCallback();
	},

	_animationCallback : null,
	/**
	 * @param {String} name
	 * @param {Function} callback
	 * @param {bool} forceReset 是否自动重置动画属性，默认是true
	 */
	playAnimate : function(name, callback, forceReset, delayTime) {
//		cc.log("playAnimate:\t"+name);
		if (forceReset === undefined) forceReset = true;
		if (delayTime === undefined) delayTime = 0;
		this._animationCallback = callback;
		this._isAnimating = true;
		this._animationName = name;
		this.rootNode.animationManager.setCompletedAnimationCallback(this, this._animationCompleted.bind(this));
		this.rootNode.animationManager.runAnimationsForSequenceNamedTweenDuration(name, delayTime, forceReset);
	},

	/**
	 * 处理 menu 按键事件，返回 false 表示不处理
	 * @returns {boolean}
	 */
	onKeyMenu : function() {
		cc.log("implement controller's onKeyMenu function to support menu key");
		return false;
	},

	/**
	 * 处理 back 按键事件，返回 false 表示不处理
	 * @returns {boolean}
	 */
	onKeyBack : function() {
		cc.log("implement controller's onKeyBack function to support back key");
		return false;
	},

	onKeyPressed : function(keyCode){
		return false;
	},

	_keyListener : null,
	handleKey : function(enabled) {
        var _this = this;
		if (!enabled && this._keyListener) {
            cc.eventManager.removeListener(this._keyListener);
            this._keyListener = null;
		}
		else {
			if (this._keyListener) this.handleKey(false);
			this._keyListener = cc.EventListener.create({
				event : cc.EventListener.KEYBOARD,
				onKeyReleased : function(keyCode, event) {
                    var stopPropagation = false;
					if (keyCode == cc.KEY.back) {
						stopPropagation = _this.onKeyBack();
					} else if (keyCode == cc.KEY.menu) {
						stopPropagation = _this.onKeyMenu();
					} else {
                        stopPropagation = _this.onKeyPressed(keyCode);
                    }
                    if (stopPropagation){
                        event.stopPropagation();
                    }
                    return stopPropagation;
				}
			});

			cc.eventManager.addListener(this._keyListener, this.rootNode);
		}
	}
});