/**
 * Created with AppCode.
 * User: Yop Chan
 * Date: 10/21/14
 * Time: 2:53 PM
 * To change this template use File | Settings | File Templates.
 */
var vee = vee = vee || {};

vee.CoolDown = {
	buffer : null,

	getCDTimestamp : function(key, interval) {
		return this._getCDTimestamp(key, interval, false);
	},

	getCDTimestamp2SpecDate : function(key, minute, hour, day) {
		var date = new Date();
		var nowTst = date.getTime();
		var dateTst;
		if (day != undefined) {
			date.setDate(day);
			dateTst = date.getTime();
			if (dateTst < nowTst) {
				dateTst = dateTst + 86400000;
				date.setTime(dateTst);
			}
		}
		if (hour != undefined) {
			date.setHours(hour);
			dateTst = date.getTime();
			if (dateTst < nowTst) {
				dateTst = dateTst + 3600000;
				date.setTime(dateTst);
			}
		}
		date.setMinutes(minute);
		dateTst = date.getTime();
		if (dateTst < nowTst) {
			dateTst = dateTst + 60000;
			date.setTime(dateTst);
		}

		return this._getCDTimestamp(key, dateTst, false);
	},

	_getCDTimestamp : function(key, interval, isSave) {
		if (!this.buffer) {
			this.buffer = vee.VIPValues.create(null, "NwodLook");
			this.buffer.forEachValue(function(key, value) {
				cc.log("key \t" + key + "\t value\t" + value);
			});
		}

		var lastTst = this.buffer.getValue(key);
		if (lastTst == null) {
			if (!interval) {
				cc.log("Please set interval!");
				return null;
			}
			var nowTst = new Date().getTime();
			this.buffer.setValue(key, parseInt(nowTst));
			this.buffer.setValue(key+"itv", parseInt(interval));
			this.buffer.save("NwodLook");
			return interval;
		} else {
			var itv = parseInt(this.buffer.getValue(key+"itv"));
			var nowTst = new Date().getTime();
			var ret = (lastTst + itv) - nowTst;
			if (ret < 0) {
				var itvOff = 0;
				if (itv < Math.abs(ret)) {
					itvOff = ret;
				} else {
					itvOff = ret%itv;
				}
				if (isSave) {
					this.buffer.setValue(key, parseInt(nowTst+itvOff));
					this.buffer.save("NwodLook");
				}
			}
			return ret;
		}
	},

	getCDedCount : function(key, interval) {
		var cdTst = this._getCDTimestamp(key, interval, true);
		if (cdTst) {
			if (cdTst > 0) {
				return 0;
			} else {
				return Math.floor(Math.abs(cdTst)/interval);
			}
		} else {
			cc.log("Please set interval!");
		}
	}
}