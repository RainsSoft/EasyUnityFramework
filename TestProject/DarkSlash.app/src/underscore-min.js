//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

var root = this;
_ = {
  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  optimizeCb : function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  },

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result ? either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  cb : function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return this.optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  },

  iteratee : function(value, context) {
    return this.cb(value, context);
  },

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  forEach : function(obj, iteratee, context) {
    if (obj == null) return obj;
    iteratee = this.optimizeCb(iteratee, context);
    var i, length = obj.length;
    if (length === +length) {
      for (i = 0; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  },


  // Return the results of applying the iteratee to each element.
  collect : function(obj, iteratee, context) {
    if (obj == null) return [];
    iteratee = this.cb(iteratee, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
      length = (keys || obj).length,
      results = Array(length),
      currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  },

  reduceError : 'Reduce of empty array with no initial value',

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.

  inject : function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = optimizeCb(iteratee, context, 4);
    var keys = obj.length !== +obj.length && _.keys(obj),
      length = (keys || obj).length,
      index = 0, currentKey;
    if (arguments.length < 3) {
      if (!length) throw new TypeError(this.reduceError);
      memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  },

  // The right-associative version of reduce, also known as `foldr`.
  foldr : function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = optimizeCb(iteratee, context, 4);
    var keys = obj.length !== + obj.length && _.keys(obj),
      index = (keys || obj).length,
      currentKey;
    if (arguments.length < 3) {
      if (!index) throw new TypeError(this.reduceError);
      memo = obj[keys ? keys[--index] : --index];
    }
    while (index--) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  },

  // Return the first value which passes a truth test. Aliased as `detect`.
  detect : function(obj, predicate, context) {
    var result;
    predicate = this.cb(predicate, context);
    _.some(obj, function(value, index, list) {
      if (predicate(value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  },

  // Return all the elements that pass a truth test.
  // Aliased as `select`.

  select : function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = this.cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  },
  // Return all the elements for which a truth test fails.
  reject : function(obj, predicate, context) {
    return _.filter(obj, _.negate(this.cb(predicate)), context);
  },

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.

  all : function(obj, predicate, context) {
    if (obj == null) return true;
    predicate = this.cb(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
      length = (keys || obj).length,
      index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  },
  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.

  any : function(obj, predicate, context) {
    if (obj == null) return false;
    predicate = this.cb(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
      length = (keys || obj).length,
      index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  },
  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.

  include : function(obj, target) {
    if (obj == null) return false;
    if (obj.length !== +obj.length) obj = _.values(obj);
    return _.indexOf(obj, target) >= 0;
  },
  // Invoke a method (with arguments) on every item in a collection.
  invoke : function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  },

  // Convenience version of a common use case of `map`: fetching a property.
  pluck : function(obj, key) {
    return _.map(obj, _.property(key));
  },

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.

  where : function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  },
  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.

  findWhere : function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  },
  // Return the maximum element (or element-based computation).
  max : function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
      value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = this.cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  },

  // Return the minimum element (or element-based computation).
  min : function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
      value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = this.cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  },

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher?Yates_shuffle).

  shuffle : function(obj) {
    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  },
  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.

  sample : function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  },
  // Sort the object's values by a criterion produced by an iteratee.
  sortBy : function(obj, iteratee, context) {
    iteratee = this.cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
          if (a > b || a === void 0) return 1;
          if (a < b || b === void 0) return -1;
        }
        return left.index - right.index;
      }), 'value');
  },

  // An internal function used for aggregate "group by" operations.
  //Yodo

  group : function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = this.cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  },
  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.

  groupBy : function(result, value, key){
    return group(function(result, value, key) {
      if (_.has(result, key)) result[key].push(value); else result[key] = [value];
    });
  },
  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.

  indexBy : function(result, value, key){
    return group(function(result, value, key) {
      result[key] = value;
    });
  },
  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.

  countBy : function(result, value, key) {
    group(function(result, value, key) {
      if (_.has(result, key)) result[key]++; else result[key] = 1;
    });
  },
  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.

  sortedIndex : function(array, obj, iteratee, context) {
    iteratee = this.cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  },
  // Safely create a real, live array from anything iterable.
  toArray : function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  },

  // Return the number of elements in an object.
  size : function(obj) {
    if (obj == null) return 0;
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  },

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.

  partition : function(obj, predicate, context) {
    predicate = this.cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  },
  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.

  take : function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  },
  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.

  initial : function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  },
  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.

  last : function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  },
  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.

  drop : function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  },
  // Trim out all falsy values from an array.
  compact : function(array) {
    return _.filter(array, _.identity);
  },

  // Internal implementation of a recursive `flatten` function.
  _flatten : function(input, shallow, strict, startIndex) {
    var output = [], idx = 0, value;
    for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
      value = input[i];
      if (value && value.length >= 0 && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = _._flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  },

  // Flatten out an array, either recursively (by default), or just one level.
  flatten : function(array, shallow) {
    return this._flatten(array, shallow, false);
  },

  // Return a version of the array that does not contain the specified value(s).
  without : function(array) {
    return _.difference(array, array.slice(1));
  },

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.

  unique : function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = this.cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  },
  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.

  union : function() {
    return _.uniq(this._flatten(arguments, true, true));
  },
  // Produce an array that contains every item shared between all the
  // passed-in arrays.

  intersection : function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  },
  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.

  difference : function(array) {
    var rest = this._flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  },
  // Zip together multiple lists into a single array -- elements that share
  // an index go together.

  zip : function(array) {
    if (array == null) return [];
    var length = _.max(arguments, 'length').length;
    var results = Array(length);
    while (length-- > 0) {
      results[length] = _.pluck(arguments, length);
    }
    return results;
  },
  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices

  unzip : function(array) {
    return _.zip.apply(null, array);
  },
  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.

  object : function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  },
  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.

  indexOf : function(array, item, isSorted) {
    var i = 0, length = array && array.length;
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  },
  lastIndexOf : function(array, item, from) {
    var idx = array ? array.length : 0;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  },

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).

  range : function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  },
  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.

  bind : function(func, context) {
    var args, bound;
    if (this.nativeBind && func.bind === this.nativeBind) return this.nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (_.isObject(result)) return result;
      return self;
    };
    return bound;
  },
  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.

  partial : function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  },
  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.

  bindAll : function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  },
  // Memoize an expensive function by storing its results.
  memoize : function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  },

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.

  delay : function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  },
  // Defers a function, scheduling it to run after the current call stack has
  // cleared.

  defer : function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  },
  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.

  throttle : function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  },
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.

  debounce : function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  },
  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.

  wrap : function(func, wrapper) {
    return _.partial(wrapper, func);
  },
  // Returns a negated version of the passed-in predicate.
  negate : function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  },

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.

  compose : function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  },
  // Returns a function that will only be executed after being called N times.
  after : function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  },

  // Returns a function that will only be executed before being called N times.
  before : function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      } else {
        func = null;
      }
      return memo;
    };
  },

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.

  once : function() {
    return this.partial(_.before, 2);
  },
  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.

  _hasEnumBug : !({toString: null}).propertyIsEnumerable('toString'),
  _nonEnumerableProps : ['constructor', 'valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'],
  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`

  keys : function(obj) {
    if (!_.isObject(obj)) return [];
    if (this.nativeKeys) return this.nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);

    // Ahem, IE < 9.
    if (this._hasEnumBug) {
      var nonEnumIdx = this._nonEnumerableProps.length;
      while (nonEnumIdx--) {
        var prop = this._nonEnumerableProps[nonEnumIdx];
        if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
      }
    }
    return keys;
  },
  // Retrieve the values of an object's properties.
  values : function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  },

  // Convert an object into a list of `[key, value]` pairs.
  pairs : function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  },

  // Invert the keys and values of an object. The values must be serializable.
  invert : function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  },

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`

  methods : function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  },
  // Extend a given object with all the properties in passed-in object(s).
  extend : function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        obj[prop] = source[prop];
      }
    }
    return obj;
  },

  // Return a copy of the object only containing the whitelisted properties.
  pick : function(obj, iteratee, context) {
    var result = {}, key;
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      iteratee = optimizeCb(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = this._flatten(arguments, false, false, 1);
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  },

  // Return a copy of the object without the blacklisted properties.
  omit : function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(this._flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  },

  // Fill in a given object with default properties.
  defaults : function(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  },

  // Create a (shallow-cloned) duplicate of an object.
  clone : function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  },

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.

  tap : function(obj, interceptor) {
    interceptor(obj);
    return obj;
  },
  // Internal recursive comparison function for `isEqual`.
  _eq : function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = Object.prototype.toString.call(a);
    if (className !== Object.prototype.toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
        && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size, result;
    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = this._eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      size = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      result = _.keys(b).length === size;
      if (result) {
        while (size--) {
          // Deep compare each member
          key = keys[size];
          if (!(result = _.has(b, key) && this._eq(a[key], b[key], aStack, bStack))) break;
        }
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  },



  // Perform a deep comparison to check if two objects are equal.
  isEqual : function(a, b) {
    return this._eq(a, b, [], []);
  },

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  isEmpty : function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  },

  // Is a given value a DOM element?
  isElement : function(obj) {
    return !!(obj && obj.nodeType === 1);
  },

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  isArray : this.nativeIsArray || function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  },

  // Is a given variable an object?
  isObject : function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  },

  isArguments: function(obj) {
    if (!Object.prototype.toString.call(function(){}) === '[object Arguments]') {
      this.isArguments = function(obj){
        return this.has(obj, 'callee');
      }
    } else {
      this.isArguments = function(obj){
        return Object.prototype.toString.call(obj) === '[object Arguments]';
      }
    }
    return this.isArguments(obj);
  },

  isFunction : function(obj) {
    if (Object.prototype.toString.call(this.noop) !== '[object Function]') {
      this.isFunction = function(obj) {
        return typeof obj == 'function' || false;
      };
    } else {
      this.isFunction = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
      }
    }
    return this.isFunction(obj);
  },

  isString : function(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  },

  isNumber : function(obj) {
    return Object.prototype.toString.call(obj) === '[object Number]';
  },

  isDate : function(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
  },

  isRegExp : function(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
  },

  isError : function(obj) {
    return Object.prototype.toString.call(obj) === '[object Error]';
  },

  // Is a given object a finite number?
  isFinite : function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  },

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  isNaN : function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  },

  // Is a given value a boolean?
  isBoolean : function(obj) {
    return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
  },

  // Is a given value equal to null?
  isNull : function(obj) {
    return obj === null;
  },

  // Is a given variable undefined?
  isUndefined : function(obj) {
    return obj === void 0;
  },

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  has : function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  },

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  noConflict : function() {
    this.root._ = this.previousUnderscore;
    return this;
  },

  // Keep the identity function around for default iteratees.
  identity : function(value) {
    return value;
  },

  // Predicate-generating functions. Often useful outside of Underscore.
  constant : function(value) {
    return function() {
      return value;
    };
  },

  noop : function(){},

  property : function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  },

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  matches : function(attrs) {
    var pairs = _.pairs(attrs), length = pairs.length;
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i], key = pair[0];
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  },

  // Run a function **n** times.
  times : function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  },

  // Return a random integer between min and max (inclusive).
  random : function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  },

  // A (possibly faster) way to get the current timestamp as an integer.
  now : Date.now || function() {
    return new Date().getTime();
  },

  // List of HTML entities for escaping.
  _escapeMap : {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  },

  _unescapeMap : {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`'
  },

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _createEscaper : function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  },

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  result : function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      return fallback;
    }
    return _.isFunction(value) ? object[property]() : value;
  },

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  _idCounter : 0,
  uniqueId : function(prefix) {
    var id = ++this._idCounter + '';
    return prefix ? prefix + id : id;
  },

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  templateSettings : {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  },

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  _noMatch : /(.)^/,

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  _escapes : {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  },

  _escaper : /\\|'|\r|\n|\u2028|\u2029/g,

  _escapeChar : function(match) {
    return '\\' + this._escapes[match];
  },

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly this._escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  template : function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || this._noMatch).source,
      (settings.interpolate || this._noMatch).source,
      (settings.evaluate || this._noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(this._escaper, this._escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  }
}

_.each = _.forEach;
_.map = _.collect;
_.reduce = _.inject;
_.foldl = _.inject;
_.reduceRight = _.foldr;
_.find = _.detect;
_.filter = _.select;
_.every = _.all;
_.some = _.any;
_.contains = _.include;
_.head = _.take;
_.first = _.take;
_.rest = _.drop;
_.tail = _.drop;
_.uniq = _.unique;
_.functions = _.methods;
_.escape = _._createEscaper(_._escapeMap);
_.unescape = _._createEscaper(_._unescapeMap);