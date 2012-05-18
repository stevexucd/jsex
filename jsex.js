/*
 * JavaScript Sequence Executer
 * Used for AJAX request
 * 
 * GNU General Public License Usage
 *	This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.
 *
 * @author steve xu
 * @email steve.xu@126.com
 * 
 * @usage 
 *      var jsex = new JSEX();
 *      var p = {
 *			x : 11
 *		};
 *		var command1 = function(){
 *			console.log('this is no arguments function');
 *			
 *			var timeout = function(){
 *				jsex.next("call next", "call next1");
 *			}
 *			
 *			setTimeout(timeout, 3000);
 *		}
 *		var command2 = function(msg, p, msg1, msg2) {
 *			console.log(msg + "-" + msg1 + "-" + msg2);
 *			console.log(p);
 *			jsex.next()
 *		}
 *		
 *		jsex.push(command1);
 *		jsex.push(command2, 'hello javascript', p);
 *		jsex.addEventHander('start', function(){console.log('jsex start')});
 *		jsex.addEventHander('end', function(){console.log('jsex finished')});
 *		jsex.exec();
 *		
 *		console output:
 *		1. jsex start
 *		2. this is no arguments function
 *		3. hello javascript-call next-call next 1 (after 3 seconds)
 *		4. jsex finished
 */

(function() {
	var JSEX = function() {
		if(!(this instanceof JSEX)) {
			return new JSEX();
		}
		this._queue = [];
		this._events = [{
			name : 'start',
			fn : function() {
			}
		},{
			name: 'end',
			fn: function(){
			}
		}];
		this._execIdx = 0;
	};

	JSEX.prototype.reset = function() {
		this._queue = [];
		this._events = [{
			name : 'start',
			fn : function() {
			}
		},{
			name : 'end',
			fn : function() {
			}
		}];
		this._execIdx = 0;
	}

	JSEX.prototype.push = function() {
		if(arguments.length >= 1) {
			if( typeof arguments[0] !== 'function') {
				throw Error("JSEX.push method need a function at first argument");
			} else {
				var args = [];
				for(var i = 1; i < arguments.length; i++) {
					args.push(arguments[i]);
				}

				this._queue.push({
					fn : arguments[0],
					args : args
				});

			}
		} else {
			throw Error("JSEX.push method need a function at first argument");
		}
	}

	JSEX.prototype.exec = function() {
		// execute the command queue
		var idx = this._execIdx;
		if (idx === 0){
			this.raiseEvent('start');
		}
		var args = this._queue[idx].args;
		var func = this._queue[idx].fn;
		func.apply(func, args);
	}

	JSEX.prototype.next = function() {
		this._execIdx++;
		if(this._execIdx >= this._queue.length) {
			// queue command finished
			this.raiseEvent('end');
		} else {
			// pass arguments to next commander
			for(var i = 0; i < arguments.length; i++) {
				this._queue[this._execIdx].args.push(arguments[i]);
			}
			this.exec();
		}
	}

	JSEX.prototype.raiseEvent = function(e) {
		for(var i = 0; i < this._events.length; i++) {
			if(e === this._events[i].name) {
				this._events[i].fn();
				break;
			}
		}
	}

	JSEX.prototype.end = function() {
		this.raiseEvent('end');
		this.reset();
	}

	JSEX.prototype.addEventHander = function(e, fn) {
		if( typeof e !== 'string' || typeof fn != 'function') {
			throw Error('JSEX addEventHander arguments error');
		}

		var bFind = false;
		for(var i = 0; i < this._events.length; i++) {
			if(e === this._events[i].name) {
				bFind = true;
				this._events[i].fn = fn;
				break;
			}
		}

		if(!bFind) {
			this._events.push({
				name : e,
				fn : fn
			});
		}
	}
	
	if( typeof exports !== "undefined") {
		exports.JSEX = JSEX;
	} else {
		this.JSEX = JSEX;
	}
}()); 
