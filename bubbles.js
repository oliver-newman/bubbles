/*
 * JavaScript program to animate a group of bubbles following the cursor
 * around the window with a certain element of randomness. Uses p5.js
 *
 * Oliver Newman, August 2016
 */

// Globals

// Appearance
var bubbles = []; // Array of bubble data
var numBubbles = 10; // Number of bubbles
var r = 10; // Radius of each bubble
var backgroundColor = {r: 0, g: 0, b: 0}; // Background RGB balues
var w = window.innerWidth;
var h = window.innerHeight;

// Behavior
var followMouse = false;
var makeBubbles = false;
var ixv = 0; // Initial x velocity of each bubble
var iyv = 0; // Initial y velocity of each bubble
var maxv = 4; // When followMouse is false, maximum x and y velocity
var followFactor = 0.007; // How quickly bubbles move to mouse
var randomFactor = 3; // How quickly the bubbles move randomly
var noFollowRandomFactor = 0.3 * randomFactor; // How quickly the bubbles move
					       // randomly when not following 

// Physics
var bounceFriction = 0.5; // Fraction of velocity to conserve after bounce
var airFriction = 0.98; // Fraction of velocity to conserve while not bouncing

//------------------------------------------------------------------------------
// Helper functions

// Creates a bubble object with the default settings specified by globals
function defaultBubble(x, y) {
	return {
		// Start bubble in middle of window
		x: x,
		y: y,
		// Choose random color for bubble
		r: Math.random() * 255,
		g: Math.random() * 255,
		b: Math.random() * 255,
		// Start with specified velocity
		xv: ixv,
		yv: iyv
	}
}

// Draws a bubble at (x, y)
function drawBubble(x, y) {
	point(x, y);
}

//------------------------------------------------------------------------------
// p5 functions

// p5.js function (executes once at beginning)
function setup() {
	var canvas = createCanvas(w, h);
	canvas.parent("canvasContainer");

	bg = document.getElementById("background");
  $("#numBubbles").html(numBubbles);

	// Create bubbles, starting in the center of the window
	for (i = 0; i < numBubbles; i++) {
		bubbles.push(defaultBubble(w / 2, h / 2));
	}
}

// p5.js function (executes infinitely after setup())
function draw() {
	background(backgroundColor.r, backgroundColor.g, backgroundColor.b);
	strokeWeight(r * 2);

	for (i = 0; i < numBubbles; i++) {
		bub = bubbles[i]; // Save current bubble as bub for conciseness
		stroke(bub.r, bub.g, bub.b); // 
		drawBubble(bub.x, bub.y);

		// Adjust location of each bubble, not allowing it to go past edge
		bub.x = Math.max(Math.min(bub.x + bub.xv, w - r), r);
		bub.y = Math.max(Math.min(bub.y + bub.yv, h - r), r);

		// Bounce off walls, losing a certain amount of energy
		if (bub.x == r || bub.x == w - r) {
			bub.xv *= (-1 * bounceFriction);
			bub.yv *= bounceFriction;
		}
		if (bub.y == r || bub.y == h - r) {
			bub.yv *= (-1 * bounceFriction);
			bub.xv *= bounceFriction;
		}

		// Adjust speed based on cursor location, with slight randomness
		if (followMouse) {
			bub.xv =  (airFriction * bub.xv)
							+ (followFactor * (mouseX - bub.x))
							+ (randomFactor * (Math.random() - 0.5));
			bub.yv =  (airFriction * bub.yv)
							+ (followFactor * (mouseY - bub.y))
							+ (randomFactor * (Math.random() - 0.5));
		}
		// Randomly "float" around, never exceeding a certain speed
		else {
			bub.xv =  Math.max(
									Math.min(
										airFriction * bub.xv +
											noFollowRandomFactor * (Math.random() - 0.5),
										maxv
									),
									-1 * maxv
								);
			bub.yv =  Math.max(
									Math.min(
										airFriction * bub.yv + 
											noFollowRandomFactor * (Math.random() - 0.5),
										maxv
									),
									-1 * maxv
								);
		}

		bubbles[i] = bub;
	}

	// Generate more bubbles on click, until 500 bubbles are present
	if (mouseIsPressed && makeBubbles && (numBubbles < 500)) {
		numBubbles++;
    $("#numBubbles").html(numBubbles);

		bubbles.push(defaultBubble(mouseX, mouseY));
	}

  document.getElementById("followMouse").onclick = function() {
    followMouse = !followMouse;
  };
  
  document.getElementById("makeBubbles").onclick = function() {
    makeBubbles = !makeBubbles;
  };

  document.getElementById("clearBubbles").onclick = function() {
    bubbles = [];
    numBubbles = 0;
    $("#numBubbles").html(numBubbles);
  };
}






