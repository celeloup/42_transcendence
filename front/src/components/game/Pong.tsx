import { useContext, useState, useEffect } from 'react';
import { GameContext, ContextType } from '../../contexts/GameContext';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';
import p5Types from "p5";
import Sketch from "react-p5";
import '../../styles/game/Pong.scss';

type Paddle = {
	is_left: boolean,
	x: number,
	y: number,
	w: number,
	h: number,
	indice: number
}

type Puck = {
	x: number,
	y: number,
	r: number,
	boost_activated:any[]
}

type endScreenProps = {
	score1: number,
	score2: number
}

function EndScreen({ score1, score2 } : endScreenProps) {
	var { setToDisplay } = useContext(AuthContext) as AuthContextType;
	return (
		<div id="end_screen">
			<div> GAME FINISHED </div>
			<div>{ score1 } VS { score2 }</div>
			<div id="back_button" onClick={ ()=> setToDisplay("landing") }> Return home </div>
		</div>
	)
}

function NoPendingGame() {
	var { setToDisplay } = useContext(AuthContext) as AuthContextType;
	return (
		<div id="no_pending_game">
			There is no current pending game.<br/> You can create a game yourself and challenge another player.
			<div className="flex">
				<div id="back_button" onClick={ ()=> setToDisplay("landing") }> <i className="fas fa-arrow-left"/>Go back </div>
				<div id="create_game_button" onClick={ ()=> setToDisplay("create") }>CREATE A GAME</div>
			</div>
		</div>
	)
}

function Pong() {
	const height: number = 626;
	const width: number = 782;
	const paddle_margin: number = 10;

	var { masterSocket, setToDisplay } = useContext(AuthContext) as AuthContextType;
	var { matchID, setMatchID, setMatch, match } = useContext(GameContext) as ContextType;

	// GAME OBJECTS
	const [ puck, setPuck ] = useState<Puck>({ x: width / 2, y: height/ 2, r: 12, boost_activated: [] });
	const [ paddleRight, setPaddleRight ] = useState<Paddle>({ is_left: false, x: width - paddle_margin - 20 / 2, y: height / 2, w: 20, h: 80, indice:0 });
	const [ paddleLeft, setPaddleLeft ] = useState<Paddle>({ is_left: true, x: paddle_margin + 20 / 2, y: height / 2, w: 20, h: 80, indice:0 });
	const [ score, setScore ] = useState<number[]>([0, 0]);

	// GAME POPUP
	const [ endScreen, setEndScreen ] = useState<boolean>(false);
	const [ noPending, setNoPending ] = useState<boolean>(false);
	const [ waiting, setWaiting ] = useState<boolean>(true);
	
	useEffect(() => {
		var id:number;
		masterSocket?.on('game_starting', (data:any) => {
			// console.log("game starting !", data);
			setMatchID(data);
			setWaiting(false);
			id = data;
		});
		
		masterSocket?.on('new_frame', (data:any) => {
			// console.log("new frame :", data);
			setPuck(data.puck);
			setPaddleLeft(data.paddle_player1);
			setPaddleRight(data.paddle_player2);
			setScore([data.score_player1, data.score_player2]);
		});

		masterSocket?.on('finish_game', (data:any) => {
			// alert("game finished !");
			setEndScreen(true);
			// console.log("game finished !");
		});
		
		masterSocket?.on('interrupted_game', (data:any) => {
			setEndScreen(true);
			alert("game interrupted !");
			// console.log("game interrupted !");
		});

		var nopending = false;

		masterSocket?.on('no_pending_game', (data:any) => {
			setNoPending(true);
			nopending = true;
		});

		return () => {
			if (nopending === false)
			{
				console.log("leaving");
				masterSocket.emit('leave_game', id);
				setMatchID("");
				setMatch(null);
			}
		}
	}, [masterSocket]) // eslint-disable-line

	
	// ------------- CANVAS
	function separation(p5: p5Types) {
		let wd = 5;
		let hd = 20;
		for (let it = 15; it < height; it += 35)
		{
			p5.fill(255);
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
		p5.fill(255,0,0);
		puck.boost_activated.forEach(sensor => {
			p5.ellipse(sensor.x, sensor.y, puck.r * 2, puck.r *2);
		});
		p5.fill(255);
		p5.rect(paddleLeft.x, paddleLeft.y, paddleLeft.w, paddleLeft.h);
		p5.rect(paddleRight.x, paddleRight.y, paddleRight.w, paddleRight.h);
	};

	const keyPressed = (p5: p5Types) => {
        if (p5.key === "ArrowUp") {
            // console.log("up", matchID);
            masterSocket.emit('paddle_movement', { id_game: matchID, move: "up"})
        } else if (p5.key === "ArrowDown") {
            // console.log("down", matchID);
            masterSocket.emit('paddle_movement', { id_game: matchID, move: "down"})
        }
    };

    const keyReleased = (p5: p5Types) => {
        if (p5.key === "ArrowUp") {
            // console.log("up", matchID);
            masterSocket.emit('paddle_movement', { id_game: matchID, move: "stop"})
        } else if (p5.key === "ArrowDown") {
            // console.log("down", matchID);
            masterSocket.emit('paddle_movement', { id_game: matchID, move: "stop"})
		}
	};

	return (
		<div id="pong_game">
			<div className="window_header" >
				<i className="fas fa-arrow-left back_button" onClick={ ()=> setToDisplay("landing") }/>
				{ matchID && <>{ score[0] } MACHIN VS TRUC { score[1] }</> }
				{ matchID ? " GAME START" : "[LOOKING FOR A PLAYER]"}
			</div>
			{ endScreen && <EndScreen score1={score[0]} score2={score[1]}/> }
			{ noPending && <NoPendingGame /> }
			{ !noPending && !waiting && <Sketch setup={ setup } draw={ draw } keyPressed={ keyPressed } keyReleased={ keyReleased }/> }
			{ waiting && !noPending && <div id="waiting">
				<i className="fas fa-spinner" />
				<p>Waiting for a second player ...</p>
			</div> }
		</div>
)}

export default Pong;