/**
 * Created with JetBrains WebStorm.
 * User: Yop Chan
 * Date: 13-1-28
 * Time: 下午4:38
 * To change this template use File | Settings | File Templates.
 */
var Flow = Flow = Flow ||{};

Flow.FlowStatus = {
	WaitingForInput : 1,
	WaitingForAction : 2,
	Finished : 3
};

Flow.BasicModel = cc.Class.extend({
	data : null,

	_name : "BasicModel",
	_status : Flow.FlowStatus.WaitingForInput,
	_onResult : null,
	_chainCallback : null,
	_head : null,

	ctor : function(data){
		this.data = data;
		//Should not call begin here as the ctor require a immediate return and the begin might delay the return.
	},

	log : function(label, msg){
		cc.log('Flow [' + this._name + '|'+ this._status + '] '+ label + ': \t' + msg);
	},

	reset : function(){
		this._status = Flow.FlowStatus.WaitingForInput;
	},

	_input : function(data){
		if(this._status != Flow.FlowStatus.WaitingForInput) {
			this.log('error', 'Flow is not waitingForInput');
			return;
		}
		this._status = Flow.FlowStatus.WaitingForAction;
		this.action(this.onInput(data));
	},

	action : function(data){
		if(this._status != Flow.FlowStatus.WaitingForAction) { return; }
		this.onAction(data);
	},

	output : function(data, fork) {
		if (this._onResult) this._onResult(data);
		if (this._chainCallback) this._chainCallback(data);
	},

	done : function(fork) {
		this.output(true, fork);
	},

	/**
	 * Override this function to validate or format input data.
	 * @param {*} original input data
	 * @param {*} input data after processed
	 */
	onInput : function(data){ return data; },

	/**
	 * Override this function to Handle the (after processed) input data. Call this.output(data) to Finish this Flow.
	 * @param {*} input data after processed
	 * @returns {*} output data
	 */
	onAction : function(data){ this.output(data); },

	onResult : function(callback) {
		this._onResult = callback;
		return this;
	},

	go : function(data) {
		var head = (this._head ? this._head : this);
		head._input(data);
	},

	then : function(flowClass, data) {
		var f = Flow.do(flowClass, data);
		if (!f) {
			this.log('error', 'Object is not a instance of Flow.');
			return;
		}
		f._head = (this._head ? this._head : this);
		this._chainCallback = function(data){
			this._input(data);
		}.bind(f);
		return f;
	},

	/**
	 * will run flow depending the fork argument of function output(data, fork).
	 * @param {Object} forkObject , a object which key is the fork string and value is the flow will run.
	 * @returns {Flow.BasicModel}
	 */
	fork : function(forkObject) {
		this.log('error', 'To support fork you must extend a Flow.ForkModel or use Flow.extendFork function.')
		return;
	},

	thenAll : function(flowArray) {
		return this.then(Flow.doAll(flowArray));
	}
});

/**
 * get a Flow object
 * @param {Flow.BasicModel|Array} a flow can be represented by a FlowClass, a Flow object, or an Array [FlowClass, data]
 * @param {*} data
 * @returns {*}
 */
Flow.do = function(flow, data){
	if (flow instanceof Array && flow.length == 2) {
		data = flow[1];
		flow = flow[0];
	}
	var f = (flow instanceof Flow.BasicModel ? flow : new flow(data));
	if (! f instanceof Flow.BasicModel) {
		return null;
	}
	return f;
};

Flow.doAll = function(flowArray) {
	return new Flow.SyncModel(flowArray);
};

/**
 * @param obj
 * @param name
 * @returns {Flow.BasicModel}
 */
Flow.extend = function(obj, name){
	if (_.isFunction(obj)) {
		var action = obj;
		obj = {};
		obj._name = (name ? name : "Name Unknown");
		obj.onAction = action;
	}
	return Flow.BasicModel.extend(obj);
};

Flow.ForkModel = Flow.extend({
	_name : "ForkModel",
	forkObject : null,

	output : function(data, fork) {
		var fork = (this.forkObject && (_.isString(fork) || _.isNumber(fork)) ? this.forkObject[fork] : fork);
		fork = (fork && this.forkObject ? Flow.do(fork) : fork);
		if (this.forkObject && !fork) {
			this.log('error', 'Missing fork. You must pass your fork argument like this.output(data, fork); or this.done(fork) ');
			vee.Utils.logKey(this.forkObject, "Here are your forks:");
			return;
		}
		this._status = Flow.FlowStatus.Finished;
		if (this.forkObject) {
			fork.onResult(this._onResult);
			fork._chainCallback = this._chainCallback;
			fork.go(data);
		} else {
			if (this._onResult) this._onResult(data);
			if (this._chainCallback) this._chainCallback(data);
		}
	},

	fork : function(forkObj) {
		this.forkObject = forkObj;
		return this;
	}
});

/**
 * @param obj
 * @param name
 * @returns {Flow.BasicModel}
 */
Flow.extendFork = function(obj, name){
	if (_.isFunction(obj)) {
		var action = obj;
		obj = {};
		obj._name = (name ? name : "Name Unknown");
		obj.onAction = action;
	}
	return Flow.ForkModel.extend(obj);
};

Flow.ValidateModel = Flow.extend({
	_name : "ValidateModel",
	//The input data sample which will be use in input validation
	_inputLock : null,

	validate : function(data) {
		for(var k in this._inputLock){
			if(!data.hasOwnProperty(k)) return false;
		}
		return this._validate(data);
	},

	onValidate : function(data) { return true },

	input : function(data){
		if(!this.validate(data)){
			this.log('Warning', 'Input validate fail');
			this.reset();
			return;
		}
		this._super(data);
	}
});

Flow.SyncModel = Flow.extend({
	_name : "SyncModel",
	count : 0,

	subMissionDone : function(){
		this.count++;
		if (this.count == this.data.length) this.done();
	},

	onAction : function(data){
		if (!this.data instanceof Array) {
			this.log('error', 'Wrap Data is not an Array of flows');
			return;
		}
		var len = this.data.length;
		for (var i = 0; i < len; i++) {
			var flow = Flow.do(this.data[i]);
			flow.onResult(function(){
				this.subMissionDone();
			}.bind(this));
			flow.go(data);
		}
	}
});

Flow.NONE = Flow.BasicModel;