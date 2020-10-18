const svgpath = require('svgpath');

/**
 * action: scaleX, scaleY, moveX, moveY, rotate, mirrorX, flipV, mirrorY, flipH, skewX, skewY
 */
function glyphMatrix(d,action,rate) {
	switch(action) {
		case 'scaleX':
			return svgpath(d).scale(parseFloat(rate),1).rel().round(3).toString();
		case 'scaleY':
			return svgpath(d).scale(1,parseFloat(rate)).rel().round(3).toString();
		case 'moveX':
			return svgpath(d).translate(parseFloat(rate),0).rel().round(3).toString();
		case 'moveY':
			return svgpath(d).translate(0,parseFloat(rate)).rel().round(3).toString();
		case 'rotate':
			return svgpath(d).rotate(parseFloat(rate), left+(right-left)/2, top+(bottom-top)/2).rel().round(3).toString();
		case 'mirrorX':
		case 'flipV':
			return svgpath(d).translate(0,-bottom-top).scale(1,-1).rel().round(3).toString();
		case 'mirrorY':
		case 'flipH':
			return svgpath(d).translate(-right-left,0).scale(-1,1).rel().round(3).toString();
		case 'skewX':
			return svgpath(d).skewY(parseFloat(rate)).rel().round(3).toString();
		case 'skewY':
			return svgpath(d).skewX(parseFloat(rate)).rel().round(3).toString();
		default:
			return d;
	}
}

module.exports = glyphMatrix;
