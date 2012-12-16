/* 
 * Author: CJ McAllister
 */

function Sun( gameWidth, gameHeight )
{
	this.x = gameWidth / 2;
	this.y = gameHeight / 14;
	this.currentFace = 0;
	
	// draws face on sun according to faceNum
	// this function is full of suck and fail because you can't disable anti-aliasing
	// on the HTML5 canvas in a cross-browser fashion
	this.changeFace = function () {
		context.save();
		
		context.globalCompositeOperation = "destination-out";
		context.strokeStyle = "rgba(0,0,0,1)";
		context.translate( 0.5, 0.5 ); // hack to avoid anti-aliasing
		
		// eyes
		context.beginPath();
		// left
		context.moveTo( this.x-EYE_X_OFFSET-1, this.y-EYE_Y_OFFSET );
		context.lineTo( this.x-EYE_X_OFFSET+2, this.y-EYE_Y_OFFSET );
		context.moveTo( this.x-EYE_X_OFFSET, this.y-EYE_Y_OFFSET-2 );
		context.lineTo( this.x-EYE_X_OFFSET, this.y-EYE_Y_OFFSET+1 );
		// right
		context.moveTo( this.x+EYE_X_OFFSET-1, this.y-EYE_Y_OFFSET );
		context.lineTo( this.x+EYE_X_OFFSET+2, this.y-EYE_Y_OFFSET );
		context.moveTo( this.x+EYE_X_OFFSET, this.y-EYE_Y_OFFSET-2 );
		context.lineTo( this.x+EYE_X_OFFSET, this.y-EYE_Y_OFFSET+1 );
		
		context.closePath();
		context.stroke();
		
		// smiling mouth
		if ( this.currentFace == 1 ) {
			context.beginPath();
			context.moveTo( this.x-MOUTH_CORNER_X_OFFSET, this.y+MOUTH_CORNER_Y_OFFSET );
			context.quadraticCurveTo( this.x, this.y+(MOUTH_CENTER_Y_OFFSET), this.x+MOUTH_CORNER_X_OFFSET, this.y+MOUTH_CORNER_Y_OFFSET );
			context.stroke();
			
			this.currentFace = 0;
		}
		// open mouth
		else {
			drawEllipse( context, sun.x, sun.y+MOUTH_CORNER_Y_OFFSET, MOUTH_RADIUS );
			context.fill();
			sun.currentFace = 1;
		}
		
		context.restore();
	}
}

var context;
var SUN_COLOR;
var SUN_RADIUS;
var SUN_SPOKE_LENGTH;
var EYE_X_OFFSET;
var EYE_Y_OFFSET;
var MOUTH_CORNER_X_OFFSET;
var MOUTH_CORNER_Y_OFFSET;
var MOUTH_CENTER_Y_OFFSET;
var MOUTH_RADIUS;

function initSun( /*[in]*/ canvasContext, /*[out]*/ sun ) {
	context = canvasContext;
	SUN_COLOR = "#FCFE04";
	SUN_RADIUS = gameWidth / 50;
	SUN_SPOKE_LENGTH = gameWidth / 35;
	EYE_X_OFFSET = 3;
	EYE_Y_OFFSET = 2;
	MOUTH_CORNER_X_OFFSET = 6;
	MOUTH_CORNER_Y_OFFSET = 3;
	MOUTH_CENTER_Y_OFFSET = 6;
	MOUTH_RADIUS = SUN_RADIUS/4;
	
	context.save();
	
	// create new sun object
	sun = new Sun( gameWidth, gameHeight );
	
	context.fillStyle = "#FCFE04";
	context.strokeStyle = "#FCFE04";
	
	// draw main body ellipse
	drawEllipse( context, sun.x, sun.y, SUN_RADIUS );
	context.fill();
	
	// draw spokes starting at theta=0
	for ( var theta=0; theta<Math.PI; theta=theta+(Math.PI/6) ) {
		var xStart = SUN_SPOKE_LENGTH * Math.cos( theta );
		var yStart = SUN_SPOKE_LENGTH * Math.sin( theta );
		var xEnd = -SUN_SPOKE_LENGTH * Math.cos( theta );
		var yEnd = -SUN_SPOKE_LENGTH * Math.sin( theta );
		
		context.beginPath();
		context.moveTo( sun.x+xStart, sun.y+yStart );
		context.lineTo( sun.x+xEnd, sun.y+yEnd );
		context.closePath();
		context.stroke();
	}
	
	// draw default face
	sun.currentFace = 1;
	sun.changeFace();
	
	context.restore();
	
	console.log( "sun:initSun(): Initialization complete" );
}

function drawEllipse( context, x, y, origRadius ) {
	context.beginPath();
	context.moveTo( x-origRadius, y );
	context.bezierCurveTo( x-origRadius, y+origRadius, x+origRadius, y+(origRadius), x+origRadius, y );
	context.moveTo( x-origRadius, y );
	context.bezierCurveTo( x-origRadius, y-origRadius, x+origRadius, y-(origRadius), x+origRadius, y );
}