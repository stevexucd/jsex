jsex
====

javascript sequence executer
function jsextest() {
	var jsex = new JSEX();
	var p = {
		x : 11
	};
	var command1 = function(){
		console.log('this is no arguments function');
		
		var timeout = function(){
			jsex.next("call next", "call next1");
		}
		
		setTimeout(timeout, 3000);
	}
	var command2 = function(msg, p, msg1, msg2) {
		console.log(msg + "-" + msg1 + "-" + msg2);
		console.log(p);
		jsex.next()
	}
	
	jsex.push(command1);
	jsex.push(command2, 'hello javascript', p);
	 jsex.addEventHander('start', function(){console.log('jsex start')});
	jsex.addEventHander('end', function(){console.log('jsex finishied')});
	jsex.exec();
}
