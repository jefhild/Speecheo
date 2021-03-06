(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = function() {
	this.h = { };
};
$hxClasses["Hash"] = Hash;
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntHash = function() {
	this.h = { };
};
$hxClasses["IntHash"] = IntHash;
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: IntHash
}
var IntIter = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIter"] = IntIter;
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = function() { }
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var Xml = function() {
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = ["Xml"];
Xml.Element = null;
Xml.PCData = null;
Xml.CData = null;
Xml.Comment = null;
Xml.DocType = null;
Xml.Prolog = null;
Xml.Document = null;
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new Hash();
	r.setNodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.setNodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.setNodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.setNodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.setNodeValue(data);
	return r;
}
Xml.createProlog = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Prolog;
	r.setNodeValue(data);
	return r;
}
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
Xml.prototype = {
	toString: function() {
		if(this.nodeType == Xml.PCData) return this._nodeValue;
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.Prolog) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("<");
			s.b += Std.string(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b += Std.string(" ");
				s.b += Std.string(k);
				s.b += Std.string("=\"");
				s.b += Std.string(this._attributes.get(k));
				s.b += Std.string("\"");
			}
			if(this._children.length == 0) {
				s.b += Std.string("/>");
				return s.b;
			}
			s.b += Std.string(">");
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.b += Std.string(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("</");
			s.b += Std.string(this._nodeName);
			s.b += Std.string(">");
		}
		return s.b;
	}
	,insertChild: function(x,pos) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.splice(pos,0,x);
	}
	,removeChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		var b = HxOverrides.remove(this._children,x);
		if(b) x._parent = null;
		return b;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k++;
				if(n.nodeType == Xml.Element && n._nodeName == name) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.keys();
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,remove: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.remove(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,getParent: function() {
		return this._parent;
	}
	,setNodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,getNodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,setNodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,getNodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,_parent: null
	,_children: null
	,_attributes: null
	,_nodeValue: null
	,_nodeName: null
	,parent: null
	,nodeValue: null
	,nodeName: null
	,nodeType: null
	,__class__: Xml
	,__properties__: {set_nodeName:"setNodeName",get_nodeName:"getNodeName",set_nodeValue:"setNodeValue",get_nodeValue:"getNodeValue",get_parent:"getParent"}
}
var brix = {}
brix.component = {}
brix.component.IBrixComponent = function() { }
$hxClasses["brix.component.IBrixComponent"] = brix.component.IBrixComponent;
brix.component.IBrixComponent.__name__ = ["brix","component","IBrixComponent"];
brix.component.IBrixComponent.prototype = {
	getBrixApplication: null
	,brixInstanceId: null
	,__class__: brix.component.IBrixComponent
}
brix.component.BrixComponent = function() { }
$hxClasses["brix.component.BrixComponent"] = brix.component.BrixComponent;
brix.component.BrixComponent.__name__ = ["brix","component","BrixComponent"];
brix.component.BrixComponent.initBrixComponent = function(component,brixInstanceId) {
	component.brixInstanceId = brixInstanceId;
}
brix.component.BrixComponent.getBrixApplication = function(component) {
	return brix.core.Application.get(component.brixInstanceId);
}
brix.component.BrixComponent.checkRequiredParameters = function(cmpClass,elt) {
	var requires = haxe.rtti.Meta.getType(cmpClass).requires;
	if(requires == null) return;
	var _g = 0;
	while(_g < requires.length) {
		var r = requires[_g];
		++_g;
		if(elt.getAttribute(Std.string(r)) == null || StringTools.trim(elt.getAttribute(Std.string(r))) == "") throw Std.string(r) + " parameter is required for " + Type.getClassName(cmpClass);
	}
}
brix.component.ui = {}
brix.component.ui.IDisplayObject = function() { }
$hxClasses["brix.component.ui.IDisplayObject"] = brix.component.ui.IDisplayObject;
brix.component.ui.IDisplayObject.__name__ = ["brix","component","ui","IDisplayObject"];
brix.component.ui.IDisplayObject.__interfaces__ = [brix.component.IBrixComponent];
brix.component.ui.IDisplayObject.prototype = {
	rootElement: null
	,__class__: brix.component.ui.IDisplayObject
}
brix.component.ui.DisplayObject = function(rootElement,brixId) {
	this.rootElement = rootElement;
	this.eventMap = new brix.core.EventMap();
	brix.component.BrixComponent.initBrixComponent(this,brixId);
	this.getBrixApplication().addAssociatedComponent(rootElement,this);
};
$hxClasses["brix.component.ui.DisplayObject"] = brix.component.ui.DisplayObject;
brix.component.ui.DisplayObject.__name__ = ["brix","component","ui","DisplayObject"];
brix.component.ui.DisplayObject.__interfaces__ = [brix.component.ui.IDisplayObject];
brix.component.ui.DisplayObject.isDisplayObject = function(cmpClass) {
	if(cmpClass == Type.resolveClass("brix.component.ui.DisplayObject")) return true;
	if(Type.getSuperClass(cmpClass) != null) return brix.component.ui.DisplayObject.isDisplayObject(Type.getSuperClass(cmpClass));
	return false;
}
brix.component.ui.DisplayObject.checkFilterOnElt = function(cmpClass,elt) {
	if(elt.nodeType != js.Lib.document.body.nodeType) throw "cannot instantiate " + Type.getClassName(cmpClass) + " on a non element node.";
	var tagFilter = haxe.rtti.Meta.getType(cmpClass) != null?haxe.rtti.Meta.getType(cmpClass).tagNameFilter:null;
	if(tagFilter == null) return;
	if(Lambda.exists(tagFilter,function(s) {
		return elt.nodeName.toLowerCase() == Std.string(s).toLowerCase();
	})) return;
	throw "cannot instantiate " + Type.getClassName(cmpClass) + " on this type of HTML element: " + elt.nodeName.toLowerCase();
}
brix.component.ui.DisplayObject.prototype = {
	clean: function() {
		this.unmapListeners();
	}
	,init: function() {
	}
	,dispatch: function(eventType,data,dispatcher,cancelable,direction) {
		if(cancelable == null) cancelable = true;
		if(dispatcher == null) dispatcher = this.rootElement;
		if(direction == null) direction = brix.core.EventDirection.up;
		this.eventMap.dispatch(eventType,data,dispatcher,cancelable,direction);
	}
	,unmapListeners: function() {
		this.eventMap.unmapListeners();
	}
	,unmapListener: function(dispatcher,type,listener,useCapture) {
		if(useCapture == null) useCapture = false;
		this.eventMap.unmapListener(dispatcher,type,listener,useCapture);
	}
	,mapListener: function(dispatcher,type,listener,useCapture) {
		if(useCapture == null) useCapture = false;
		this.eventMap.mapListener(dispatcher,type,listener,useCapture);
	}
	,remove: function() {
		this.clean();
		this.getBrixApplication().removeAssociatedComponent(this.rootElement,this);
	}
	,getBrixApplication: function() {
		return brix.component.BrixComponent.getBrixApplication(this);
	}
	,eventMap: null
	,rootElement: null
	,brixInstanceId: null
	,__class__: brix.component.ui.DisplayObject
}
brix.component.group = {}
brix.component.group.Group = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	var explodedClassName = rootElement.className.split(" ");
	if(Lambda.has(explodedClassName,"Group")) {
		brix.component.group.Group.GROUP_SEQ++;
		var newGroupId = "Group" + brix.component.group.Group.GROUP_SEQ + "r";
		HxOverrides.remove(explodedClassName,"Group");
		explodedClassName.unshift(newGroupId);
		rootElement.className = explodedClassName.join(" ");
		var $it0 = this.discoverGroupableChilds(rootElement).iterator();
		while( $it0.hasNext() ) {
			var gc = $it0.next();
			gc.setAttribute("data-group-id",newGroupId);
		}
	}
};
$hxClasses["brix.component.group.Group"] = brix.component.group.Group;
brix.component.group.Group.__name__ = ["brix","component","group","Group"];
brix.component.group.Group.__super__ = brix.component.ui.DisplayObject;
brix.component.group.Group.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	discoverGroupableChilds: function(elt) {
		var groupables = new List();
		var _g1 = 0, _g = elt.childNodes.length;
		while(_g1 < _g) {
			var childCnt = _g1++;
			if(elt.childNodes[childCnt].nodeType != 1) continue;
			if(elt.childNodes[childCnt].className != null) {
				var _g2 = 0, _g3 = elt.childNodes[childCnt].className.split(" ");
				while(_g2 < _g3.length) {
					var c = _g3[_g2];
					++_g2;
					var rc = this.getBrixApplication().resolveUIComponentClass(c,brix.component.group.IGroupable);
					if(rc == null) continue;
					groupables.add(elt.childNodes[childCnt]);
					break;
				}
				if(Lambda.has(elt.childNodes[childCnt].className.split(" "),"Group")) continue;
			}
			groupables = Lambda.concat(groupables,this.discoverGroupableChilds(elt.childNodes[childCnt]));
		}
		return groupables;
	}
	,__class__: brix.component.group.Group
});
brix.component.group.IGroupable = function() { }
$hxClasses["brix.component.group.IGroupable"] = brix.component.group.IGroupable;
brix.component.group.IGroupable.__name__ = ["brix","component","group","IGroupable"];
brix.component.group.IGroupable.__interfaces__ = [brix.component.ui.IDisplayObject];
brix.component.group.IGroupable.prototype = {
	groupElement: null
	,__class__: brix.component.group.IGroupable
}
brix.component.group.Groupable = function() { }
$hxClasses["brix.component.group.Groupable"] = brix.component.group.Groupable;
brix.component.group.Groupable.__name__ = ["brix","component","group","Groupable"];
brix.component.group.Groupable.startGroupable = function(groupable,rootElement) {
	var groupId = groupable.rootElement.getAttribute("data-group-id");
	if(groupId == null) return;
	if(rootElement == null) {
		var groupElements = groupable.getBrixApplication().body.getElementsByClassName(groupId);
		if(groupElements.length < 1) return;
		if(groupElements.length > 1) throw "ERROR " + groupElements.length + " Group components are declared with the same group id " + groupId;
		groupable.groupElement = groupElements[0];
	} else {
		var domElement = rootElement;
		while(domElement != null && !brix.util.DomTools.hasClass(domElement,groupId)) domElement = domElement.parentNode;
		if(domElement != null) groupable.groupElement = domElement; else return;
	}
}
brix.component.layout = {}
brix.component.layout.LayoutBase = function(rootElement,BrixId) {
	this.preventRedraw = false;
	brix.component.ui.DisplayObject.call(this,rootElement,BrixId);
	this.mapListener(js.Lib.window,"resize",$bind(this,this.redrawCallback),false);
	this.mapListener(js.Lib.document.body,"pageOpenStop",$bind(this,this.navigationCallback),true);
	this.mapListener(js.Lib.document.body,"pageCloseStop",$bind(this,this.navigationCallback),true);
	this.mapListener(js.Lib.document.body,"changeContextEvent",$bind(this,this.navigationCallback),true);
	this.mapListener(js.Lib.document.body,"changeStateEvent",$bind(this,this.navigationCallback),true);
	this.mapListener(js.Lib.document.body,"layoutRedraw",$bind(this,this.redrawCallback),true);
};
$hxClasses["brix.component.layout.LayoutBase"] = brix.component.layout.LayoutBase;
brix.component.layout.LayoutBase.__name__ = ["brix","component","layout","LayoutBase"];
brix.component.layout.LayoutBase.__super__ = brix.component.ui.DisplayObject;
brix.component.layout.LayoutBase.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	redraw: function() {
		if(this.preventRedraw) return;
		this.preventRedraw = true;
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent("layoutRedraw",true,true,{ target : this.rootElement, component : this});
		this.rootElement.dispatchEvent(event);
		this.preventRedraw = false;
	}
	,redrawCallback: function(e) {
		this.redraw();
	}
	,navigationCallback: function(e) {
		brix.util.DomTools.doLater($bind(this,this.redraw));
	}
	,init: function() {
		brix.component.ui.DisplayObject.prototype.init.call(this);
	}
	,preventRedraw: null
	,__class__: brix.component.layout.LayoutBase
});
brix.component.layout.Panel = function(rootElement,brixId) {
	brix.component.layout.LayoutBase.call(this,rootElement,brixId);
	var cssClassName = rootElement.getAttribute("data-panel-header-class-name");
	if(cssClassName == null) cssClassName = "panel-header";
	this.header = brix.util.DomTools.getSingleElement(rootElement,cssClassName,false);
	if(this.header == null) null;
	var cssClassName1 = rootElement.getAttribute("data-panel-body-class-name");
	if(cssClassName1 == null) cssClassName1 = "panel-body";
	this.body = brix.util.DomTools.getSingleElement(rootElement,cssClassName1,true);
	var cssClassName2 = rootElement.getAttribute("data-panel-footer-class-name");
	if(cssClassName2 == null) cssClassName2 = "panel-footer";
	this.footer = brix.util.DomTools.getSingleElement(rootElement,cssClassName2,false);
	if(this.footer == null) null;
	if(rootElement.getAttribute("data-panel-is-horizontal") == "true") this.isHorizontal = true; else this.isHorizontal = false;
};
$hxClasses["brix.component.layout.Panel"] = brix.component.layout.Panel;
brix.component.layout.Panel.__name__ = ["brix","component","layout","Panel"];
brix.component.layout.Panel.__super__ = brix.component.layout.LayoutBase;
brix.component.layout.Panel.prototype = $extend(brix.component.layout.LayoutBase.prototype,{
	redraw: function() {
		if(this.preventRedraw) return;
		var bodySize;
		var boundingBox = brix.util.DomTools.getElementBoundingBox(this.rootElement);
		if(this.isHorizontal) {
			var margin = this.rootElement.offsetWidth - this.rootElement.clientWidth;
			var bodyMargin = this.body.offsetWidth - this.body.clientWidth;
			bodySize = boundingBox.w;
			if(this.header != null) {
				var bbHeader = brix.util.DomTools.getElementBoundingBox(this.header);
				brix.util.DomTools.moveTo(this.body,bbHeader.w,null);
				bodySize -= bbHeader.w;
			} else brix.util.DomTools.moveTo(this.body,0,null);
			bodySize -= bodyMargin;
			bodySize -= margin;
			if(this.footer != null) {
				var footerMargin = this.footer.offsetWidth - this.footer.clientWidth;
				var boundingBox1 = brix.util.DomTools.getElementBoundingBox(this.footer);
				bodySize -= boundingBox1.w;
				bodySize -= footerMargin;
			}
			this.body.style.width = bodySize + "px";
		} else {
			var margin = this.rootElement.offsetHeight - this.rootElement.clientHeight;
			var bodyMargin = this.body.offsetHeight - this.body.clientHeight;
			bodySize = boundingBox.h;
			if(this.header != null) {
				var bbHeader = brix.util.DomTools.getElementBoundingBox(this.header);
				brix.util.DomTools.moveTo(this.body,null,bbHeader.h);
				bodySize -= bbHeader.h;
			} else brix.util.DomTools.moveTo(this.body,null,0);
			bodySize -= bodyMargin;
			bodySize -= margin;
			if(this.footer != null) {
				var footerMargin = this.footer.offsetHeight - this.footer.clientHeight;
				var boundingBox1 = brix.util.DomTools.getElementBoundingBox(this.footer);
				bodySize -= boundingBox1.h;
				bodySize -= footerMargin;
			}
			this.body.style.height = bodySize + "px";
		}
		brix.component.layout.LayoutBase.prototype.redraw.call(this);
	}
	,init: function() {
		brix.component.layout.LayoutBase.prototype.init.call(this);
	}
	,footer: null
	,header: null
	,body: null
	,isHorizontal: null
	,__class__: brix.component.layout.Panel
});
brix.component.navigation = {}
brix.component.navigation.ContextManager = function(rootElement,brixId) {
	this.isDirty = false;
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	if(rootElement.getAttribute("data-context-list") != null) this.allContexts = this.string2ContextList(rootElement.getAttribute("data-context-list")); else throw "Error: Context component needs param in " + "data-context-list";
	this.mapListener(rootElement,"addContextsEvent",$bind(this,this.onAddContextEvent),true);
	this.mapListener(rootElement,"removeContextsEvent",$bind(this,this.onRemoveContextEvent),true);
	this.mapListener(rootElement,"resetContextsEvent",$bind(this,this.onResetContextEvent),true);
	this.mapListener(rootElement,"replaceContextsEvent",$bind(this,this.onReplaceContextsEvent),true);
	this.mapListener(rootElement,"toggleContextsEvent",$bind(this,this.onToggleContextsEvent),true);
};
$hxClasses["brix.component.navigation.ContextManager"] = brix.component.navigation.ContextManager;
brix.component.navigation.ContextManager.__name__ = ["brix","component","navigation","ContextManager"];
brix.component.navigation.ContextManager.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.ContextManager.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	contextList2String: function(contextList) {
		return contextList.concat(", ");
	}
	,cleanupContextValue: function(contextName) {
		return StringTools.trim(contextName).toLowerCase();
	}
	,string2ContextList: function(string) {
		var contextList = string.split(",");
		var _g1 = 0, _g = contextList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			contextList[idx] = this.cleanupContextValue(contextList[idx]);
		}
		return contextList;
	}
	,refresh: function() {
		this.isDirty = false;
	}
	,isOutContext: function(element) {
		if(element.className != null) {
			var elementClasses = element.className.split(" ");
			var _g = 0;
			while(_g < elementClasses.length) {
				var className = elementClasses[_g];
				++_g;
				className = this.cleanupContextValue(className);
				if(this.isContext(className) && !this.hasContext(className)) return true;
			}
		}
		return false;
	}
	,isInContext: function(element) {
		if(element.className != null) {
			var elementClasses = element.className.split(" ");
			var _g = 0;
			while(_g < elementClasses.length) {
				var className = elementClasses[_g];
				++_g;
				className = this.cleanupContextValue(className);
				if(this.isContext(className) && this.hasContext(className)) return true;
			}
		}
		return false;
	}
	,isContext: function(context) {
		return Lambda.has(this.allContexts,context);
	}
	,hasContext: function(context) {
		return Lambda.has(this.currentContexts,context);
	}
	,toggleContext: function(context) {
		if(!this.isContext(context)) throw "Error: unknown context \"" + context + "\". It should be defined in the \"" + "data-context-list" + "\" parameter of the Context component.";
		if(this.hasContext(context)) this.removeContext(context); else this.addContext(context);
	}
	,removeContext: function(context) {
		if(!this.isContext(context)) throw "Error: unknown context \"" + context + "\". It should be defined in the \"" + "data-context-list" + "\" parameter of the Context component.";
		if(this.hasContext(context)) {
			HxOverrides.remove(this.currentContexts,context);
			this.invalidate();
		} else {
		}
	}
	,addContext: function(context) {
		if(!this.isContext(context)) throw "Error: unknown context \"" + context + "\". It should be defined in the \"" + "data-context-list" + "\" parameter of the Context component.";
		if(!this.hasContext(context)) {
			this.currentContexts.push(context);
			this.invalidate();
		} else {
		}
	}
	,setCurrentContexts: function(contextList) {
		this.currentContexts = contextList;
		this.invalidate();
		return contextList;
	}
	,invalidate: function() {
		this.refresh();
		this.isDirty = true;
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent("changeContextEvent",true,true,this);
		this.rootElement.dispatchEvent(event);
	}
	,onResetContextEvent: function(e) {
		this.resetContexts();
	}
	,onToggleContextsEvent: function(e) {
		var contextValues = e.detail;
		var _g = 0;
		while(_g < contextValues.length) {
			var contextValue = contextValues[_g];
			++_g;
			this.toggleContext(contextValue);
		}
	}
	,onReplaceContextsEvent: function(e) {
		var contextValues = e.detail;
		this.setCurrentContexts(contextValues);
	}
	,onRemoveContextEvent: function(e) {
		var contextValues = e.detail;
		var _g = 0;
		while(_g < contextValues.length) {
			var contextValue = contextValues[_g];
			++_g;
			this.removeContext(contextValue);
		}
	}
	,onAddContextEvent: function(e) {
		var contextValues = e.detail;
		var _g = 0;
		while(_g < contextValues.length) {
			var contextValue = contextValues[_g];
			++_g;
			this.addContext(contextValue);
		}
	}
	,resetContexts: function() {
		if(this.rootElement.getAttribute("data-initial-context") != null) this.setCurrentContexts(this.string2ContextList(this.rootElement.getAttribute("data-initial-context"))); else this.setCurrentContexts(new Array());
	}
	,init: function() {
		brix.component.ui.DisplayObject.prototype.init.call(this);
		this.resetContexts();
	}
	,isDirty: null
	,currentContexts: null
	,allContexts: null
	,__class__: brix.component.navigation.ContextManager
	,__properties__: {set_currentContexts:"setCurrentContexts"}
});
brix.component.navigation.LayerStatus = $hxClasses["brix.component.navigation.LayerStatus"] = { __ename__ : ["brix","component","navigation","LayerStatus"], __constructs__ : ["showTransition","hideTransition","visible","hidden","notInit"] }
brix.component.navigation.LayerStatus.showTransition = ["showTransition",0];
brix.component.navigation.LayerStatus.showTransition.toString = $estr;
brix.component.navigation.LayerStatus.showTransition.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.hideTransition = ["hideTransition",1];
brix.component.navigation.LayerStatus.hideTransition.toString = $estr;
brix.component.navigation.LayerStatus.hideTransition.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.visible = ["visible",2];
brix.component.navigation.LayerStatus.visible.toString = $estr;
brix.component.navigation.LayerStatus.visible.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.hidden = ["hidden",3];
brix.component.navigation.LayerStatus.hidden.toString = $estr;
brix.component.navigation.LayerStatus.hidden.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.notInit = ["notInit",4];
brix.component.navigation.LayerStatus.notInit.toString = $estr;
brix.component.navigation.LayerStatus.notInit.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.Layer = function(rootElement,brixId) {
	this.hasTransitionStarted = false;
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	this.childrenArray = new Array();
	this.setStatus(brix.component.navigation.LayerStatus.notInit);
	this.styleAttrDisplay = rootElement.style.display;
};
$hxClasses["brix.component.navigation.Layer"] = brix.component.navigation.Layer;
brix.component.navigation.Layer.__name__ = ["brix","component","navigation","Layer"];
brix.component.navigation.Layer.getLayerNodes = function(pageName,brixId,root) {
	if(pageName == null) pageName = "";
	var body = root;
	if(root == null) body = brix.core.Application.get(brixId).body;
	if(pageName != "") return body.getElementsByClassName(pageName); else return body.getElementsByClassName("Layer");
}
brix.component.navigation.Layer.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.Layer.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	cleanupVideoElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				element.pause();
				element.currentTime = 0;
			} catch( e ) {
				null;
			}
		}
	}
	,cleanupAudioElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				element.pause();
				element.currentTime = 0;
			} catch( e ) {
				null;
			}
		}
	}
	,setupVideoElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				if(element.autoplay == true) {
					element.currentTime = 0;
					element.play();
				}
				element.muted = brix.component.sound.SoundOn.isMuted;
			} catch( e ) {
				null;
			}
		}
	}
	,setupAudioElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				if(element.autoplay == true) {
					element.currentTime = 0;
					element.play();
				}
				element.muted = brix.component.sound.SoundOn.isMuted;
			} catch( e ) {
				null;
			}
		}
	}
	,doHide: function(transitionData,transitionObserver,preventTransitions,e) {
		if(e != null && e.target != this.rootElement) return;
		if(preventTransitions == false && this.doHideCallback == null) return;
		if(preventTransitions == false) {
			this.endTransition(brix.component.navigation.transition.TransitionType.hide,transitionData,this.doHideCallback);
			this.doHideCallback = null;
		}
		this.setStatus(brix.component.navigation.LayerStatus.hidden);
		try {
			this.dispatch("onLayerHideStop",{ transitionObserver : transitionObserver, transitionData : transitionData, target : this.rootElement, layer : this},this.rootElement,true,brix.core.EventDirection.down);
		} catch( e1 ) {
			null;
		}
		if(transitionObserver != null) transitionObserver.removeTransition(this);
		while(this.rootElement.childNodes.length > 0) {
			var element = this.rootElement.childNodes[0];
			this.rootElement.removeChild(element);
			this.childrenArray.push(element);
		}
		this.rootElement.style.display = "none";
	}
	,hide: function(transitionData,transitionObserver,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		if(this.status == brix.component.navigation.LayerStatus.hideTransition) {
			this.doHideCallback(null);
			this.removeTransitionEvent(this.doHideCallback);
		} else if(this.status == brix.component.navigation.LayerStatus.showTransition) {
			this.doShowCallback(null);
			this.removeTransitionEvent(this.doShowCallback);
		}
		if(this.status != brix.component.navigation.LayerStatus.visible && this.status != brix.component.navigation.LayerStatus.notInit) {
			this.dispatch("onLayerHideAgain",{ transitionObserver : transitionObserver, transitionData : transitionData, target : this.rootElement, layer : this},this.rootElement,true,brix.core.EventDirection.down);
			return;
		}
		this.setStatus(brix.component.navigation.LayerStatus.hideTransition);
		if(transitionObserver != null) transitionObserver.addTransition(this);
		try {
			this.dispatch("onLayerHideStart",{ transitionObserver : transitionObserver, transitionData : transitionData, target : this.rootElement, layer : this},this.rootElement,true,brix.core.EventDirection.down);
		} catch( e ) {
			null;
		}
		var audioNodes = this.rootElement.getElementsByTagName("audio");
		this.cleanupAudioElements(audioNodes);
		var videoNodes = this.rootElement.getElementsByTagName("video");
		this.cleanupVideoElements(videoNodes);
		if(preventTransitions == false) {
			this.doHideCallback = (function(f,a1,a2,a3) {
				return function(e) {
					return f(a1,a2,a3,e);
				};
			})($bind(this,this.doHide),transitionData,transitionObserver,preventTransitions);
			this.startTransition(brix.component.navigation.transition.TransitionType.hide,transitionData,this.doHideCallback);
		} else this.doHide(transitionData,transitionObserver,preventTransitions,null);
	}
	,doShow: function(transitionData,transitionObserver,preventTransitions,e) {
		if(e != null && e.target != this.rootElement) return;
		if(preventTransitions == false && this.doShowCallback == null) return;
		if(preventTransitions == false) this.endTransition(brix.component.navigation.transition.TransitionType.show,transitionData,this.doShowCallback);
		this.doShowCallback = null;
		this.setStatus(brix.component.navigation.LayerStatus.visible);
		var audioNodes = this.rootElement.getElementsByTagName("audio");
		this.setupAudioElements(audioNodes);
		var videoNodes = this.rootElement.getElementsByTagName("video");
		this.setupVideoElements(videoNodes);
		try {
			this.dispatch("onLayerShowStop",{ transitionObserver : transitionObserver, transitionData : transitionData, target : this.rootElement, layer : this},this.rootElement,true,brix.core.EventDirection.down);
		} catch( e1 ) {
			null;
		}
		if(transitionObserver != null) transitionObserver.removeTransition(this);
	}
	,show: function(transitionData,transitionObserver,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		if(this.status == brix.component.navigation.LayerStatus.hideTransition) {
			this.doHideCallback(null);
			this.removeTransitionEvent(this.doHideCallback);
		} else if(this.status == brix.component.navigation.LayerStatus.showTransition) {
			this.doShowCallback(null);
			this.removeTransitionEvent(this.doShowCallback);
		}
		if(this.status != brix.component.navigation.LayerStatus.hidden && this.status != brix.component.navigation.LayerStatus.notInit) {
			this.dispatch("onLayerShowAgain",{ transitionObserver : transitionObserver, transitionData : transitionData, target : this.rootElement, layer : this},this.rootElement,true,brix.core.EventDirection.down);
			if(transitionObserver != null) transitionObserver.alreadyOpen(this);
			return;
		}
		this.setStatus(brix.component.navigation.LayerStatus.showTransition);
		while(this.childrenArray.length > 0) {
			var element = this.childrenArray.shift();
			this.rootElement.appendChild(element);
		}
		if(transitionObserver != null) transitionObserver.addTransition(this);
		try {
			this.dispatch("onLayerShowStart",{ transitionObserver : transitionObserver, transitionData : transitionData, target : this.rootElement, layer : this},this.rootElement,true,brix.core.EventDirection.down);
		} catch( e ) {
			null;
		}
		if(preventTransitions == false) {
			this.doShowCallback = (function(f,a1,a2,a3) {
				return function(e) {
					return f(a1,a2,a3,e);
				};
			})($bind(this,this.doShow),transitionData,transitionObserver,preventTransitions);
			this.startTransition(brix.component.navigation.transition.TransitionType.show,transitionData,this.doShowCallback);
		} else this.doShow(transitionData,transitionObserver,preventTransitions,null);
		this.rootElement.style.display = this.styleAttrDisplay;
	}
	,removeTransitionEvent: function(onEndCallback) {
		this.unmapListener(this.rootElement,"transitionend",onEndCallback,false);
		this.unmapListener(this.rootElement,"transitionEnd",onEndCallback,false);
		this.unmapListener(this.rootElement,"webkitTransitionEnd",onEndCallback,false);
		this.unmapListener(this.rootElement,"oTransitionEnd",onEndCallback,false);
		this.unmapListener(this.rootElement,"MSTransitionEnd",onEndCallback,false);
	}
	,addTransitionEvent: function(onEndCallback) {
		this.mapListener(this.rootElement,"transitionend",onEndCallback,false);
		this.mapListener(this.rootElement,"transitionEnd",onEndCallback,false);
		this.mapListener(this.rootElement,"webkitTransitionEnd",onEndCallback,false);
		this.mapListener(this.rootElement,"oTransitionEnd",onEndCallback,false);
		this.mapListener(this.rootElement,"MSTransitionEnd",onEndCallback,false);
	}
	,endTransition: function(type,transitionData,onComplete) {
		this.removeTransitionEvent(onComplete);
		if(transitionData != null) brix.util.DomTools.removeClass(this.rootElement,transitionData.endStyleName);
		var transitionData2 = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,type);
		if(transitionData2 != null) brix.util.DomTools.removeClass(this.rootElement,transitionData2.endStyleName);
	}
	,doStartTransition: function(sumOfTransitions,onComplete) {
		var _g = 0;
		while(_g < sumOfTransitions.length) {
			var transition = sumOfTransitions[_g];
			++_g;
			brix.util.DomTools.removeClass(this.rootElement,transition.startStyleName);
		}
		if(onComplete != null) this.addTransitionEvent(onComplete);
		brix.component.navigation.transition.TransitionTools.setTransitionProperty(this.rootElement,"transitionDuration",null);
		var _g = 0;
		while(_g < sumOfTransitions.length) {
			var transition = sumOfTransitions[_g];
			++_g;
			brix.util.DomTools.addClass(this.rootElement,transition.endStyleName);
		}
	}
	,startTransition: function(type,transitionData,onComplete) {
		var transitionData2 = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,type);
		var sumOfTransitions = new Array();
		if(transitionData != null) sumOfTransitions.push(transitionData);
		if(transitionData2 != null) sumOfTransitions.push(transitionData2);
		if(sumOfTransitions.length == 0) {
			if(onComplete != null) onComplete(null);
		} else {
			this.hasTransitionStarted = true;
			brix.component.navigation.transition.TransitionTools.setTransitionProperty(this.rootElement,"transitionDuration","0");
			var _g = 0;
			while(_g < sumOfTransitions.length) {
				var transition = sumOfTransitions[_g];
				++_g;
				brix.util.DomTools.addClass(this.rootElement,transition.startStyleName);
			}
			brix.util.DomTools.doLater((function(f,a1,a2) {
				return function() {
					return f(a1,a2);
				};
			})($bind(this,this.doStartTransition),sumOfTransitions,onComplete));
		}
	}
	,checkForNeverEndingTransition: function() {
		if(this.status == brix.component.navigation.LayerStatus.showTransition || this.status == brix.component.navigation.LayerStatus.hideTransition) haxe.Timer.delay($bind(this,this.checkForNeverEndingTransition),2500);
	}
	,setStatus: function(newStatus) {
		this.status = newStatus;
		if(this.status == brix.component.navigation.LayerStatus.showTransition || this.status == brix.component.navigation.LayerStatus.hideTransition) haxe.Timer.delay($bind(this,this.checkForNeverEndingTransition),2500);
		return this.status;
	}
	,doHideCallback: null
	,doShowCallback: null
	,styleAttrDisplay: null
	,hasTransitionStarted: null
	,status: null
	,childrenArray: null
	,__class__: brix.component.navigation.Layer
	,__properties__: {set_status:"setStatus"}
});
brix.component.navigation.Page = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	brix.component.group.Groupable.startGroupable(this);
	if(this.groupElement == null) this.groupElement = this.getBrixApplication().body;
	this.name = rootElement.getAttribute("name");
	if(this.name == null || StringTools.trim(this.name) == "") throw "Pages must have a 'name' attribute";
	if(brix.component.navigation.Page.useDeeplink == null) brix.component.navigation.Page.useDeeplink = brix.util.DomTools.getMeta("useDeeplink") == null || brix.util.DomTools.getMeta("useDeeplink") == "true";
	if(brix.component.navigation.Page.useDeeplink) this.mapListener(js.Lib.window,"popstate",$bind(this,this.onPopState),true);
};
$hxClasses["brix.component.navigation.Page"] = brix.component.navigation.Page;
brix.component.navigation.Page.__name__ = ["brix","component","navigation","Page"];
brix.component.navigation.Page.__interfaces__ = [brix.component.group.IGroupable];
brix.component.navigation.Page.openPage = function(pageName,isPopup,transitionDataShow,transitionDataHide,brixId,root) {
	var body = root;
	if(root == null) body = brix.core.Application.get(brixId).body;
	var pageURL = pageName.split("?");
	var page = brix.component.navigation.Page.getPageByName(pageURL[0],brixId,body);
	if(page == null) {
		page = brix.component.navigation.Page.getPageByName(pageURL[0],brixId);
		if(page == null) throw "Error, could not find a page with name " + pageName;
	}
	page.query = { };
	if(pageURL[1] != null) {
		var queryString = pageURL[1];
		queryString = StringTools.htmlUnescape(queryString);
		queryString = StringTools.urlDecode(queryString);
		queryString = StringTools.htmlUnescape(queryString);
		brix.component.navigation.Page.updateQuery(page,queryString);
	}
	page.open(transitionDataShow,transitionDataHide,!isPopup);
}
brix.component.navigation.Page.closePage = function(pageName,transitionData,brixId,root) {
	var body = root;
	if(root == null) body = brix.core.Application.get(brixId).body;
	var page = brix.component.navigation.Page.getPageByName(pageName,brixId,body);
	if(page == null) {
		page = brix.component.navigation.Page.getPageByName(pageName,brixId);
		if(page == null) throw "Error, could not find a page with name " + pageName;
	}
	page.close(transitionData);
}
brix.component.navigation.Page.getPageNodes = function(brixId,root) {
	var body = root;
	if(root == null) body = brix.core.Application.get(brixId).body;
	return body.getElementsByClassName("Page");
}
brix.component.navigation.Page.getPageByName = function(pageName,brixId,root) {
	var body = root;
	if(root == null) body = brix.core.Application.get(brixId).body;
	var pages = brix.component.navigation.Page.getPageNodes(brixId,body);
	var _g1 = 0, _g = pages.length;
	while(_g1 < _g) {
		var pageIdx = _g1++;
		if(pages[pageIdx].getAttribute("name") == pageName) {
			var pageInstances = brix.core.Application.get(brixId).getAssociatedComponents(pages[pageIdx],brix.component.navigation.Page);
			var $it0 = pageInstances.iterator();
			while( $it0.hasNext() ) {
				var page = $it0.next();
				return page;
			}
			return null;
		}
	}
	return null;
}
brix.component.navigation.Page.updateQuery = function(page,queryString) {
	var queryParams = queryString.split("&");
	var _g1 = 0, _g = queryParams.length;
	while(_g1 < _g) {
		var i = _g1++;
		var param = queryParams[i].split("=");
		page.query[param[0]] = param[1];
	}
	null;
}
brix.component.navigation.Page.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.Page.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	close: function(transitionData,preventCloseByClassName,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		var transitionObserver = new brix.component.navigation.transition.TransitionObserver(this,"pageCloseStart","pageCloseStop");
		if(preventCloseByClassName == null) preventCloseByClassName = new Array();
		var nodes = brix.component.navigation.Layer.getLayerNodes(this.name,this.brixInstanceId,this.groupElement);
		var layersToBeClosed = new Array();
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var layerNode = nodes[idxLayerNode];
			var hasForbiddenClass = false;
			var _g2 = 0;
			while(_g2 < preventCloseByClassName.length) {
				var className = preventCloseByClassName[_g2];
				++_g2;
				if(brix.util.DomTools.hasClass(layerNode,className)) hasForbiddenClass = true;
			}
			if(!hasForbiddenClass) {
				var layerInstances = this.getBrixApplication().getAssociatedComponents(layerNode,brix.component.navigation.Layer);
				var $it0 = layerInstances.iterator();
				while( $it0.hasNext() ) {
					var layerInstance = $it0.next();
					layersToBeClosed.push(layerInstance);
				}
			}
		}
		var _g = 0;
		while(_g < layersToBeClosed.length) {
			var layerInstance = layersToBeClosed[_g];
			++_g;
			layerInstance.hide(transitionData,transitionObserver,preventTransitions);
		}
		var nodes1 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href",this.name);
		var _g1 = 0, _g = nodes1.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes1[idxLayerNode];
			brix.util.DomTools.removeClass(element,"page-opened");
		}
		var nodes2 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href","#" + this.name);
		var _g1 = 0, _g = nodes2.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes2[idxLayerNode];
			brix.util.DomTools.removeClass(element,"page-opened");
		}
	}
	,doOpen: function(transitionData,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		var transitionObserver = new brix.component.navigation.transition.TransitionObserver(this,"pageOpenStart","pageOpenStop");
		var nodes = brix.component.navigation.Layer.getLayerNodes(this.name,this.brixInstanceId,this.groupElement);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var layerNode = nodes[idxLayerNode];
			var layerInstances = this.getBrixApplication().getAssociatedComponents(layerNode,brix.component.navigation.Layer);
			var $it0 = layerInstances.iterator();
			while( $it0.hasNext() ) {
				var layerInstance = $it0.next();
				layerInstance.show(transitionData,transitionObserver,preventTransitions);
			}
		}
		var nodes1 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href",this.name);
		var _g1 = 0, _g = nodes1.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes1[idxLayerNode];
			brix.util.DomTools.addClass(element,"page-opened");
		}
		var nodes2 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href","#" + this.name);
		var _g1 = 0, _g = nodes2.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes2[idxLayerNode];
			brix.util.DomTools.addClass(element,"page-opened");
		}
	}
	,closeOthers: function(transitionData,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		var nodes = brix.component.navigation.Page.getPageNodes(this.brixInstanceId,this.groupElement);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxPageNode = _g1++;
			var pageNode = nodes[idxPageNode];
			var pageInstances = this.getBrixApplication().getAssociatedComponents(pageNode,brix.component.navigation.Page);
			var $it0 = pageInstances.iterator();
			while( $it0.hasNext() ) {
				var pageInstance = $it0.next();
				if(pageInstance != this) pageInstance.close(transitionData,[this.name],preventTransitions);
			}
		}
	}
	,open: function(transitionDataShow,transitionDataHide,doCloseOthers,preventTransitions,recordInHistory) {
		if(recordInHistory == null) recordInHistory = true;
		if(preventTransitions == null) preventTransitions = false;
		if(doCloseOthers == null) doCloseOthers = true;
		if(doCloseOthers) this.closeOthers(transitionDataHide,preventTransitions);
		this.doOpen(transitionDataShow,preventTransitions);
		if(recordInHistory && brix.component.navigation.Page.useDeeplink) {
			if(window.history.pushState) js.Lib.window.history.pushState({ name : this.name, transitionDataShow : transitionDataShow, transitionDataHide : transitionDataHide, doCloseOthers : doCloseOthers, preventTransitions : preventTransitions, query : this.query},this.name,"?/" + this.name);
		}
	}
	,setPageName: function(newPageName) {
		this.rootElement.setAttribute("name",newPageName);
		this.name = newPageName;
		return newPageName;
	}
	,init: function() {
		brix.component.ui.DisplayObject.prototype.init.call(this);
		if(brix.component.navigation.Page.useDeeplink && js.Lib.window.history.state != null) {
			if(js.Lib.window.history.state.name == this.name) this.open(null,null,true,true,false);
		} else if(StringTools.startsWith(js.Lib.window.location.search,"?/")) {
			if(HxOverrides.substr(js.Lib.window.location.search,2,null) == this.name) this.open(null,null,true,true);
		} else if(brix.util.DomTools.getMeta("initialPageName") == this.name || this.groupElement.getAttribute("data-initial-page-name") == this.name) this.open(null,null,true,true);
	}
	,onPopState: function(e) {
		var event = e;
		if(event.state != null && event.state.name == this.name) {
			this.query = event.state.query;
			this.open(event.state.transitionDataShow,event.state.transitionDataHide,event.state.doCloseOthers,event.state.preventTransitions,false);
		}
	}
	,query: null
	,groupElement: null
	,name: null
	,__class__: brix.component.navigation.Page
});
brix.component.navigation.StateManager = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	this.currentCssClassNamesContexts = new Array();
	this.currentCssClassNamesPages = new Array();
};
$hxClasses["brix.component.navigation.StateManager"] = brix.component.navigation.StateManager;
brix.component.navigation.StateManager.__name__ = ["brix","component","navigation","StateManager"];
brix.component.navigation.StateManager.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.StateManager.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	update: function(states,currentCssClassNames) {
		var isDirty = false;
		var _g = 0;
		while(_g < currentCssClassNames.length) {
			var cssClass = currentCssClassNames[_g];
			++_g;
			brix.util.DomTools.removeClass(this.rootElement,cssClass);
			isDirty = true;
		}
		var _g = 0;
		while(_g < states.length) {
			var state = states[_g];
			++_g;
			var attrName = "data-" + state;
			var attrVal = this.rootElement.getAttribute(attrName);
			if(attrVal != null) {
				brix.util.DomTools.addClass(this.rootElement,attrVal);
				currentCssClassNames.push(attrVal);
				isDirty = true;
			}
		}
		if(isDirty) {
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent("changeStateEvent",false,false,this);
			this.rootElement.dispatchEvent(event);
		}
	}
	,onPageOpened: function(e) {
		var page = e.detail;
		this.update([page.name],this.currentCssClassNamesPages);
	}
	,onContextChanged: function(e) {
		var contextManager = e.detail;
		this.update(contextManager.currentContexts,this.currentCssClassNamesContexts);
	}
	,init: function() {
		this.mapListener(js.Lib.document.body,"pageOpenStop",$bind(this,this.onPageOpened),true);
		this.mapListener(js.Lib.document.body,"changeContextEvent",$bind(this,this.onContextChanged),true);
	}
	,currentCssClassNamesPages: null
	,currentCssClassNamesContexts: null
	,__class__: brix.component.navigation.StateManager
});
brix.component.navigation.link = {}
brix.component.navigation.link.LinkBase = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	brix.component.group.Groupable.startGroupable(this);
	this.mapListener(rootElement,"click",$bind(this,this.onClick),false);
	rootElement.style.cursor = "pointer";
	if(rootElement.getAttribute("href") != null) {
		this.linkName = StringTools.trim(rootElement.getAttribute("href"));
		this.linkName = HxOverrides.substr(this.linkName,this.linkName.indexOf("#") + 1,null);
	} else if(rootElement.getAttribute("data-href") != null) this.linkName = StringTools.trim(rootElement.getAttribute("data-href")); else null;
	if(rootElement.getAttribute("target") != null && StringTools.trim(rootElement.getAttribute("target")) != "") this.targetAttr = StringTools.trim(rootElement.getAttribute("target"));
};
$hxClasses["brix.component.navigation.link.LinkBase"] = brix.component.navigation.link.LinkBase;
brix.component.navigation.link.LinkBase.__name__ = ["brix","component","navigation","link","LinkBase"];
brix.component.navigation.link.LinkBase.__interfaces__ = [brix.component.group.IGroupable];
brix.component.navigation.link.LinkBase.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.link.LinkBase.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onClick: function(e) {
		e.preventDefault();
		this.transitionDataShow = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,brix.component.navigation.transition.TransitionType.show);
		this.transitionDataHide = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,brix.component.navigation.transition.TransitionType.hide);
	}
	,transitionDataHide: null
	,transitionDataShow: null
	,targetAttr: null
	,linkName: null
	,groupElement: null
	,__class__: brix.component.navigation.link.LinkBase
});
brix.component.navigation.link.LinkContextBase = function(rootElement,brixId) {
	brix.component.navigation.link.LinkBase.call(this,rootElement,brixId);
	if(rootElement.getAttribute("data-context") != null) this.linkName = rootElement.getAttribute("data-context");
	this.links = this.linkName.split("#");
};
$hxClasses["brix.component.navigation.link.LinkContextBase"] = brix.component.navigation.link.LinkContextBase;
brix.component.navigation.link.LinkContextBase.__name__ = ["brix","component","navigation","link","LinkContextBase"];
brix.component.navigation.link.LinkContextBase.__super__ = brix.component.navigation.link.LinkBase;
brix.component.navigation.link.LinkContextBase.prototype = $extend(brix.component.navigation.link.LinkBase.prototype,{
	dispatchContextEvent: function(type) {
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent(type,false,false,this.links);
		this.rootElement.dispatchEvent(event);
	}
	,onClick: function(e) {
		brix.component.navigation.link.LinkBase.prototype.onClick.call(this,e);
	}
	,links: null
	,__class__: brix.component.navigation.link.LinkContextBase
});
brix.component.navigation.link.LinkAddContext = function(rootElement,brixId) {
	brix.component.navigation.link.LinkContextBase.call(this,rootElement,brixId);
};
$hxClasses["brix.component.navigation.link.LinkAddContext"] = brix.component.navigation.link.LinkAddContext;
brix.component.navigation.link.LinkAddContext.__name__ = ["brix","component","navigation","link","LinkAddContext"];
brix.component.navigation.link.LinkAddContext.__super__ = brix.component.navigation.link.LinkContextBase;
brix.component.navigation.link.LinkAddContext.prototype = $extend(brix.component.navigation.link.LinkContextBase.prototype,{
	onClick: function(e) {
		brix.component.navigation.link.LinkContextBase.prototype.onClick.call(this,e);
		this.dispatchContextEvent("addContextsEvent");
	}
	,__class__: brix.component.navigation.link.LinkAddContext
});
brix.component.navigation.link.LinkClosePage = function(rootElement,brixId) {
	brix.component.navigation.link.LinkBase.call(this,rootElement,brixId);
};
$hxClasses["brix.component.navigation.link.LinkClosePage"] = brix.component.navigation.link.LinkClosePage;
brix.component.navigation.link.LinkClosePage.__name__ = ["brix","component","navigation","link","LinkClosePage"];
brix.component.navigation.link.LinkClosePage.__super__ = brix.component.navigation.link.LinkBase;
brix.component.navigation.link.LinkClosePage.prototype = $extend(brix.component.navigation.link.LinkBase.prototype,{
	onClick: function(e) {
		brix.component.navigation.link.LinkBase.prototype.onClick.call(this,e);
		brix.component.navigation.Page.closePage(this.linkName,this.transitionDataHide,this.brixInstanceId);
	}
	,__class__: brix.component.navigation.link.LinkClosePage
});
brix.component.navigation.link.LinkRemoveContext = function(rootElement,brixId) {
	brix.component.navigation.link.LinkContextBase.call(this,rootElement,brixId);
};
$hxClasses["brix.component.navigation.link.LinkRemoveContext"] = brix.component.navigation.link.LinkRemoveContext;
brix.component.navigation.link.LinkRemoveContext.__name__ = ["brix","component","navigation","link","LinkRemoveContext"];
brix.component.navigation.link.LinkRemoveContext.__super__ = brix.component.navigation.link.LinkContextBase;
brix.component.navigation.link.LinkRemoveContext.prototype = $extend(brix.component.navigation.link.LinkContextBase.prototype,{
	onClick: function(e) {
		brix.component.navigation.link.LinkContextBase.prototype.onClick.call(this,e);
		this.dispatchContextEvent("removeContextsEvent");
	}
	,__class__: brix.component.navigation.link.LinkRemoveContext
});
brix.component.navigation.link.LinkReplaceContext = function(rootElement,brixId) {
	brix.component.navigation.link.LinkContextBase.call(this,rootElement,brixId);
};
$hxClasses["brix.component.navigation.link.LinkReplaceContext"] = brix.component.navigation.link.LinkReplaceContext;
brix.component.navigation.link.LinkReplaceContext.__name__ = ["brix","component","navigation","link","LinkReplaceContext"];
brix.component.navigation.link.LinkReplaceContext.__super__ = brix.component.navigation.link.LinkContextBase;
brix.component.navigation.link.LinkReplaceContext.prototype = $extend(brix.component.navigation.link.LinkContextBase.prototype,{
	onClick: function(e) {
		brix.component.navigation.link.LinkContextBase.prototype.onClick.call(this,e);
		this.dispatchContextEvent("replaceContextsEvent");
	}
	,__class__: brix.component.navigation.link.LinkReplaceContext
});
brix.component.navigation.link.LinkToPage = function(rootElement,brixId) {
	brix.component.navigation.link.LinkBase.call(this,rootElement,brixId);
};
$hxClasses["brix.component.navigation.link.LinkToPage"] = brix.component.navigation.link.LinkToPage;
brix.component.navigation.link.LinkToPage.__name__ = ["brix","component","navigation","link","LinkToPage"];
brix.component.navigation.link.LinkToPage.__super__ = brix.component.navigation.link.LinkBase;
brix.component.navigation.link.LinkToPage.prototype = $extend(brix.component.navigation.link.LinkBase.prototype,{
	onClick: function(e) {
		brix.component.navigation.link.LinkBase.prototype.onClick.call(this,e);
		brix.component.navigation.Page.openPage(this.linkName,this.targetAttr == "_top",this.transitionDataShow,this.transitionDataHide,this.brixInstanceId,this.groupElement);
	}
	,__class__: brix.component.navigation.link.LinkToPage
});
brix.component.navigation.link.TouchType = $hxClasses["brix.component.navigation.link.TouchType"] = { __ename__ : ["brix","component","navigation","link","TouchType"], __constructs__ : ["swipeLeft","swipeRight","swipeUp","swipeDown","pinchOpen","pinchClose"] }
brix.component.navigation.link.TouchType.swipeLeft = ["swipeLeft",0];
brix.component.navigation.link.TouchType.swipeLeft.toString = $estr;
brix.component.navigation.link.TouchType.swipeLeft.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchType.swipeRight = ["swipeRight",1];
brix.component.navigation.link.TouchType.swipeRight.toString = $estr;
brix.component.navigation.link.TouchType.swipeRight.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchType.swipeUp = ["swipeUp",2];
brix.component.navigation.link.TouchType.swipeUp.toString = $estr;
brix.component.navigation.link.TouchType.swipeUp.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchType.swipeDown = ["swipeDown",3];
brix.component.navigation.link.TouchType.swipeDown.toString = $estr;
brix.component.navigation.link.TouchType.swipeDown.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchType.pinchOpen = ["pinchOpen",4];
brix.component.navigation.link.TouchType.pinchOpen.toString = $estr;
brix.component.navigation.link.TouchType.pinchOpen.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchType.pinchClose = ["pinchClose",5];
brix.component.navigation.link.TouchType.pinchClose.toString = $estr;
brix.component.navigation.link.TouchType.pinchClose.__enum__ = brix.component.navigation.link.TouchType;
brix.component.navigation.link.TouchLink = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	brix.component.group.Groupable.startGroupable(this);
	var element;
	if(this.groupElement != null) element = this.groupElement; else element = js.Lib.document.body;
	var attrStr = rootElement.getAttribute("data-touch-detection-distance");
	if(attrStr == null || attrStr == "") this.detectDistance = 10; else this.detectDistance = Std.parseInt(attrStr);
	this.mapListener(element,"touchmove",$bind(this,this.onTouchMove),false);
	this.mapListener(element,"touchstart",$bind(this,this.onTouchStart),false);
	this.mapListener(element,"touchend",$bind(this,this.onTouchEnd),false);
	switch(rootElement.getAttribute("data-touch-type")) {
	case "left":
		this.touchType = brix.component.navigation.link.TouchType.swipeLeft;
		break;
	case "right":
		this.touchType = brix.component.navigation.link.TouchType.swipeRight;
		break;
	case "up":
		this.touchType = brix.component.navigation.link.TouchType.swipeUp;
		break;
	case "down":
		this.touchType = brix.component.navigation.link.TouchType.swipeDown;
		break;
	case "open":
		this.touchType = brix.component.navigation.link.TouchType.pinchOpen;
		throw "not implemented";
		break;
	case "close":
		this.touchType = brix.component.navigation.link.TouchType.pinchClose;
		throw "not implemented";
		break;
	default:
		throw "Error in param " + "data-touch-type" + " for touch event type (requires left, right, up, down, in, out)";
	}
};
$hxClasses["brix.component.navigation.link.TouchLink"] = brix.component.navigation.link.TouchLink;
brix.component.navigation.link.TouchLink.__name__ = ["brix","component","navigation","link","TouchLink"];
brix.component.navigation.link.TouchLink.__interfaces__ = [brix.component.group.IGroupable];
brix.component.navigation.link.TouchLink.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.link.TouchLink.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	dispatchClick: function() {
		var evt = js.Lib.document.createEvent("MouseEvent");
		evt.initEvent("click",true,true);
		this.rootElement.dispatchEvent(evt);
	}
	,onTouchEnd: function(e) {
		var event = e;
		this.touchStart = null;
	}
	,onTouchMove: function(e) {
		var event = e;
		event.preventDefault();
		if(this.touchStart == null) return;
		var xOffset = event.touches.item(0).screenX - this.touchStart.x;
		var yOffset = event.touches.item(0).screenY - this.touchStart.y;
		if(Math.abs(xOffset) > this.detectDistance) {
			this.touchStart = null;
			if(xOffset > 0) {
				if(this.touchType == brix.component.navigation.link.TouchType.swipeLeft) this.dispatchClick();
			} else if(this.touchType == brix.component.navigation.link.TouchType.swipeRight) this.dispatchClick();
		} else if(Math.abs(yOffset) > this.detectDistance) {
			this.touchStart = null;
			if(yOffset > 0) {
				if(this.touchType == brix.component.navigation.link.TouchType.swipeUp) this.dispatchClick();
			} else if(this.touchType == brix.component.navigation.link.TouchType.swipeDown) this.dispatchClick();
		}
	}
	,onClick: function(e) {
	}
	,onTouchStart: function(e) {
		var event = e;
		this.touchStart = { x : event.touches.item(0).screenX, y : event.touches.item(0).screenY};
	}
	,touchStart: null
	,touchType: null
	,detectDistance: null
	,groupElement: null
	,__class__: brix.component.navigation.link.TouchLink
});
brix.component.navigation.transition = {}
brix.component.navigation.transition.TransitionType = $hxClasses["brix.component.navigation.transition.TransitionType"] = { __ename__ : ["brix","component","navigation","transition","TransitionType"], __constructs__ : ["show","hide"] }
brix.component.navigation.transition.TransitionType.show = ["show",0];
brix.component.navigation.transition.TransitionType.show.toString = $estr;
brix.component.navigation.transition.TransitionType.show.__enum__ = brix.component.navigation.transition.TransitionType;
brix.component.navigation.transition.TransitionType.hide = ["hide",1];
brix.component.navigation.transition.TransitionType.hide.toString = $estr;
brix.component.navigation.transition.TransitionType.hide.__enum__ = brix.component.navigation.transition.TransitionType;
brix.component.navigation.transition.TransitionObserver = function(page,startEvent,stopEvent) {
	this.pendingTransitions = 0;
	this.hasStoped = false;
	this.hasStarted = false;
	this.page = page;
	this.startEvent = startEvent;
	this.stopEvent = stopEvent;
};
$hxClasses["brix.component.navigation.transition.TransitionObserver"] = brix.component.navigation.transition.TransitionObserver;
brix.component.navigation.transition.TransitionObserver.__name__ = ["brix","component","navigation","transition","TransitionObserver"];
brix.component.navigation.transition.TransitionObserver.prototype = {
	dispatch: function(eventName) {
		try {
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent(eventName,true,true,this.page);
			this.page.rootElement.dispatchEvent(event);
		} catch( e ) {
			null;
		}
	}
	,doRemoveTransition: function() {
		this.pendingTransitions--;
		if(this.pendingTransitions == 0) this.stopProcess();
	}
	,removeTransition: function(layer) {
		brix.util.DomTools.doLater($bind(this,this.doRemoveTransition));
	}
	,alreadyOpen: function(layer) {
		this.addTransition(layer);
		this.removeTransition(layer);
	}
	,addTransition: function(layer) {
		if(this.pendingTransitions == 0) this.startProcess();
		this.pendingTransitions++;
	}
	,stopProcess: function() {
		if(this.hasStoped) return;
		this.hasStoped = true;
		this.dispatch(this.stopEvent);
	}
	,startProcess: function() {
		if(this.hasStoped) return;
		this.hasStarted = true;
		this.dispatch(this.startEvent);
	}
	,stopEvent: null
	,startEvent: null
	,page: null
	,pendingTransitions: null
	,hasStoped: null
	,hasStarted: null
	,__class__: brix.component.navigation.transition.TransitionObserver
}
brix.component.navigation.transition.TransitionTools = function() { }
$hxClasses["brix.component.navigation.transition.TransitionTools"] = brix.component.navigation.transition.TransitionTools;
brix.component.navigation.transition.TransitionTools.__name__ = ["brix","component","navigation","transition","TransitionTools"];
brix.component.navigation.transition.TransitionTools.getTransitionData = function(rootElement,type) {
	var res = null;
	if(type == brix.component.navigation.transition.TransitionType.show) {
		var start = rootElement.getAttribute("data-show-start-style");
		var end = rootElement.getAttribute("data-show-end-style");
		if(start != null && end != null) res = { startStyleName : start, endStyleName : end};
	} else {
		var start = rootElement.getAttribute("data-hide-start-style");
		var end = rootElement.getAttribute("data-hide-end-style");
		if(start != null && end != null) res = { startStyleName : start, endStyleName : end};
	}
	return res;
}
brix.component.navigation.transition.TransitionTools.setTransitionProperty = function(rootElement,name,value) {
	Reflect.setProperty(rootElement.style,name,value);
	var prefixed = "MozT" + HxOverrides.substr(name,1,null);
	rootElement.style[prefixed] = value;
	var prefixed1 = "webkitT" + HxOverrides.substr(name,1,null);
	rootElement.style[prefixed1] = value;
	var prefixed2 = "oT" + HxOverrides.substr(name,1,null);
	rootElement.style[prefixed2] = value;
}
brix.component.sound = {}
brix.component.sound.SoundOn = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	rootElement.onclick = $bind(this,this.onClick);
};
$hxClasses["brix.component.sound.SoundOn"] = brix.component.sound.SoundOn;
brix.component.sound.SoundOn.__name__ = ["brix","component","sound","SoundOn"];
brix.component.sound.SoundOn.mute = function(doMute) {
	var audioTags = js.Lib.document.getElementsByTagName("audio");
	var _g1 = 0, _g = audioTags.length;
	while(_g1 < _g) {
		var idx = _g1++;
		audioTags[idx].muted = doMute;
	}
	brix.component.sound.SoundOn.isMuted = doMute;
	var soundOffButtons = js.Lib.document.getElementsByClassName("SoundOff");
	var soundOnButtons = js.Lib.document.getElementsByClassName("SoundOn");
	var _g1 = 0, _g = soundOffButtons.length;
	while(_g1 < _g) {
		var idx = _g1++;
		if(doMute) soundOffButtons[idx].style.visibility = "hidden"; else soundOffButtons[idx].style.visibility = "visible";
	}
	var _g1 = 0, _g = soundOnButtons.length;
	while(_g1 < _g) {
		var idx = _g1++;
		if(!doMute) soundOnButtons[idx].style.visibility = "hidden"; else soundOnButtons[idx].style.visibility = "visible";
	}
}
brix.component.sound.SoundOn.__super__ = brix.component.ui.DisplayObject;
brix.component.sound.SoundOn.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onClick: function(e) {
		brix.component.sound.SoundOn.mute(false);
	}
	,init: function() {
		brix.util.DomTools.doLater(function() {
			return brix.component.sound.SoundOn.mute(false);
		});
	}
	,__class__: brix.component.sound.SoundOn
});
brix.component.sound.SoundOff = function(rootElement,brixId) {
	brix.component.sound.SoundOn.call(this,rootElement,brixId);
};
$hxClasses["brix.component.sound.SoundOff"] = brix.component.sound.SoundOff;
brix.component.sound.SoundOff.__name__ = ["brix","component","sound","SoundOff"];
brix.component.sound.SoundOff.__super__ = brix.component.sound.SoundOn;
brix.component.sound.SoundOff.prototype = $extend(brix.component.sound.SoundOn.prototype,{
	onClick: function(e) {
		brix.component.sound.SoundOn.mute(true);
	}
	,__class__: brix.component.sound.SoundOff
});
brix.core = {}
brix.core.Application = function(id,args) {
	this.dataObject = args;
	this.id = id;
	this.nodesIdSequence = 0;
	this.registeredUIComponents = new Array();
	this.registeredGlobalComponents = new Array();
	this.nodeToCmpInstances = new Hash();
	this.globalCompInstances = new Hash();
	this.body = js.Lib.document.createElement("div");
	this.applicationContext = new brix.core.ApplicationContext();
};
$hxClasses["brix.core.Application"] = brix.core.Application;
$hxExpose(brix.core.Application, "app_slave");
brix.core.Application.__name__ = ["brix","core","Application"];
brix.core.Application.get = function(BrixId) {
	return brix.core.Application.instances.get(BrixId);
}
brix.core.Application.main = function() {
	var newApp = brix.core.Application.createApplication();
	newApp.initDom();
	newApp.initComponents();
	newApp.attachBody();
}
brix.core.Application.createApplication = function(args) {
	var newId = brix.core.Application.generateUniqueId();
	var newInstance = new brix.core.Application(newId,args);
	brix.core.Application.instances.set(newId,newInstance);
	return newInstance;
}
brix.core.Application.generateUniqueId = function() {
	return Std.string(Math.round(Math.random() * 10000));
}
brix.core.Application.prototype = {
	resolveComponentClass: function(classname) {
		var componentClass = Type.resolveClass(classname);
		if(componentClass == null) null;
		return componentClass;
	}
	,exists: function(array,element) {
		var length = array.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			if(array[i] == element) return true;
		}
		return false;
	}
	,resolveUIComponentClass: function(className,typeFilter) {
		var _g = 0, _g1 = this.getRegisteredUIComponents();
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			var componentClassAttrValues = [rc.unconflictedClassTag];
			if(componentClassAttrValues[0] != rc.classname) componentClassAttrValues.push(rc.classname);
			if(!this.exists(componentClassAttrValues,className)) continue;
			var componentClass = this.resolveComponentClass(rc.classname);
			if(componentClass == null) continue;
			if(typeFilter != null) {
				if(!js.Boot.__instanceof(Type.createEmptyInstance(componentClass),typeFilter)) return null;
			}
			return componentClass;
		}
		return null;
	}
	,getGlobalComponentList: function() {
		return Lambda.list({ iterator : ($_=this.globalCompInstances,$bind($_,$_.keys))});
	}
	,getGlobalComponent: function(classname) {
		return this.globalCompInstances.get(classname);
	}
	,getComponents: function(typeFilter) {
		var l = new List();
		var $it0 = this.nodeToCmpInstances.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			var $it1 = n.iterator();
			while( $it1.hasNext() ) {
				var i = $it1.next();
				if(js.Boot.__instanceof(i,typeFilter)) {
					var inst = i;
					l.add(inst);
				}
			}
		}
		return l;
	}
	,getAssociatedComponents: function(node,typeFilter) {
		var nodeId = node.getAttribute("data-brix-id");
		if(nodeId != null) {
			var l = new List();
			if(this.nodeToCmpInstances.exists(nodeId)) {
				var $it0 = this.nodeToCmpInstances.get(nodeId).iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					if(js.Boot.__instanceof(i,typeFilter)) {
						var inst = i;
						l.add(inst);
					}
				}
			}
			return l;
		}
		return new List();
	}
	,removeAllAssociatedComponent: function(node) {
		var nodeId = node.getAttribute("data-brix-id");
		if(nodeId != null) {
			node.removeAttribute("data-brix-id");
			var isError = !this.nodeToCmpInstances.remove(nodeId);
			if(isError) throw "Could not find the node in the associated components list.";
		} else null;
	}
	,removeAssociatedComponent: function(node,cmp) {
		var nodeId = node.getAttribute("data-brix-id");
		var associatedCmps;
		if(nodeId != null) {
			associatedCmps = this.nodeToCmpInstances.get(nodeId);
			var isError = !associatedCmps.remove(cmp);
			if(isError) throw "Could not find the component in the node's associated components list.";
			if(associatedCmps.isEmpty()) {
				node.removeAttribute("data-brix-id");
				this.nodeToCmpInstances.remove(nodeId);
			}
		} else null;
	}
	,addAssociatedComponent: function(node,cmp) {
		var nodeId = node.getAttribute("data-brix-id");
		var associatedCmps;
		if(nodeId != null) associatedCmps = this.nodeToCmpInstances.get(nodeId); else {
			this.nodesIdSequence++;
			nodeId = Std.string(this.nodesIdSequence);
			node.setAttribute("data-brix-id",nodeId);
			associatedCmps = new List();
		}
		associatedCmps.add(cmp);
		this.nodeToCmpInstances.set(nodeId,associatedCmps);
	}
	,cleanNode: function(node) {
		if(node.nodeType != js.Lib.document.body.nodeType) return;
		var comps = this.getAssociatedComponents(node,brix.component.ui.DisplayObject);
		var $it0 = comps.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			c.remove();
		}
		var _g1 = 0, _g = node.childNodes.length;
		while(_g1 < _g) {
			var childCnt = _g1++;
			this.cleanNode(node.childNodes[childCnt]);
		}
	}
	,createGlobalComponents: function() {
		var _g = 0, _g1 = this.getRegisteredGlobalComponents();
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			var componentClass = this.resolveComponentClass(rc.classname);
			if(componentClass == null) continue;
			var cmpInstance = null;
			try {
				if(rc.args != null) cmpInstance = Type.createInstance(componentClass,[rc.args]); else cmpInstance = Type.createInstance(componentClass,[]);
			} catch( unknown ) {
				var excptArr = haxe.Stack.exceptionStack();
				if(excptArr.length > 0) null;
			}
			if(cmpInstance != null && js.Boot.__instanceof(cmpInstance,brix.component.IBrixComponent)) brix.component.BrixComponent.initBrixComponent(cmpInstance,this.id);
			this.globalCompInstances.set(rc.classname,cmpInstance);
		}
	}
	,initUIComponents: function(compInstances) {
		var $it0 = compInstances.iterator();
		while( $it0.hasNext() ) {
			var ci = $it0.next();
			try {
				ci.init();
			} catch( unknown ) {
				var excptArr = haxe.Stack.exceptionStack();
				if(excptArr.length > 0) null;
			}
		}
	}
	,createUIComponents: function(node) {
		if(node.nodeType != 1) return null;
		var nodeId = node.getAttribute("data-brix-id");
		if(nodeId != null) {
			if(!this.nodeToCmpInstances.exists(nodeId)) node.removeAttribute("data-brix-id"); else return null;
		}
		var compsToInit = new List();
		if(node.className != null) {
			var _g = 0, _g1 = node.className.split(" ");
			while(_g < _g1.length) {
				var classValue = _g1[_g];
				++_g;
				var componentClass = this.resolveUIComponentClass(classValue);
				if(componentClass == null) continue;
				var newDisplayObject = null;
				try {
					newDisplayObject = Type.createInstance(componentClass,[node,this.id]);
				} catch( unknown ) {
					var excptArr = haxe.Stack.exceptionStack();
					if(excptArr.length > 0) null;
				}
				compsToInit.add(newDisplayObject);
			}
		}
		var _g1 = 0, _g = node.childNodes.length;
		while(_g1 < _g) {
			var cc = _g1++;
			var res = this.createUIComponents(node.childNodes[cc]);
			if(res != null) compsToInit = Lambda.concat(compsToInit,res);
		}
		return compsToInit;
	}
	,initNode: function(node) {
		var comps = this.createUIComponents(node);
		if(comps == null) return;
		this.initUIComponents(comps);
	}
	,initComponents: function() {
		this.createGlobalComponents();
		this.initNode(this.body);
	}
	,initDom: function(appendTo) {
		this.htmlRootElement = appendTo;
		if(this.htmlRootElement == null || this.htmlRootElement.nodeType != js.Lib.document.documentElement.nodeType) this.htmlRootElement = js.Lib.document.documentElement;
		if(this.htmlRootElement == null) return;
		var htmlString = brix.core.ApplicationContext.htmlDocumentElement;
		var lowerCaseHtml = htmlString.toLowerCase();
		var htmlOpenIdx = lowerCaseHtml.indexOf("<html");
		var htmlCloseIdx = lowerCaseHtml.indexOf("</html>");
		if(htmlOpenIdx > -1 && htmlCloseIdx > -1) {
			var closingTagIdx = lowerCaseHtml.indexOf(">",htmlOpenIdx);
			lowerCaseHtml = lowerCaseHtml.substring(closingTagIdx + 1,htmlCloseIdx);
			htmlString = htmlString.substring(closingTagIdx + 1,htmlCloseIdx);
		}
		var bodyOpenIdx = lowerCaseHtml.indexOf("<body");
		var bodyCloseIdx = lowerCaseHtml.indexOf("</body>");
		if(bodyOpenIdx <= -1 || bodyCloseIdx <= -1) throw "Error: body tag not found or malformed.";
		var closingTagIdx = lowerCaseHtml.indexOf(">",bodyOpenIdx);
		var documentString = htmlString.substring(0,closingTagIdx + 1);
		var bodyString = htmlString.substring(closingTagIdx + 1,bodyCloseIdx);
		documentString += HxOverrides.substr(htmlString,bodyCloseIdx,null);
		this.body.innerHTML = bodyString;
		var updateRootRef = this.htmlRootElement == js.Lib.document.documentElement;
		brix.util.DomTools.innerHTML(this.htmlRootElement,documentString);
		if(updateRootRef) this.htmlRootElement = js.Lib.document.documentElement;
	}
	,attachBody: function(appendTo) {
		if(appendTo == null) appendTo = js.Lib.document.body;
		if(this.body.parentNode == null) appendTo.appendChild(this.body);
		this.body = appendTo;
	}
	,getRegisteredGlobalComponents: function() {
		return this.applicationContext.registeredGlobalComponents;
	}
	,registeredGlobalComponents: null
	,getRegisteredUIComponents: function() {
		return this.applicationContext.registeredUIComponents;
	}
	,registeredUIComponents: null
	,applicationContext: null
	,dataObject: null
	,body: null
	,htmlRootElement: null
	,globalCompInstances: null
	,nodeToCmpInstances: null
	,nodesIdSequence: null
	,id: null
	,__class__: brix.core.Application
	,__properties__: {get_registeredUIComponents:"getRegisteredUIComponents",get_registeredGlobalComponents:"getRegisteredGlobalComponents"}
}
var haxe = {}
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0, _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
}
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
}
haxe.Unserializer.prototype = {
	unserialize: function() {
		switch(this.buf.charCodeAt(this.pos++)) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = StringTools.urlDecode(s);
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n = this.readDigits();
			if(n < 0 || n >= this.cache.length) throw "Invalid reference";
			return this.cache[n];
		case 82:
			var n = this.readDigits();
			if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
			return this.scache[n];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 119:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl)[index];
			if(tag == null) throw "Unknown enum index " + name + "@" + index;
			var e = this.unserializeEnum(edecl,tag);
			this.cache.push(e);
			return e;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new Hash();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h = new IntHash();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.charCodeAt(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				h.set(i,this.unserialize());
				c = this.buf.charCodeAt(this.pos++);
			}
			if(c != 104) throw "Invalid IntHash format";
			return h;
		case 118:
			var d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len = this.readDigits();
			var buf = this.buf;
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i = this.pos;
			var rest = len & 3;
			var size = (len >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i + (len - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i < max) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				var c3 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				var c4 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c3 << 6 | c4) & 255;
			}
			if(rest >= 2) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				if(rest == 3) {
					var c3 = codes[buf.charCodeAt(i++)];
					bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				}
			}
			this.pos += len;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			o.hxUnserialize(this);
			if(this.buf.charCodeAt(this.pos++) != 103) throw "Invalid custom data";
			return o;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.buf.charCodeAt(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!js.Boot.__instanceof(k,String)) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,getResolver: function() {
		return this.resolver;
	}
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,resolver: null
	,scache: null
	,cache: null
	,length: null
	,pos: null
	,buf: null
	,__class__: haxe.Unserializer
}
brix.core.ApplicationContext = function() {
	this.registeredUIComponents = new Array();
	this.registeredGlobalComponents = new Array();
	this.registerComponentsforInit();
};
$hxClasses["brix.core.ApplicationContext"] = brix.core.ApplicationContext;
brix.core.ApplicationContext.__name__ = ["brix","core","ApplicationContext"];
brix.core.ApplicationContext.prototype = {
	registerComponentsforInit: function() {
		brix.component.group.Group;
		this.registeredUIComponents.push({ classname : "brix.component.group.Group", args : null, unconflictedClassTag : "Group"});
		brix.component.navigation.link.LinkClosePage;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.link.LinkClosePage", args : null, unconflictedClassTag : "LinkClosePage"});
		components.ResizeIcon;
		this.registeredUIComponents.push({ classname : "components.ResizeIcon", args : null, unconflictedClassTag : "ResizeIcon"});
		brix.component.navigation.link.LinkToPage;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.link.LinkToPage", args : null, unconflictedClassTag : "LinkToPage"});
		brix.component.navigation.link.LinkReplaceContext;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.link.LinkReplaceContext", args : null, unconflictedClassTag : "LinkReplaceContext"});
		brix.component.navigation.Layer;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.Layer", args : null, unconflictedClassTag : "Layer"});
		brix.component.navigation.link.LinkAddContext;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.link.LinkAddContext", args : null, unconflictedClassTag : "LinkAddContext"});
		brix.component.navigation.link.TouchLink;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.link.TouchLink", args : null, unconflictedClassTag : "TouchLink"});
		brix.component.navigation.Page;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.Page", args : null, unconflictedClassTag : "Page"});
		components.Pointer;
		this.registeredUIComponents.push({ classname : "components.Pointer", args : null, unconflictedClassTag : "Pointer"});
		brix.component.navigation.ContextManager;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.ContextManager", args : null, unconflictedClassTag : "ContextManager"});
		brix.component.navigation.link.LinkRemoveContext;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.link.LinkRemoveContext", args : null, unconflictedClassTag : "LinkRemoveContext"});
		brix.component.layout.Panel;
		this.registeredUIComponents.push({ classname : "brix.component.layout.Panel", args : null, unconflictedClassTag : "Panel"});
		components.GallerySplity;
		this.registeredUIComponents.push({ classname : "components.GallerySplity", args : null, unconflictedClassTag : "GallerySplity"});
	}
	,registeredGlobalComponents: null
	,registeredUIComponents: null
	,__class__: brix.core.ApplicationContext
}
brix.core.EventDirection = $hxClasses["brix.core.EventDirection"] = { __ename__ : ["brix","core","EventDirection"], __constructs__ : ["up","down","both","none"] }
brix.core.EventDirection.up = ["up",0];
brix.core.EventDirection.up.toString = $estr;
brix.core.EventDirection.up.__enum__ = brix.core.EventDirection;
brix.core.EventDirection.down = ["down",1];
brix.core.EventDirection.down.toString = $estr;
brix.core.EventDirection.down.__enum__ = brix.core.EventDirection;
brix.core.EventDirection.both = ["both",2];
brix.core.EventDirection.both.toString = $estr;
brix.core.EventDirection.both.__enum__ = brix.core.EventDirection;
brix.core.EventDirection.none = ["none",3];
brix.core.EventDirection.none.toString = $estr;
brix.core.EventDirection.none.__enum__ = brix.core.EventDirection;
brix.core.EventMap = function() {
	this.notCapturingListeners = new brix.util.haxe.ObjectHash();
	this.capturingListeners = new brix.util.haxe.ObjectHash();
};
$hxClasses["brix.core.EventMap"] = brix.core.EventMap;
brix.core.EventMap.__name__ = ["brix","core","EventMap"];
brix.core.EventMap.prototype = {
	crossBrowserRemoveEventListener: function(dispatcher,type,listener,useCapture) {
		if(dispatcher.removeEventListener) dispatcher.removeEventListener(type,listener,useCapture); else if(dispatcher.detachEvent) dispatcher.detachEvent("on" + type,listener);
	}
	,crossBrowserAddEventListener: function(dispatcher,type,listener,useCapture) {
		if(dispatcher.addEventListener) dispatcher.addEventListener(type,listener,useCapture); else if(dispatcher.attachEvent) dispatcher.attachEvent("on" + type,listener);
	}
	,getListeners: function(useCapture) {
		if(useCapture) return this.capturingListeners;
		return this.notCapturingListeners;
	}
	,dispatchCustomEvent: function(eventType,data,dispatcher,cancelable,canBubble) {
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent(eventType,canBubble,cancelable,data);
		dispatcher.dispatchEvent(event);
	}
	,dispatchDownRecursive: function(eventType,data,dispatcher,cancelable) {
		var _g1 = 0, _g = dispatcher.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var node = dispatcher.childNodes[i];
			if(node.nodeType == 1) {
				this.dispatchCustomEvent(eventType,data,node,cancelable,false);
				this.dispatchDownRecursive(eventType,data,node,cancelable);
			}
		}
	}
	,dispatch: function(eventType,data,dispatcher,cancelable,direction) {
		if(direction != brix.core.EventDirection.down) this.dispatchCustomEvent(eventType,data,dispatcher,cancelable,direction == brix.core.EventDirection.up || direction == brix.core.EventDirection.both); else this.dispatchCustomEvent(eventType,data,dispatcher,cancelable,false);
		if(direction == brix.core.EventDirection.down || direction == brix.core.EventDirection.both) this.dispatchDownRecursive(eventType,data,dispatcher,cancelable);
	}
	,unmapListeners: function() {
		var useCapture = true;
		var _g = 0, _g1 = [this.capturingListeners,this.notCapturingListeners];
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			var $it0 = $iterator({ iterator : $bind(c,c.keys)})();
			while( $it0.hasNext() ) {
				var d = $it0.next();
				var $it1 = $iterator({ iterator : ($_=c.get(d),$bind($_,$_.keys))})();
				while( $it1.hasNext() ) {
					var t = $it1.next();
					var $it2 = c.get(d).get(t).iterator();
					while( $it2.hasNext() ) {
						var l = $it2.next();
						this.crossBrowserRemoveEventListener(d,t,l,useCapture);
						c.get(d).get(t).remove(l);
					}
					c.get(d).remove(t);
				}
				c.remove(d);
			}
			useCapture = false;
		}
	}
	,unmapListener: function(dispatcher,type,listener,useCapture) {
		if(useCapture == null) useCapture = false;
		var coll = this.getListeners(useCapture);
		if(coll.exists(dispatcher) && coll.get(dispatcher).exists(type)) {
			var $it0 = coll.get(dispatcher).get(type).iterator();
			while( $it0.hasNext() ) {
				var l = $it0.next();
				if(Reflect.compareMethods(listener,l)) {
					this.crossBrowserRemoveEventListener(dispatcher,type,l,useCapture);
					coll.get(dispatcher).get(type).remove(l);
					return;
				}
			}
		}
	}
	,mapListener: function(dispatcher,type,listener,useCapture) {
		if(useCapture == null) useCapture = false;
		var coll = this.getListeners(useCapture);
		if(!coll.exists(dispatcher)) coll.set(dispatcher,new Hash());
		if(!coll.get(dispatcher).exists(type)) coll.get(dispatcher).set(type,new List());
		if(!Lambda.exists(coll.get(dispatcher).get(type),function(l) {
			return Reflect.compareMethods(listener,l);
		})) {
			coll.get(dispatcher).get(type).add(listener);
			this.crossBrowserAddEventListener(dispatcher,type,listener,useCapture);
		}
	}
	,capturingListeners: null
	,notCapturingListeners: null
	,__class__: brix.core.EventMap
}
brix.util = {}
brix.util.NodeTypes = function() { }
$hxClasses["brix.util.NodeTypes"] = brix.util.NodeTypes;
brix.util.NodeTypes.__name__ = ["brix","util","NodeTypes"];
brix.util.DomTools = function() { }
$hxClasses["brix.util.DomTools"] = brix.util.DomTools;
brix.util.DomTools.__name__ = ["brix","util","DomTools"];
brix.util.DomTools.doLater = function(callbackFunction,frames) {
	if(frames == null) frames = 1;
	var frameInterval = 200;
	haxe.Timer.delay(callbackFunction,frames * frameInterval);
}
brix.util.DomTools.abs2rel = function(url) {
	var initialUrl = url;
	var base = brix.util.DomTools.getBaseUrl();
	var idx = base.indexOf("://");
	if(idx == -1) return initialUrl; else base = HxOverrides.substr(base,idx + 3,null);
	var idx1 = url.indexOf("://");
	if(idx1 == -1) return initialUrl; else url = HxOverrides.substr(url,idx1 + 3,null);
	var baseArray = base.split("/");
	var urlArray = url.split("/");
	if(baseArray[0] != urlArray[0]) return initialUrl;
	var diffIdx = 0;
	var _g1 = 0, _g = baseArray.length;
	while(_g1 < _g) {
		var idx2 = _g1++;
		if(urlArray.length < idx2 || baseArray[idx2] != urlArray[idx2]) {
			diffIdx = idx2;
			break;
		}
	}
	var resUrl = "";
	if(baseArray.length > diffIdx + 1) {
		var _g1 = diffIdx, _g = baseArray.length - 1;
		while(_g1 < _g) {
			var idx2 = _g1++;
			resUrl += "../";
		}
	} else {
	}
	var _g1 = diffIdx, _g = urlArray.length;
	while(_g1 < _g) {
		var idx2 = _g1++;
		resUrl += urlArray[idx2];
		if(idx2 != urlArray.length - 1) resUrl += "/";
	}
	return resUrl;
}
brix.util.DomTools.rel2abs = function(url,base) {
	if(base == null) base = brix.util.DomTools.getBaseUrl();
	url = StringTools.replace(url,"\\","/");
	var idxBase = url.indexOf("://");
	if(idxBase == -1) url = base + url;
	var urlArray = url.split("/");
	var absoluteUrlArray = new Array();
	var _g1 = 0, _g = urlArray.length;
	while(_g1 < _g) {
		var idx = _g1++;
		if(urlArray[idx] == "..") absoluteUrlArray.pop(); else absoluteUrlArray.push(urlArray[idx]);
	}
	url = absoluteUrlArray.join("/");
	return url;
}
brix.util.DomTools.getElementsByAttribute = function(elt,attr,value) {
	var childElts = elt.getElementsByTagName("*");
	var filteredChildElts = new Array();
	var _g1 = 0, _g = childElts.length;
	while(_g1 < _g) {
		var cCount = _g1++;
		if(childElts[cCount].getAttribute(attr) != null && (value == "*" || childElts[cCount].getAttribute(attr) == value)) filteredChildElts.push(childElts[cCount]);
	}
	return filteredChildElts;
}
brix.util.DomTools.getSingleElement = function(rootElement,className,required) {
	if(required == null) required = true;
	var domElements = rootElement.getElementsByClassName(className);
	if(domElements.length > 1) throw "Error: search for the element with class name \"" + className + "\" gave " + domElements.length + " results";
	if(domElements != null && domElements.length == 1) return domElements[0]; else {
		if(required) throw "Error: search for the element with class name \"" + className + "\" gave " + domElements.length + " results";
		return null;
	}
}
brix.util.DomTools.getElementBoundingBox = function(htmlDom) {
	if(htmlDom.nodeType != 1) return null;
	var offsetTop = 0;
	var offsetLeft = 0;
	var offsetWidth = 0.0;
	var offsetHeight = 0.0;
	var element = htmlDom;
	while(element != null) {
		var borderH = (element.offsetWidth - element.clientWidth) / 2;
		var borderV = (element.offsetHeight - element.clientHeight) / 2;
		offsetWidth += borderH;
		offsetHeight += borderV;
		offsetWidth -= borderH;
		offsetHeight -= borderV;
		offsetTop -= Math.round(borderV / 2.0);
		offsetLeft -= Math.round(borderH / 2.0);
		offsetTop -= element.scrollTop;
		offsetLeft -= element.scrollLeft;
		offsetTop += element.offsetTop;
		offsetLeft += element.offsetLeft;
		element = element.offsetParent;
	}
	return { x : Math.round(offsetLeft), y : Math.round(offsetTop), w : Math.round(htmlDom.offsetWidth + offsetWidth), h : Math.round(htmlDom.offsetHeight + offsetHeight)};
}
brix.util.DomTools.getElementIndex = function(childNode) {
	var i = 0;
	var child = childNode;
	while((child = child.previousSibling) != null) i++;
	return i;
}
brix.util.DomTools.moveTo = function(htmlDom,x,y) {
	var elementBox = brix.util.DomTools.getElementBoundingBox(htmlDom);
	if(x != null) {
		var newPosX = htmlDom.offsetLeft + (x - elementBox.x);
		htmlDom.style.left = Math.round(newPosX) + "px";
	}
	if(y != null) {
		var newPosY = htmlDom.offsetTop + (y - elementBox.y);
		htmlDom.style.top = Math.round(newPosY) + "px";
	}
}
brix.util.DomTools.inspectTrace = function(obj,callingClass) {
	var _g = 0, _g1 = Reflect.fields(obj);
	while(_g < _g1.length) {
		var prop = _g1[_g];
		++_g;
		null;
	}
	null;
}
brix.util.DomTools.toggleClass = function(element,className) {
	if(brix.util.DomTools.hasClass(element,className)) brix.util.DomTools.removeClass(element,className); else brix.util.DomTools.addClass(element,className);
}
brix.util.DomTools.addClass = function(element,className) {
	if(element.className == null) element.className = "";
	Lambda.iter(className.split(" "),function(cn) {
		if(!Lambda.has(element.className.split(" "),cn)) {
			if(element.className != "") element.className += " ";
			element.className += cn;
		}
	});
}
brix.util.DomTools.removeClass = function(element,className) {
	if(element.className == null || StringTools.trim(element.className) == "") return;
	var classNamesToKeep = new Array();
	var cns = className.split(" ");
	Lambda.iter(element.className.split(" "),function(ecn) {
		if(!Lambda.has(cns,ecn)) classNamesToKeep.push(ecn);
	});
	element.className = classNamesToKeep.join(" ");
}
brix.util.DomTools.hasClass = function(element,className,orderedClassName) {
	if(orderedClassName == null) orderedClassName = false;
	if(element.className == null || StringTools.trim(element.className) == "" || className == null || StringTools.trim(className) == "") return false;
	if(orderedClassName) {
		var cns = className.split(" ");
		var ecns = element.className.split(" ");
		var result = Lambda.map(cns,function(cn) {
			return Lambda.indexOf(ecns,cn);
		});
		var prevR = 0;
		var $it0 = result.iterator();
		while( $it0.hasNext() ) {
			var r = $it0.next();
			if(r < prevR) return false;
			prevR = r;
		}
		return true;
	} else {
		var _g = 0, _g1 = className.split(" ");
		while(_g < _g1.length) {
			var cn = _g1[_g];
			++_g;
			if(cn == null || StringTools.trim(cn) == "") continue;
			var found = Lambda.has(element.className.split(" "),cn);
			if(!found) return false;
		}
		return true;
	}
}
brix.util.DomTools.setMeta = function(metaName,metaValue,attributeName,head) {
	if(attributeName == null) attributeName = "content";
	var res = new Hash();
	if(head == null) head = js.Lib.document.documentElement.getElementsByTagName("head")[0];
	var metaTags = head.getElementsByTagName("META");
	var found = false;
	var _g1 = 0, _g = metaTags.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = metaTags[idxNode];
		var configName = node.getAttribute("name");
		var configValue = node.getAttribute(attributeName);
		if(configName != null && configValue != null) {
			if(configName == metaName) {
				configValue = metaValue;
				node.setAttribute(attributeName,metaValue);
				found = true;
			}
			res.set(configName,configValue);
		}
	}
	if(!found) {
		var node = js.Lib.document.createElement("meta");
		node.setAttribute("name",metaName);
		node.setAttribute("content",metaValue);
		head.appendChild(node);
		res.set(metaName,metaValue);
	}
	return res;
}
brix.util.DomTools.getMeta = function(name,attributeName,head) {
	if(attributeName == null) attributeName = "content";
	if(head == null) head = js.Lib.document.documentElement.getElementsByTagName("head")[0];
	var metaTags = head.getElementsByTagName("meta");
	var _g1 = 0, _g = metaTags.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = metaTags[idxNode];
		var configName = node.getAttribute("name");
		var configValue = node.getAttribute(attributeName);
		if(configName == name) return configValue;
	}
	return null;
}
brix.util.DomTools.addCssRules = function(css,head) {
	if(head == null) head = js.Lib.document.documentElement.getElementsByTagName("head")[0];
	var node = js.Lib.document.createElement("style");
	node.setAttribute("type","text/css");
	node.appendChild(js.Lib.document.createTextNode(css));
	head.appendChild(node);
	return node;
}
brix.util.DomTools.embedScript = function(src) {
	var head = js.Lib.document.getElementsByTagName("head")[0];
	var scriptNodes = js.Lib.document.getElementsByTagName("script");
	var _g1 = 0, _g = scriptNodes.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = scriptNodes[idxNode];
		if(node.getAttribute("src") == src) return node;
	}
	var node = js.Lib.document.createElement("script");
	node.setAttribute("src",src);
	head.appendChild(node);
	return node;
}
brix.util.DomTools.getBaseTag = function() {
	var baseNodes = js.Lib.document.getElementsByTagName("base");
	if(baseNodes.length > 0) return baseNodes[0].getAttribute("href"); else return null;
}
brix.util.DomTools.setBaseTag = function(href) {
	var head = js.Lib.document.getElementsByTagName("head")[0];
	var baseNodes = js.Lib.document.getElementsByTagName("base");
	href = brix.util.DomTools.rel2abs(href);
	if(baseNodes.length > 0) baseNodes[0].setAttribute("href",href); else {
		var node = js.Lib.document.createElement("base");
		node.setAttribute("href",href);
		if(head.childNodes.length > 0) head.insertBefore(node,head.childNodes[0]); else head.appendChild(node);
	}
}
brix.util.DomTools.removeBaseTag = function() {
	var baseNodes = js.Lib.document.getElementsByTagName("base");
	while(baseNodes.length > 0) baseNodes[0].parentNode.removeChild(baseNodes[0]);
}
brix.util.DomTools.getBaseUrl = function() {
	var base = brix.util.DomTools.getBaseTag();
	if(base == null) {
		var idxSlash = js.Lib.window.location.href.lastIndexOf("/");
		var idxDot = js.Lib.window.location.href.lastIndexOf(".");
		if(idxSlash < idxDot) base = base = HxOverrides.substr(js.Lib.window.location.href,0,idxSlash + 1); else base = js.Lib.window.location.href;
	}
	return base;
}
brix.util.DomTools.isUndefined = function(value) {
	var ret = "undefined" === typeof value;
	return ret;
}
brix.util.DomTools.innerHTML = function(node,content) {
	if(content != null && node.nodeName == "HTML" && js.Lib.window.navigator.userAgent.toLowerCase().indexOf("msie") > -1) {
		content = StringTools.replace(content,"<HEAD>","<BRIXHEAD>");
		content = StringTools.replace(content,"</HEAD>","</BRIXHEAD>");
		content = StringTools.replace(content,"<BODY>","<BRIXBODY>");
		content = StringTools.replace(content,"</BODY>","</BRIXBODY>");
		var tempNode = js.Lib.document.createElement("DIV");
		tempNode.innerHTML = content;
		while(node.attributes.length > 0) node.removeAttribute(node.attributes[0].nodeName);
		var head = node.getElementsByTagName("HEAD");
		if(head.length > 0) while(head[0].hasChildNodes()) head[0].removeChild(head[0].firstChild);
		var body = node.getElementsByTagName("BODY");
		if(body.length > 0) {
			while(body[0].attributes.length > 0) body[0].removeAttribute(body[0].attributes[0].nodeName);
			while(body[0].hasChildNodes()) body[0].removeChild(body[0].firstChild);
		}
		while(tempNode.attributes.length > 0) {
			node.setAttribute(tempNode.attributes[0].nodeName,tempNode.attributes[0].nodeValue);
			tempNode.removeAttribute(tempNode.attributes[0].nodeName);
		}
		var tempHead = tempNode.getElementsByTagName("BRIXHEAD");
		var head1 = node.getElementsByTagName("HEAD");
		if(tempHead.length > 0) {
			if(head1.length == 0) {
				if(node.hasChildNodes()) node.insertBefore(js.Lib.document.createElement("HEAD"),node.firstChild); else node.appendChild(js.Lib.document.createElement("HEAD"));
			}
			while(tempHead[0].hasChildNodes()) head1[0].appendChild(tempHead[0].removeChild(tempHead[0].childNodes[0]));
		}
		var tempBody = tempNode.getElementsByTagName("BRIXBODY");
		var body1 = node.getElementsByTagName("BODY");
		if(tempBody.length > 0) {
			if(body1.length == 0) node.appendChild(js.Lib.document.createElement("BODY"));
			while(tempBody[0].attributes.length > 0) {
				body1[0].setAttribute(tempBody[0].attributes[0].nodeName,tempBody[0].attributes[0].nodeValue);
				tempBody[0].removeAttribute(tempBody[0].attributes[0].nodeName);
			}
			while(tempBody[0].hasChildNodes()) body1[0].appendChild(tempBody[0].removeChild(tempBody[0].childNodes[0]));
		}
		return node.innerHTML;
	}
	if(content != null) node.innerHTML = content;
	return node.innerHTML;
}
brix.util.haxe = {}
brix.util.haxe.ObjectHash = function() {
	this._keys = new Array();
	this._values = new Array();
};
$hxClasses["brix.util.haxe.ObjectHash"] = brix.util.haxe.ObjectHash;
brix.util.haxe.ObjectHash.__name__ = ["brix","util","haxe","ObjectHash"];
brix.util.haxe.ObjectHash.prototype = {
	toString: function() {
		var str = "";
		var _g1 = 0, _g = this._keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			str += ", [" + Std.string(this._keys[i]) + "] => " + Std.string(this._values[i]);
		}
		return str;
	}
	,set: function(key,value) {
		this._keys.push(key);
		this._values.push(value);
	}
	,remove: function(key) {
		var _g1 = 0, _g = this._keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._keys[i] == key) return this._values.splice(i,1) != null && this._keys.splice(i,1) != null;
		}
		return false;
	}
	,keys: function() {
		return HxOverrides.iter(this._keys);
	}
	,iterator: function() {
		return HxOverrides.iter(this._values);
	}
	,get: function(key) {
		var _g1 = 0, _g = this._keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._keys[i] == key) return this._values[i];
		}
		return null;
	}
	,exists: function(key) {
		return Lambda.has(this._keys,key);
	}
	,_values: null
	,_keys: null
	,__class__: brix.util.haxe.ObjectHash
}
var components = {}
components.GallerySplity = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
};
$hxClasses["components.GallerySplity"] = components.GallerySplity;
components.GallerySplity.__name__ = ["components","GallerySplity"];
components.GallerySplity.__super__ = brix.component.ui.DisplayObject;
components.GallerySplity.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onStatus: function(messageData) {
		switch(messageData.type) {
		case "TYPE_CLIENT_DISPATCH":
			if(messageData.metaData.id != this._id) {
				if(messageData.metaData.action == components.GallerySplity.CHANGE_PAGE) this.changePage(messageData.metaData.pageName); else {
					var event = js.Lib.document.createEvent("CustomEvent");
					event.initCustomEvent("TYPE_CLIENT_DISPATCH",false,false,messageData.metaData);
					this.rootElement.dispatchEvent(event);
				}
			}
			break;
		}
	}
	,onError: function(str) {
		null;
	}
	,onMetaDataSet: function(data) {
		this.initApplication();
	}
	,onConnect: function() {
		this._id = "" + Math.round(Math.random() * 1000);
		this._splityAPI.setClientMetaData(components.GallerySplity.ID_IDENT,this._id,$bind(this,this.onMetaDataSet),$bind(this,this.onError));
	}
	,onTransitionEnd: function(e) {
		this._remotePageChange = false;
	}
	,listenToPageChange: function() {
		js.Lib.document.body.addEventListener("pageOpenStart",$bind(this,this.onPageChange),false);
		js.Lib.document.body.addEventListener("pageOpenStop",$bind(this,this.onTransitionEnd),false);
	}
	,changePage: function(name) {
		this._remotePageChange = true;
		var page = brix.component.navigation.Page.getPageByName(name,this.brixInstanceId);
		page.open(null,null,true,true,true);
	}
	,getContextManager: function() {
		var contextManagerNode = js.Lib.document.getElementsByClassName(components.GallerySplity.CONTEXT_MANAGER_CLASS)[0];
		var application = brix.core.Application.get(this.brixInstanceId);
		return application.getAssociatedComponents(contextManagerNode,brix.component.navigation.ContextManager).first();
	}
	,removeFunctionnality: function(name) {
		this.getContextManager().removeContext(name);
	}
	,addFunctionnality: function(name) {
		this.getContextManager().addContext(name);
	}
	,onSendMessageRequest: function(e) {
		e.detail.id = this._id;
		this._splityAPI.dispatch(e.detail,null,null);
	}
	,onMasterButtonClick: function(e) {
		brix.util.DomTools.toggleClass(e.target,components.GallerySplity.MASTER_BUTTON_DOWN_CLASS);
		if(this._isMaster == true) {
			this.removeFunctionnality(components.GallerySplity.THUMB_FUNCTIONNALITY);
			this.removeFunctionnality(components.GallerySplity.REMOTE_FUNCTIONNALITY);
			this._isMaster = false;
		} else {
			this.addFunctionnality(components.GallerySplity.THUMB_FUNCTIONNALITY);
			this.addFunctionnality(components.GallerySplity.REMOTE_FUNCTIONNALITY);
			this._isMaster = true;
		}
	}
	,listenToMasterButton: function() {
		js.Lib.document.getElementById(components.GallerySplity.MASTER_BUTTON_ID).addEventListener("click",$bind(this,this.onMasterButtonClick),false);
	}
	,initApplication: function() {
		this.addFunctionnality(components.GallerySplity.DISPLAY_FUNCTIONNALITY);
		this.listenToPageChange();
		this.listenToMasterButton();
		this.rootElement.addEventListener(components.GallerySplity.TYPE_REQUEST_SEND,$bind(this,this.onSendMessageRequest),true);
	}
	,onPageChange: function(e) {
		var ce = e;
		if(this._remotePageChange == false) this._splityAPI.dispatch({ action : components.GallerySplity.CHANGE_PAGE, pageName : ce.detail.name, id : this._id},null,null);
	}
	,init: function() {
		this._remotePageChange = false;
		this._isMaster = false;
		this._splityAPI = new splity.client.SplityAPI();
		this._splityAPI.connect(components.GallerySplity.SPLITY_URL,null,null,null);
		this._splityAPI.subscribe($bind(this,this.onConnect),$bind(this,this.onError),$bind(this,this.onStatus));
	}
	,_isMaster: null
	,_remotePageChange: null
	,_splityAPI: null
	,_id: null
	,__class__: components.GallerySplity
});
components.Pointer = function(rootElement,brixId) {
	this._mouseY = -1000;
	this._mouseX = -1000;
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	this._imageElement = brix.util.DomTools.getSingleElement(rootElement,"pointer-image");
	this._imageElement.style.position = "fixed";
	this._imageElement.style.zIndex = 30;
	this._imageElement.style.top = "0px";
	this._imageElement.style.left = "0px";
	this._imageElement.style.display = "none";
	this._imageElement.style.zIndex = 1000;
	this.onMouseMoveCallback = (function(f) {
		return function(e) {
			return f(e);
		};
	})($bind(this,this.onMouseMove));
	this.onMouseDownCallback = (function(f) {
		return function(e) {
			return f(e);
		};
	})($bind(this,this.onMouseDown));
	this.onMouseUpCallback = (function(f) {
		return function(e) {
			return f(e);
		};
	})($bind(this,this.onMouseUp));
	this.onDrawCallback = (function(f) {
		return function(e) {
			return f(e);
		};
	})($bind(this,this.onDraw));
	var pointerDisplay = brix.util.DomTools.getSingleElement(rootElement,"pointer-display");
	pointerDisplay.addEventListener("mouseup",$bind(this,this.displayPointer),true);
	var pointerHide = brix.util.DomTools.getSingleElement(rootElement,"pointer-hide");
	pointerHide.addEventListener("mouseup",$bind(this,this.hidePointer),true);
};
$hxClasses["components.Pointer"] = components.Pointer;
components.Pointer.__name__ = ["components","Pointer"];
components.Pointer.__super__ = brix.component.ui.DisplayObject;
components.Pointer.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onDraw: function(e) {
		if(e.detail.type == "sendDraw") {
			var x = Math.round(e.detail.clientX * js.Lib.window.innerWidth);
			var y = Math.round(e.detail.clientY * js.Lib.window.innerHeight);
			this.draw(x,y);
		}
	}
	,sendDraw: function() {
		var percentX = this._mouseX / js.Lib.window.innerWidth;
		var percentY = this._mouseY / js.Lib.window.innerHeight;
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent(components.GallerySplity.TYPE_REQUEST_SEND,false,false,{ type : "sendDraw", clientX : percentX, clientY : percentY});
		this.rootElement.dispatchEvent(event);
	}
	,draw: function(x,y) {
		this._imageElement.style.top = y - 1 + "px";
		this._imageElement.style.left = x - 1 + "px";
		this._imageElement.style.display = "inherit";
	}
	,onMouseMove: function(e) {
		e.preventDefault();
		this._mouseX = e.clientX;
		this._mouseY = e.clientY;
	}
	,onMouseUp: function(e) {
		if(this._timer != null) this._timer.stop();
		this._timer = null;
		this._imageElement.style.display = "none";
		this.sendDraw();
		this.draw(this._mouseX,this._mouseY);
	}
	,onMouseDown: function(e) {
		this.onMouseMove(e);
		this.sendDraw();
		if(this._timer == null) this._timer = new haxe.Timer(500);
		this._timer.run = $bind(this,this.sendDraw);
	}
	,hidePointer: function(e) {
		this.rootElement.style.cursor = "";
		this._container.removeEventListener("mousemove",this.onMouseMoveCallback,true);
		this._container.removeEventListener("mouseup",this.onMouseUpCallback,true);
		this.rootElement.removeEventListener("TYPE_CLIENT_DISPATCH",this.onDrawCallback,true);
	}
	,displayPointer: function(e) {
		this.rootElement.style.cursor = "url(\"assets/pointer-red.png\"), pointer";
		this._container = brix.util.DomTools.getSingleElement(this.rootElement,"pages-container");
		this._container.addEventListener("mousemove",this.onMouseMoveCallback,true);
		this._container.addEventListener("mouseup",this.onMouseUpCallback,true);
		this.rootElement.addEventListener("TYPE_CLIENT_DISPATCH",this.onDrawCallback,true);
	}
	,onDrawCallback: null
	,onMouseUpCallback: null
	,onMouseDownCallback: null
	,onMouseMoveCallback: null
	,_timer: null
	,_mouseY: null
	,_mouseX: null
	,_imageElement: null
	,_container: null
	,__class__: components.Pointer
});
components.ResizeIcon = function(rootElement,SLPId) {
	brix.component.ui.DisplayObject.call(this,rootElement,SLPId);
	js.Lib.window.addEventListener("resize",$bind(this,this.onResize),false);
	this.onResize(null);
};
$hxClasses["components.ResizeIcon"] = components.ResizeIcon;
components.ResizeIcon.__name__ = ["components","ResizeIcon"];
components.ResizeIcon.__super__ = brix.component.ui.DisplayObject;
components.ResizeIcon.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onResize: function(e) {
		var width = 0;
		var height = 0;
		var marginTop = 0;
		if(js.Lib.document.body.clientHeight < 480 && js.Lib.document.body.clientWidth < 640) {
			width = 25;
			height = 25;
		} else {
			width = 50;
			height = 50;
		}
		marginTop = -height / 2 | 0;
		this.rootElement.style.width = Std.string(width) + "px";
		this.rootElement.style.height = Std.string(height) + "px";
		this.rootElement.style.marginTop = Std.string(marginTop) + "px";
	}
	,__class__: components.ResizeIcon
});
haxe.Http = function(url) {
	this.url = url;
	this.headers = new Hash();
	this.params = new Hash();
	this.async = true;
};
$hxClasses["haxe.Http"] = haxe.Http;
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.requestUrl = function(url) {
	var h = new haxe.Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	};
	h.onError = function(e) {
		throw e;
	};
	h.request(false);
	return r;
}
haxe.Http.prototype = {
	onStatus: function(status) {
	}
	,onError: function(msg) {
	}
	,onData: function(data) {
	}
	,request: function(post) {
		var me = this;
		var r = new js.XMLHttpRequest();
		var onreadystatechange = function() {
			if(r.readyState != 4) return;
			var s = (function($this) {
				var $r;
				try {
					$r = r.status;
				} catch( e ) {
					$r = null;
				}
				return $r;
			}(this));
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) me.onData(r.responseText); else switch(s) {
			case null: case undefined:
				me.onError("Failed to connect or resolve host");
				break;
			case 12029:
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.onError("Unknown host");
				break;
			default:
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.keys();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(this.params.get(p));
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e ) {
			this.onError(e.toString());
			return;
		}
		if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.keys();
		while( $it1.hasNext() ) {
			var h = $it1.next();
			r.setRequestHeader(h,this.headers.get(h));
		}
		r.send(uri);
		if(!this.async) onreadystatechange();
	}
	,setPostData: function(data) {
		this.postData = data;
	}
	,setParameter: function(param,value) {
		this.params.set(param,value);
	}
	,setHeader: function(header,value) {
		this.headers.set(header,value);
	}
	,params: null
	,headers: null
	,postData: null
	,async: null
	,url: null
	,__class__: haxe.Http
}
haxe.Log = function() { }
$hxClasses["haxe.Log"] = haxe.Log;
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new Hash();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe.Serializer;
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
}
haxe.Serializer.prototype = {
	serializeException: function(e) {
		this.buf.b += Std.string("x");
		this.serialize(e);
	}
	,serialize: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 0:
			this.buf.b += Std.string("n");
			break;
		case 1:
			if(v == 0) {
				this.buf.b += Std.string("z");
				return;
			}
			this.buf.b += Std.string("i");
			this.buf.b += Std.string(v);
			break;
		case 2:
			if(Math.isNaN(v)) this.buf.b += Std.string("k"); else if(!Math.isFinite(v)) this.buf.b += Std.string(v < 0?"m":"p"); else {
				this.buf.b += Std.string("d");
				this.buf.b += Std.string(v);
			}
			break;
		case 3:
			this.buf.b += Std.string(v?"t":"f");
			break;
		case 6:
			var c = $e[2];
			if(c == String) {
				this.serializeString(v);
				return;
			}
			if(this.useCache && this.serializeRef(v)) return;
			switch(c) {
			case Array:
				var ucount = 0;
				this.buf.b += Std.string("a");
				var l = v.length;
				var _g = 0;
				while(_g < l) {
					var i = _g++;
					if(v[i] == null) ucount++; else {
						if(ucount > 0) {
							if(ucount == 1) this.buf.b += Std.string("n"); else {
								this.buf.b += Std.string("u");
								this.buf.b += Std.string(ucount);
							}
							ucount = 0;
						}
						this.serialize(v[i]);
					}
				}
				if(ucount > 0) {
					if(ucount == 1) this.buf.b += Std.string("n"); else {
						this.buf.b += Std.string("u");
						this.buf.b += Std.string(ucount);
					}
				}
				this.buf.b += Std.string("h");
				break;
			case List:
				this.buf.b += Std.string("l");
				var v1 = v;
				var $it0 = v1.iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					this.serialize(i);
				}
				this.buf.b += Std.string("h");
				break;
			case Date:
				var d = v;
				this.buf.b += Std.string("v");
				this.buf.b += Std.string(HxOverrides.dateStr(d));
				break;
			case Hash:
				this.buf.b += Std.string("b");
				var v1 = v;
				var $it1 = v1.keys();
				while( $it1.hasNext() ) {
					var k = $it1.next();
					this.serializeString(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case IntHash:
				this.buf.b += Std.string("q");
				var v1 = v;
				var $it2 = v1.keys();
				while( $it2.hasNext() ) {
					var k = $it2.next();
					this.buf.b += Std.string(":");
					this.buf.b += Std.string(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case haxe.io.Bytes:
				var v1 = v;
				var i = 0;
				var max = v1.length - 2;
				var charsBuf = new StringBuf();
				var b64 = haxe.Serializer.BASE64;
				while(i < max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					var b3 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt((b2 << 2 | b3 >> 6) & 63));
					charsBuf.b += Std.string(b64.charAt(b3 & 63));
				}
				if(i == max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt(b2 << 2 & 63));
				} else if(i == max + 1) {
					var b1 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt(b1 << 4 & 63));
				}
				var chars = charsBuf.b;
				this.buf.b += Std.string("s");
				this.buf.b += Std.string(chars.length);
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(chars);
				break;
			default:
				this.cache.pop();
				if(v.hxSerialize != null) {
					this.buf.b += Std.string("C");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					v.hxSerialize(this);
					this.buf.b += Std.string("g");
				} else {
					this.buf.b += Std.string("c");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					this.serializeFields(v);
				}
			}
			break;
		case 4:
			if(this.useCache && this.serializeRef(v)) return;
			this.buf.b += Std.string("o");
			this.serializeFields(v);
			break;
		case 7:
			var e = $e[2];
			if(this.useCache && this.serializeRef(v)) return;
			this.cache.pop();
			this.buf.b += Std.string(this.useEnumIndex?"j":"w");
			this.serializeString(Type.getEnumName(e));
			if(this.useEnumIndex) {
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(v[1]);
			} else this.serializeString(v[0]);
			this.buf.b += Std.string(":");
			var l = v.length;
			this.buf.b += Std.string(l - 2);
			var _g = 2;
			while(_g < l) {
				var i = _g++;
				this.serialize(v[i]);
			}
			this.cache.push(v);
			break;
		case 5:
			throw "Cannot serialize function";
			break;
		default:
			throw "Cannot serialize " + Std.string(v);
		}
	}
	,serializeFields: function(v) {
		var _g = 0, _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += Std.string("g");
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0, _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += Std.string("r");
				this.buf.b += Std.string(i);
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += Std.string("R");
			this.buf.b += Std.string(x);
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += Std.string("y");
		s = StringTools.urlEncode(s);
		this.buf.b += Std.string(s.length);
		this.buf.b += Std.string(":");
		this.buf.b += Std.string(s);
	}
	,toString: function() {
		return this.buf.b;
	}
	,useEnumIndex: null
	,useCache: null
	,scount: null
	,shash: null
	,cache: null
	,buf: null
	,__class__: haxe.Serializer
}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = function() { }
$hxClasses["haxe.Stack"] = haxe.Stack;
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
haxe._Template = {}
haxe._Template.TemplateExpr = $hxClasses["haxe._Template.TemplateExpr"] = { __ename__ : ["haxe","_Template","TemplateExpr"], __constructs__ : ["OpVar","OpExpr","OpIf","OpStr","OpBlock","OpForeach","OpMacro"] }
haxe._Template.TemplateExpr.OpVar = function(v) { var $x = ["OpVar",0,v]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpExpr = function(expr) { var $x = ["OpExpr",1,expr]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpIf = function(expr,eif,eelse) { var $x = ["OpIf",2,expr,eif,eelse]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpStr = function(str) { var $x = ["OpStr",3,str]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpBlock = function(l) { var $x = ["OpBlock",4,l]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpForeach = function(expr,loop) { var $x = ["OpForeach",5,expr,loop]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpMacro = function(name,params) { var $x = ["OpMacro",6,name,params]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe.Template = function(str) {
	var tokens = this.parseTokens(str);
	this.expr = this.parseBlock(tokens);
	if(!tokens.isEmpty()) throw "Unexpected '" + Std.string(tokens.first().s) + "'";
};
$hxClasses["haxe.Template"] = haxe.Template;
haxe.Template.__name__ = ["haxe","Template"];
haxe.Template.prototype = {
	run: function(e) {
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			this.buf.b += Std.string(Std.string(this.resolve(v)));
			break;
		case 1:
			var e1 = $e[2];
			this.buf.b += Std.string(Std.string(e1()));
			break;
		case 2:
			var eelse = $e[4], eif = $e[3], e1 = $e[2];
			var v = e1();
			if(v == null || v == false) {
				if(eelse != null) this.run(eelse);
			} else this.run(eif);
			break;
		case 3:
			var str = $e[2];
			this.buf.b += Std.string(str);
			break;
		case 4:
			var l = $e[2];
			var $it0 = l.iterator();
			while( $it0.hasNext() ) {
				var e1 = $it0.next();
				this.run(e1);
			}
			break;
		case 5:
			var loop = $e[3], e1 = $e[2];
			var v = e1();
			try {
				var x = $iterator(v)();
				if(x.hasNext == null) throw null;
				v = x;
			} catch( e2 ) {
				try {
					if(v.hasNext == null) throw null;
				} catch( e3 ) {
					throw "Cannot iter on " + Std.string(v);
				}
			}
			this.stack.push(this.context);
			var v1 = v;
			while( v1.hasNext() ) {
				var ctx = v1.next();
				this.context = ctx;
				this.run(loop);
			}
			this.context = this.stack.pop();
			break;
		case 6:
			var params = $e[3], m = $e[2];
			var v = Reflect.field(this.macros,m);
			var pl = new Array();
			var old = this.buf;
			pl.push($bind(this,this.resolve));
			var $it1 = params.iterator();
			while( $it1.hasNext() ) {
				var p = $it1.next();
				var $e = (p);
				switch( $e[1] ) {
				case 0:
					var v1 = $e[2];
					pl.push(this.resolve(v1));
					break;
				default:
					this.buf = new StringBuf();
					this.run(p);
					pl.push(this.buf.b);
				}
			}
			this.buf = old;
			try {
				this.buf.b += Std.string(Std.string(v.apply(this.macros,pl)));
			} catch( e1 ) {
				var plstr = (function($this) {
					var $r;
					try {
						$r = pl.join(",");
					} catch( e2 ) {
						$r = "???";
					}
					return $r;
				}(this));
				var msg = "Macro call " + m + "(" + plstr + ") failed (" + Std.string(e1) + ")";
				throw msg;
			}
			break;
		}
	}
	,makeExpr2: function(l) {
		var p = l.pop();
		if(p == null) throw "<eof>";
		if(p.s) return this.makeConst(p.p);
		switch(p.p) {
		case "(":
			var e1 = this.makeExpr(l);
			var p1 = l.pop();
			if(p1 == null || p1.s) throw p1.p;
			if(p1.p == ")") return e1;
			var e2 = this.makeExpr(l);
			var p2 = l.pop();
			if(p2 == null || p2.p != ")") throw p2.p;
			return (function($this) {
				var $r;
				switch(p1.p) {
				case "+":
					$r = function() {
						return e1() + e2();
					};
					break;
				case "-":
					$r = function() {
						return e1() - e2();
					};
					break;
				case "*":
					$r = function() {
						return e1() * e2();
					};
					break;
				case "/":
					$r = function() {
						return e1() / e2();
					};
					break;
				case ">":
					$r = function() {
						return e1() > e2();
					};
					break;
				case "<":
					$r = function() {
						return e1() < e2();
					};
					break;
				case ">=":
					$r = function() {
						return e1() >= e2();
					};
					break;
				case "<=":
					$r = function() {
						return e1() <= e2();
					};
					break;
				case "==":
					$r = function() {
						return e1() == e2();
					};
					break;
				case "!=":
					$r = function() {
						return e1() != e2();
					};
					break;
				case "&&":
					$r = function() {
						return e1() && e2();
					};
					break;
				case "||":
					$r = function() {
						return e1() || e2();
					};
					break;
				default:
					$r = (function($this) {
						var $r;
						throw "Unknown operation " + p1.p;
						return $r;
					}($this));
				}
				return $r;
			}(this));
		case "!":
			var e = this.makeExpr(l);
			return function() {
				var v = e();
				return v == null || v == false;
			};
		case "-":
			var e = this.makeExpr(l);
			return function() {
				return -e();
			};
		}
		throw p.p;
	}
	,makeExpr: function(l) {
		return this.makePath(this.makeExpr2(l),l);
	}
	,makePath: function(e,l) {
		var p = l.first();
		if(p == null || p.p != ".") return e;
		l.pop();
		var field = l.pop();
		if(field == null || !field.s) throw field.p;
		var f = field.p;
		haxe.Template.expr_trim.match(f);
		f = haxe.Template.expr_trim.matched(1);
		return this.makePath(function() {
			return Reflect.field(e(),f);
		},l);
	}
	,makeConst: function(v) {
		haxe.Template.expr_trim.match(v);
		v = haxe.Template.expr_trim.matched(1);
		if(HxOverrides.cca(v,0) == 34) {
			var str = HxOverrides.substr(v,1,v.length - 2);
			return function() {
				return str;
			};
		}
		if(haxe.Template.expr_int.match(v)) {
			var i = Std.parseInt(v);
			return function() {
				return i;
			};
		}
		if(haxe.Template.expr_float.match(v)) {
			var f = Std.parseFloat(v);
			return function() {
				return f;
			};
		}
		var me = this;
		return function() {
			return me.resolve(v);
		};
	}
	,parseExpr: function(data) {
		var l = new List();
		var expr = data;
		while(haxe.Template.expr_splitter.match(data)) {
			var p = haxe.Template.expr_splitter.matchedPos();
			var k = p.pos + p.len;
			if(p.pos != 0) l.add({ p : HxOverrides.substr(data,0,p.pos), s : true});
			var p1 = haxe.Template.expr_splitter.matched(0);
			l.add({ p : p1, s : p1.indexOf("\"") >= 0});
			data = haxe.Template.expr_splitter.matchedRight();
		}
		if(data.length != 0) l.add({ p : data, s : true});
		var e;
		try {
			e = this.makeExpr(l);
			if(!l.isEmpty()) throw l.first().p;
		} catch( s ) {
			if( js.Boot.__instanceof(s,String) ) {
				throw "Unexpected '" + s + "' in " + expr;
			} else throw(s);
		}
		return function() {
			try {
				return e();
			} catch( exc ) {
				throw "Error : " + Std.string(exc) + " in " + expr;
			}
		};
	}
	,parse: function(tokens) {
		var t = tokens.pop();
		var p = t.p;
		if(t.s) return haxe._Template.TemplateExpr.OpStr(p);
		if(t.l != null) {
			var pe = new List();
			var _g = 0, _g1 = t.l;
			while(_g < _g1.length) {
				var p1 = _g1[_g];
				++_g;
				pe.add(this.parseBlock(this.parseTokens(p1)));
			}
			return haxe._Template.TemplateExpr.OpMacro(p,pe);
		}
		if(HxOverrides.substr(p,0,3) == "if ") {
			p = HxOverrides.substr(p,3,p.length - 3);
			var e = this.parseExpr(p);
			var eif = this.parseBlock(tokens);
			var t1 = tokens.first();
			var eelse;
			if(t1 == null) throw "Unclosed 'if'";
			if(t1.p == "end") {
				tokens.pop();
				eelse = null;
			} else if(t1.p == "else") {
				tokens.pop();
				eelse = this.parseBlock(tokens);
				t1 = tokens.pop();
				if(t1 == null || t1.p != "end") throw "Unclosed 'else'";
			} else {
				t1.p = HxOverrides.substr(t1.p,4,t1.p.length - 4);
				eelse = this.parse(tokens);
			}
			return haxe._Template.TemplateExpr.OpIf(e,eif,eelse);
		}
		if(HxOverrides.substr(p,0,8) == "foreach ") {
			p = HxOverrides.substr(p,8,p.length - 8);
			var e = this.parseExpr(p);
			var efor = this.parseBlock(tokens);
			var t1 = tokens.pop();
			if(t1 == null || t1.p != "end") throw "Unclosed 'foreach'";
			return haxe._Template.TemplateExpr.OpForeach(e,efor);
		}
		if(haxe.Template.expr_splitter.match(p)) return haxe._Template.TemplateExpr.OpExpr(this.parseExpr(p));
		return haxe._Template.TemplateExpr.OpVar(p);
	}
	,parseBlock: function(tokens) {
		var l = new List();
		while(true) {
			var t = tokens.first();
			if(t == null) break;
			if(!t.s && (t.p == "end" || t.p == "else" || HxOverrides.substr(t.p,0,7) == "elseif ")) break;
			l.add(this.parse(tokens));
		}
		if(l.length == 1) return l.first();
		return haxe._Template.TemplateExpr.OpBlock(l);
	}
	,parseTokens: function(data) {
		var tokens = new List();
		while(haxe.Template.splitter.match(data)) {
			var p = haxe.Template.splitter.matchedPos();
			if(p.pos > 0) tokens.add({ p : HxOverrides.substr(data,0,p.pos), s : true, l : null});
			if(HxOverrides.cca(data,p.pos) == 58) {
				tokens.add({ p : HxOverrides.substr(data,p.pos + 2,p.len - 4), s : false, l : null});
				data = haxe.Template.splitter.matchedRight();
				continue;
			}
			var parp = p.pos + p.len;
			var npar = 1;
			while(npar > 0) {
				var c = HxOverrides.cca(data,parp);
				if(c == 40) npar++; else if(c == 41) npar--; else if(c == null) throw "Unclosed macro parenthesis";
				parp++;
			}
			var params = HxOverrides.substr(data,p.pos + p.len,parp - (p.pos + p.len) - 1).split(",");
			tokens.add({ p : haxe.Template.splitter.matched(2), s : false, l : params});
			data = HxOverrides.substr(data,parp,data.length - parp);
		}
		if(data.length > 0) tokens.add({ p : data, s : true, l : null});
		return tokens;
	}
	,resolve: function(v) {
		if(Reflect.hasField(this.context,v)) return Reflect.field(this.context,v);
		var $it0 = this.stack.iterator();
		while( $it0.hasNext() ) {
			var ctx = $it0.next();
			if(Reflect.hasField(ctx,v)) return Reflect.field(ctx,v);
		}
		if(v == "__current__") return this.context;
		return Reflect.field(haxe.Template.globals,v);
	}
	,execute: function(context,macros) {
		this.macros = macros == null?{ }:macros;
		this.context = context;
		this.stack = new List();
		this.buf = new StringBuf();
		this.run(this.expr);
		return this.buf.b;
	}
	,buf: null
	,stack: null
	,macros: null
	,context: null
	,expr: null
	,__class__: haxe.Template
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,b: null
	,length: null
	,__class__: haxe.io.Bytes
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
haxe.remoting = {}
haxe.remoting.AsyncConnection = function() { }
$hxClasses["haxe.remoting.AsyncConnection"] = haxe.remoting.AsyncConnection;
haxe.remoting.AsyncConnection.__name__ = ["haxe","remoting","AsyncConnection"];
haxe.remoting.AsyncConnection.prototype = {
	setErrorHandler: null
	,call: null
	,resolve: null
	,__class__: haxe.remoting.AsyncConnection
}
haxe.remoting.HttpAsyncConnection = function(data,path) {
	this.__data = data;
	this.__path = path;
};
$hxClasses["haxe.remoting.HttpAsyncConnection"] = haxe.remoting.HttpAsyncConnection;
haxe.remoting.HttpAsyncConnection.__name__ = ["haxe","remoting","HttpAsyncConnection"];
haxe.remoting.HttpAsyncConnection.__interfaces__ = [haxe.remoting.AsyncConnection];
haxe.remoting.HttpAsyncConnection.urlConnect = function(url) {
	return new haxe.remoting.HttpAsyncConnection({ url : url, error : function(e) {
		throw e;
	}},[]);
}
haxe.remoting.HttpAsyncConnection.prototype = {
	call: function(params,onResult) {
		var h = new haxe.Http(this.__data.url);
		var s = new haxe.Serializer();
		s.serialize(this.__path);
		s.serialize(params);
		h.setHeader("X-Haxe-Remoting","1");
		h.setParameter("__x",s.toString());
		var error = this.__data.error;
		h.onData = function(response) {
			var ok = true;
			var ret;
			try {
				if(HxOverrides.substr(response,0,3) != "hxr") throw "Invalid response : '" + response + "'";
				var s1 = new haxe.Unserializer(HxOverrides.substr(response,3,null));
				ret = s1.unserialize();
			} catch( err ) {
				ret = null;
				ok = false;
				error(err);
			}
			if(ok && onResult != null) onResult(ret);
		};
		h.onError = error;
		h.request(true);
	}
	,setErrorHandler: function(h) {
		this.__data.error = h;
	}
	,resolve: function(name) {
		var c = new haxe.remoting.HttpAsyncConnection(this.__data,this.__path.slice());
		c.__path.push(name);
		return c;
	}
	,__path: null
	,__data: null
	,__class__: haxe.remoting.HttpAsyncConnection
}
haxe.rtti = {}
haxe.rtti.Meta = function() { }
$hxClasses["haxe.rtti.Meta"] = haxe.rtti.Meta;
haxe.rtti.Meta.__name__ = ["haxe","rtti","Meta"];
haxe.rtti.Meta.getType = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.obj == null?{ }:meta.obj;
}
haxe.rtti.Meta.getStatics = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.statics == null?{ }:meta.statics;
}
haxe.rtti.Meta.getFields = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.fields == null?{ }:meta.fields;
}
haxe.xml = {}
haxe.xml.Parser = function() { }
$hxClasses["haxe.xml.Parser"] = haxe.xml.Parser;
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
}
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.getNodeName()) throw "Expected </" + parent.getNodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProlog(str1));
				state = 1;
			}
			break;
		}
		c = str.charCodeAt(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
haxe.xml.Parser.isValidChar = function(c) {
	return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45;
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = function() { }
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib["eval"] = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var org = {}
org.phpMessaging = {}
org.phpMessaging.client = {}
org.phpMessaging.client.Connection = function() {
	this._isPolling = false;
	this._firstPollFlag = true;
};
$hxClasses["org.phpMessaging.client.Connection"] = org.phpMessaging.client.Connection;
org.phpMessaging.client.Connection.__name__ = ["org","phpMessaging","client","Connection"];
org.phpMessaging.client.Connection.prototype = {
	getClients: function(successCallback,errorCallback,clientIDs) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(this._serverUrl);
		cnx.setErrorHandler(errorCallback);
		cnx.resolve("Server").resolve("getClients").call([clientIDs],successCallback);
	}
	,getApplicationMetaData: function(name,successCallback,errorCallback) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(this._serverUrl);
		cnx.setErrorHandler(errorCallback);
		cnx.resolve("Server").resolve("getApplicationMetaData").call([name],successCallback);
	}
	,setApplicationMetaData: function(name,value,successCallback,errorCallback) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(this._serverUrl);
		cnx.setErrorHandler(errorCallback);
		cnx.resolve("Server").resolve("setApplicationMetaData").call([name,value],successCallback);
	}
	,getClientMetaData: function(name,successCallback,errorCallback) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(this._serverUrl);
		cnx.setErrorHandler(errorCallback);
		cnx.resolve("Server").resolve("getClientMetaData").call([name],successCallback);
	}
	,setClientMetaData: function(name,value,successCallback,errorCallback) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(this._serverUrl);
		cnx.setErrorHandler(errorCallback);
		cnx.resolve("Server").resolve("setClientMetaData").call([name,value],successCallback);
	}
	,dispatch: function(params,idClients,callbackResult) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(this._serverUrl);
		cnx.setErrorHandler($bind(this,this._pollError));
		cnx.resolve("Server").resolve("dispatch").call([params,idClients,"TYPE_CLIENT_DISPATCH"],callbackResult);
	}
	,callMethod: function(methodName,params,callbackResult) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(this._serverUrl);
		cnx.setErrorHandler($bind(this,this._pollError));
		Reflect.field(cnx.resolve("Server"),methodName).call(params,callbackResult);
	}
	,_pollCallback: function(messageData) {
		if(this._connectSuccessCallback != null && this._firstPollFlag) {
			this._firstPollFlag = false;
			this._connectSuccessCallback();
		}
		if(messageData != null) {
			if(this._pollStatusCallback != null) this._pollStatusCallback(messageData);
		}
		if(this._isPolling) haxe.Timer.delay($bind(this,this._poll),1);
	}
	,_pollError: function(str) {
		if(this._pollErrorCallback != null) this._pollErrorCallback(str); else null;
	}
	,_poll: function() {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(this._serverUrl);
		cnx.setErrorHandler($bind(this,this._pollError));
		cnx.resolve("Server").resolve("poll").call([this._applicationName,this._instanceName,this._params],$bind(this,this._pollCallback));
	}
	,unsubscribe: function() {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(this._serverUrl);
		cnx.resolve("Server").resolve("unsubscribe").call([]);
		this._isPolling = false;
		this._applicationName = null;
		this._instanceName = null;
		this._params = null;
		this._serverUrl = null;
	}
	,subscribe: function(successCallback,errorCallback,statusCallback) {
		this._connectSuccessCallback = successCallback;
		this._pollErrorCallback = errorCallback;
		this._pollStatusCallback = statusCallback;
		this._isPolling = true;
		this._firstPollFlag = true;
		this._poll();
	}
	,disconnect: function() {
		this.unsubscribe();
	}
	,connect: function(serverUrl,applicationName,instanceName,params) {
		this._applicationName = applicationName;
		this._instanceName = instanceName;
		this._params = params;
		this._serverUrl = serverUrl;
	}
	,_pollStatusCallback: null
	,_pollErrorCallback: null
	,_connectSuccessCallback: null
	,_params: null
	,_serverUrl: null
	,_instanceName: null
	,_applicationName: null
	,_firstPollFlag: null
	,_isPolling: null
	,clientData: null
	,__class__: org.phpMessaging.client.Connection
}
org.phpMessaging.model = {}
org.phpMessaging.model.ClientData = function() { }
$hxClasses["org.phpMessaging.model.ClientData"] = org.phpMessaging.model.ClientData;
org.phpMessaging.model.ClientData.__name__ = ["org","phpMessaging","model","ClientData"];
org.phpMessaging.model.ClientData.prototype = {
	metaData: null
	,lastActivity: null
	,time: null
	,applicationId: null
	,id: null
	,fromDataModel: function(dataModel) {
		this.id = dataModel.id;
		this.applicationId = dataModel.applicationId;
		this.time = dataModel.time;
		this.lastActivity = dataModel.lastActivity;
		this.metaData = dataModel.metaData;
	}
	,toDataModel: function() {
		return { id : this.id, applicationId : this.applicationId, time : this.time, lastActivity : this.lastActivity, metaData : this.metaData};
	}
	,__class__: org.phpMessaging.model.ClientData
}
org.phpMessaging.model.MessageData = function() { }
$hxClasses["org.phpMessaging.model.MessageData"] = org.phpMessaging.model.MessageData;
org.phpMessaging.model.MessageData.__name__ = ["org","phpMessaging","model","MessageData"];
org.phpMessaging.model.MessageData.prototype = {
	metaData: null
	,time: null
	,applicationId: null
	,clientId: null
	,type: null
	,id: null
	,toDataModel: function() {
		return { id : this.id, type : this.type, clientId : this.clientId, applicationId : this.applicationId, time : this.time, metaData : this.metaData};
	}
	,__class__: org.phpMessaging.model.MessageData
}
var splity = {}
splity.client = {}
splity.client.SplityAPI = function() {
	org.phpMessaging.client.Connection.call(this);
};
$hxClasses["splity.client.SplityAPI"] = splity.client.SplityAPI;
splity.client.SplityAPI.__name__ = ["splity","client","SplityAPI"];
splity.client.SplityAPI.__super__ = org.phpMessaging.client.Connection;
splity.client.SplityAPI.prototype = $extend(org.phpMessaging.client.Connection.prototype,{
	requestFunctionnality: function(name,onSuccess,onError,metaData) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(this._serverUrl);
		cnx.setErrorHandler(onError);
		cnx.resolve("Server").resolve("requestFunctionality").call([name,metaData],onSuccess);
	}
	,getFunctionalities: function(onSuccess,onError) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(this._serverUrl);
		cnx.setErrorHandler(onError);
		cnx.resolve("Server").resolve("getFunctionalities").call([],onSuccess);
	}
	,__class__: splity.client.SplityAPI
});
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.Prolog = "prolog";
Xml.Document = "document";
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.XMLHttpRequest = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch( e ) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch( e1 ) {
			throw "Unable to create XMLHttpRequest object.";
		}
	}
}:(function($this) {
	var $r;
	throw "Unable to create XMLHttpRequest object.";
	return $r;
}(this));
brix.component.group.Group.GROUP_ID_ATTR = "data-group-id";
brix.component.group.Group.GROUP_SEQ = 0;
brix.component.layout.LayoutBase.EVENT_LAYOUT_REDRAW = "layoutRedraw";
brix.component.layout.Panel.DEFAULT_CSS_CLASS_HEADER = "panel-header";
brix.component.layout.Panel.DEFAULT_CSS_CLASS_BODY = "panel-body";
brix.component.layout.Panel.DEFAULT_CSS_CLASS_FOOTER = "panel-footer";
brix.component.layout.Panel.ATTR_CSS_CLASS_HEADER = "data-panel-header-class-name";
brix.component.layout.Panel.ATTR_CSS_CLASS_BODY = "data-panel-body-class-name";
brix.component.layout.Panel.ATTR_CSS_CLASS_FOOTER = "data-panel-footer-class-name";
brix.component.layout.Panel.ATTR_IS_HORIZONTAL = "data-panel-is-horizontal";
brix.component.navigation.ContextManager.PARAM_DATA_CONTEXT_LIST = "data-context-list";
brix.component.navigation.ContextManager.PARAM_DATA_INITIAL_CONTEXT = "data-initial-context";
brix.component.navigation.ContextManager.EVENT_CONTEXT_CHANGE = "changeContextEvent";
brix.component.navigation.ContextManager.EVENT_ADD_CONTEXTS = "addContextsEvent";
brix.component.navigation.ContextManager.EVENT_REMOVE_CONTEXTS = "removeContextsEvent";
brix.component.navigation.ContextManager.EVENT_TOGGLE_CONTEXTS = "toggleContextsEvent";
brix.component.navigation.ContextManager.EVENT_REPLACE_CONTEXTS = "replaceContextsEvent";
brix.component.navigation.ContextManager.EVENT_RESET_CONTEXTS = "resetContextsEvent";
brix.component.navigation.Layer.EVENT_TYPE_SHOW_START = "onLayerShowStart";
brix.component.navigation.Layer.EVENT_TYPE_HIDE_START = "onLayerHideStart";
brix.component.navigation.Layer.EVENT_TYPE_SHOW_STOP = "onLayerShowStop";
brix.component.navigation.Layer.EVENT_TYPE_HIDE_STOP = "onLayerHideStop";
brix.component.navigation.Layer.EVENT_TYPE_SHOW_AGAIN = "onLayerShowAgain";
brix.component.navigation.Layer.EVENT_TYPE_HIDE_AGAIN = "onLayerHideAgain";
brix.component.navigation.Layer.MAX_DELAY_FOR_TRANSITION = 2500;
brix.component.navigation.Page.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.Page.CLASS_NAME = "Page";
brix.component.navigation.Page.CONFIG_NAME_ATTR = "name";
brix.component.navigation.Page.CONFIG_USE_DEEPLINK = "useDeeplink";
brix.component.navigation.Page.CONFIG_INITIAL_PAGE_NAME = "initialPageName";
brix.component.navigation.Page.ATTRIBUTE_INITIAL_PAGE_NAME = "data-initial-page-name";
brix.component.navigation.Page.OPENED_PAGE_CSS_CLASS = "page-opened";
brix.component.navigation.Page.EVENT_TYPE_OPEN_START = "pageOpenStart";
brix.component.navigation.Page.EVENT_TYPE_OPEN_STOP = "pageOpenStop";
brix.component.navigation.Page.EVENT_TYPE_CLOSE_START = "pageCloseStart";
brix.component.navigation.Page.EVENT_TYPE_CLOSE_STOP = "pageCloseStop";
brix.component.navigation.Page.useDeeplink = null;
brix.component.navigation.StateManager.PARAM_DATA_PREFIX = "data-";
brix.component.navigation.StateManager.EVENT_STATE_CHANGE = "changeStateEvent";
brix.component.navigation.link.LinkBase.__meta__ = { obj : { tagNameFilter : ["a","div"]}};
brix.component.navigation.link.LinkBase.CONFIG_PAGE_NAME_ATTR = "href";
brix.component.navigation.link.LinkBase.CONFIG_PAGE_NAME_DATA_ATTR = "data-href";
brix.component.navigation.link.LinkBase.CONFIG_TARGET_ATTR = "target";
brix.component.navigation.link.LinkBase.CONFIG_TARGET_IS_POPUP = "_top";
brix.component.navigation.link.LinkContextBase.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.link.LinkContextBase.CONFIG_ATTR_CONTEXT = "data-context";
brix.component.navigation.link.LinkAddContext.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.link.LinkClosePage.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.link.LinkRemoveContext.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.link.LinkReplaceContext.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.link.LinkToPage.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.link.TouchLink.ATTR_TOUCH_TYPE = "data-touch-type";
brix.component.navigation.link.TouchLink.ATTR_TOUCH_DETECT_DISTANCE = "data-touch-detection-distance";
brix.component.navigation.link.TouchLink.DEFAULT_DETECT_DISTANCE = 10;
brix.component.navigation.transition.TransitionTools.SHOW_START_STYLE_ATTR_NAME = "data-show-start-style";
brix.component.navigation.transition.TransitionTools.SHOW_END_STYLE_ATTR_NAME = "data-show-end-style";
brix.component.navigation.transition.TransitionTools.HIDE_START_STYLE_ATTR_NAME = "data-hide-start-style";
brix.component.navigation.transition.TransitionTools.HIDE_END_STYLE_ATTR_NAME = "data-hide-end-style";
brix.component.navigation.transition.TransitionTools.EVENT_TYPE_REQUEST = "transitionEventTypeRequest";
brix.component.navigation.transition.TransitionTools.EVENT_TYPE_STARTED = "transitionEventTypeStarted";
brix.component.navigation.transition.TransitionTools.EVENT_TYPE_ENDED = "transitionEventTypeEnded";
brix.component.sound.SoundOn.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.sound.SoundOn.CLASS_NAME = "SoundOn";
brix.component.sound.SoundOn.isMuted = false;
brix.component.sound.SoundOff.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.sound.SoundOff.CLASS_NAME = "SoundOff";
brix.core.Application.BRIX_ID_ATTR_NAME = "data-brix-id";
brix.core.Application.instances = new Hash();
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.CODES = null;
brix.core.ApplicationContext.htmlDocumentElement = haxe.Unserializer.run("y6703:%3CHTML%3E%0D%0A%3CHEAD%3E%0D%0A%09%3CTITLE%3ESplity%20Gallery%3C%2FTITLE%3E%0D%0A%09%3CLINK%20href%3D%22app.css%22%20type%3D%22text%2Fcss%22%20rel%3D%22stylesheet%22%3E%3C%2FLINK%3E%0D%0A%09%3CMETA%20http-equiv%3D%22Content-Type%22%20content%3D%22text%2Fhtml%3B%20charset%3DUTF-8%22%3E%3C%2FMETA%3E%20%0D%0A%09%3CMETA%20name%3D%22viewport%22%20content%3D%22width%3Ddevice-width%2Cinitial-scale%3D1.0%2Cminimum-scale%3D1.0%2Cmaximum-scale%3D1.0%2Cuser-scalable%3Dno%22%3E%3C%2FMETA%3E%0D%0A%09%3CMETA%20name%3D%22initialPageName%22%20content%3D%22page01%22%3E%3C%2FMETA%3E%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%09%0D%0A%3C%2FHEAD%3E%0D%0A%0D%0A%3CBODY%3E%0D%0A%09%0D%0A%09%0D%0A%09%3CDIV%20class%3D%22main-container%20ContextManager%20GallerySplity%20Pointer%22%20data-context-list%3D%22display%2C%20hand-pointer%22%20data-initial-context%3D%22display%22%3E%0D%0A%0D%0A%09%09%3CDIV%20class%3D%22Panel%22%3E%0D%0A%09%09%09%3CDIV%20class%3D%22panel-body%22%3E%0D%0A%09%09%09%09%3CDIV%20class%3D%22pages-container%22%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page01%22%3E%3C%2FA%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group1%20Layer%20page01%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage01.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page02%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group2%20Layer%20page02%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage02.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page03%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group3%20Layer%20page03%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage03.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page04%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group4%20Layer%20page04%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage04.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page05%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group5%20Layer%20page05%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage05.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page06%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group6%20Layer%20page06%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage06.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page07%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group7%20Layer%20page07%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage07.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page08%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group8%20Layer%20page08%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage08.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page09%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group9%20Layer%20page09%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage09.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page10%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group10%20Layer%20page10%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage10.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page11%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group11%20Layer%20page11%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage11.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page12%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group12%20Layer%20page12%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage12.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%0D%0A%09%09%09%09%09%3CA%20class%3D%22Page%22%20name%3D%22page13%22%3E%3C%2FA%3E%0D%0A%0D%0A%09%09%09%09%09%0D%0A%09%09%09%09%09%3CDIV%20class%3D%22Group13%20Layer%20page13%20display%22%3E%0D%0A%09%09%09%09%09%09%0D%0A%09%09%09%09%09%09%3CDIV%20class%3D%22big-img%22%20style%3D%22background-image%3Aurl%28assets%2Fimage13.jpg%29%3B%22%3E%3C%2FDIV%3E%0D%0A%09%09%09%09%09%3C%2FDIV%3E%09%0D%0A%09%09%09%09%3C%2FDIV%3E%0D%0A%09%09%09%3C%2FDIV%3E%0D%0A%09%09%3C%2FDIV%3E%0D%0A%09%3C%2FDIV%3E%0D%0A%3C%2FBODY%3E%3C%2FHTML%3E");
brix.util.NodeTypes.ELEMENT_NODE = 1;
brix.util.NodeTypes.ATTRIBUTE_NODE = 2;
brix.util.NodeTypes.TEXT_NODE = 3;
brix.util.NodeTypes.CDATA_SECTION_NODE = 4;
brix.util.NodeTypes.ENTITY_REFERENCE_NODE = 5;
brix.util.NodeTypes.ENTITY_NODE = 6;
brix.util.NodeTypes.PROCESSING_INSTRUCTION_NODE = 7;
brix.util.NodeTypes.COMMENT_NODE = 8;
brix.util.NodeTypes.DOCUMENT_NODE = 9;
brix.util.NodeTypes.DOCUMENT_TYPE_NODE = 10;
brix.util.NodeTypes.DOCUMENT_FRAGMENT_NODE = 11;
brix.util.NodeTypes.NOTATION_NODE = 12;
components.GallerySplity.THUMB_FUNCTIONNALITY = "thumblist";
components.GallerySplity.REMOTE_FUNCTIONNALITY = "remote";
components.GallerySplity.DISPLAY_FUNCTIONNALITY = "display";
components.GallerySplity.SPLITY_URL = "http://demos.silexlabs.org/splity/splity.php/index.php";
components.GallerySplity.ID_IDENT = "id";
components.GallerySplity.CHANGE_PAGE = "changePage";
components.GallerySplity.CONTEXT_MANAGER_CLASS = "ContextManager";
components.GallerySplity.MASTER_BUTTON_ID = "master";
components.GallerySplity.MASTER_BUTTON_DOWN_CLASS = "down";
components.GallerySplity.TYPE_REQUEST_SEND = "RequestSend";
components.Pointer.IMG_SIZE = 1;
components.ResizeIcon.WIDTH = 25;
components.ResizeIcon.HEIGHT = 25;
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Template.splitter = new EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","");
haxe.Template.expr_splitter = new EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","");
haxe.Template.expr_trim = new EReg("^[ ]*([^ ]+)[ ]*$","");
haxe.Template.expr_int = new EReg("^[0-9]+$","");
haxe.Template.expr_float = new EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","");
haxe.Template.globals = { };
js.Lib.onerror = null;
org.phpMessaging.model.MessageData.TYPE_CLIENT_CREATED = "TYPE_NEW_CLIENT";
org.phpMessaging.model.MessageData.TYPE_CLIENT_DELETED = "TYPE_CLIENT_DELETED";
org.phpMessaging.model.MessageData.TYPE_CLIENT_DISPATCH = "TYPE_CLIENT_DISPATCH";
org.phpMessaging.model.MessageData.TYPE_CLIENT_RECONNECT = "TYPE_CLIENT_RECONNECT";
splity.client.SplityAPI.SPLITY = "splity";
brix.core.Application.main();
function $hxExpose(src, path) {
	var o = window;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();
