// port of Daniel Shiffman's Pong coding challenge
// by madacoo
// https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_067_Pong/P5

let leftscore = 0;
let rightscore = 0;
let pause = false;

function preload() {
	img = loadImage('assets/ball_white_small.png');
  }

function setup() {
  createCanvas(900, 600);
//   ding = loadSound('data/ding.mp3');
  puck = new Puck();
  left = new Paddle(true);
  right = new Paddle(false);
}

function draw() {
  background(0);

  puck.checkPaddleRight(right);
  puck.checkPaddleLeft(left);

  left.show();
  right.show();
  left.update(true, puck.y);
  right.update(false, 0);

  puck.update();
  puck.edges();
  puck.show();

  fill(255);
  textSize(32);
  text(leftscore, 32, 40);
  text(rightscore, width - 64, 40);
  image(img, 100, 100, 12, 12);
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
