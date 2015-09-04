/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 14-2-12
 * Time: 上午3:28
 * To change this template use File | Settings | File Templates.
 */

var vee = vee = vee ||{};

vee.Direction = {
	Origin : 0,
	TopLeft : 1,
	Top : 2,
	TopRight : 3,
	Right : 4,
	BottomRight : 5,
	Bottom : 6,
	BottomLeft : 7,
	Left : 8,

	direction2Point : function( dir ) {
		switch(dir) {
			case this.TopLeft :
				return cc.p(-1,-1);
			case this.Top :
				return cc.p(0,-1);
			case this.TopRight :
				return cc.p(1,-1);
			case this.Right :
				return cc.p(1,0);
			case this.BottomRight :
				return cc.p(1,1);
			case this.Bottom :
				return cc.p(0,1);
			case this.BottomLeft :
				return cc.p(-1,1);
			case this.Left :
				return cc.p(-1,0);
			default :
				return cc.p(0,0);
		}
	},

	direction2String : function( dir ) {
		switch(dir) {
			case this.TopLeft :
				return "TopLeft";
			case this.Top :
				return "Top";
			case this.TopRight :
				return "TopRight";
			case this.Right :
				return "Right";
			case this.BottomRight :
				return "BottomRight";
			case this.Bottom :
				return "Bottom";
			case this.BottomLeft :
				return "BottomLeft";
			case this.Left :
				return "Left";
			default :
				return "Origin";
		}
	},

	/**
	 *
	 * @param {Float} angle
	 * @param {bool} only4Direction
	 * @returns {vee.Direction}
	 */
	getDirectionByAngle : function( angle, only4Direction) {
		var dir = (Math.floor((Math.floor(angle + (only4Direction ? 45 : 22.5))%360)/( only4Direction ? 90 : 45)) + 1) * (only4Direction ? 2 : 1);
		return (only4Direction ? dir : this.getDirectionClockwise(dir));
	},

	/**
	 * @param {vee.Direction} dir
	 * @param {bool} only4Direction
	 * @returns {vee.Direction}
	 */
	getDirectionClockwise : function( dir , only4Direction) {
		dir += 1 + (only4Direction ? 1 : 0);
		if (dir > this.Left ) dir = (only4Direction ? this.Top : this.TopLeft);
		return dir;
	},

	/**
	 * @param {vee.Direction} dir
	 * @param {bool}} only4Direction
	 * @returns {vee.Direction}
	 */
	getDirectionCounterClockwise : function( dir , only4Direction) {
		dir -= 1 + (only4Direction ? 1 : 0);
		if (dir < (only4Direction ? this.Top : this.TopLeft) ) dir = this.Left;
		return dir;
	},

	/**
	 * @param {bool} escapeOrigin
	 * @param {bool}} only4Direction
	 * @returns {vee.Direction}
	 */
	getRandomDirection : function( escapeOrigin , only4Direction) {
		var max = (only4Direction ? this.Left/2.0 : this.Left) + (escapeOrigin ? 0 : 1);
		var ret = Math.floor(cc.RANDOM_0_1()*1000) % max + (escapeOrigin ? 1 : 0);
		return only4Direction ? ret*2 : ret;
	},

	revert : function(dir){
		// rotate 180° to get a revert direction
		dir = this.getDirectionClockwise(dir);
		dir = this.getDirectionClockwise(dir);
		dir = this.getDirectionClockwise(dir);
		dir = this.getDirectionClockwise(dir);
		return dir;
	},

	isHorizontal : function(dir) {
		return (dir == this.Left || dir == this.Right);
	},

	isVertical : function(dir) {
		return (dir == this.Top || dir == this.Bottom);
	}
};

vee.Map = cc.Class.extend({
	/**
	 * @type Array
	 */
	_objs : null,

	/**
	 *
	 * @param obj {Object}
	 * @param p {cc.Point}
	 */
	setObject : function(obj, p){
		if (p === null || p === undefined) return;
		var idx = p;
		if (_.isObject(p)) idx = this.grid2Index(p);
		if(idx >= 0) this._objs[idx] = obj;
	},

	/**
	 *
	 * @param p {cc.Point|Number}
	 * @returns {Object}
	 */
	getObject : function(p){
		if (p === null || p === undefined) return null;
		var idx = p;
		if (_.isObject(p)) idx = this.grid2Index(p);
		if(idx >= 0) return this._objs[idx];
		else return null;
	},

	/**
	 * @param p {cc.Point|Number}
	 */
	removeObject : function(p){
		this.setObject(null, p);
	},

	getObjects : function(){
		return this._objs;
	},

	forEachObjects : function(callback) {
		for (var i in this._objs) {
			if (this._objs[i] !== null)
				callback(this._objs[i]);
		}
	},

	removeAllObjects : function(){
		this._objs = [];
	},

	/**
	 * @type cc.Point
	 */
	baseLocation : {x:0, y:0},

	/**
	 * @type cc.Size
	 */
	tileSize : {width:0, height:0},

	/**
	 * @type cc.Size
	 */
	mapSize : {width:10, height: 10},

	contentSize : {width:0, height: 0},

	getContentSize : function(){ return cc.size(this.contentSize.width, this.contentSize.height); },

	length : 0,
	/**
	 * @param {cc.size} size
	 */
	setMapSize : function(size) {
		this.mapSize = size;
		this.contentSize.width = this.mapSize.width*this.tileSize.width;
		this.contentSize.height = this.mapSize.height*this.tileSize.height;
		this.length = size.width * size.height;
	},

	/**
	 * @param {cc.Size} size
	 */
	setTileSize : function(size) {
		this.tileSize = size;
		this.contentSize.width = this.mapSize.width*this.tileSize.width;
		this.contentSize.height = this.mapSize.height*this.tileSize.height;
	},

	/**
	 * @param {cc.Point} p
	 */
	setPosition : function(p) {
		this.baseLocation = p;
	},
	getPosition : function() { return cc.p(this.baseLocation.x, this.baseLocation.y); },

	/**
	 * @param {cc.Point} p
	 */
	position2Grid : function(p){
		var gridX = Math.floor((p.x - this.baseLocation.x)/this.tileSize.width);
		var gridY = this.mapSize.height - Math.floor((p.y - this.baseLocation.y)/this.tileSize.height) - 1;
		if(gridX < 0 || gridY < 0 || gridX >= this.mapSize.width || gridY >= this.mapSize.height) {
//			vee.Utils.logObj(cc.p(gridX,gridY), "Bad position2Grid");
			return null;
		}
		return cc.p(gridX,gridY);
	},

	/**
	 * @param {cc.Point} p
	 */
	mapPosition2Grid : function(p){
		var gridX = Math.floor(p.x/this.tileSize.width);
		var gridY = this.mapSize.height - Math.floor(p.y/this.tileSize.height) - 1;
		if(gridX < 0 || gridY < 0 || gridX >= this.mapSize.width || gridY >= this.mapSize.height) return null;
		return cc.p(gridX,gridY);
	},

	/**
	 * @param {cc.Point} p
	 * @param {vee.Direction} dir
	 */
	gridByDirection : function(p, dir) {
		return this.lawGrid(cc.pAdd(p, vee.Direction.direction2Point(dir)));
	},

	/**
	 * @param {cc.Point} p
	 */
	grid2Index : function(p){
		if(!this.lawGrid(p)) return -1;
		return p.x + p.y*this.mapSize.width;
	},

	/**
	 * @param {Number} idx
	 */
	index2Grid : function(idx){
		return cc.p(idx%this.mapSize.width, Math.floor(idx/this.mapSize.width));
	},

	/**
	 * @param {cc.Point} p
	 */
	grid2Position : function(p){
		return cc.p(this.baseLocation.x + (p.x + 0.5)*this.tileSize.width, this.baseLocation.y + (this.mapSize.height - p.y - 0.5)*this.tileSize.height);
	},

	/**
	 * @param {cc.Point} p
	 */
	grid2PositionInMap : function(p){
		return cc.p((p.x + 0.5)*this.tileSize.width, (this.mapSize.height - p.y - 0.5)*this.tileSize.height);
	},

	/**
	 * @param {cc.Point} p
	 */
	forceLawGrid : function(p){
		var x = Math.max(0,Math.min(this.mapSize.width-1, p.x));
		var y = Math.max(0,Math.min(this.mapSize.height-1, p.y));
		return cc.p(x,y);
	},

	/**
	 * @param {cc.Point} p
	 */
	lawGrid : function(p) {
		if (!p) return null;
		if (p.x < 0 || p.y < 0 || p.x >= this.mapSize.width || p.y >= this.mapSize.height) {
//			vee.Utils.logObj(p, "Bad lawGrid");
			return null;
		}
		return p;
	}
});

/**
 * @param {cc.Size} mapSize
 * @param {cc.Size} tileSize
 * @returns {vee.Map}
 */
vee.Map.create = function(mapSize, tileSize) {
	var map = new vee.Map();
	if (mapSize) map.setMapSize(mapSize);
	if (tileSize) map.setTileSize(tileSize);
	map._objs = [];
	return map;
};