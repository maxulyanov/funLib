
;(function() {

	'use strict';

	// lib global varables
	var funLib = {
    shortName: function () {
      /** @namespace window._f */
      var _f = window._f;
			for(var item in _f) {
				var firstLetter = item.slice(0, 1);
				_f[firstLetter] = _f[item];
			}
		}
	};


	// lib global functions
	function isNumeric(num, notNegative) {
		var resultNumber = !isNaN(parseFloat(num)) && isFinite(num);
		if(resultNumber && notNegative) {
			return onlyPositive(num);
		}
		return resultNumber;
  }

  function onlyPositive(num) {
		return num >= 0;
  }



  // string methods
  var string = function () {};

  /**
   *
   * @param string
   * @param separator
   * @param marker
   * @returns {*}
   */
  string.compact = function (string, separator, marker) {
    if (!string.length)
      return string;

    var compactString = '';
    var compactObject = {};
    var compactItemIndex = 0;
    separator = separator || '|';
    marker = marker || '>';

    for (var i = 0; i < string.length; i++) {
      var currentSymbol = string[i];
      var prevSymbol = string[i - 1];

      if (i === 0) {
        compactObject[compactItemIndex] = currentSymbol;
      }
      else {
        if (prevSymbol !== currentSymbol) {
          compactItemIndex++;
        }
        if (typeof (compactObject[compactItemIndex]) === 'undefined') {
          compactObject[compactItemIndex] = currentSymbol;
        }
        else {
          compactObject[compactItemIndex] += currentSymbol;
        }
      }

    }

    for (var key in compactObject) {
      var propertyLength = compactObject[key].length > 1 ? compactObject[key].length + marker : '';
      var currentSeparator = key != compactItemIndex ? separator : '';
      compactString += propertyLength + compactObject[key].charAt(0) + currentSeparator;
    }

    return compactString;
  }

  /**
   *
   * @param string
   * @param separator
   * @param marker
   * @returns {*}
   */
  string.deCompact = function (string, separator, marker) {
    if (!string.length)
      return string;

    var deCompactString = '';
    separator = separator || '|';
    marker = marker || '>';

    string.split(separator).forEach(function (item) {
      var positionMarker = item.indexOf(marker);
      if (positionMarker < 0) {
        deCompactString += item;
      }
      else {
        var count = +item.slice(0, positionMarker);
        var it = item[positionMarker + 1];
        while (count) {
          count--;
          deCompactString += it;
        }
      }
    });

    return deCompactString;

  };



  // object methods
  var object = function () {};

  /**
   *
   * @param object
   * @param properties
   * @param callback
   * @returns {boolean}
   */
  object.watch = function(object, properties, callback) {
    if (!properties && Object.keys(object).length > 0) {
      return false;
    }

    if(properties === true) {
      var propertiesI = [];
      for(var key in object) {
        propertiesI.push(key);
      }
    }

    if (properties.length > 0) {
      for (var i = 0; i < properties.length; i++) {
        (function (index) {
          var thisPropKey = properties[index];
          var thisPropValue = object[thisPropKey];

          Object.defineProperty(object, thisPropKey, {
            configurable: true,
            enumerable: true,
            get: function () {
              return thisPropValue;
            },
            set: function (value) {
              var oldValue = thisPropValue;
              thisPropValue = value;
              if (callback && typeof(callback) === 'function') {
                callback({
                  self: this,
                  key: thisPropKey,
                  value: value,
                  oldValue: oldValue
                });
              }
            }
          });

        }(i));
      }
    }
    else {
      console.error('properties item not found');
    }
  };


	// array methods
	var array = function () {};

	/**
	 *
	 * @param array
	 * @returns {Array}
	 */
	array.uniq = function (array) {
		var result = [];

		nextIter:
			for (var i = 0; i < array.length; i++) {
				if (result.length == 0) {
					result.push(array[i]);
				}
				for (var j = 0; j < result.length; j++) {
					if (array[i] == result[j]) continue nextIter;
				}
				result.push(array[i]);
			}

		return result;

	};

	/**
	 *
	 * @param array
	 * @param types
	 * @returns {*}
	 */
	array.types = function (array, types) {
		if (!array)
			return false;

		if (!types)
			return array;


		var result = [];
		if(!Array.isArray(array)) {
			array = [array];
		}

		if (Array.isArray(types)) {
      array.forEach(function(item) {
        types.forEach(function(type) {
          if (typeof item === type) {
            result.push(item);
          }
        });
      });
		}
		else {
      array.forEach(function(item) {
        if (typeof item == types) {
          result.push(item);
        }
      });
		}

		return result;

	};

	/**
	 *
	 * @param array
	 * @returns {*}
	 */
	array.clear = function (array) {
		if (!array)
			return false;

		var result = [];

    array.forEach(function(item) {
      if (item) {
        result.push(item);
      }
    });

		return result;

	};

  /**
   *
   * @param array
   * @param values
   * @returns {*}
   */
  array.values = function (array, values) {
    if (!array)
      return false;

    if (!values)
      return array;

    var result = [];
    var innerFor;

    if (typeof values === 'object') {
      innerFor = function (i) {
        for (var j = 0; j < values.length; j++) {
          if (array[i] === values[j]) {
            return true;
          }
        }
      }
    }
    else {
      innerFor = function (i) {
        if (array[i] === values) {
          return true;
        }
      }
    }

    array.forEach(function (item, i) {
      if (innerFor(i)) {
        result.push(item);
      }
    });

    return result;

  };

  /**
   *
   * @param array
   * @param values
   * @returns {*}
   */
  array.exclude = function (array, values) {
    if (!array)
      return false;

    if (!values)
      return array;

    var copyArr = this.clone(array);
    var innerFor;

    if (Array.isArray(values)) {
      innerFor = function innerForName(i) {
        for (var j = 0; j < values.length; j++) {
          if (copyArr[i] === values[j]) {
            return true;
          }
        }
      }
    }
    else {
      innerFor = function (i) {
        if (copyArr[i] === values) {
          return true;
        }
      }
    }

    for (var i = 0; i < copyArr.length; i++) {
      if (innerFor(i)) {
        copyArr.splice(i, 1);
        i--;
      }
    }

    return copyArr;

  };

  /**
   *
   * @param array
   * @param func
   * @returns {*}
   */
  array.divide = function (array, func) {
    if (!array)
      return false;

    if (!func)
      return array;

    var result = {
      correct: [],
      wrong: []
    };

    for (var i = 0; i < array.length; i++) {
      var thisElement = array[i];
      if (func(thisElement)) {
        result.correct.push(thisElement);
        continue;
      }
      result.wrong.push(thisElement);
    }

    return result;

  };

  /**
   *
   * @param array
   * @param func
   * @returns {*}
   */
  array.filter = function (array, func) {
    if (!array)
      return false;

    if (!func)
      return array;

    var result = [];

    for (var i = 0; i < array.length; i++) {
      var thisElement = array[i];
      if (func(thisElement)) {
        result.push(thisElement);
      }
    }

    return result;

  };

  /**
   *
   * @returns {Array}
   */
  array.anywhere = function () {

    var result = [];
    var arrays = [];

    for (var i = 0; i < arguments.length; i++) {
      arrays.push(arguments[i]);
    }

    var key = 0;
    var mathesCount = 0;
    for (var j = 0; j < arrays[0].length; j++) {
      var mainItem = arrays[0][j];
      if (arrays[key] != undefined) {
        for (var k = 1; k < arrays.length; k++) {
          var innerArray = arrays[k];
          var matches = false;
          for (var l = 0; l < innerArray.length; l++) {
            if (mainItem == innerArray[l]) {
              matches = true;
              mathesCount++;
              break;
            }
          }

          if (!matches) {
            break;
          }

        }
      }
      if (mathesCount === arrays[0].length - 1) {
        result.push(mainItem);
        mathesCount = 0;
      }
      key++;
    }

    return result;

  };

  /**
   *
   * @param array
   * @param limit
   * @returns {*}
   */
  array.split = function (array, limit) {
    if (!array)
      return false;

    if (!limit)
      return array;

    var result = [];
    var storage = [];
    var count = 0;

    array.forEach(function(item, i) {
      storage.push(item);
      count++;

      if (count >= limit || (array.length - 1) === i) {
        count = 0;
        result.push(storage);
        storage = [];
      }
    });

    return result;

  };

  /**
   *
   * @param arrays
   * @returns {*}
   */
  array.zip = function (arrays) {
    if (!arrays)
      return false;

    var result = [];
    var maxIndex = 0;

    arrays.forEach(function (item) {
      if (item.length > maxIndex) {
        maxIndex = item.length;
      }
    });

    for (var j = 0; j < maxIndex; j++) {
      if (typeof (result[j]) === 'undefined') {
        result[j] = [];
      }
      pushArray(result[j], 0);
    }

    function pushArray(array, index) {
      var item;
      if (typeof (arrays[index]) != 'undefined' && typeof (arrays[index][j]) != 'undefined') {
        item = arrays[index][j];
      }
      else {
        item = null;
      }
      if (index < arrays.length) {
        array.push(item);
        index++;
        pushArray(array, index);
      }

    }

    return result;

  };

  /**
   *
   * @param arrays
   * @returns {*}
   */
  array.zipType = function (arrays) {
    if (!arrays)
      return false;

    var newArrays = this.clone(arrays);
    var result = [];
    var thisType = null;
    var thisTypeArray = [];

    while (newArrays.length > 0) {
      for (var i = 0; i < newArrays.length; i++) {
        var item = newArrays[i];
        var itemType = typeof(item);

        if (thisType === null) {
          thisType = itemType;
        }

        if (thisType === itemType) {
          thisTypeArray.push(item);
          result[thisType] = {
            'items': thisTypeArray
          };
          newArrays.splice(i, 1);
          i--;
        }
      }

      clearData();
    }

    function clearData() {
      thisTypeArray = [];
      thisType = null;
    }

    return result;

  };

  /**
   *
   * @param array
   * @returns {*}
   */
  array.parse = function (array) {
    if (!array)
      return false;

    var result = [];

    (function parse(array) {
      array.forEach(function (item) {
        var thisElement = item;
        if ((Array.isArray(thisElement))) {
          parse(thisElement);
        }
        else {
          result.push(thisElement);
        }
      });
    })(array);

    return result;

  };

  /**
   *
   * @param array
   * @returns {boolean}
   */
  array.clone = function (array) {
    if (!array)
      return false;

    return (function deepCopy(array) {
      if (Array.isArray(array)) {
        var copy = array.slice(0);
        copy.forEach(function (item) {
          item = deepCopy(item);
        });
        return copy;
      }
      else {
        return array;
      }

    })(array);

  };

  /**
   *
   * @param array
   * @param value
   * @param position
   * @returns {*}
   */
  array.search = function (array, value, position) {
    if (!array)
      return false;

    if (!value)
      return array;

    return array.indexOf(value, position || 0);

  };

  /**
	 *
	 * @param array
	 * @param count
	 * @returns {*}
	 */
	array.first = function (array, count) {
		if (!array)
			return false;

		count = count || 0;
		var result = [];

		if (count >= 1) {
			for (var i = 0; i < count; i++) {
				result.push(array[i]);
			}
			return result;
		}

		return array[0];

	};

	/**
	 *
	 * @param array
	 * @param count
	 * @returns {*}
	 */
	array.last = function (array, count) {
		if (!array)
			return false;

		count = count || 1;

		if (count > 1) {
			var copyArr = this.clone(array);
			return copyArr.splice(copyArr.length - count);
		}

		return array[array.length - 1];

	};

	/**
	 *
	 * @param array
	 * @param index
	 * @returns {*}
	 */
	array.rest = function (array, index) {
		if (!array)
			return false;

		return (array.length - 1) - index;

	};

  /**
   *
   * @param array
   * @param index
   * @returns {*}
   */
  array.index = function (array, index) {
    if (!array)
      return false;

    if (!index)
      return array;

    return array[index];

  };

	/**
	 *
	 * @param array
	 * @param step
	 * @returns {*}
	 */
	array.nthChild = function (array, step) {
		if (!array)
			return false;

		var result = [];
		if (typeof step === 'string') {
			var typeStep = step == 'even' ? true : false;
      array.forEach(function (item, i) {
        var thisIteration = (i + 1) % 2 === 0;
        if (typeStep === thisIteration) {
          result.push(item);
        }
      });
		}
		else {
			for (var i = step - 1; i < array.length; i += step) {
				result.push(array[i])
			}
		}

		return result;

	};

  /**
   *
   * @param array
   * @param numbers
   * @returns {*}
   */
  array.range = function (array, numbers) {
    var result = [];

    if (array.length < 1)
      return result;

    if (numbers[0] === undefined)
      return array;

    if (numbers[1] === undefined)
      numbers[1] = Infinity;

    array.forEach(function(item) {
      if (numbers[0] <= item && numbers[1] >= item) {
        result.push(item)
      }
    });

    return result;

  };

  /**
   *
   * @param array
   * @param fixed
   * @returns {*}
   */
  array.average = function (array, fixed) {
    var result = [];
    var total = 0;

    if (array.length < 1)
      return result;

    array.forEach(function (item) {
      if (isNumeric(item)) {
        total += item;
        result.push(item);
      }
    });

    if (fixed) {
      return +(total / result.length).toFixed(fixed);
    }

    return +(total / result.length);

  };

	/**
	 *
	 * @param array
	 * @param notNegative
	 * @returns {*}
	 */
  array.min = function (array, notNegative) {
    if (!array)
      return false;

    var minNum = 0;

    array.forEach(function (item) {
      if (isNumeric(item, notNegative)) {
        if (minNum === undefined) {
          minNum = item;
        }
        minNum = minNum > item ? item : minNum;
      }
    });

    return minNum;

  };

  /**
   *
   * @param array
   * @returns {*}
   */
  array.max = function (array) {
    if (!array)
      return false;

    var maxNum = 0;

    array.forEach(function (item) {
      if (isNumeric(item)) {
        if (maxNum === undefined) {
          maxNum = item;
        }
        maxNum = maxNum < item ? item : maxNum;
      }
    });

    return maxNum;

  };

	/**
	 *
	 * @param start
	 * @param end
	 * @param step
	 * @returns {*}
	 */
  array.createRange = function (start, end, step) {

    if (!isNumeric(start)) {
      return [];
    }

    if (!isNumeric(end)) {
      return [start];
    }

    var result = [];
    step = step || 1;

    if (1 > step) {
      step = 1;
    }

    if (isNumeric(start) && isNumeric(end)) {
      for (var i = start; i <= end; i += step) {
        result.push(i);
      }
    }

    return result;

  };


  /**
   *
   * @param array
   * @param deep
   * @returns {*}
   */
  array.inObject = function (array, deep) {
    if (!array)
      return false;

    var result = {};

    if (deep) {
      result = (function deepCopy(array) {
        if (Array.isArray(array)) {
          var copy = array.slice(0);
          var copyObj = {};
          copy.forEach(function(item, i) {
            copyObj[i] = deepCopy(item);
          });
          return copyObj;
        }
        else {
          return array;
        }

      })(array);
    }
    else {
      array.forEach(function(item, i) {
        result[i] = item;
      })
    }

    return result;

  };

  /**
   *
   * @param keys
   * @param values
   * @returns {*}
   */
  array.inObjectKey = function (keys, values) {
    if (!keys || !values)
      return false;

    var result = {};
    keys.forEach(function(item, i) {
      result[item] = values[i];
    });

    return result;

  };


	// gathering objects
	funLib.object = object;
	funLib.array = array;
  funLib.string = string;

	// import global scope
	window._f = funLib;

})(); 
