/* 
 * Author: CJ McAllister
 */


var gameWidth = 640;
var gameHeight = 350;
var gameBGColor = "#0402AC";
var grav = 9.8;

var BOTTOM_PADDING = 14;
var GORILLA_WIDTH = 28;
var GORILLA_HEIGHT = 29;
var BANANA_WIDTH = 4;
var BANANA_LENGTH = 11;
 
if ( window.addEventListener ) {

window.addEventListener( 'load', function() {	
	var gameContainer;
	
	var bgCanvas;
	var bgContext;
	var bananaCanvas;
	var bananaContext;
	var spriteCanvas;
	var spriteContext;
	var textCanvas;
	var textContext;
	
	var buildings = [];
	var sun;
	var gorillas = [];

	var introString = "You mission is to hit your opponent with the exploding banana \
	by varying the angle and power of your throw taking into account gravity and the \
	city skyline. The wind speed is shown by a directional arrow at the bottom of the \
	playing field, its length relative to its strength.";
	
	var bannerNUM = 0; // HAAAAAAACK
	var keypressCount = 0; // hack to prevent invalid input popup on game start
	
	var currentPlayer = 1; // hack, will be switched to 0 during initialzation
	var otherPlayer = (currentPlayer + 1) % 2;
	var scores = [0, 0];
	var playerCount = 1;
	var player0Name = "Player 1";
	var player1Name = "Player 2";
	var pointsToWin = 3;
	
	// begin errRange at 30, and halve after each attempt, reset between rounds
	var errRange = 30;
	
	// flag to prevent multiple launches by player
	var launchReady = true;
	
	// initialize canvases, gameContainer, overlay
	function preInit( ) {
		initCanvases();
		
		gameContainer = document.createElement("div")
		gameContainer.id = "game_container";
		gameContainer.width = gameWidth;
		gameContainer.height = gameHeight;
		document.getElementById("main_container").appendChild(gameContainer);
		
		// place canvases in div
		gameContainer.appendChild(bgCanvas);
		gameContainer.appendChild(spriteCanvas);
		gameContainer.appendChild(bananaCanvas);	

		// overlay absolutely-positioned div on the canvases
		// prevents click events from reaching the game div
		var overlayDiv = document.createElement("div");
		overlayDiv.id = "overlay";
		overlayDiv.className = "overlay";
		overlayDiv.width = gameWidth;
		overlayDiv.height = gameHeight;
		document.getElementById("main_container").appendChild(overlayDiv);
	}
	
	// displays 1st intro animation
	function intro1( ) {
		bgContext.save();
		bgContext.fillStyle = "black";
		bgContext.fillRect( 0, 0, gameWidth, gameHeight );
		
		// intro text
		var intro1Div = document.createElement("div");
		intro1Div.id = "intro1";
		intro1Div.className = "introText";
		intro1Div.className += " visible";
		intro1Div.width = gameWidth;
		intro1Div.height = gameHeight;
		document.getElementById("game_container").appendChild( intro1Div );
		intro1Div.innerHTML = "H T M L 5 \u00A0 G O R I L L A S";
		intro1Div.innerHTML += introString;
		
		// banner
		var bannerInterval = setInterval( drawBanner, 50 );		
		
		bgContext.restore();
	}
	
	// draw moving banner
	function drawBanner( ) {
		var bannerDiv = document.createElement("div");
		bannerDiv.id = "banner";
		document.getElementById("game_container").appendChild( bannerDiv );		
	}
	
	// gets game parameters from user
	function setup( ) {	
		bgContext.save()
		bgContext.fillStlye = "black";
		bgContext.fillRect( 0, 0, gameWidth, gameHeight );
	
		// create parent div for easy removal later
		var setupDiv = document.createElement("div");
		setupDiv.id = "setup";
		setupDiv.width = gameWidth;
		setupDiv.height = gameHeight;
		document.getElementById("game_container").appendChild( setupDiv );
		
		// player number entry
		var playerNumDiv = document.createElement("div");
		playerNumDiv.id = "playerNumInput";
		playerNumDiv.className = "introText";
		playerNumDiv.className += " visible";
		setupDiv.appendChild( playerNumDiv );
		playerNumDiv.innerHTML = "Players (Default = 1): ";
		playerNumDiv.width = gameWidth;
		playerNumDiv.style.paddingTop = (gameHeight/4)+"px"
		var playerNumInput = document.createElement("input");
		playerNumInput.id = "playerNum";
		playerNumDiv.appendChild( playerNumInput );
		playerNumInput.type = "text";
		playerNumInput.maxLength = 1;
		playerNumInput.size = 1;
		playerNumInput.focus();
		
		// player 0 name entry
		var name0Div = document.createElement("div");
		name0Div.id = "nameInput0";
		name0Div.className = "introText";
		name0Div.className += " hidden";
		setupDiv.appendChild( name0Div );
		name0Div.innerHTML = "</br>Name of Player 1 (Default = 'Player 1'): ";
		name0Div.width = gameWidth;
		var name0Input = document.createElement("input");
		name0Input.id = "name0";
		name0Div.appendChild( name0Input );
		name0Input.type = "text";
		name0Input.maxLength = 16;
		name0Input.size = 16;
		name0Input.disabled = true;
		
		// player 1 name entry
		var name1Div = document.createElement("div");
		name1Div.id = "nameInput1";
		name1Div.className = "introText";
		name1Div.className += " hidden";
		setupDiv.appendChild( name1Div );
		name1Div.innerHTML = "</br>Name of Player 2 (Default = 'Player 2'): ";
		name1Div.width = gameWidth;
		var name1Input = document.createElement("input");
		name1Input.id = "name0";
		name1Div.appendChild( name1Input );
		name1Input.type = "text";
		name1Input.maxLength = 16;
		name1Input.size = 16;
		name1Input.disabled = true;
		
		// points-to-win entry
		var pointsDiv = document.createElement("div");
		pointsDiv.id = "pointsInput";
		pointsDiv.className = "introText";
		pointsDiv.className += " hidden";
		setupDiv.appendChild( pointsDiv );
		pointsDiv.innerHTML = "</br>Play to how many total points (Default = 3)? ";
		pointsDiv.width = gameWidth;
		var pointsInput = document.createElement("input");
		pointsInput.id = "points";
		pointsDiv.appendChild( pointsInput );
		pointsInput.type = "text";
		pointsInput.maxLength = 2;
		pointsInput.size = 16;
		pointsInput.disabled = true;
		
		// gravity entry
		var gravDiv = document.createElement("div");
		gravDiv.id = "gravInput";
		gravDiv.className = "introText";
		gravDiv.className += " hidden";
		setupDiv.appendChild( gravDiv );
		gravDiv.innerHTML = "</br>Gravity in Meters/Sec (Earth = 9.8)? ";
		gravDiv.width = gameWidth;
		var gravInput = document.createElement("input");
		gravInput.id = "grav";
		gravDiv.appendChild( gravInput );
		gravInput.type = "text";
		gravInput.maxLength = 5;
		gravInput.size = 16;
		gravInput.disabled = true;
		
		// haaaaaaaaaaack
		function clickFunc( ev ) {
			playerNumInput.focus();
		}
		
		// temporarily cause click events to refocus on player 0 name entry
		var temp = document.getElementById("overlay").addEventListener( "click", clickFunc );
		
		// wait for input on player num before showing name0Input
		playerNumInput.addEventListener( "keypress", function keypressFunc( ev ) {
			if ( ev.charCode == 13 ) {
				if ( playerNumInput.value != "" ) {
					playerCount = playerNumInput.value;
				}
				
				
				console.log( "main_game:setup(): playerCount: "+playerCount );
				name0Div.className = "introText visible";
				name0Input.disabled = false;
				name0Input.focus();
				playerNumInput.removeEventListener( "keypress", keypressFunc );
			}
		} );
		
		// wait for input on player 0 before showing name1Input
		name0Input.addEventListener( "keypress", function keypressFunc( ev ) {
			if ( ev.charCode == 13 ) {				
				if ( name0Input.value != "" ) {
					player0Name = name0Input.value;
				}
				
				console.log( "main_game:setup(): player0Name: "+player0Name );
				name1Div.className = "introText visible";
				name1Input.disabled = false;
				name1Input.focus();
				name0Input.removeEventListener( "keypress", keypressFunc );
			}
		} );
		
		// wait for input on player 1 before showing pointsInput
		name1Input.addEventListener( "keypress", function keypressFunc( ev ) {
			if ( ev.charCode == 13 ) {	
				if ( name1Input.value != "" ) {
					player1Name = name1Input.value;
				}
				
				console.log( "main_game:setup(): player1Name: "+player1Name );
				pointsDiv.className = "introText visible";
				pointsInput.disabled = false;
				pointsInput.focus();
				name1Input.removeEventListener( "keypress", keypressFunc );
			}
		} );
		
		// wait for input on points before showing gravInput
		pointsInput.addEventListener( "keypress", function keypressFunc( ev ) {
			if ( ev.charCode == 13 ) {				
				if ( pointsInput.value != "" ) {
					pointsToWin = pointsInput.value;
				}
				
				console.log( "main_game:setup(): pointToWin: "+pointsToWin );
				gravDiv.className = "introText visible";
				gravInput.disabled = false;
				gravInput.focus();
				pointsInput.removeEventListener( "keypress", keypressFunc );
			}
		} );
		
		// wait for input on grav, then clean up and init game
		gravInput.addEventListener( "keypress", function keypressFunc( ev ) {
			if ( ev.charCode == 13 ) {
				if ( gravInput.value != "" ) {
					grav = gravInput.value;
				}
				
				console.log( "main_game:setup(): grav: "+grav );
				gravInput.removeEventListener( "keypress", keypressFunc );
				
				// remove setup div
				while( setupDiv.hasChildNodes() ) {
					setupDiv.removeChild( setupDiv.lastChild );
				}
				
				// remove temp event listener
				document.getElementById("overlay").removeEventListener( "click", clickFunc );
				
				initRound();
				switchPlayer(); // haaaaaaaaaaaack
			}
		} );
		
		bgContext.restore();
	}
	
	// displays 2nd intro animation
	function intro2( ) {
	
		var titleTextDiv = document.createElement("div");
		titleTextDiv.id = "titleText";
		titleTextDiv.className = "gameText";
		setupDiv.appendChild( titleTextDiv );
		titleTextDiv.innerHTML = "HTML5 GORILLAS";
		titleTextDiv.width = gameWidth;
		titleTextDiv.style.letterSpacing = "10px";
		titleTextDiv.style.paddingTop = "20px";
		
		var playerTextDiv = document.createElement("div");
		playerTextDiv.id = "playerText";
		playerTextDiv.className = "gameText";
		setupDiv.appendChild( playerTextDiv );
		titleTextDiv.innerHTML = "STARRING</br></br>"+player0Name+" AND "+player1Name;
	}
	
	// initialize new round
	function initRound( ) {
		// draw buildings, sun, and player sprites
		drawBackground( );
		
		// reset computer error bound
		errRange = 30;
		
		buildings = [];
		initBuildings( bgContext, buildings );
		
		sun = 0;
		initSun( spriteContext, sun );
		
		gorillas = [];
		initGorillas( spriteContext, buildings, gorillas );
		
		initRoundText();
		
		initPlayerInput();
		
		// prevent input from losing focus when user clicks on canvas area
		document.getElementById("overlay").addEventListener( "click", function() {
			document.getElementById("angle"+currentPlayer+"Input").focus();
		} );
		
		// set up game event listeners
		gameContainer.addEventListener( "keypress", playerAction );
	}

	// callback for launchBanana
	function launchCallback ( hitType, x, y ) {
	
		// self hit, record score
		if ( hitType == "self" ) {
			console.log( "main_game:playerAction(): Player hit self, animating and switching player" );
			scores[(currentPlayer+1)%2]++;										
			gorillaHit( spriteContext, gorillas[currentPlayer], nextRound );
		}
		// opponent hit, record score
		if ( hitType == "opp" ) {
			console.log( "main_game:playerAction(): Player hit, animating and switching player" );
			scores[currentPlayer]++;										
			gorillaHit( spriteContext, gorillas[(currentPlayer+1)%2], nextRound );
		}
		// building hit, perform hit animation and switch player
		if ( hitType == "bld" ) {
			console.log( "main_game:playerAction(): Building hit, animating and switching player" );
			buildingHit( bgContext, x, y )
			switchPlayer();
		}
		// total miss, switch player
		if ( hitType == "non" ) {
			console.log( "main_game:playerAction(): Player missed, switching player" );
			switchPlayer();
		}
		
		// allow next player to launch
		launchReady = true;
	}
	
	// event handler for banana launching after Enter|Return
	function playerAction( ev ) {
		if ( ev.charCode == 13 && launchReady == true ) {
			if ( keypressCount == 0 ) {
				keypressCount++;
				return false;
			}
			
			launchReady = false;
			console.log( "main_game:playerAction(): Enter|Return keypress caught" );
			var validInput = validateInputs();
			
			// if inputs are valid, launch the banana
			if ( validInput ) {
				console.log( "main_game:playerAction(): Inputs valid, launching banana..." );
				var angle = document.getElementById("angle"+currentPlayer+"Input").value;
				var vel = document.getElementById("vel"+currentPlayer+"Input").value;
				
				// disable inputs to prevent multiple launches
				document.getElementById("angle"+currentPlayer+"Input").disabled = true;
				document.getElementById("vel"+currentPlayer+"Input").disabled = true;
				
				launchBanana( bananaContext, gorillas[currentPlayer], gorillas[(currentPlayer+1)%2],
							  buildings, angle, vel, function( hitType, x, y ) { launchCallback( hitType, x, y ); } );
			}
			
			// if not, do nothing
			else {
				console.log( "main_game:playerAction(): Inputs invalid, doing nothing" );
				launchReady = true;
				return false;
			}
			
			keypressCount++;
		}
	}
	
	// calculates direct hit, then a random error 
	function computerAction( ) {
		var hitType = "inPlay";
		var angle, vel, tmpX, tmpY;
	
		// determine trajectory via theta = atan((v^2 +- sqrt(v^4 - g(gx^2+2yv^2)))/gx)
		console.log( "main_game:computerAction(): computing direct hit" );
		
		var range = Math.abs(gorillas[otherPlayer].x - gorillas[currentPlayer].x);
		var altitude = (gameHeight - (gorillas[otherPlayer].y+(GORILLA_HEIGHT/2))) - (gameHeight - (gorillas[currentPlayer].y-1));
		console.log( "main_game:computerAction(): Range: "+range+" Altitude: "+altitude );
		
		var trajSuccess = false;
		for( vel=0; vel<100; vel++ ) {
			var descrim = Math.pow(vel,4) - grav*((grav*Math.pow(range,2)) + (2*altitude*Math.pow(vel,2)));
			console.log( "main_game:computerAction(): descriminant: "+descrim );
			var theta1 = Math.atan((Math.pow(vel,2) + Math.sqrt(descrim))/(grav*range));
			var theta2 = Math.atan((Math.pow(vel,2) - Math.sqrt(descrim))/(grav*range));
			var theta = [theta1, theta2];
			
			// validity check
			if ( isNaN(theta1) && isNaN(theta2) ) {
				continue;
			}
			
			// get subset of buildings between current and target player
			var bldgSubset = [];
			if ( currentPlayer == 0 ) {
				bldSubset = buildings.slice( gorillas[currentPlayer].buildingNum+1, gorillas[otherPlayer].buildingNum ); 
			}
			else {
				bldSubset = buildings.slice( gorillas[otherPlayer].buildingNum+1, gorillas[currentPlayer].buildingNum ); 			
			}
			
			// try both values of theta
			for( var j=0; j<1; j++ ) {
				// validity check
				if ( isNaN( theta[j] ) ) {
					continue;
				}
				// clip check on each builing's top left and right edges in subset
				for ( var i=0; i<bldSubset.length; i++ ) {
					var distLeft = Math.abs(bldSubset[i].topLeft.x - (gorillas[currentPlayer].x+(GORILLA_WIDTH/2)));
					var distRight = Math.abs(bldSubset[i].topRight.x - (gorillas[currentPlayer].x+(GORILLA_WIDTH/2)));
					
					// pad each dist by 1 unit to avoid calculated misses that are actually hits
					if ( currentPlayer == 0 ) {
						distLeft--;
						distRight++;
					}
					else {
						distLeft++;
						distRight--;
					}
					console.log( "main_game:computerAction(): bld "+i+" distLeft: "+distLeft+" distRight: "+distRight );
					
					var y0 = gameHeight - (gorillas[currentPlayer].y-1);
					var projHeightLeft = y0 + distLeft*Math.tan(theta[j]) - (grav*Math.pow(distLeft,2))/(2*Math.pow(vel*Math.cos(theta[j]),2));
					var projHeightRight = y0 + distRight*Math.tan(theta[j]) - (grav*Math.pow(distRight,2))/(2*Math.pow(vel*Math.cos(theta[j]),2));
					var projYLeft = gameHeight - projHeightLeft;
					var projYRight = gameHeight - projHeightRight;
					console.log( "main_game:computerAction(): projYLeft: "+projYLeft+" Top Left Y: "+bldSubset[i].topLeft.y);
					console.log( "main_game:computerAction(): projYRight: "+projYRight+" Top Right Y: "+bldSubset[i].topRight.y);
					
					var bldClip = bldSubset[i].clipCheck( bldSubset[i].topLeft.x, projYLeft );
					if ( bldClip == false ) {
						bldClip = bldSubset[i].clipCheck( bldSubset[i].topRight.x, projYRight );
					}
					
					// break loop on clip detection
					if ( bldClip == true ) {
						break;
					}
				}
				
				// if clips on building, keep trying; otherwise we have a successful trajectory
				if ( bldClip == true ) {
					console.log( "main_game:computerAction(): theta: "+theta[j]+" vel: "+vel+" clipped building, continuing" );
					continue;
				}
				else {
					angle = Math.round(theta[j] * 180 / Math.PI);
					trajSuccess = true;
					break;
				}
			}
			
			// break main loop also if successful trajectory found
			if ( trajSuccess == true ) {
				break;
			}
		}
	
		console.log( "main_game:computerAction(): Exact trajectory: angle: "+angle+" vel: "+vel );
	
		// if no suitable angle found, NPC will suicide
		if ( typeof angle === "undefined" ) {
			angle = 90;
			vel = 25;
		}
		// otherwise, generate random error within errRange of 0
		else {		
			angle += Math.floor((Math.random()*(errRange*2))-errRange);
			vel += Math.floor((Math.random()*(errRange*2))-errRange);
			console.log( "main_game:computerAction(): Used trajectory: angle: "+angle+" vel: "+vel );
			console.log( "main_game:computerAction(): errRange: "+errRange );
			errRange = Math.floor(errRange/2);
		}
		
		// enter calculated coordinates
		document.getElementById("angle"+currentPlayer+"Input").value = angle;
		document.getElementById("vel"+currentPlayer+"Input").value = vel;
		
		launchBanana( bananaContext, gorillas[currentPlayer], gorillas[(currentPlayer+1)%2],
					  buildings, angle, vel, function( hitType, x, y ) { launchCallback( hitType, x, y ); } );
	}
	
	// progresses to next round of game, re-inits and switches player
	function nextRound( ) {
		var gameParent = gameContainer.parentNode;
		while( gameParent.hasChildNodes() ) {
			gameParent.removeChild( gameParent.lastChild );
		}
		preInit();
		
		// check for win
		if ( scores[0] == pointsToWin || scores[1] == pointsToWin ) {
			gameOver();
		}
		// no win, continue playing
		else {
			initRound();
			switchPlayer();
		}
	}
	
	// changes the active player
	function switchPlayer( ) {
		otherPlayer = currentPlayer;
		currentPlayer = (currentPlayer + 1) % 2;
		
		// remove old game text and re-init
		gameContainer.removeChild( document.getElementById("player0Text") );
		gameContainer.removeChild( document.getElementById("player1Text") );
		gameContainer.removeChild( document.getElementById("scoreText") );
		initRoundText();
		
		// change css classes of input divs
		document.getElementById("angle"+otherPlayer).className = "gameText hidden";
		document.getElementById("angle"+otherPlayer+"Input").className = "gameInput hidden";
		document.getElementById("angle"+otherPlayer+"Input").disabled = true;
		document.getElementById("angle"+otherPlayer+"Input").value = "";
		document.getElementById("vel"+otherPlayer).className = "gameText hidden";
		document.getElementById("vel"+otherPlayer+"Input").className = "gameInput hidden";
		document.getElementById("vel"+otherPlayer+"Input").disabled = true;
		document.getElementById("vel"+otherPlayer+"Input").value = "";
		
		document.getElementById("angle"+currentPlayer).className = "gameText visible";
		document.getElementById("angle"+currentPlayer+"Input").className = "gameInput visible";
		document.getElementById("angle"+currentPlayer+"Input").disabled = false;
		document.getElementById("vel"+currentPlayer).className = "gameText visible";
		document.getElementById("vel"+currentPlayer+"Input").className = "gameInput visible";
		document.getElementById("vel"+currentPlayer+"Input").disabled = false;
	
		// set focus to current player's angle input
		if ( currentPlayer == 0 ) {
			angle0Input.focus();
		}
		else {
			angle1Input.focus();
		}
		
		// check if computer should take over
		console.log( "main_game:switchPlayer(): playerCount: "+playerCount+" currentPlayer: "+currentPlayer );
		if ( (playerCount==1 && currentPlayer==1) || playerCount == 0 ) {
			computerAction();
		}
	}
	
	// checks angle and velocity for validity
	function validateInputs( ) {
		var angle = document.getElementById("angle"+currentPlayer+"Input").value;
		var vel = document.getElementById("vel"+currentPlayer+"Input").value;
		console.log( "main_game:validateInputs(): Angle: " + angle + " Velocity: " + vel );
		
		if ( angle < 0 || angle > 180 ) {
			alert( "Invalid angle. Angle must be between 0 and 180" );
			return false;
		}
		
		if ( vel < 1 || vel > 100 ) {
			alert( "Invalid velocity. Velocity must be between 0 and 100" );
			return false;
		}
		
		return true;
	}
	
	// returns the x and y offset of a given element
	// credit to animuson http://stackoverflow.com/a/442474/503585
	function getOffset( el ) {
		var _x = 0;
		var _y = 0;
		while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
			_x += el.offsetLeft - el.scrollLeft;
			_y += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		}
		return { top: _y, left: _x };
	}
	
	// draws a landscape based on seed value (eventually), and black background
	function drawBackground( ) {
		bgContext.save();
		
		bgContext.fillStyle = gameBGColor;
		bgContext.fillRect( 0, 0, gameWidth, gameHeight );
		
		bgContext.restore();
	}
	
	// helper function for initializing the canvases
	function initCanvases( ) {
		bgCanvas = document.createElement('canvas');
		
		if (!bgCanvas) {
			alert('Error: failed to create bgCanvas');
			return;
		}
		
		bgCanvas.setAttribute('id', 'bg_canvas');
		bgCanvas.setAttribute('width', gameWidth );
		bgCanvas.setAttribute('height', gameHeight );
		bgCanvas.style.position = 'absolute';
		bgCanvas.style.background = 'transparent';
		bgCanvas.style.zIndex = '-3';
		
		bgContext = bgCanvas.getContext("2d");
		if (!bgContext) {
			alert('Error: failed to get 2D bgContext from bgCanvas');
			return;
		}
		
		spriteCanvas = document.createElement('canvas');
		
		if (!spriteCanvas) {
			alert('Error: failed to create spriteCanvas');
			return;
		}
		
		spriteCanvas.setAttribute('id', 'sprite_canvas');
		spriteCanvas.setAttribute('width', gameWidth );
		spriteCanvas.setAttribute('height', gameHeight );
		spriteCanvas.style.position = 'absolute';
		spriteCanvas.style.background = 'transparent';
		spriteCanvas.style.zIndex = '-2';
		
		spriteContext = spriteCanvas.getContext("2d");
		if (!spriteContext) {
			alert('Error: failed to get 2D spriteContext from spriteCanvas');
			return;
		}
		
		bananaCanvas = document.createElement('canvas');
		
		if (!bananaCanvas) {
			alert('Error: failed to create bananaCanvas');
			return;
		}
		
		bananaCanvas.setAttribute('id', 'banana_canvas');
		bananaCanvas.setAttribute('width', gameWidth );
		bananaCanvas.setAttribute('height', gameHeight );
		bananaCanvas.style.position = 'absolute';
		bananaCanvas.style.background = 'transparent';
		bananaCanvas.style.zIndex = '-1';
		
		bananaContext = bananaCanvas.getContext("2d");
		if (!bananaContext) {
			alert('Error: failed to get 2D bananaContext from bananaCanvas');
			return;
		}
	}
	
	// helper function for initializing game text
	function initRoundText( ) {
		var containerCoords = getOffset(gameContainer);
	
		// player IDs
		var player0TextDiv = document.createElement("div");
		player0TextDiv.id = "player0Text";
		player0TextDiv.className = "gameText";
		gameContainer.appendChild(player0TextDiv);
		player0TextDiv.innerHTML = player0Name;
		player0TextDiv.style.top = containerCoords.top + "px";
		player0TextDiv.style.left = containerCoords.left + "px";
		
		
		var player1TextDiv = document.createElement("div");
		player1TextDiv.id = "player1Text";
		player1TextDiv.className = "gameText";
		gameContainer.appendChild(player1TextDiv);
		player1TextDiv.innerHTML = player1Name;
		player1TextDiv.style.top = containerCoords.top + "px";
		player1TextDiv.style.left = (containerCoords.left+gameWidth-player1TextDiv.offsetWidth) + "px";
		
		// score
		var scoreTextDiv = document.createElement("div");
		scoreTextDiv.id = "scoreText";
		scoreTextDiv.className = "gameText";
		gameContainer.appendChild(scoreTextDiv);
		scoreTextDiv.innerHTML = scores[0] + ">Score<" + scores[1];
		scoreTextDiv.style.top = (containerCoords.top+(7*gameHeight/8)) + "px";
		scoreTextDiv.style.left = (containerCoords.left+((gameWidth/2)-(scoreTextDiv.offsetWidth/2))) + "px";
		scoreTextDiv.style.backgroundColor = gameBGColor;
	}
	
	// helper function from initializing player input
	function initPlayerInput( ) {
		var containerCoords = getOffset(gameContainer);
	
		// player 0 angle and velocity
		var angle0Div = document.createElement("div");
		angle0Div.id = "angle0";
		angle0Div.className = "gameText";
		angle0Div.className += " visible";
		gameContainer.appendChild(angle0Div);
		angle0Div.innerHTML = "Angle:";
		angle0Div.style.top = "" + (containerCoords.top+angle0Div.offsetHeight) + "px";
		angle0Div.style.left = "" + containerCoords.left + "px";
		var angle0Input = document.createElement("input");
		angle0Input.id = "angle0Input";
		angle0Input.className += " visible";
		angle0Input.type = "text";
		angle0Input.maxLength = 3;
		angle0Input.size = 3;
		angle0Div.appendChild(angle0Input);
		
		var vel0Div = document.createElement("div");
		vel0Div.id = "vel0";
		vel0Div.className = "gameText";
		gameContainer.appendChild(vel0Div);
		vel0Div.innerHTML = "Velocity:";
		vel0Div.style.top = "" + (containerCoords.top+angle0Div.offsetHeight+vel0Div.offsetHeight) + "px";
		vel0Div.style.left = "" + containerCoords.left + "px";
		var vel0Input = document.createElement("input");
		vel0Input.id = "vel0Input";
		vel0Input.className += " visible";
		vel0Input.type = "text";
		vel0Input.maxLength = 3;
		vel0Input.size = 3;
		vel0Div.appendChild(vel0Input);
		
		// player 1 angle and velocity
		// will be hidden upon game start 
		var angle1Div = document.createElement("div");
		angle1Div.id = "angle1";
		angle1Div.className = "gameText";
		angle1Div.className += " hidden";
		gameContainer.appendChild(angle1Div);
		angle1Div.innerHTML = "Angle:";
		angle1Div.style.top = "" + (containerCoords.top+angle1Div.offsetHeight) + "px";
		angle1Div.style.left = "" + (containerCoords.left+gameWidth-130) + "px";
		var angle1Input = document.createElement("input");
		angle1Input.id = "angle1Input";
		angle1Input.className += " hidden";
		angle1Input.type = "text";
		angle1Input.maxLength = 3;
		angle1Input.size = 3;
		angle1Input.disabled = true;
		angle1Div.appendChild(angle1Input);
		
		var vel1Div = document.createElement("div");
		vel1Div.id = "vel1";
		vel1Div.className = "gameText";
		vel1Div.className += " hidden";
		gameContainer.appendChild(vel1Div);
		vel1Div.innerHTML = "Velocity:";
		vel1Div.style.top = "" + (containerCoords.top+angle1Div.offsetHeight+vel1Div.offsetHeight) + "px";
		vel1Div.style.left = "" + (containerCoords.left+gameWidth-130) + "px";
		var vel1Input = document.createElement("input");
		vel1Input.id = "vel1Input";
		vel1Input.className += " hidden";
		vel1Input.type = "text";
		vel1Input.maxLength = 3;
		vel1Input.size = 3;
		vel1Input.disabled = true;
		vel1Div.appendChild(vel1Input);
		
		// set player 0 angle input as active element
		angle0Input.focus();
	}
	
	// displays game over screen
	function gameOver( ) {
		bgContext.save();
		
		bgContext.fillStyle = "black";
		bgContext.fillRect( 0, 0, gameWidth, gameHeight );
		
		var gameOverDiv = document.createElement("div");
		gameOverDiv.id = "gameOver";
		gameOverDiv.width = gameWidth;
		gameOverDiv.height = gameHeight;
		document.getElementById("game_container").appendChild( gameOverDiv );
		
		var gameOverTextDiv = document.createElement("div");
		gameOverTextDiv.id = "gameOverText";
		gameOverTextDiv.className = "gameText";
		gameOverDiv.appendChild( gameOverTextDiv );
		gameOverTextDiv.innerHTML = "GAME OVER!</br></br>Score:</br>Player 1: "+scores[0]+"</br>Player 2: "+scores[1];
		gameOverTextDiv.width = gameWidth;
		gameOverTextDiv.style.marginTop = (gameHeight/3)+"px";
		gameOverTextDiv.style.textAlign = "center";
		
		bgContext.restore();
	}
	
	// stupid Chrome click-drag hack
	// without this, selection cursor will show when dragging
	document.onselectstart = function(){ return false; };
	
	// begin!
	preInit();
	setup();
}, false);

}
else {
	alert( "Your browser can't even add event listeners. Use one that doesn't suck." );
}


// helper function for getting variables passed in via url
// credit to css-tricks.com/snippets/javascript/get-url-variables/
function checkURLVar(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
		   var pair = vars[i].split("=");
		   if(pair[0] == variable){return pair[1];}
   }
   return false;
}