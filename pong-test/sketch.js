// port of Daniel Shiffman's Pong coding challenge
// by madacoo
// https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_067_Pong/P5

let leftscore = 0;
let rightscore = 0;
let pause = true;

function preload() {
	img = loadImage('assets/ball.svg');
}

function setup() {
	createCanvas(900, 600);
	//   ding = loadSound('data/ding.mp3');
	puck = new Puck();
	left = new Paddle(true);
	right = new Paddle(false);
	meteor = new Meteor();
	noLoop();
	frameRate(50);
	imageMode(CENTER);
	noSmooth();
	noStroke();
}

function draw() {
	// background(0);
	clear();
	separation();

	puck.checkPaddleRight(right);
	puck.checkPaddleLeft(left);
	puck.checkMeteor(meteor);

	left.show();
	right.show();
	meteor.show();
	left.update(true, puck.y);
	right.update(false, 0);

	puck.update();
	puck.edges();
	puck.show();

	

	fill(255);
	textSize(32);
	text(leftscore, width / 2 - 43, 40);
	text(rightscore, width / 2 + 20, 40);
}

function keyReleased() {
	left.move(0);
	right.move(0);
}

function keyPressed() {
	//   console.log(key);
	//   if (key == "ArrowUp") {
	//     left.move(-10);
	//   } else if (key == "ArrowDown") {
	//     left.move(10);
	//   }

	if (key == "ArrowUp") {
		right.move(-10);
	} else if (key == "ArrowDown") {
		right.move(10);
	}
}

function stop() {
	pause = !pause;
	if (pause)
		noLoop();
	else
		loop();
}

function separation() {
	let wd = 5;
	let hd = 20;
	for (let it = 20; it < 600; it += 35)
	{
		fill(255);
		rectMode(CENTER);
		rect(900 / 2 - wd / 2, it, wd, hd);
		// console.log(it);
	}
}