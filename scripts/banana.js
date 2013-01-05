/* 
 * Author: CJ McAllister
 */

// array for checking image loaded-ness
// could probably be more elegant, but it's 2am
var imageReady = [false, false, false, false]; 

function Banana( x, y, owner ) {
	this.x = x;
	this.y = y;
	this.owner = owner;
	
	// 0 = H-up, 1 = V-Left, 2 = H-down, 3 =  V-right
	// direction corresponds to open end of banana
	this.orientation = 0; 
	
	// initialize images
	this.hUpImage = new Image();
	this.hUpImage.src = "images/banana_h_up.png";
	this.hUpImage.onload = function() {
		imageReady[0] = true;
		//console.log( "banana:Banana(): hUpImage loaded" );
	};
	this.vRightImage = new Image();
	this.vRightImage.src = "images/banana_v_right.png";
	this.vRightImage.onload = function() {
		imageReady[1] = true;
		//console.log( "banana:Banana(): vRightImage loaded" );
	};
	this.hDownImage = new Image();
	this.hDownImage.src = "images/banana_h_down.png";
	this.hDownImage.onload = function() {
		imageReady[2] = true;
		//console.log( "banana:Banana(): hDownImage loaded" );
	};
	this.vLeftImage = new Image();
	this.vLeftImage.src = "images/banana_v_left.png";
	this.vLeftImage.onload = function() {
		imageReady[3] = true;
		//console.log( "banana:Banana(): vLeftImage loaded" );
	};
	
	this.images = [];
	this.images[0] = this.hUpImage;
	this.images[1] = this.vRightImage;
	this.images[2] = this.hDownImage;
	this.images[3] = this.vLeftImage;
		
	// draws the banana to the given context at its current coords
	this.draw = function( context ) {
		var self = this;
	
		// check first that image is loaded
		if ( !imageReady[this.orientation] ) {
			// wait 10ms, then recursively call
			console.log( "banana:Banana.draw(): image not loaded, waiting..." );
			setTimeout( function() { self.draw( context ); }, 10 );
			return;
		}
		
		// BEGIN get rid of this shit
		var bgCtx = document.getElementById("bg_canvas").getContext("2d");
		bgCtx.fillStyle = 'red';
		bgCtx.fillRect( this.x, this.y, 1, 1 );
		// END get rid of this shit
		
		// each orientation requires different drawing parameters to properly
		// mimic a rotating motion, also dependent on player
		switch ( this.orientation ) {
		case 0:
			context.drawImage( this.images[0], this.x, this.y-(BANANA_LENGTH/2) );
			break;
		case 1:
			if ( this.owner.playerNum == 0 ) {
				context.drawImage( this.images[1], this.x+(BANANA_WIDTH/2), this.y-(BANANA_LENGTH/2)-1 );
				//console.log( "banana:Banana.draw(): orientation 1 drawn at (" + this.x + ", " + this.y + ")" );
			}
			else {
				context.drawImage( this.images[3], this.x+(BANANA_LENGTH/2)-1, this.y-(BANANA_LENGTH/2)-1 );
				//console.log( "banana:Banana.draw(): orientation 3 drawn at (" + this.x + ", " + this.y + ")" );
			}
			break;
		case 2:
			context.drawImage( this.images[2], this.x, this.y-(BANANA_WIDTH/2) );
			//console.log( "banana:Banana.draw(): orientation 2 drawn at (" + this.x + ", " + this.y + ")" );
			break;
		case 3:
			if ( this.owner.playerNum == 0 ) {
				context.drawImage( this.images[3], this.x+(BANANA_LENGTH/2)-1, this.y-(BANANA_LENGTH/2)-1 );
				//console.log( "banana:Banana.draw(): orientation 3 drawn at (" + this.x + ", " + this.y + ")" );
			}
			else {
				context.drawImage( this.images[1], this.x+(BANANA_WIDTH/2), this.y-(BANANA_LENGTH/2)-1 );
				//console.log( "banana:Banana.draw(): orientation 1 drawn at (" + this.x + ", " + this.y + ")" );
			}
			break;
		}
		
		// increment orientation
		this.orientation = (this.orientation + 1) % 4;
	}
}

// launches banana with given trajectory and Gorilla owner
function launchBanana( context, player, opponent, buildings, angle, vel, callback ) {
	context.save();
	var hitType = "";
	var banana = new Banana( player.x, player.y, player);
	
	var theta = (angle * Math.PI)/180;

	var t = 0.0;
	var bananaLoop = setInterval( function () {
		
		// clear old banana drawing
		context.clearRect( 0, 0, gameWidth, gameHeight );
		
		// throw banana in positive X dir for player 1, negative for player 2
		if ( player.playerNum == 0 ) {
			banana.x = (player.x+(GORILLA_WIDTH/2)) + (vel*t* Math.cos(theta));
			banana.y = (player.y-1) - (vel*t*Math.sin(theta)) + (0.5*grav*Math.pow(t,2));
		}
		else {
			banana.x = (player.x+(GORILLA_WIDTH/2)) - (vel*t* Math.cos(theta));
			banana.y = (player.y-1) - (vel*t*Math.sin(theta)) + (0.5*grav*Math.pow(t,2));
		}
		banana.draw( context );
		
		hitType = hitCheck( banana.x, banana.y, player, opponent, buildings );
		
		if ( hitType != "inPlay" ) { 
			clearInterval( bananaLoop );
			context.clearRect( 0, 0, gameWidth, gameHeight );

			console.log( "banana:launchBanana(): Returning hitType: '" + hitType + "'" );
			callback( hitType, banana.x, banana.y );
		}
		
		// increment by 5 hundreths for better path resolution
		t += 0.05;
	}, 75 );
	
	context.restore();
}

// helper function for checking for hits on opponent or buildings
function hitCheck( x, y, player, opponent, buildings ) {
	
	/*
	// check for sun hit
	if ( (x > sun.x-SUN_RADIUS && x < sun.x+SUN_RADIUS) &&
		 (y > sun.y-SUN_RADIUS && y < sun.y+SUN_RADIUS) ) {
		console.log( "banana:hitCheck(): sun hit registered" );
		sun.changeFace();
		return "sun";
	}
	*/
	
	// check for self hit
	if ( (x > player.x && x < player.x+GORILLA_WIDTH) &&
		 (y > player.y && y < player.y+GORILLA_HEIGHT) ) {
		console.log( "banana:hitCheck(): self hit registered" );
		return "self";
	}
	
	// check for opponent hit
	if ( (x > opponent.x && x < opponent.x+GORILLA_WIDTH) &&
		 (y > opponent.y && y < opponent.y+GORILLA_HEIGHT) ) {
		console.log( "banana:hitCheck(): opponent hit registered" );
		return "opp";
	}
	
	// check for building hit
	for ( var i=0; i<buildings.length; i++ ) {
		if ( (x > buildings[i].x && x < buildings[i].x+buildings[i].width) &&
			 (y > gameHeight-BOTTOM_PADDING-buildings[i].height && y < gameHeight-BOTTOM_PADDING) ) {
			console.log( "banana:hitCheck(): building hit registered" );
			return "bld";
		}
	}

	// missed all buildings and opponent
	if ( y > gameHeight || x > gameWidth || x < 0 ) {
		console.log( "banana:hitCheck(): non-hit registered" );
		return "non";
	}
	
	// still in play
	return "inPlay";
}