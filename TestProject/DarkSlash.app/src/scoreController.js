var vee = vee = vee || {};

vee.ScoreController = cc.Class.extend({
	/**
	 * @type {cc.LabelTTF}
	 */
	_label : null,

	/**
	 * @type {Number}
	 */
	_displayValue : 0,
	_prefix : null,
	_appendix : null,
    _formatFunction: null,

	/** @type {vee.NumberProtector} */
	_numberProtector : null,

	_invisibleWhenEmpty : false,

	_rootNode_onExit : null,

	/* for score string show with flow */
	_tempValue : 0,
	_offset : 0,
	_enableFlow : false,
	_flowDuration : 0.3,

	init : function(label, defaultValue, formatFunction) {
		this.rootNode = label;
		this._label = label;
		this._numberProtector = vee.NumberProtector.create(defaultValue);
        this._numberProtector.setValue(defaultValue);
        this._formatFunction = formatFunction;
		this._invisibleWhenEmpty = false;
        label.scoreController = this;
		this._updateValue();
	},

	initWithKey : function(label, key, formatFunction) {
		if (this._bindingID) this.onExit();
		this._label = label;
		this._formatFunction = formatFunction;
		this.bind2VIPValues(key);
		label.scoreController = this;
	},

	setEnableFlow : function(enable, flowDur) {
		this._enableFlow = enable;
		this._flowDuration = flowDur ? flowDur : this._flowDuration;
	},

	setInvisibleWhenEmpty : function(v){
		this._invisibleWhenEmpty = v;
		this._updateValue();
	},

	_bindingID : null,
	bind2VIPValues : function(key){
		var np = vee.VIPValues.getNumberProtector(key);
		if (np) {
			this._numberProtector = np;
			this._updateValue();
			this._bindingID = vee.VIPValues.bind2Value(key, function(key, value){
				this._updateValue();
			}.bind(this));
		}
		this._rootNode_onExit = this._label.onExit;
		this._label.onExit = this.onExit.bind(this);
	},

	onExit : function(){
		cc.log("scoreController onExit");
		if (this._bindingID){
			vee.VIPValues.releaseBinding(this._bindingID);
			this._bindingID = null;
		}
		this._rootNode_onExit.call(this._label);
	},

	setProtectEnabled : function(enabled) {
		this._numberProtector.setProtectEnabled(enabled);
	},

	getString : function(){
		return this._label.getString();
	},

	getNumber : function(){
		return this._numberProtector.getValue();
	},

	setNumber : function(num) {
		this._numberProtector.setValue(num);
		if (this._displayValue != num) {
			this._updateValue();
		}
	},

	addNumber : function(num) {
		this.setNumber(this._numberProtector.getValue()+num);
	},

	setDisplayFormat : function(prefix, appendix){
		this._prefix = prefix;
		this._appendix = appendix;
		this._updateValue();
	},

	_updateValue : function() {
		this._displayValue = this._numberProtector.getValue();
		if (this._enableFlow) {
			if (!this._displayValue && this._invisibleWhenEmpty) {
				str = "";
				this._label.setString(str);
			} else {
				if (this._label) {
					this._offset = parseInt((this._displayValue - this._tempValue)/(60*this._flowDuration));
					if (this._offset < 1) this._offset = 1;
					vee.Utils.scheduleCallbackForTarget(this._label, this._schValue.bind(this));
				} else {
					cc.log("ERROR vee.ScoreController: this._label is "+this._label);
				}
			}
		} else {
			var str = (this._prefix ? this._prefix : "") + vee.ScoreController.getScoreString(this._displayValue) + (this._appendix ? this._appendix : "");
			if (!this._displayValue && this._invisibleWhenEmpty) {
				str = "";
			}
			if (this._formatFunction){
				this._formatFunction(this._label, this._displayValue, str);
			} else {
				this._label.setString(str);
			}
		}
	},

	_schValue : function(dt) {
		this._tempValue += this._offset;
		if (this._tempValue >= this._displayValue) {
			this._tempValue = this._displayValue;
			this._setTempValue();
			vee.Utils.unscheduleAllCallbacksForTarget(this._label);
		} else {
			this._setTempValue();
		}
	},

	_setTempValue : function() {
		var str = (this._prefix ? this._prefix : "") + vee.ScoreController.getScoreString(this._tempValue) + (this._appendix ? this._appendix : "");
		if (this._formatFunction){
			this._formatFunction(this._label, this._tempValue, str);
		} else {
			this._label.setString(str);
		}
	}
});

/**
 * @param {cc.LabelTTF} label
 * @param {Number} defaultValue
 * @param {Function} formatFunction
 */
vee.ScoreController.registerController = function(label, defaultValue, formatFunction) {
	var ctl = new vee.ScoreController();
	ctl.init(label, defaultValue, formatFunction);
	return ctl;
}

vee.ScoreController.registerControllerWithKey = function(label, key, formatFunction) {
	var ctl = new vee.ScoreController();
	ctl.initWithKey(label, key, formatFunction);
	return ctl;
}

/**
 *
 * @param {Number} score
 * @returns {string} return string like '12,234,530'
 */
vee.ScoreController.getScoreString = function(score) {
	var test = score%1000;
	var str = '';
	while(score > 1000) {
		if (test < 10) str = ',00' + test + str;
		else if (test < 100) str = ',0' + test + str;
		else str = ',' + test + str;
		score = Math.floor(score/1000);
		test = score%1000;
	}
	str = '' + score + str;
	return str;
}