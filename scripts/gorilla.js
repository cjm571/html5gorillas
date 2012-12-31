/* 
 * Author: CJ McAllister
 */

function Gorilla( x, y, playerNum, buildingNum ) {
	this.x = x;
	this.y = y;
	
	this.playerNum = playerNum;
	
	this.buildingNum = buildingNum;
}

var EXPLOSION_RADIUS = 75;

var context;

function initGorillas( /*[in]*/ canvasContext,  /*[in]*/ buildings, /*[out]*/ gorillas ) {
	context = canvasContext;
	
	context.save();
	
	// randomly choose left-side building to place gorilla A
	for ( var i=0; i<buildings.length; i++ ) {
		var rightEdge = buildings[i].x + buildings[i].width;
		if ( rightEdge > gameWidth/2 ) {
			break;
		}
	}
	
	var buildingNum = Math.floor( Math.random() * i );
	
	// place gorilla on building
	var gorillaX = buildings[buildingNum].x + (buildings[buildingNum].width/2) - (GORILLA_WIDTH/2);
	var gorillaY = gameHeight - buildings[buildingNum].height - GORILLA_HEIGHT - BOTTOM_PADDING;
	var gorillaA = new Gorilla( gorillaX, gorillaY, 0, buildingNum );
	var gorillaAImg = new Image();
	gorillaAImg.src = "images/gorilla.png";
	gorillaAImg.onload = function() {
		context.drawImage( gorillaAImg, gorillaA.x, gorillaA.y );
	};
	
	// randomly choose right-side buidling to place gorilla B
	buildingNum = i + Math.floor( Math.random() * (buildings.length - i) );
	gorillaX = buildings[buildingNum].x + (buildings[buildingNum].width/2) - (GORILLA_WIDTH/2);
	gorillaY = gameHeight - buildings[buildingNum].height - GORILLA_HEIGHT - BOTTOM_PADDING;
	var gorillaB = new Gorilla( gorillaX, gorillaY, 1, buildingNum );
	var gorillaBImg = new Image();
	gorillaBImg.src = "images/gorilla.png";
	gorillaBImg.onload = function() {
		context.drawImage( gorillaBImg, gorillaB.x, gorillaB.y );
	};
	
	gorillas[0] = gorillaA;
	gorillas[1] = gorillaB;
	
	context.restore();
	console.log( "gorilla:initGorillas(): Initialization complete" );
}

// draws big gorilla hit explosion
function gorillaHit( context, gorilla, callback ) {
	console.log( "gorilla:gorillaHit(): beginning explosion" );
	
	var radius = 0;
	// draw expanding explosion
	var explosion = setInterval ( function () {		
		context.save();
		context.fillStyle = "red";
		
		drawEllipse( context, gorilla.x+(GORILLA_WIDTH/2), gorilla.y+(GORILLA_HEIGHT/2), radius );
		context.fill();
		
		// stop at radius = 30
		if ( radius >= EXPLOSION_RADIUS ) {
			clearInterval( explosion );
			
			console.log( "gorilla:gorillaHit(): explosion done expanding" );
			gorillaHit2( context, gorilla, callback );
		}
		
		radius++;
		context.restore();
	}, 10 );
}

// un-draws exlposion
function gorillaHit2( context, gorilla, callback ) {	
	console.log( "gorilla:gorillaHit2(): beginning unsplosion" );
	
	var radius = EXPLOSION_RADIUS;
	
	var unsplosion = setInterval( function() {
		context.save();
		
		context.globalCompositeOperation = "destination-out";
		context.strokeStyle = "rgba(0,0,0,1)";
		drawEllipse( context, gorilla.x+(GORILLA_WIDTH/2), gorilla.y+(GORILLA_HEIGHT/2), radius );
		context.stroke();
		
		// stop unsploding once radius is back to 0
		if ( radius <= 0 ) {
			clearInterval( unsplosion );
			
			console.log( "gorilla:gorillaHit2(): unsplosion done unspanding" );
			callback();
		}
		
		radius -= 0.5;
		context.restore();
	}, 5 );
}