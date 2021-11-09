import { useContext, useState, useEffect } from 'react';
import { GameContext, ContextType } from '../../contexts/GameContext';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';
import p5Types from "p5";
import Sketch from "react-p5";
import '../../styles/game/Pong.scss';
import axios from 'axios';

import Coin from '../../assets/img/coin.svg';
import KO from '../../assets/img/street_fighter_ko.png';
import Telescope from '../../assets/img/telescope.svg';
import TelescopeTop from '../../assets/img/telescope_top.svg';

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
	score2: number,
	setToDisplay: (s:string) => void
}

function EndScreen({ score1, score2, setToDisplay } : endScreenProps) {
	// var { setToDisplay } = useContext(AuthContext) as AuthContextType;
	return (
		<div id="end_screen">
			<div> GAME FINISHED </div>
			<div>{ score1 } VS { score2 }</div>
			<div id="back_button" onClick={ ()=> setToDisplay("landing") }> Return home </div>
		</div>
	)
}

type InfoProps = {
	setToDisplay: (s:string) => void,
	message: string,
	type: number
}

function InfoError({ setToDisplay, message, type } : InfoProps) {
	return (
		<div id="infos_error_game">
			{ type === 1 &&
			<div id="telescope_img"><img id="telescope_top" src={ TelescopeTop } alt="Telescope img top"/>
			<img id="telescope" src={ Telescope } alt="Telescope img"/></div>
			}
			<p>{ message }</p>
			<div className="buttons">
				<div id="back_button" onClick={ ()=> setToDisplay("landing") }> <i className="fas fa-arrow-left"/> Go back </div>
				<div id="create_game_button" onClick={ ()=> setToDisplay("create") }>Create a game</div>
			</div>
		</div>
	)
}

// function Space() {

// }

type BackgroundProps = {
	p1: string,
	p2: string,
	scoreP1: number,
	scoreP2: number,
	goal?: number,
	allP1?: number,
	allP2?: number
}

function Mario({ p1, p2, scoreP1, scoreP2 }: BackgroundProps) {
	return (
		<div className="game_background" id="mario">
			<div id="p1">
				<span className="name">{ p1 }</span>
				<img src={ Coin } alt="Coin from Mario."/>
				<span >x{ scoreP1 < 10 ? "0" + scoreP1 : scoreP1 }</span>
			</div>
			<div id="p2">
				<img src={ Coin } alt="Coin from Mario."/>
				<span>x{ scoreP2 < 10 ? "0" + scoreP2 : scoreP2 }</span>
				<span className="name">{ p2 }</span>
			</div>
		</div>
	)
}

function Street({ p1, p2, scoreP1, scoreP2, allP1, allP2, goal }: BackgroundProps) {
	let p1_life:number;
	if (goal)
		p1_life = 100 - (scoreP2 / goal) * 100;
	else
		p1_life = 100;
	let p2_life:number;
		if (goal)
			p2_life = 100 - (scoreP1 / goal) * 100;
		else
			p2_life = 100;
	return (
		<div className="game_background" id="street">
			<div id="first_line">
				<div id="p1">
					<img alt="Player1" src="https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-1P"/>
					<img alt="Player1 total score" src={ "https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-" + allP1?.toString().padStart(5, '0') }/>
				</div>
				<div id="p2">
					<img  alt="Player2" src="https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-2P"/>
					<img  alt="Player2 total score" src={ "https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-" + allP2?.toString().padStart(5, '0') }/>
				</div>
			</div>
			<div id="life_bar">
				<div id="p1_bar"><span style={{"width": p1_life + "%"}}></span></div>
				<img src={ KO } alt="Street_fighter_ko"/>
				<div id="p2_bar"><span style={{"width": p2_life + "%"}}></span></div>
			</div>
			<div id="last_line">
				<img alt="Player1 name" className="name" src={"https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-" + p1.toUpperCase()}/>
				<img alt="Player2 name" className="name" src={"https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-" + p2.toUpperCase()}/>
			</div>
		</div>
	)
}

function Pong() {
	const height: number = 626;
	const width: number = 782;
	const paddle_margin: number = 10;

	let { masterSocket, setToDisplay } = useContext(AuthContext) as AuthContextType;
	let { matchID, setMatchID, setMatch, match } = useContext(GameContext) as ContextType;

	// GAME OBJECTS
	const [ puck, setPuck ] = useState<Puck>({ x: width / 2, y: height/ 2, r: 12, boost_activated: [] });
	const [ paddleRight, setPaddleRight ] = useState<Paddle>({ is_left: false, x: width - paddle_margin - 20 / 2, y: height / 2, w: 20, h: 80, indice:0 });
	const [ paddleLeft, setPaddleLeft ] = useState<Paddle>({ is_left: true, x: paddle_margin + 20 / 2, y: height / 2, w: 20, h: 80, indice:0 });
	const [ score, setScore ] = useState<number[]>([0, 0]);
	const [ map, setMap ] = useState<number>(3);
	const [ goal, setGoal ] = useState<number>(10);
	const [ user2, setUser2 ] = useState<any>(null);

	// GAME POPUP
	const [ endScreen, setEndScreen ] = useState<boolean>(false);
	const [ noPending, setNoPending ] = useState<boolean>(false);
	const [ declined, setDeclined ] = useState<boolean>(false);
	const [ waiting, setWaiting ] = useState<boolean>(true);
	
	useEffect(() => {
		let id:number;
		let game_starting = false;
		masterSocket?.on('game_starting', (data:any) => {
			console.log("game starting !", data);
			game_starting = true;
			axios.get(`/users/infos/${ data.user2_id}`)
			.then (res => {
				setMatch(data);
				setMap(data.map);
				setGoal(data.goal);
				// console.log(res.data);
				setMatchID(data.id);
				setUser2(res.data);
				setWaiting(false);
				id = data;
			})
			.catch( err => console.log(err))
		});
		
		masterSocket?.on('new_frame', (data:any) => {
			// console.log("new frame :", data);
			setPuck(data.puck);
			setPaddleLeft(data.paddle_player1);
			setPaddleRight(data.paddle_player2);
			setScore([data.score_player1, data.score_player2]);
			setMap(data.map);
		});

		masterSocket?.on('finish_game', (data:any) => {
			// alert("game finished !");
			setEndScreen(true);
			// console.log("game finished !");
		});
		
		masterSocket?.on('interrupted_game', (data:any) => {
			setEndScreen(true);
			// alert("game interrupted !");
			// console.log("game interrupted !");
		});

		let nopending = false;

		masterSocket?.on('no_pending_game', (data:any) => {
			setNoPending(true);
			nopending = true;
		});

		masterSocket?.on('invit_decline', (data:any) => {
			id = data;
			console.log("They declined !", data);
			if (!game_starting)
				setDeclined(true);
		});

		masterSocket?.on('cancel_game', (data:any) => {
			console.log("game cancel", data);
		})

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
		// let wd = 6;
		// let hd = 20;
		// for (let it = 15; it < height; it += 35)
		// {
		// 	p5.fill(255);
		// 	p5.rect(width / 2, it, wd, hd);
		// }
		// let wd = 8;
		// let hd = 30;
		// for (let it = 40; it < height; it += 55)
		// {
		// 	p5.fill(255);
		// 	p5.rect(width / 2, it, wd, hd);
		// }
	}

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.rectMode(p5.CENTER);
		p5.ellipseMode(p5.CENTER);
		p5.createCanvas(width, height).parent(canvasParentRef);
		p5.disableFriendlyErrors = true;
		if (map !== 1)
			p5.strokeWeight(2.3);
		else
			p5.noStroke();
		p5.frameRate(50);
	};

	const draw = (p5: p5Types) => {
		// p5.background('#232323');
		
		p5.clear();
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
        if (p5.key === "ArrowUp" && !waiting) {
            masterSocket.emit('paddle_movement', { id_game: matchID, move: "up"})
        } else if (p5.key === "ArrowDown" && !waiting) {
            masterSocket.emit('paddle_movement', { id_game: matchID, move: "down"})
        }
    };

    const keyReleased = (p5: p5Types) => {
        if (p5.key === "ArrowUp" && !waiting) {
            masterSocket.emit('paddle_movement', { id_game: matchID, move: "stop"})
        } else if (p5.key === "ArrowDown" && !waiting) {
            masterSocket.emit('paddle_movement', { id_game: matchID, move: "stop"})
		}
	};

	let header_text;
	if (noPending)
		header_text = "[ NO PENDING GAME ]";
	else if (declined)
		header_text = "[ MATCH REQUEST DECLINED ]";
	else if (waiting)
		header_text = "[ WAITING FOR PLAYER 2 ]";

	return (
		<div id="pong_game">
			<div className="window_header" >
				<i className="fas fa-arrow-left back_button" onClick={ ()=> setToDisplay("landing") }/>
				{ matchID && <>{ score[0] } MACHIN VS TRUC { score[1] }</> }
				{ matchID ? " GAME START" : header_text }
			</div>
			{ endScreen && <EndScreen score1={ score[0] } score2={ score[1] } setToDisplay={ setToDisplay }/> }
			{ noPending && <InfoError setToDisplay={ setToDisplay } type={ 1 } message="We searched the entire galaxy and no one is currently looking for a second player. Why don't you create your own game ?" /> }
			{ declined && <InfoError setToDisplay={ setToDisplay } type={ 2 } message={ `The player refused your challenge (the coward). Maybe try creating a new game and challenge someone who won't be scared of your pong skills.` } /> }
			{ !waiting && map === 2 && <Mario p1={ match.users[0].name } p2={ user2.name } scoreP1={score[0]} scoreP2={score[1]}/>}
			{ !waiting && map === 3 && <Street p1={ match.users[0].name } p2={ user2.name } scoreP1={score[0]} scoreP2={score[1]} goal={goal} allP1={ match.users[0].points } allP2={ user2.points }/>}
			{ !waiting && !noPending && <Sketch setup={ setup } draw={ draw } keyPressed={ keyPressed } keyReleased={ keyReleased }/> }
			{ waiting && !noPending && !declined && <div id="waiting">
				<i className="fas fa-spinner" />
				<p>Waiting for a second player ...</p>
			</div> }
		</div>
)}

export default Pong;