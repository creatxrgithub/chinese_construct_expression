const glyphMatrix = require('./glyph_matrix.js');

class Glyph {
	constructor() {
		this.arch = [];
		this.part = [];
	}

	toStringLite() {
		if(this.part.length==0) return '';
		let oo = '';
		for(let i=0; i<this.part.length; i++) {
			if((typeof this.part[i]) == 'object') {
				oo += this.part[i].toStringLite();
			} else if ((typeof this.part[i]) == 'string') {
				oo += this.part[i];
			}
		}
		return oo;
	}

/*
	toString() {
		if(this.part.length==0) return '';

		let oo = '';
		let rightBrack = '';
		let archSet = new Set(this.arch);
		if(archSet.size==0) {
			oo += this.part[0].toString();
		} else if(archSet.has('^')||archSet.has('<')||archSet.has('2')||archSet.has('3')||archSet.has('4')) {
			oo += this.arch.join('') + '(' + this.part[0].toString(); rightBrack=')';
		} else if(archSet.has('@')||(!archSet.has('_')&&archSet.has('%'))) {
			oo += this.part[0].toString();
				if(this.arch.join('')=='%') oo += this.arch.join('');
				oo += '{';
				rightBrack='}';
		} else if(archSet.has('?')) {
			oo += this.arch.join('');
			oo += '[';
			oo += this.part[0].toString();
			rightBrack=']';
		} else if(archSet.has('~')||archSet.has('!')||archSet.has('#')||archSet.has('$')||archSet.has('_')) {
			oo += this.arch.join('');
			oo += this.part[0].toString();
		} else {
			if((typeof this.part[0])!='undefined') oo += this.part[0].toString();
			rightBrack='';
		}


		for(let i=1; i<this.part.length; i++) {
			oo += this.part[i].toString();
		}

		return oo += rightBrack;
	}
//*/

	toString() {
		if(this.part.length==0) return '';

		let oo = '';
		let rightBrack = '';
		switch(this.arch.join('')) {
			case '' : oo += this.part[0].toString(); break;
			case '2': case '2^': case '2<': case '3': case '4':
			case '^': case '<': case '-<': case '-^' :
				oo += this.arch.join('') + '(' + this.part[0].toString(); rightBrack=')'; break;
			case '@' :
			case '%' :
				oo += this.part[0].toString();
				if(this.arch.join('')=='%') oo += this.arch.join('');
				oo += '{';
				rightBrack='}';
				break;
			case '?':
				oo += this.arch.join('');
				oo += '[';
				oo += this.part[0].toString();
				rightBrack=']';
				break;
			case '~': case '!': case '#':
			case '$':
				oo += this.arch.join('');
				oo += this.part[0].toString(); break;
			default:
				oo += this.arch.join('');
				//console.log(typeof this.part[0]); console.log(this.part[0]);
				if((typeof this.part[0])!='undefined')
				oo += this.part[0].toString(); rightBrack='';
				break;
		}

		for(let i=1; i<this.part.length; i++) {
			oo += this.part[i].toString();
		}

		return oo += rightBrack;
	}


	static parse(s) {
//		if(s instanceof Glyph) return s;

		let retGlyph = new Glyph();
		if(s==null) return retGlyph;
//		if((typeof s)!='string' && (typeof s)!='object') return retGlyph;
//console.log(typeof s[Symbol.iterator] === 'function');
//console.log(Symbol.iterator in Object(s));


		let oo = [];	for(let o of s) oo.push(o);  //不能使用 s.split('')  //例：s = '㗰𠳝'; 分解單字出錯
		//let oo = Array.from(s);

		const op = '?~!@#$%^&*_-<234';
		const opbrackets = '{[()]}?~!@#$%^&*_-<234';
		const leftBrackets = '{[(';
		const rightBrackets = ')]}';

		function getRightBrackets(s) {
			switch(s) {
				case '(' : return ')';
				case '[' : return ']';
				case '{' : return '}';
				default: return '';
			}
		}

		while(oo.length>0) {
			if(opbrackets.indexOf(oo[0])==-1 && oo.length>0) {
				retGlyph.part.push(oo.shift());
				continue;
			}
			if(op.indexOf(oo[0])!=-1 || leftBrackets.indexOf(oo[0])!=-1) {
				let subGlyph = new Glyph();
				while(op.indexOf(oo[0])!=-1) subGlyph.arch.push(oo.shift());
				while(rightBrackets.indexOf(oo[0])!=-1) oo.shift();  //去掉右括號
				if(opbrackets.indexOf(oo[0])==-1 && oo.length>0) {
					subGlyph.part.push(oo.shift());
					if(subGlyph.arch.includes('*')) {
						subGlyph.arch.splice(subGlyph.arch.indexOf('*'),1);
						subGlyph.arch.push('@');
						subGlyph.part.push(retGlyph.part.pop());
					}
					retGlyph.part.push(subGlyph);
					continue;
				} else if(leftBrackets.indexOf(oo[0])!=-1) {
					let leftBracket = oo.shift();
					let rightBracket  = getRightBrackets(leftBracket);
					let matchBracket = 1;
					while(oo.length>0 && matchBracket>0) {
						if(leftBracket.indexOf(oo[0])!=-1) matchBracket++;
						else if(rightBracket.indexOf(oo[0])!=-1) matchBracket--;
						subGlyph.part.push(oo.shift());
					}
					subGlyph.part = Glyph.parse(subGlyph.part).part;  //對括號內的元素作遞歸操作
					let archSet = new Set(subGlyph.arch);
					if(archSet.has('-')) {
						archSet.delete('-');
						subGlyph.part.push(subGlyph.part.shift());
					}
					if(leftBracket.indexOf('{')!=-1) {
						if(!(archSet.has('%')||archSet.has('*'))) {
							archSet.add('@');
							subGlyph.part.unshift(retGlyph.part.pop());
						} else if(archSet.has('%')) {
							subGlyph.part.unshift(retGlyph.part.pop());
						}
					} else if(leftBracket.indexOf('[')!=-1) {
						archSet.add('?');
					}
					if(archSet.has('*')) {  //星號構造符的特殊性：後置前並包含前符。
						archSet.delete('*');
						let tmpGlyph = new Glyph();
						tmpGlyph.arch.push('@');
						subGlyph.arch = Array.from(archSet);
						if(subGlyph.arch.length==0 && subGlyph.part.length>1) subGlyph.arch.push('?');
						tmpGlyph.part.push(subGlyph);
						tmpGlyph.part.push(retGlyph.part.pop());
						retGlyph.part.push(tmpGlyph);
						continue;
					}
					{
						subGlyph.arch = Array.from(archSet);
						retGlyph.part.push(subGlyph);
					}
					continue;
				}
			}
			oo.shift();  //去掉右括號
		}
		if(retGlyph.arch.length==0 && retGlyph.part.length==1 && retGlyph.part[0] instanceof Glyph) {
//			retGlyph = retGlyph.part[0];
		}
		return retGlyph;
	}


	static parseThinner(s) {
		return Glyph.parse(Glyph.parse(s).toString());
	}



}

module.exports = Glyph;
