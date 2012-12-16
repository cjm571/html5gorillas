/* 
 * Author: CJ McAllister
 */

 function Building ( x, width, height) {
	this.x = x;
	this.width = width;
	this.height = height;
}

var context;

// generate random set of buildings and draw them to the context
// places Building objects in buildings parameter
function initBuildings( /*[in]*/ canvasContext, /*[out]*/ buildings ) {
	var MAX_BUILDING_WIDTH = gameWidth/6;
	var MIN_BUILDING_WIDTH = gameWidth/20;
	var MAX_BUILDING_HEIGHT = 3*gameHeight/5;
	var MIN_BUILDING_HEIGHT = gameHeight/4;
	
	var currentX = 0;
	var n = 0;
	
	context = canvasContext;
	
	var remainingWidth = gameWidth;
	// generate randomly-sized buildiings until 4 slots or less are left
	while ( remainingWidth > MAX_BUILDING_WIDTH ) {		
		// generate random width and height for building
		var width = Math.floor( (Math.random()*(MAX_BUILDING_WIDTH-MIN_BUILDING_WIDTH)) + MIN_BUILDING_WIDTH );
		var height = Math.floor( Math.random()*(MAX_BUILDING_HEIGHT-MIN_BUILDING_HEIGHT) + MIN_BUILDING_HEIGHT );
		remainingWidth = remainingWidth - width;
		
		buildings[n] = new Building( currentX, width, height );
		currentX = currentX + width;
		
		n++;
	}
	
	for ( var i=0; i<n; i++ ) {
		drawBuilding( buildings[i] );		
	}
	
	console.log( "building:initBuildings(): Initialization complete" );
}

// draw buildings to canvas
function drawBuilding( building ) {
	context.save();
	
	var buildingColors = ["#04AAAC", "#AC0204", "#ACAAAC"];
	var windowColors = ["#FCFE54", "#545654"];
	
	// named constants
	var WINDOW_UNIT_HEIGHT = 15;
	var WINDOW_UNIT_WIDTH = 10;
	var WINDOW_HEIGHT = 7;
	var WINDOW_WIDTH = 4;
	
	// select random color from array
	var buildingColorNum = Math.floor( Math.random() * 3 );
	context.fillStyle = buildingColors[buildingColorNum];
	
	// fill in the building
	context.fillRect( building.x, gameHeight-building.height-BOTTOM_PADDING, building.width, building.height );
	
	// place window rows
	for ( var i=0; i<(building.height/WINDOW_UNIT_HEIGHT)-1; i++ ) {
		// inner loop for placing windows in each row
		for ( var j=0; j<(building.width/WINDOW_UNIT_WIDTH)-1; j++ ) {
			var windowColorNum = Math.floor( Math.random() * 2 );
			context.fillStyle = windowColors[windowColorNum];
			
			var column = building.x + (j * WINDOW_UNIT_WIDTH);
			var row = (gameHeight-building.height) + (i * WINDOW_UNIT_HEIGHT);
			context.fillRect( column+3, row+4-BOTTOM_PADDING, WINDOW_WIDTH, WINDOW_HEIGHT);
		}
	}
	
	context.restore();
}

// display building hit animation
function buildingHit( context, x, y) {
	context.save();
	
	context.strokeStyle = gameBGColor;
	context.fillStyle = gameBGColor;
	
	// draw circle of radius 5 to canvas to simulate building destruction
	context.beginPath();
	context.arc( x, y, 5, 0, 2*Math.PI, true );
	context.fill();
	context.closePath();
	
	context.restore();
}