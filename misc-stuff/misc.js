//add(1)(2)(3) == 6
let add = function(i) {
	let f = function(j) {
		return add(i + j)
	};
	f.toString = function() { return i };
	return f
}
add(1)(2)(3) == 6

// prototype inherentance
function Foo() {this.foo = 123; this.say = function(){console.log('hi')}}
function Bar() {this.bar = 456; this.say = function(){console.log('Hi hi')}}
Bar.prototype = new Foo();

function Bar2() {
	this.__proto__ = new Foo(); this.bar = 456; this.say = function(){console.log('Hi hi')
}}

