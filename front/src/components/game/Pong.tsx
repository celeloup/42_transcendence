import { useState, KeyboardEvent } from 'react';
import p5Types from "p5";
import Sketch from "react-p5";

type Paddle = {
	is_left: boolean,
	x: number,
	y: number,
	w: number,
	h: number,
	indice: number
}

function Pong() {
	const height: number = 626;
	const width: number = 782;
	const paddle_margin: number = 10;

	const [ puck, setPuck ] = useState<{x: number, y: number, r: number}>({ x: width / 2, y: height/ 2, r: 12 });
	const [ paddleRight, setPaddleRight ] = useState<Paddle>({ is_left: false, x: width - paddle_margin - 20 / 2, y: height / 2, w: 20, h: 80, indice:0 });
	const [ paddleLeft, setPaddleLeft ] = useState<Paddle>({ is_left: true, x: paddle_margin + 20 / 2, y: height / 2, w: 20, h: 80, indice:0 });
	const [ score, setScore ] = useState<number[]>([0, 0]);
	
	// useEffect(() => {
	// 	socket?.on('new_frame', (data:any) => {
	// 		// console.log("new frame :", data);
	// 		setPuck(data.puck);
	// 		setPaddleLeft(data.paddle_player1);
	// 		setPaddleRight(data.paddle_player2);
	// 		setScore([data.score_player1, data.score_player2]);
	// 	})

	// 	socket?.on('finish_game', (data:any) => {
	// 		alert("game finished !");
	// 		console.log("game finished !");
	// 	})
	// 	socket?.on('interrupted_game', (data:any) => {
	// 		alert("game interrupted !");
	// 		console.log("game interrupted !");
	// 	})

	// 	socket?.on('game_starting', (data:any) => {
	// 		console.log("game starting !", data);
	// 		setMatchID(data);
	// 	})
	// }, [socket])

	// ------------- CANVAS

	function separation(p5: p5Types) {
		let wd = 5;
		let hd = 20;
		for (let it = 15; it < height; it += 35)
		{
			p5.fill(255);
			// p5.rectMode(p5.CENTER);
			p5.rect(width / 2, it, wd, hd);
		}
	}

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.rectMode(p5.CENTER);
		p5.ellipseMode(p5.CENTER);
		p5.createCanvas(width, height).parent(canvasParentRef);
	};

	const draw = (p5: p5Types) => {
		p5.background('#232323');
		separation(p5);
		p5.ellipse(puck.x, puck.y, puck.r * 2, puck.r * 2);
		p5.rect(paddleLeft.x, paddleLeft.y, paddleLeft.w, paddleLeft.h);
		p5.rect(paddleRight.x, paddleRight.y, paddleRight.w, paddleRight.h);
	};

	const keyPressed = (p5: p5Types) => {
		if (p5.key === "ArrowUp") {
			// console.log("up", matchID);
			// socket.emit('paddle_movement', { id_game: matchID, move: "up"})
		} else if (p5.key === "ArrowDown") {
			// console.log("down", matchID);
			// socket.emit('paddle_movement', { id_game: matchID, move: "down"})
		}
	};

	const keyDown = (e: KeyboardEvent<HTMLImageElement>) => {
		e.preventDefault();
		console.log("keyDown");
	  };

	return (
		<div id="pong_game">
			{ score[0] } MACHIN VS TRUC { score[1] }
			<Sketch setup={ setup } draw={ draw } keyPressed={ keyPressed }/>
		</div>
)}

export default Pong;