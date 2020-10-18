// npm install jest --save-dev

const Glyph = require('../glyph_serial.js');


test('Glyph.parse must always return an instance, even input is null', () => {
	expect(Glyph.parse('') instanceof Glyph).toBe(true);
	expect(Glyph.parse(null) instanceof Glyph).toBe(true);
});

test('Glyph.parse basic expression', () => {
	expect(Glyph.parse('<(ab)').toString()).toBe('<(ab)');
	expect(Glyph.parse('^(ab)').toString()).toBe('^(ab)');
	expect(Glyph.parse('<-(ab)').toString()).toBe('<(ba)');
	expect(Glyph.parse('-<(ab)').toString()).toBe('<(ba)');
	expect(Glyph.parse('^-(ab)').toString()).toBe('^(ba)');
	expect(Glyph.parse('-^(ab)').toString()).toBe('^(ba)');
	expect(Glyph.parse('a{b}').toString()).toBe('a{b}');
	expect(Glyph.parse('a@{b}').toString()).toBe('a{b}');
	expect(Glyph.parse('a%{b}').toString()).toBe('a%{b}');
	expect(Glyph.parse('a%_b').toString()).toBe('a%_b');
	expect(Glyph.parse('a*b').toString()).toBe('b{a}');
	expect(Glyph.parse('a*{b}').toString()).toBe('b{a}');
	expect(Glyph.parse('a*{bc}').toString()).toBe('?[bc]{a}');
	expect(Glyph.parse('a$-^b').toString()).toBe('a$-^b');
	expect(Glyph.parse('a{b{c}d}').toString()).toBe('a{b{c}d}');
	expect(Glyph.parse('a[b[cd]]').toString()).toBe('a?[b?[cd]]');
	expect(Glyph.parse('(ab)*<(cd)').toString()).toBe('<(cd){ab}');
	expect(Glyph.parse('<(ab)*<(cd)').toString()).toBe('<(cd){<(ab)}');
	expect(Glyph.parse('-(abc)*<(de)').toString()).toBe('<(de){bca}');
});

test('very long and wong input, try to output the best corrected result', () => {
	expect(Glyph.parse('甲)]}乙(丙))<(丁戊)-<(己[庚辛)壬]2(癸)@{子}丑%{寅-^(卯-^(辰}巳))午$未-<(申酉戌)*(亥乾坤))').toString()).toBe('甲乙丙<(丁戊)<(?[庚辛]己)壬2(癸){子}丑%{寅^(^(辰)卯)}巳午$未?[亥乾坤]{<(酉戌申)}');
});
