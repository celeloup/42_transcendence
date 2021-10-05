
// import { io } from "socket.io-client";
// import { useContext, useState, useEffect } from 'react';
import WindowBorder from '../ui_components/WindowBorder';
// import Sketch from "react-p5";
// import p5Types from "p5";

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

function Game() {

	// const [socket, setSocket] = useState<any>(null);
	// const [ puck, setPuck ] = useState<{x: number, y: number}>({x:100, y:100});

	// useEffect(() => {
	// 	setSocket(io("http://localhost:8080/game", { transports: ["websocket"] }));
	// }, [])

	// useEffect(() => {
	// 	// console.log("in useEffect");
	// 	socket?.on('new_frame', (data:any) => {
	// 		// console.log("on new frame");
	// 		// console.log(data);
	// 		setPuck(data.puck);
	// 	})
	// })

	// const launch_game = () => {
	// 	// socket.emit('launch_game', { user1_id: 1, user2_id: 2 });
	// }

	// ------------- CANVAS

	// function separation(p5: p5Types) {
	// 	let wd = 5;
	// 	let hd = 20;
	// 	for (let it = 20; it < 630; it += 35)
	// 	{
	// 		p5.fill(255);
	// 		p5.rectMode(p5.CENTER);
	// 		p5.rect(782 / 2 - wd / 2, it, wd, hd);
	// 		// console.log(it);
	// 	}
	// }

	// const setup = (p5: p5Types, canvasParentRef: Element) => {
	// 	p5.createCanvas(782, 630).parent(canvasParentRef);
	// };

	// const draw = (p5: p5Types) => {
	// 	p5.background(0);
	// 	separation(p5);
	// 	// p5.ellipse(puck.x, puck.y, 20, 20);
	// 	// puck.x++;
	// };
	

	return (
		<WindowBorder w='816px' h='670px'>
			
		<div id="game">
			<div className="window_header">
				{/*MACHIN VS TRUC <button onClick={launch_game}>LAUNCH GAME</button>
			</div>
			<div id="game_window">
				{/* <Sketch setup={setup} draw={draw} /> */}
			</div>
		</div>
	</WindowBorder>
)}

export default Game;