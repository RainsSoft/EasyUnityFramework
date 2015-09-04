/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 14-8-7
 * Time: 下午5:46
 * To change this template use File | Settings | File Templates.
 */


vee.NumberProtector = cc.Class.extend({
	_protect : 0,
	_secret : 0,
	_value : 0,
	_isInProtected : false,
	_callback : null,
	_default : 0,

	setDefaultValue : function(v){
		this._secret = vee.NumberProtector.SecretNum + vee.Utils.randomInt(0,999);
		this._default = v;
		this._isInProtected = true;
		this._protect = this._secret - v;
	},

	setProtectEnabled : function(enabled){
		this._isInProtected = enabled;
		if (enabled) {
			this._protect = this._secret - this._value;
		}
	},

	setValue : function(v){
		if(!_.isNumber(v)){
			cc.log("Error!! 传入 NumberProtector 的值必须为数值，不能为:\t"+v);
		}
		if(this._isValidate()){
			this._value = v;
		}
		if (this._isInProtected) this._protect = this._secret - this._value;
	},

	getValue : function(){
		if (this._isValidate()) return this._value;
		else return this._default;
	},

	addValue : function(v){
		this.setValue(v+this._value);
	},

	setAbnormalCallback : function(callback, override){
		if (override) this._callback = callback;
		else this._afterAbnormal = callback;
	},

	_afterAbnormal : function(){},
	_onAbnormal : function(){
		vee.PopMgr.alert(vee.Utils.getStringByLanguage("Abnormal data operation detected!", "发现非正常的数据操作!"),
			vee.Utils.getStringByLanguage("Error", "出错了"));
		this._value = this._default;
		this._protect = this._secret - this._value;
		this._afterAbnormal();
	},

	_isValidate : function(warning) {
		if (warning == undefined) warning = true;
		if (!this._isInProtected) return true;
		if (this._value + this._protect != this._secret) {
			if (warning) {
				if (this._callback && _.isFunction(this._callback)) this._callback(this);
				else this._onAbnormal();
			}
			return false;
		}
		return true;
	},

	_getDataObject : function(){
		if (!this._isValidate(false)) this._value = this._default;
		return {
			isProtect : this._isInProtected,
			defaultValue : this._default,
			value  : this._value
		}
	},

	_setDataObject : function(data){
		this.setDefaultValue(data.defaultValue);
		this.setProtectEnabled(data.isProtect);
		this.setValue(data.value);
	}
});

/**
 * @param defaultValue
 * @param onAbnormalAction
 */
vee.NumberProtector.create = function(defaultValue, onAbnormalAction) {
	var p = new vee.NumberProtector();
	p.setAbnormalCallback(onAbnormalAction, true);
	p.setDefaultValue(defaultValue);
	p.setProtectEnabled(true);
	return p;
}

vee.NumberProtector.SecretNum = 19861024;

/**
 * 使用方法：
 *      用 a = vee.VIPValues.getValue(i)
 *
 */


vee._VIPValues = cc.Class.extend({
	_protectors : null,
	_bindings : null,

	/**
	 * @param {String} key
	 * @param {Function(key,value)} callback
	 * @returns {BindingIdentifier} identifier for release binding
	 */
	bind2Value : function(key, callback){
		if (!this._bindings[key]) {
			this._bindings[key] = [];
		}
		var ret = this._bindings[key].length;
		for (var i in this._bindings){
			if (!this._bindings[i]) ret = i;
		}
		this._bindings[key].push(callback);
		return {key : key, index : ret};
	},

	/**
	 * @param {BindingIdentifier} id identifier from bind2Value function
	 */
	releaseBinding : function(id){
		if (!id) return;
		var key = id.key;
		var idx = id.index;
		if (!this._bindings[key]) return;
		this._bindings[key][idx] = null;
	},

	setValue : function(key, value){
		var np = this._protectors[key];
		if (!np) {
			np = vee.NumberProtector.create(value);
			np.key = key;
			np.setAbnormalCallback(function(){
			});
			this._protectors[key] = np;
		}
		np.setValue(value);
		var binding = this._bindings[key];
		if (binding){
			for (var i in binding){
				if (binding[i]) binding[i](key, value);
			}
		}
	},

	add2Value : function(key, value){
		this.setValue(key, this.getValue(key)+value);
	},

	forEachValue : function(callback) {
		for (var i in this._protectors) {
			callback(i, this._protectors[i].getValue());
		}
	},

	removeValue : function(key){
		delete this._bindings[key];
		delete this._protectors[key];
	},

	getValue : function(key){
        if (this._protectors.hasOwnProperty(key)){
            return this._protectors[key].getValue();
        } else {
            return null;
        }
	},

	/**
	 * @param {String} key
	 * @returns {vee.NumberProtector}
	 */
	getNumberProtector : function(key){
		return this._protectors[key];
	},

	/**
	 * @param defaults 格式如
	 * {    value1 : "default",
	 *      value2 : 1,
	 *      value3 : 2
	 * }
	 */
	load : function(defaults, fileName){
		this._protectors = {};
		this._bindings = {};
		fileName = (fileName ? fileName : 'sulavPiv');
		var dataObjects = vee.Utils.loadObj(fileName);
		if (!dataObjects) {
			dataObjects = {};
			if (defaults) {
				for (var i in defaults) {
					dataObjects[i] = {
						isProtect : true,
						defaultValue : defaults[i],
						value : defaults[i]
					}
				}
			}
		}
		for (var i in dataObjects){
			var np = new vee.NumberProtector();
			np._setDataObject(dataObjects[i]);
			this._protectors[i] = np;
		}
	},

	save : function(fileName){
		fileName = (fileName ? fileName : 'sulavPiv');
		var dataObjects = {};
		for (var i in this._protectors) {
			dataObjects[i] = this._protectors[i]._getDataObject();
		}
		vee.Utils.saveObj(dataObjects, fileName);
	}
});

vee._VIPValues.create = function(defaults, fileName){
	var vip = new vee._VIPValues();
	vip.load(defaults, fileName);
	return vip;
}

vee.VIPValues = new vee._VIPValues();
vee.VIPValues.create = vee._VIPValues.create;