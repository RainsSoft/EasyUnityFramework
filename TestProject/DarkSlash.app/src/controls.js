/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 14-3-12
 * Time: 下午3:37
 * To change this template use File | Settings | File Templates.
 */

var vee = vee = vee || {};

vee.Controls = {
	wrap2ScrollView : function(node, size){
		var parent = node.getParent();
		var size;
		node.retain();
		if (parent) node.removeFromParent();
		if (!size || size.width == 0 || size.height == 0) {
			if (parent) {
				size = parent.getContentSize();
			} else size = vee.PopMgr.winSize;
		}
		var scv = cc.ScrollView.create(size, node);
//		scv.setPosition(node.getPosition());
		if (parent) {
			parent.addChild(scv);
		}
		node.release();
		return scv;
	}
}

var VeeMusicButton = cc.Class.extend({
	/** @type {cc.ControlButton} */
	/** @expose */
	btnChange : null,

	onDidLoadFromCCB : function(){
		this.btnChange.setSelected(vee.Audio.musicEnabled);
	},

	/** @expose */
	onChange : function(){
		var a = vee.Audio;
		a.setMusicEnabled(!a.musicEnabled);
		this.btnChange.setSelected(a.musicEnabled);
		a.onEvent("button");
	}
});
cc.BuilderReader.registerController("VeeMusicButton", VeeMusicButton);


var VeeSoundButton = cc.Class.extend({
	/** @type {cc.ControlButton} */
	/** @expose */
	btnChange : null,

	onDidLoadFromCCB : function(){
		this.btnChange.setSelected(vee.Audio.soundEnabled);
	},

	/** @expose */
	onChange : function(){
		var a = vee.Audio;
		a.setSoundEnabled(!a.soundEnabled);
		this.btnChange.setSelected(a.soundEnabled);
		a.onEvent("button");
	}
});
cc.BuilderReader.registerController("VeeSoundButton", VeeSoundButton);

var VeeProgress = cc.Class.extend({
	/** @type {cc.Node} */
	/** @expose */
	lyBG : null,

	/** @type {cc.Node} */
	/** @expose */
	lyProgress : null,

	/** @type {cc.Node} */
	/** @expose */
	lyProgressContent : null,

	/** @type {cc.Node} */
	/** @expose */
	lySurface : null,

	/** @type {cc.Sprite} */
	/** @expose */
	lyHeader : null,

	/** @type {cc.size} */
	size : null,

	progress : 0,
	maxValue : 100,
	_beforeCallback : null,
	_callback : null,
	_isRuning : false,
	_runOutDuration : 1,
	_easeEffect : true,
	_isVertical : false,

	onDidLoadFromCCB : function() {
		var isVertical = (this.rootNode.getTag() > 0);
		this._isVertical = isVertical;

		this.size = this.rootNode.getContentSize();
		this.lyHeader.setPositionX(this.size.width);
		this.lyProgress.retain();
		this.lyProgress.removeFromParent();
		var scv = cc.ScrollView.create(this.size, this.lyProgress);
		scv.setClippingToBounds(true);
		scv.setTouchEnabled(false);
		this.lyProgressContent.addChild(scv);
		this.lyProgress.release();
	},

	setIsVertical : function(v){
		this._isVertical = v;
	},

	getProgress : function(){
		return this.progress;
	},

	getValue : function(){
		return this.maxValue * this.progress;
	},

	getMaxValue : function(){
		return this.maxValue;
	},

	/**
	 * @param {Number} pass 2.0 for double speed and 0.5 for half speed
	 */
	setRunOutSpeed : function(speed){
		this._runOutDuration = speed;
	},

    setEaseEffectEnabled: function(bool){
        this._easeEffect = bool;
    },

	/**
	 * @param {Number} defaultProgress
	 * @param {Number} maxValue
	 * @param {Function} didValueChange
	 */
	reset : function(defaultProgress, maxValue, beforeValueChanged, onValueChanged) {
		this.progress = defaultProgress;
		this.maxValue = maxValue;
		this._beforeCallback = beforeValueChanged;
		this._callback = onValueChanged;
		this.updateProgress();
	},

	/**
	 * @param {Float} percentage
	 * @param {BOOL} animate
	 */
	setProgress : function(percentage, animate) {
		if (percentage == this.percent) return;
		if (percentage < 0) percentage = 0;
		else if (percentage > 1) percentage = 1;
		if (this._isRuning) this.onValueChanged();
		this.progress = percentage;
		this.updateProgress(animate);
	},

	setValue : function(value, animate){
		this.progress = value/this.maxValue;
		this.lyProgress.stopAllActions();
		this.lyHeader.stopAllActions();
		this.setProgress(this.progress, animate);
	},

	getPositionXOfValue : function(v) {
		return this.getPositionXOfProgress(v/this.maxValue)
	},

	getPositionYOfValue : function(v) {
		return this.getPositionYOfProgress(v/this.maxValue)
	},

	getPositionXOfProgress : function(pro) {
		return this.size.width*(pro);
	},

	getPositionYOfProgress : function(pro) {
		return this.size.height*(pro);
	},

	updateProgress : function(animate) {
		if (this._beforeCallback) this._beforeCallback(this);
		if (this._isVertical) this._updateProgressVertical(animate);
		else this._updateProgressHorizontal(animate);
	},

	_updateProgressHorizontal : function(animate) {
		var progressX = this.size.width*(this.progress-1);
		var headerX = this.size.width + progressX;
		if (animate) {
			var oldX = this.lyProgress.getPositionX();
			var adjust = 0;
			if (this._easeEffect) adjust = 0.3;
			var duration = ((Math.abs(oldX-progressX)/this.size.width) + adjust) * this._runOutDuration;
			if (duration > this._runOutDuration) duration = this._runOutDuration;
			this._isRuning = true;
			var move = cc.MoveTo.create(duration, cc.p(progressX, 0));
			var ease = move;
			if (this._easeEffect) {
				ease = cc.EaseExponentialOut.create(move);
			}
			var callback = cc.CallFunc.create(this.onValueChanged, this);
			this.lyProgress.runAction(cc.Sequence.create(ease, callback));

			var move2 = cc.MoveTo.create(duration, cc.p(headerX, 0));
            var ease2 = move2;
            if (this._easeEffect) {
                ease2= cc.EaseExponentialOut.create(move2);
            }
			this.lyHeader.runAction(ease2);
		} else {
			this.lyProgress.setPositionX(progressX);
			this.lyHeader.setPositionX(headerX);
			this.onValueChanged();
		}
	},

	_updateProgressVertical : function(animate) {
		var progressY = this.size.height*(this.progress-1);
		var headerY = this.size.width + progressY;
		if (animate) {
			var oldY = this.lyProgress.getPositionY();
			var adjust = 0;
			if (this._easeEffect) adjust = 0.3;
			var duration = ((Math.abs(oldY-progressY)/this.size.height) + adjust) * this._runOutDuration;
			if (duration > this._runOutDuration) duration = this._runOutDuration;
			this._isRuning = true;
			var move = cc.MoveTo.create(duration, cc.p(0, progressY));
			var ease = move;
			if (this._easeEffect) {
				ease = cc.EaseExponentialOut.create(move);
			}
			var callback = cc.CallFunc.create(this.onValueChanged, this);
			this.lyProgress.runAction(cc.Sequence.create(ease, callback));

			var move2 = cc.MoveTo.create(duration, cc.p(0, headerY));
			var ease2 = cc.EaseExponentialOut.create(move2);
			this.lyHeader.runAction(ease2);
		} else {
			this.lyProgress.setPositionY(progressY);
			this.lyHeader.setPositionY(headerY);
			this.onValueChanged();
		}
	},

	onValueChanged : function(){
		if (this._callback) this._callback(this);
		this._isRuning = false;
	}
});
cc.BuilderReader.registerController("VeeProgress", VeeProgress);

/**
 * @param {VeeProgress} sender
 */
VeeProgress.onValueChanged = function(sender) {}

var VeeRateButton = vee.Class.extend({
	/** @expose */
	onRate : function(){
		vee.Utils.rate();
	}
});
cc.BuilderReader.registerController("VeeRateButton", VeeRateButton);

var VeeTableViewController = vee.Class.extend({
	_cellSize : null,
	_cellNum : 0,
	_cellCCB : null,
	_isUseDifferentCCB : false,
	_dataSource : null,
	_cellSizeArr : null,

	setCellNumber : function(num){
		this._cellNum = num;
	},

	setCellCCB : function(ccb){
		this._cellCCB = ccb;
		this._isUseDifferentCCB = _.isArray(ccb);
		var cell = this._isUseDifferentCCB ? ccb[ccb.length-1] : ccb;
		var node = cc.BuilderReader.load(cell);
		this._cellSize = node.getContentSize();
		if (this._isUseDifferentCCB) {
			this._cellSizeArr = [];
			this._cellSizeArr[ccb.length-1] = this._cellSize;
		}
	},

	setDataSource : function(data){
		this._dataSource = data;
	},

	//table datasource delegate
	cellSizeForTable : function(table){
		return this._cellSize;
	},

	_updateCellSize : function(idx){
		if (this._cellCCB[idx] && !this._cellSizeArr[idx]){
			var node = cc.BuilderReader.load(this._cellCCB[idx]);
			var size = node.getContentSize();
			this._cellSizeArr[idx] = cc.size(size.width, size.height);
		}
	},

	tableCellSizeForIndex : function(table, index){
		if (this._isUseDifferentCCB) {
			var idx = this._cellNum - index - 1;
			this._updateCellSize(idx+1);
			this._updateCellSize(idx-1);
			return this._cellSizeArr[idx];
		} else return this._cellSize;
	},

	numberOfCellsInTableView : function(){
		return this._cellNum;
	},

	/**
	 * @param {cc.TableView} table
	 * @param index
	 * @returns {cc.TableCellView}
	 */
	tableCellAtIndex : function(table, index){
		var cell = table.dequeueCell();
		if (!cell) cell = new cc.TableViewCell();

		/** @type {VeeTableCellController} */
		var ctlCell;
		var idx = this._cellNum - index - 1;
		var mapCell = cell.getChildren()[0];
		if (!mapCell || this._isUseDifferentCCB) {
			cell.removeAllChildren();
			var ccb = this._isUseDifferentCCB ? this._cellCCB[idx] : this._cellCCB;
			var mapCell = cc.BuilderReader.load(ccb);
			cell.addChild(mapCell);
		}
		ctlCell = mapCell.controller;
		if (_.isFunction(ctlCell._updateIndex)) ctlCell._updateIndex(idx, this._dataSource);
		return cell;
	},

	/**
	 * @param {cc.TableView} table
	 * @param {cc.TableViewCell} cell
	 */
	tableCellTouched : function(table, cell){
		var mapCell = cell.getChildren()[0];
		/** @type {VeeTableCellController} */
		var ctlCell = mapCell.controller;
		if (_.isFunction(ctlCell.touched)) ctlCell.touched(table);
	},

	tableCellHighlight:function(table, cell){
		var mapCell = cell.getChildren()[0];
		/** @type {VeeTableCellController} */
		var ctlCell = mapCell.controller;
		if (_.isFunction(ctlCell.touched2)) ctlCell.touched2(table);
	}
});
cc.BuilderReader.registerController("VeeTableViewController", VeeTableViewController);


/**
 * @param contentSize // tableview 的尺寸
 * @param cellCCB // cell CCB 的 名字，可以传一个数组让不同的 cell 读取 不同的 CCB,
 *                   CCB 的 class 要继承 VeeTableCellController
 * @param cellCount // cell 的 数量, 如果 cellCCB 是一个数组，则 这个参数无效，以 cellCCB 的 length 为准
 * @param dataSource // cell 的 数据源，作为参数被传递到 cell 的 updateIndex 方法
 * @returns {cc.TableView}
 */
VeeTableViewController.createTableView = function(contentSize, cellCCB, cellCount, dataSource){
	var ctl = new VeeTableViewController();
	ctl.setCellCCB(cellCCB);
	if (_.isArray(cellCCB)) ctl.setCellNumber(cellCCB.length);
	else ctl.setCellNumber(cellCount);
	ctl.setDataSource(dataSource);
	var table = cc.TableView.create(ctl, contentSize);
	table.controller = ctl;
	table.setDelegate(ctl);
	return table;
}

var VeeTableCellController = vee.Class.extend({
	_idx : 0,

	getIdx : function(){ return this._idx; },

	_updateIndex : function(idx, dataSource){
		this._idx = idx;
		this.updateIndex(idx, dataSource);
	},

	updateIndex : function(idx, dataSource){
		//var data = dataSource.getData(idx);
		//this.lbTitle.setString(data.name);
	},

	touched : function(table){
		//handle touch event here
	},

	touched2 : function(table){
		//handle touch event here
	}
});
cc.BuilderReader.registerController("VeeTableCellController", VeeTableCellController);

var VeeNotification = vee.Class.extend({
	_autoHide : false,
	_bindingID : -1,
	/** @type {cc.LabelTTF} */
	lbNotice : null,

	onCreate : function(){
		this._autoHide = true;
		this._bindingID = null;
	},

	onExit : function(){
		if (this._bindingID) vee.VIPValues.releaseBinding(this._bindingID);
	},

	setAutoHide : function(value){
		this._autoHide = value;
		this.updateValue();
	},

	_formatFunction : null,
	setFormatFunction : function(func){
		this._formatFunction = func;
	},

	updateValue : function(key, value){
		if (value == undefined) {
			value = vee.VIPValues.getValue(key);
		}
		var str = (this._formatFunction ? this._formatFunction(value) : ''+value);
		this.lbNotice.setString(str);
		if (!value && this._autoHide){
			this.rootNode.setVisible(false);
		} else this.rootNode.setVisible(true);
	},

	reset : function(vipValueKey){
		this._bindingID = vee.VIPValues.bind2Value(vipValueKey, function(key, value){
			this.updateValue(key, value);
		}.bind(this));
		this.updateValue(vipValueKey);
	}
});
cc.BuilderReader.registerController("VeeNotification", VeeNotification);
