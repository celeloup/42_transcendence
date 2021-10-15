
import { io } from "socket.io-client";
import { EffectCallback, useState, useEffect } from 'react';
import WindowBorder from '../ui_components/WindowBorder';
import Sketch from "react-p5";
import p5Types from "p5";
import P5 from "p5";
import axios from "axios";
import '../../styles/Game.scss';
import Landing from './Landing';
import React, { KeyboardEvent } from 'react';

// type GameSettings = {
// 	friendly: boolean, 
// 	user1_id: number,
// 	user2_id: number,
// 	score_user1: number,
// 	score_user2: number,
// 	winner?: number,
// 	createDate: any
// }

// type RoundSettings = {
// 	id_player1: number
// }

type Paddle = {
	is_left: boolean,
	x: number,
	y: number,
	w: number,
	h: number,
	indice: number
}

function Game() {
	
	const [ socket, setSocket ] = useState<any>(null);
	const [ puck, setPuck ] = useState<{x: number, y: number}>({x:100, y:100});
	const [ paddleRight, setPaddleRight ] = useState<Paddle>({ is_left: false, x: 0, y: 0, w: 20, h: 80, indice:0 });
	const [ paddleLeft, setPaddleLeft ] = useState<Paddle>({ is_left: true, x: 0, y: 0, w: 20, h: 80, indice:0 });
	const [ score, setScore ] = useState<number[]>([0, 0]);
	const [ match, setMatch ] = useState<any>(null);
	const [ matchID, setMatchID ] = useState<string>("");

	useEffect(() : ReturnType<EffectCallback> => {
		const newSocket:any = io(`${process.env.REACT_APP_BACK_URL}/game`, { transports: ["websocket"] });
		setSocket(newSocket);
		return () => newSocket.close();
	}, [setSocket]);

	useEffect(() => {
		socket?.on('new_frame', (data:any) => {
			// console.log("new frame :", data);
			setPuck(data.puck);
			setPaddleLeft(data.paddle_player1);
			setPaddleRight(data.paddle_player2);
			setScore([data.score_player1, data.score_player2]);
		})

		socket?.on('finish_game', (data:any) => {
			alert("game finished !");
			console.log("game finished !");
		})
		socket?.on('interrupted_game', (data:any) => {
			alert("game interrupted !");
			console.log("game interrupted !");
		})

		socket?.on('game_starting', (data:any) => {
			console.log("game starting !", data);
			setMatchID(data);
		})
	}, [socket])

	const matchmaking = () => {
		socket.emit('match_player');
	}

	const create_game = () => {
		axios.post('/matches', {
			"friendly": true,
			"user1_id": 1,
			"user2_id": 2,
			"map": 0,
			"speed": 1,
			"goal": 10,
			"boost_available": false
		  })
		  .then( res => { 
			  	// console.log("create match success !", res);
			  	socket.emit('create_game', res.data);
				setMatch(res.data)
			} )
		  .catch ( err => { console.log("create match fail :(", err); } )
	}
	
	// ------------- CANVAS

	function separation(p5: p5Types) {
		let wd = 5;
		let hd = 20;
		for (let it = 20; it < 630; it += 35)
		{
			p5.fill(255);
			p5.rectMode(p5.CENTER);
			p5.rect(782 / 2 - wd / 2, it, wd, hd);
		}
	}

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.rectMode(p5.CENTER);
		p5.createCanvas(782, 630).parent(canvasParentRef);
	};

	const draw = (p5: p5Types) => {
		p5.background(0);
		separation(p5);
		p5.rectMode(p5.CENTER);
		p5.ellipse(puck.x, puck.y, 20, 20);
		p5.rect(paddleLeft.x, paddleLeft.y, paddleLeft.w, paddleLeft.h);
		p5.rect(paddleRight.x, paddleRight.y, paddleRight.w, paddleRight.h);
	};

	const keyPressed = (p5: p5Types) => {
		if (p5.key === "ArrowUp") {
			// console.log("up", matchID);
			socket.emit('paddle_movement', { id_game: matchID, move: "up"})
		} else if (p5.key === "ArrowDown") {
			// console.log("down", matchID);
			socket.emit('paddle_movement', { id_game: matchID, move: "down"})
		}
	};

	const keyDown = (e: KeyboardEvent<HTMLImageElement>) => {
		e.preventDefault();
		console.log("keyDown");
	  };

	return (
		<WindowBorder w='816px' h='670px'>
		<div id="game">
				{/*onKeyDown={ keyDown }
				tabIndex={0} */} 
			<div className="window_header" >
				<button onClick={ create_game }>CREATE GAME</button>
				{ score[0] } MACHIN VS TRUC { score[1] }
				<button onClick={ matchmaking }>MATCH MAKING</button>
			</div>
			{/* <Landing /> */}
			<div id="game_window" >
				<Sketch setup={ setup } draw={ draw } keyPressed={ keyPressed }/>
			</div>
		</div>
	</WindowBorder>
)}

export default Game;