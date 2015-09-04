var vee = vee = vee || {};

vee.Utils = {
	/**
	 * 预加载游戏资源.
	 * @param resources
	 * @param selector
	 * @param target
	 */
    preLoad: function(resources, selector, target) {
        for (var i = 0; i < resources.length; i++) {
            var resource, type;
            if (resources[i].src && resources[i].type) {
                resource = resources[i].src;
                type = resources[i].type;
                switch (type) {
                    case "music":
                        cc.AudioEngine.getInstance().preloadMusic(resource);
                        break;
                    case "sound":
                        cc.AudioEngine.getInstance().preloadEffect(resource);
                        break;
                    case "image":
                        cc.TextureCache.getInstance().addImage(resource);
                        break;
                    case "plist":
                        cc.SpriteFrameCache.getInstance().addSpriteFrames(resource);
                        break;
                }
            } else {
                resource = resources[i];
                type = resource.split(".").pop();
                switch (type) {
                    case "mp3":
                    case "caf":
                    case "ogg":
                    case "wav":
                        cc.AudioEngine.getInstance().preloadMusic(resource);
                        break;
                    case "png":
                    case "jpeg":
                    case "jpg":
                        cc.TextureCache.getInstance().addImage(resource);
                        break;
                }
            }
        }
		//在预加载完毕后执行一个方法.
		if (selector) {
			selector.call(target);
		}
    },

    /**
     * Call callback when collision occurs.
     * @param durationUnit  the small unit of time for predication.
     * @param totalDuration the total duration of predication.
     * @param obj1_pos
     * @param obj2_pos
     * @param {Function} changePosFunc
     * @param {Function} detectFunc
     * @param {Function} collisionCallback
     */
    collideWithCallback: function(durationUnit, totalDuration, obj1_pos, obj2_pos, changePosFunc, detectFunc, collisionCallback) {
        // To memorize position for obj1 and obj2 to save cpu.
        var cached_obj1_pos = obj1_pos;
        var cached_obj2_pos = obj2_pos;
        var posOffsets = [cc.p(0, 0), cc.p(0, 0)];
        for (var i = 0; i < totalDuration; i += durationUnit) {
            if (detectFunc(cached_obj1_pos, cached_obj2_pos)) {
                this.scheduleOnce(function() {
                    // There may be time delay since we need time to calculate the final positions.
                    collisionCallback(cached_obj1_pos, cached_obj2_pos);
                }, i);
                return;
            }

            posOffsets = changePosFunc(durationUnit);
            cached_obj1_pos = vee.Utils.addPoints(posOffsets[0], cached_obj1_pos);
            cached_obj2_pos = vee.Utils.addPoints(posOffsets[1], cached_obj2_pos);
        }
    },

	/**
	 * 得到当前时间.
	 * @returns {number}
	 */
    getTimeNow: function() {
        return (new Date()).getTime();
    },
	/**
	 * 计算
	 * @param deltaSeconds
	 * @returns {{hours: number, minutes: number, seconds: number}}
	 */
    getDeltaTime: function(deltaSeconds) {
        var hours = Math.floor(deltaSeconds / 3600);
        var minutes = Math.floor((deltaSeconds - hours * 3600) / 60);
        var seconds = Math.floor(deltaSeconds - hours * 3600 - minutes * 60);
        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        }
    },

	/**
	 * 把秒数转换为"时:分:秒"格式的时间.
	 * @param seconds
	 * @returns {string}
	 */
    formatTimeWithSecond: function(seconds) {
        var time = this.getDeltaTime(seconds);
        if (time.hours < 10) time.hours = "0" + time.hours;
        if (time.minutes < 10) time.minutes = "0" + time.minutes;
        if (time.seconds < 10) time.seconds = "0" + time.seconds;
        return time.hours + ":" + time.minutes + ":" + time.seconds;
    },

    /**
     * 1.699 with position 2 = 1.7. If you need 1.70 should use 1.69.toFixed(2)
     * @param number
     * @param position
     * @return {number}
     */
    roundNumber: function(number, position) {
        var arg = Math.pow(10, position);
        return Math.round(number * arg) / arg;
    },

    /**
     * Whether an object is empty.
     * @param obj
     * @return {bool}
     */
    isEmpty: function(obj) {

        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0) return false;
        if (obj.length === 0) return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    },

	/**
	 * 遍历node的所有子结点.
	 * @param node
	 * @param callback
	 * @param reverse
	 * @returns {boolean}
	 */
    iterateChildren: function(node, callback, reverse) {
        var children = node.getChildren();
        // if callback return and kontinue is false, the for loop will end.
        var kontinue = true;
        var i;
        if (reverse) {
            for (i = children.length - 1; i >= 0; i--) {
                kontinue = callback(children[i], i, node);
                if (kontinue === false) {
                    return false;
                }
            }
        } else {
            for (i = 0; i < children.length; i++) {
                kontinue = callback(children[i], i, node);
                if (kontinue === false) {
                    return false;
                }
            }
        }

    },
	/**
	 * Get values of properties in an object.
	 * @param object
	 * @returns {Array}
	 */
    getValues: function(object){
        var arr = [];
        for( var key in object){
	        // whether the object has a property named 'key'.
            if (object.hasOwnProperty(key)){
                arr.push(object[key]);
            }
        }
        return arr;
    },
    forEach: function(arr, func, context){
        var kontinue = true;
        for (var i = 0; i < arr.length; i++){
            kontinue = func.call(context, arr[i], i, arr);
            if (kontinue === false){
                return kontinue;
            }
        }
    },
	/**
	 * 得到一组具有相同内容的对象.
	 * @param count
	 * @param data
	 * @returns {Array}
	 */
    getArrayOfObj: function(count, data){
        var arr = [];
        for (var i = 0; i < count; i++){
            arr.push(this.copy(data));
        }
        return arr;
    },

    scheduleCallbackForTarget: function(target, selector, interval, repeat, delay, paused) {
        var scheduler = cc.director.getScheduler();
        scheduler.scheduleCallbackForTarget.apply(scheduler, Array.prototype.slice.call(arguments));
    },
    scheduleOnceForTarget: function(target, selector, delay) {
        var scheduler = cc.director.getScheduler();
        scheduler.scheduleCallbackForTarget(target, selector, 0, 0, delay);
    },
    scheduleResumeTarget: function(target) {
        var scheduler = cc.director.getScheduler();
        scheduler.resumeTarget(target);
    },
    schedulePauseTarget: function(target) {
        var scheduler = cc.director.getScheduler();
        scheduler.pauseTarget(target);
    },

    unscheduleCallbackForTarget: function(target, selector) {
        var scheduler = cc.director.getScheduler();
        scheduler.unscheduleCallbackForTarget.apply(scheduler, Array.prototype.slice.call(arguments));
    },

    unscheduleAllCallbacksForTarget: function(target) {
        var scheduler = cc.director.getScheduler();
        scheduler.unscheduleAllCallbacksForTarget.apply(scheduler, Array.prototype.slice.call(arguments));
    },

    /**
     * Generate getInstance function for class.
     * @return {Function}
     */
    generateInstance: function(theClass) {

        /**
         * Return instance of {theClass}.
         * @returns {theClass}
         */
        theClass.getInstance = function() {
            if (!theClass._instance) {
                theClass._instance = new theClass();
            }
            return theClass._instance;
        }
    },
    /**
     * Get a random number between start to end (including start and end).
     * @param {number} start
     * @param {number} end
     * @return {integer}
     */
    randomInt: function(start, end) {
        var len = end - start;
        return Math.floor(Math.random() * (len + 1)) + start;
    },

	/**
	 * 从数组中随即得到一个数组元素.
	 * @param {array} array
	 * @return {*} 
	 */
	randomChoice: function(array){
		var idx = vee.Utils.randomInt(0, array.length-1);
		return array[idx];
	},

	/**
	 * 判断两条直线是否相交.
	 * @param {cc.Point} start1
	 * @param {cc.Point} end1
	 * @param {cc.Point} start2
	 * @param {cc.Point} end2
	 * @return {boolean}
	 */
	lineIntersectLine: function(start1, end1, start2, end2){
		var s1_x, s1_y, s2_x, s2_y;
		s1_x = end1.x - start1.x;
		s1_y = end1.y - start1.y;

		s2_x = end2.x - start2.x;
		s2_y = end2.y - start2.y;

		var s = (-s1_y * (start1.x - start2.x) + s1_x * (start1.y - start2.y)) / (-s2_x * s1_y + s1_x * s2_y);
		var t = ( s2_x * (start1.y - start2.y) - s2_y * (start1.x - start2.x)) / (-s2_x * s1_y + s1_x * s2_y);

		return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
	},

    /**
     * 判断直线和圆是否相交.
     * @param {cc.Point} start          start position of line.
     * @param {cc.Point} end            end position of line.
     * @param {cc.Point} circlePoint      center position of circle.
     * @param {Number}   circleRadius   radius of circle.
     * @returns {boolean}
     */
    lineIntersectCircle: function(start, end, circlePoint, circleRadius){
        var squaredDistance = this.pointToLineSquaredDistance(circlePoint, start, end);
        return circleRadius * circleRadius >= squaredDistance;
    },

	/**
	 * 判断直线是否和三角形相交.
	 * @param {cc.Point} start
	 * @param {cc.Point} end
	 * @param {cc.Rect} rect
	 * @return {boolean}
	 */
	lineIntersectRect: function(start, end, rect){
		var p1 = cc.p(rect.x, rect.y);
		var p2 = cc.p(rect.x + rect.width, rect.y);
		var p3 = cc.p(rect.x + rect.width, rect.y + rect.height);
		var p4 = cc.p(rect.x, rect.y + rect.height);

		var lines = [[p1,p2], [p2,p3], [p3,p4],[p4,p1]];
		for (var i=0; i < lines.length; i++){
			var line = lines[i];
			if (vee.Utils.lineIntersectLine(start, end, line[0], line[1])){
				return true;
			}
		}
		return false;
	},

    /**
     * 计算点到直线的距离.
     * @param {cc.Point} p Point
     * @param {cc.Point} v Start point of line.
     * @param {cc.Point} w End point of line.
     * @returns {Number}
     */
    pointToLineSquaredDistance: function(p, v, w){
        var l2 = this.distancePower2BetweenPoints(v, w);
        if (l2 == 0) return this.distancePower2BetweenPoints(p, v);
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        if (t < 0) return this.distancePower2BetweenPoints(p, v);
        if (t > 1) return this.distancePower2BetweenPoints(p, w);
        return this.distancePower2BetweenPoints(p, {
            x: v.x + t * (w.x - v.x),
            y: v.y + t * (w.y - v.y)
        });
    },

	/**
	 *
	 * @param {Object} obj
	 * @param {String} name
	 */
	logObj : function (obj, name){},

	/**
	 * 打印对象中属性名
	 * @param {Object} obj
	 * @param {String} name
	 */
	logKey: function (obj, name) {
		cc.log('Object Name:\t' + name);
		cc.log('{');
		for (var i in obj) {
			cc.log('\t' + i + ' : ' + typeof(obj[i]));
		}
		cc.log('}');
	},

	/**
	 * 打印对象中属性值
	 * @param {Object} obj
	 * @param {String} name
	 */
	logValue: function (obj, name, isValueOnly) {
		cc.log('Object Name:\t' + name);
		cc.log('{');
		for (var i in obj) {
			var o = obj[i];
			if (_.isNull(o)) cc.log('\t'+ i + ' : ' + 'null');
			else if (_.isString(o)) cc.log('\t' + i + ' : ' + '"' + o.toString() + '"');
			else if (_.isNumber(o) || _.isBoolean(o)) cc.log('\t'+ i + ' : ' + o.toString());
			else if (!isValueOnly) cc.log('\t' + i + ' : ' + typeof(obj[i]));
		}
		cc.log('}');
	},

	/**
	 *
	 * @param {Object} obj
	 * @param {String} name
	 */
	saveObj : function(obj, name){
		if (obj === null || obj === undefined) return;
		vee.Common.getInstance().saveToFile(obj, name);
	},

	/**
	 *
	 * @param {String} name
	 */
	loadObj : function(name){
		var objStr = vee.Common.getInstance().loadFromFile(name+".o");
		cc.log("obj name = "+name);
		if (objStr == "") return null;
        // else cc.log("loadObj\t" + objStr);
		return eval('('+objStr+')');
	},

    getInt: function(key){
        return vee.Common.getInstance().getInt(key);
    },
    saveInt: function(key, value){
        vee.Common.getInstance().saveInt(key, value);
    },

	/**
	 *
	 * @param idx
	 * @param {optional} obj
	 */
	removeObj : function(array, idx, obj) {
		var item, item2;
		item = (obj ? obj : array[idx]);
		item2 = array.pop();
		if (item != item2){
			array[idx] = item2;
		}
	},

	/**
	 *
	 * @param {Float} radian
	 * @returns {number} degree
	 */
	radianToDegree: function (radian) {
		return radian * (180 /  Math.PI);
	},

	/**
	 * @param {cc.Point} first
	 * @param {cc.Point} second
	 * @returns {number} distance
	 */
	distanceBetweenPoints: function (first, second) {
		return Math.sqrt(this.distancePower2BetweenPoints(first, second));
	},

	/**
	 * @param {cc.Point} first
	 * @param {cc.Point} second
	 * @returns {number} distance^2 返回距离的平方，用来检测碰撞用这个性能更好
	 */
	distancePower2BetweenPoints : function(first, second) {
    	second = (second ? second : cc.p(0,0));
		var deltaX = second.x - first.x;
		var deltaY = second.y - first.y;
		return deltaX*deltaX + deltaY*deltaY;
	},

	/**
	 *
	 * @param {cc.Point} first
	 * @param {cc.Point} second
	 * @returns {cc.Point} result
	 */
	addPoints: function (first, second) {
		return cc.p(first.x + second.x, first.y + second.y);
	},

	pAdd: function(first, second) { return this.addPoints(first, second);},
	/**
	 *
	 * @param {cc.Point} first
	 * @param {number} factor
	 * @returns {cc.Point} result
	 */
	multiPoints: function (first, factor) {
		return cc.p(first.x * (factor.x ? factor.x : factor), first.y * (factor.y ? factor.y : factor));
	},

	pMult: function(first, second) { return this.multiPoints(first, second);},

	/**
	 *
	 * @param {cc.Point} first
	 * @param {cc.Point} second
	 * @returns {cc.Point} result
	 */
	substractPoints: function (first, second) {
		return cc.p(first.x - second.x, first.y - second.y);
	},

	pSub: function(first, second) { return this.substractPoints(first, second);},

	/**
	 *
	 * @param {cc.Point} src
	 * @param {number} distance
	 * @param {number} offset
	 * @returns {cc.Point} dest
	 */
	getPointWithOffset: function (src, distance, offset) {
		var distanceOfOffset = vee.Utils.distanceBetweenPoints(cc.p(0, 0), offset);
		var deltaX = offset.x === 0 ? offset.x : distance / distanceOfOffset * offset.x;
		var deltaY = offset.y === 0 ? offset.y : distance / distanceOfOffset * offset.y;
		return cc.p(src.x + deltaX, src.y + deltaY);
	},
	
	/**
	 *
	 * @param {cc.Point} src
	 * @param {number} distance
	 * @param {number} angle
	 * @returns {cc.Point} dest
	 */
	getPointWithAngle: function (src, distance, angle) {
		var radian = angle * Math.PI / 180;
		var deltaX = Math.sin(radian) * distance;
		var deltaY = Math.cos(radian) * distance;				
		return cc.p(src.x + deltaX, src.y + deltaY);
	},	

	/**
	 *
	 * @param {cc.Point} line1Start
	 * @param {cc.Point} line1End
	 * @param {cc.Point} line2Start
	 * @param {cc.Point} line2End
	 * @returns {number} degree
	 */
	angleBetweenLines: function (line1Start, line1End, line2Start, line2End) {
		var a = line1End.x - line1Start.x;
		var b = line1End.y - line1Start.y;
		var c = line2End.x - line2Start.x;
		var d = line2End.y - line2Start.y;
        if ((a ===0 && b===0) || (c===0 && d===0)){
            return 0;
        }
		var rads = Math.acos(((a * c) + (b * d)) / ((Math.sqrt(a * a + b * b)) * (Math.sqrt(c * c + d * d))));
		return vee.Utils.radianToDegree(rads);
	},

	/**
	 *
	 * @param {cc.Point} lineStart
	 * @param {cc.Point} lineEnd
	 * @returns {number} degree
	 */
	angleOfLine: function (lineStart, lineEnd) {
		lineEnd = (lineEnd ? lineEnd : cc.p(0,0));
		var x = lineEnd.x - lineStart.x;
		var y = lineEnd.y - lineStart.y;
		if (x == 0) {
			return y > 0 ? 0 : 180;
		}
		var flat = (x > 0 ? 1 : -1);
		var rads = Math.acos(y / Math.sqrt(x * x + y * y));
		var degree = flat * vee.Utils.radianToDegree(rads);
		if (degree < 0) {
			degree += 360;
		}
		return degree;
	},

    callFunction: function(func){
        if (typeof func === "function"){
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            func.apply(func, args);
        }
    },

    /**
     *
     * @param {Function} callback like callback(data)
     * @param {Number} delay
     * @param {Object} data
     */
    scheduleOnce: function(callback, delay, data) {
        var obj = {
            callback: function(){
                callback(data);
            }
        };
        this.scheduleCallbackForTarget(obj, obj.callback, 0, 0, delay);
    },

    _scheduleBackFunc: null,
    scheduleBack: function(callback) {
	    if (vee.Utils.getObjByPlatform(false, true, false)) {
	        if (!this._scheduleBackFunc){
	            this._scheduleBackFunc = function(){
	                callback();
	                this._scheduleBackFunc = null;
	            }.bind(this);
	            this.scheduleCallbackForTarget(this, this._scheduleBackFunc, 0, 0, 0.2);
	        }
	    } else {
		    callback();
	    }
    },


	/**
	 * 分享当前屏幕截图.
	 * @param {String} msg
	 * @param {cc.Layer} layer optional
	 * @param {vee.Share.ShareType} share type optional
	 */
	shareScreen : function(msg, layer, shareType) {
		if (!shareType) shareType = vee.Share.ShareType.BOTH;
		layer = (layer ? layer : vee.PopMgr.rootNode);
		var comm = vee.Common.getInstance();
		vee.Promo.hideMoreGameBanner();
		var strPath = comm.saveImage(layer, "shareImage.jpg");
		vee.Promo.showMoreGameBanner();

		vee.Share.share(msg, strPath, app.Config.AppURL, shareType);
	},

	shareMsg : function(msg, layer) {
		this.shareScreen(msg, layer, vee.Share.ShareType.MSG_ONLY);
	},

	shareImage : function(layer) {
		this.shareScreen("", layer, vee.Share.ShareType.IMG_ONLY);
	},


	/**
	 * 获取玩家名字
	 * @returns {string}
	 */
	getPlayerName : function() {
		return vee.GameCenter.getPlayerName();
	},

	/**
	 * 打开一个链接.
	 * @param url
	 */
	openURL : function(url) {
		var comm = vee.Common.getInstance();
		comm.openURL(url);
	},

	/**
	 * 判断是否是调试模式.
	 * @returns {boolean}
	 */
    isDebugMode: function(){
        return vee.Common.getInstance().isDebugMode();
    },

	rateUs : function() {
		var comm = vee.Common.getInstance();
		var appid = app.Config.AppID;
		comm.rateUs(appid);
	},

	showAppById : function (id) {
		var comm = vee.Common.getInstance();
		comm.rateUs(id);
	},

	/**
	 * 需要在app.Config中定义{Number}数组arrRateUs
	 */
	showRateUs : function(key, arrCount) {
		if (!key && !arrCount) {
			key = "RateUsCount";
			arrCount = app.Config.arrRateUs;
		}
		if (!arrCount) {
			cc.log("需要在app.Config中定义{Number}数组arrRateUs");
			return;
		}
		if (!vee.data[key]) {
			vee.data[key] = 0;
		}
		vee.data[key] = parseInt(vee.data[key]) + 1;
		for (var i in app.Config.arrRateUs) {
			var checkNum = app.Config.arrRateUs[i];
			if (parseInt(vee.data[key]) == checkNum) {
				if (!vee.data["RatedUs"]) {
					vee.PopMgr.alert(
						vee.Utils.getObjByLanguage([
							"Have fun? \nPlease rate us!",
							"喜欢这个游戏吗？请给我们评价一下吧~"
						]),
						vee.Utils.getObjByLanguage([
							"RATE US",
							""
						]),
						function() {
							vee.Utils.rateUs();
							vee.data["RatedUs"] = true;
							vee.saveData();
						},
						true);
					return true;
				}
			}
		}
		return false;
	},

	rate : function(){
		vee.Utils.rateUs();
	},

	getStringByPlatform : function(ios, android, web){
		return this.getObjByPlatform(ios, android, web);
	},
	/**
	 * @param ios
	 * @param android
	 * @param web
	 * @return {Object}
	 */
	getObjByPlatform : function(ios, android, other){
		var s = {};
		s[cc.sys.OS_IOS] = ios;
		s[cc.sys.OS_ANDROID] = android;
		var ret = s[cc.sys.os];
		if (ret === undefined) return other;
		return ret;
	},

	getStringByLanguage : function(en, cn, jp, kr){
		return this.getObjByLanguage(en, cn, jp, kr);
	},
	/**
	 * @param {vee.LangString} strings
	 * @returns {Object}
	 */
	getObjByLanguage : function(en, cn, jp, kr){
		var s = {};
		if (_.isArray(en)) {
			s[cc.sys.LANGUAGE_ENGLISH] = 0 < en.length ? en[0] : "";
			s[cc.sys.LANGUAGE_CHINESE] = 1 < en.length ? en[1] : "";
			s[cc.sys.LANGUAGE_KOREAN] = 2 < en.length ? en[2] : "";
			s[cc.sys.LANGUAGE_JAPANESE] = 3 < en.length ? en[3] : "";
		} else {
			s[cc.sys.LANGUAGE_ENGLISH] = en;
			s[cc.sys.LANGUAGE_CHINESE] = cn;
			s[cc.sys.LANGUAGE_KOREAN] = kr;
			s[cc.sys.LANGUAGE_JAPANESE] = jp;
		}
		var ret = s[cc.sys.language];
		if (ret === undefined) return en;
		return ret;
	},

	RequestType : {
		GET : 0,
		POST : 1,
		PUT : 2,
		DELETE : 3,
		UNKNOWN : 4
	},

	/**
	 * 下载一个json文件并将它转换成一个js对象.
	 * json must implement the format like { "err" : false, "data" : obj }
	 * and callback will be invoke like callback(obj)
	 * @param url
	 * @param callback
	 */
	getObjWithURL : function(url, callback, act, body, encrypt) {
		if (act && body) body = "a="+act+"&v="+1+"&body="+body;
		this.requestURL(url, body, (body ? this.RequestType.POST : this.RequestType.GET), callback, (encrypt ? true : false));
	},

	downloadFileFromURL : function(url, callback) {
		this.requestURL(url, "", this.RequestType.GET, callback, false);
	},

	uploadObjFromURL : function(url, data, callback) {
		this.requestURL(url, data, this.RequestType.PUT, callback, false);
	},

	getApiFromURL : function() {
		this.requestURL(url, "", this.RequestType.POST, callback, true);
	},

	requestURL : function(url, data, type, callback, enc) {
		vee.Common.getInstance().requestServer(
			url,
			(data ? JSON.stringify(data) : ""),
			(type ? type : this.RequestType.GET),
			function(data){
				vee.Utils.logObj(data, "requestURL");
				callback(data);
			},
			enc);
	},


	/**
	 * 通过成功率rate获得一个随机结果.
	 * etc. isLucky(0.3) will 30% return true and 70% return false.
	 * @param rate percentage, 1 = 100%
	 * @returns {boolean}
	 */
	isLucky : function(rate){
		return this.randomInt(0,999) < rate*1000;
	},

	/**
	 * copy a obj data without copy obj ref
	 * @param obj
	 * @returns newObj
	 */
	copy : function(obj) {
		if(_.isObject(obj)) {
			var newObj = {};
			for (var key in obj) {
				newObj[key] = vee.Utils.copy(obj[key]);
			}
			return newObj;
		} else {
			return obj;
		}
	},

	/**
	 * 给按钮设置精灵帧.
	 * @param {cc.ControlButton} button
	 * @param {cc.SpriteFrame} spriteframe
	 */
	setBtnBackgroundFrame : function(button, spriteframe){
		button.setBackgroundSpriteFrameForState(spriteframe, 1);
	},

	/**
	 * 提交分数.
	 * @param score
	 * @param idx
	 */
	submitScore : function(score, idx) {
		vee.GameCenter.submitScore(score, idx);
	},

	/**
	 * 显示排行榜.
	 * @param idx
	 */
	showLeaderboard : function(idx) {
		vee.GameCenter.showLeaderboard(idx);
	},

	/**
	 * Launch app
	 * @param id AppId
 	 * @returns {Is launch succeed}
	 */
	launchAppById : function(id) {
		var comm = vee.Common.getInstance();
		return comm.launchApp(id);
	},

	/**
	 * @param id AppId
	 * @returns {Is installed}
	 */
	checkIsInstalledApp : function(id) {
		var comm = vee.Common.getInstance();
		return comm.checkIsInstalled(id);
	},

	/**
	 * @returns {BOOL} Is update success
	 */
	checkLocalUpdate : function(callback) {
		var comm = vee.Common.getInstance();
		var isSuccess = comm.checkLocalUpdate();

		if (isSuccess && _.isFunction(callback)) {
			callback();
		}
	},

	/**
	 * Reload cached files and destory sprite frame instance
	 */
	reloadCache : function() {
		var comm = vee.Common.getInstance();
		comm.reloadCache();
		cc.spriteFrameCache = cc.SpriteFrameCache.getInstance();
	},

	checkPackage : function() {
		var comm = vee.Common.getInstance();
		comm.checkPackage(app.Config.AppID);
	},

	checkSignature : function() {
		var comm = vee.Common.getInstance();
		comm.checkSignature(app.Config.signature);
	},


	/**
	 * encode a string, only support lowercase letters and numbers, you can pass an extra codeMap for particular symbols
	 * @param {string} string
	 * @param {Object} codeMap
	 * @returns {string}
	 */
	simpleEncode : function(string, codeMap) {
		string = string.toLowerCase();
		var map = codeMap || vee.Utils.CodeMap;
		var length = string.length;
		if (length > 20) return -1;
		var ran = vee.Utils.randomInt(1,9);
		var code, ret = "" + ran;
		for (var i = 0; i < length; i++) {
			code = map[string[i]] || parseInt(string[i], 36);
			code += ran + (i%2 ? ran : 0);
			ret += (code > 9 ? '' + code : '0' + code);
		}
		return ret;
	},

	/**
	 * decode a string which encoded by simpleEncode method.
	 * @param {string} string
	 * @param {Object} codeMap
	 * @returns {string}
	 */
	simpleDecode : function(string, codeMap) {
		var map = codeMap || vee.Utils.CodeMap;
		var length = string.length;
		var ran = parseInt(string[0]);
		var code, ret = "";
		for (var i = 1; i < length; i+=2) {
			code = parseInt(string[i] + string[i+1]);
			code -= ran + (((i-1)/2)%2 ? ran : 0);
			ret += map[code] || (code).toString(36, 0);
		}
		return ret;
	}
}

vee.Utils.logObj = (function () {
	var objs = [];

	function serialize(o, key, tab) {
		var tab = (tab ? tab : '');
		var shortPrefix = tab + (key ? key + ' : ' : '');
		if (_.isNull(o)) return shortPrefix + 'null';
		if (_.isString(o)) return shortPrefix + '"' + o.toString() + '"';
		if (_.isNumber(o) || _.isBoolean(o)) return shortPrefix + o.toString();
		if (_.isFunction(o)) return shortPrefix + 'function()';
		if (_.isArray(o)) {
			var hasReferred = _.contains(objs, o);
			var content = '[\n';
			var hasChild = false;

			objs.push(o);
			for (var k in o) {
				if (hasChild) content += ',\n';
				hasChild = true;
				content += serialize(hasReferred ? key : o[k], null, tab + '\t');
			}
			content += '\n' + tab + ']';
			return shortPrefix + content;
		}
		if (_.isObject(o)) {
			var hasReferred = _.contains(objs, o);
			objs.push(o);
			var content = '{\n';
			var hasChild = false;
			for (var k in o) {
				if (hasChild) content += ',\n';
				hasChild = true;
				content += serialize((hasReferred && _.isObject(o[k])) ? '(recursive)' : o[k], k, '\t' + tab);
			}
			content += '\n' + tab + '}';
			return shortPrefix + content;
		}
		return shortPrefix + typeof(o);
	};

	return function (obj, name) {
		objs = [];
		cc.log(serialize(obj, name));
		objs = [];
	}
})();

vee.Utils.saveObj = (function() {
    var objs = [];

    function serialize(o, key) {
        var shortPrefix = (key ? '"' + key + '"' + ' : ' : '');
        if (_.isNull(o)) return shortPrefix + 'null';
        if (_.isString(o)) return shortPrefix + '"' + o.toString() + '"';
        if (_.isNumber(o) || _.isBoolean(o)) return shortPrefix + o.toString();
        if (_.isArray(o)) {
            if (_.contains(objs, o)) return "null";
            var content = '[';
            var hasChild = false;
            for (var k in o) {
                if (hasChild) content += ',';
                hasChild = true;
                content += serialize(o[k]);
            }
            content += '' + ']';
            return shortPrefix + content;
        }
        if (_.isObject(o)) {
            if (_.contains(objs, o)) return "null";
            objs.push(o);
            var content = '{';
            var hasChild = false;
            for (var k in o) {
                if (hasChild) content += ',';
                hasChild = true;
                content += serialize(o[k], k);
            }
            content += '' + '}';
            return shortPrefix + content;
        }
        return 'null';
    };

    return function(obj, name) {
        if (!name) {
            cc.log("Error : 保存 obj 需要一个 key");
            return;
        }
        objs = [];
        var objStr = serialize(obj);
        //		cc.log("saveObj:\t" + objStr);
        vee.Common.getInstance().saveToFile(objStr, name + ".o");
        objs = [];
    }
})();

//code map for simple Encode & Decode
vee.Utils.CodeMap = {
	'.' : 36,  36 : '.',
	':' : 37,  37 : ':'
};