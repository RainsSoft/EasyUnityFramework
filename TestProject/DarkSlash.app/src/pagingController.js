var vee = vee = vee || {};

vee.PagingController = cc.Class.extend({
	_currGrid : null,
	/**
	 * @type {vee.Map}
	 */
	_map : null,
	/**
	 * @type {vee.PagingController.Direction}
	 */
	_horizontalEnabled : false,
	_vertivalEnabled : false,
	_canSwipe : true,
	_container : false,
	_offset : null,
	_sensitivity : 1,
	_tileDistance : 0,
	/**
	 *
	 * @param {Number} value 设置移动的灵敏度
	 */
	setSensitivity : function(value) {
		this._sensitivity = value;
	},

	/**
	 *
	 * @param {cc.Node} container
	 * @param {vee.Map} map
	 */
	init : function(container, width, height, pageSize){
		this._sensitivity = 1;
		this._container = container;
		this._horizontalEnabled = (width && width > 0);
		this._vertivalEnabled = (height && height > 0);

		if (!height) height = 1;
		if (!pageSize) pageSize = container.getContentSize();

		if (this._horizontalEnabled && this._vertivalEnabled) {
			this._tileDistance = vee.Utils.distanceBetweenPoints(cc.p(0,0), cc.p(pageSize.width, pageSize.height));
		} else if (this._horizontalEnabled) {
			this._tileDistance = pageSize.width;
		} else {
			this._tileDistance = pageSize.height;
		}


		var map = new vee.Map();
		map.setMapSize(cc.size(width, height));
		map.setTileSize(pageSize);

		var p = container.getPosition();
		var anp = container.getAnchorPoint();
		this._offset = cc.p(pageSize.width/2, pageSize.height/2);
		p.x -= pageSize.width*(width-1) + this._offset.x;
		p.y += pageSize.height*(height-1) - this._offset.y;
		map.setPosition(p);

		this._map = map;
		this._currGrid = map.position2Grid(container.getPosition());
		vee.GestureController.registerController(container, this);

		this._dragingEnabled = true;
	},

	_dragingEnabled : false,

	/**
	 *
	 * @param {BOOL} v
	 */
	setDragingEnabled : function(v) {
		this._dragingEnabled = v;
	},

	onGestureMove : function(context, offset) {
		if (!this._dragingEnabled) return;

		var p = this._container.getPosition();

		var pos = this._map.getPosition();
		var posEnd = this._map.getContentSize();
		posEnd.width += pos.x - this._offset.x;
		posEnd.height -= pos.y + this._offset.y;
		pos.x += this._offset.x;
		pos.y -= this._offset.y;

		if (this._horizontalEnabled) {
			var test = p.x + this._sensitivity*offset.x;
			if (test <= pos.x) test = pos.x;
			else if(test >= posEnd.width) test = posEnd.width;
			p.x = test;
		}
		if (this._vertivalEnabled) {
			var test = p.y + this._sensitivity*offset.y;
			if (test <= pos.y) test = pos.y;
			else if (test >= posEnd.height) test = posEnd.height;
			p.y = test;
		}

		this._container.setPosition(p);
		this._needReset = true;
	},

	/**
	 * @param {Boolean}
	 */
 	setCanSwipe : function(canSwipe) {
	    this._canSwipe = canSwipe;
    },

	/**
	 * @param {vee.GestureController} context
	 */
	onGestureSwipe : function(context, angle, distance) {
		if (!this._canSwipe) return;
		var dir = vee.Direction.getDirectionByAngle(angle, true);
		if (!(this._horizontalEnabled && this._vertivalEnabled)) {
			if (this._horizontalEnabled) {
				if (!vee.Direction.isHorizontal(dir)) dir = vee.Direction.origin;
			}
			else {
				if (!vee.Direction.isVertical(dir)) dir = vee.Direction.origin;
			}
		}
		var grid = this._map.gridByDirection(this._currGrid, dir);
		if (grid) this._setGrid(grid, true);
		else this._setGrid(this._currGrid, true);
	},

	_needReset : false,
	onGestureLeave : function() {
		if (!this._dragingEnabled) return;
		if (this._needReset) {
			this._currGrid = this._map.position2Grid(this._container.getPosition());;
			this._setGrid(this._currGrid, true);
		}
	},

	/**
	 *
	 * @param {Number} pageNum
	 * @param {Bool} animate
	 */
	setPage : function(pageNum, animate) {
		var page = this._map.length - pageNum;
		this._setGrid(this._map.index2Grid(page), animate);
	},

	_setGrid : function(grid, animate) {
		this._needReset = false;
		this._container.stopAllActions();
		var p = this._map.grid2Position(grid);
		if (animate) {
			var distance = vee.Utils.distanceBetweenPoints(p, this._container.getPosition());
			var duration = 0.2*distance/this._tileDistance;
			var action = cc.MoveTo.create(duration, p);
			var ease = cc.EaseExponentialOut.create(action);
			this._container.runAction(action);
		} else {
			this._container.setPosition(p);
		}
		this._currGrid = grid;
		if (_.isFunction(this._onPageChanged)){
			var pageNum = this._map.length - this._map.grid2Index(grid);
			this._onPageChanged(this, pageNum);
		}
	},

	_onPageChanged : null,
	/**
	 * @param callback {Function}
	 */
	setPageChanged : function(callback) {
		this._onPageChanged = callback;
	}

});

/**
 *
 * @param {cc.Layer} container
 * @param {Number} width
 * @param {Number} height
 * @param {cc.Size} pageSize
 */
vee.PagingController.registerController = function(container, width, height, pageSize){
	var ctl = new vee.PagingController();
	ctl.init(container, width, height, pageSize);
	container.pagingController = ctl;
	return ctl;
};


