import { useContext, useState, useEffect } from 'react';
import { GameContext, ContextType } from '../../contexts/GameContext';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';
import { EndScreen, InfoError, Space, Street, Mario } from './Screens';
import p5Types from "p5";
import Sketch from "react-p5";
import '../../styles/game/Pong.scss';

type Props = {
	map:number
}

function Countdown({map}:Props) {
    const [ counter, setCounter ] = useState(3);
    
    useEffect(() => {
		let mounted = true;
		if (mounted && counter > 0)
			setTimeout(() => setCounter(counter - 1), 1000);
		return () => { mounted = false; }
    }, [counter])
    
    return (
        <div id="countdown" className={ map === 1 ? "yellow" : ""}>
            { counter > 0 ? counter : "GO!" }
        </div>
	)
}

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

function Pong() {
	const height: number = 626;
	const width: number = 782;
	const paddle_margin: number = 10;

	let { masterSocket, setToDisplay } = useContext(AuthContext) as AuthContextType;
	let { setMatch, match } = useContext(GameContext) as ContextType;

	// GAME OBJECTS
	const [ puck, setPuck ] = useState<Puck>({ x: -100, y: -100, r: 12, boost_activated: [] });
	const [ paddleRight, setPaddleRight ] = useState<Paddle>({ is_left: false, x: width - paddle_margin - 20 / 2, y: height / 2, w: 20, h: 80, indice:0 });
	const [ paddleLeft, setPaddleLeft ] = useState<Paddle>({ is_left: true, x: paddle_margin + 20 / 2, y: height / 2, w: 20, h: 80, indice:0 });
	const [ score, setScore ] = useState<number[]>([0, 0]);

	// GAME POPUP
	const [ endScreen, setEndScreen ] = useState<boolean>(false);
	const [ noPending, setNoPending ] = useState<boolean>(false);
	const [ declined, setDeclined ] = useState<any>(null);
	const [ canceledGame, setCanceledGame ] = useState<any>(null);
	const [ userOffline, setUserOffline ] = useState<any>(null);
	const [ interrupted, setInterrupted ] = useState<boolean>(false);
	const [ showCountdown, setShowCountdown ] = useState(false);
	const [ waiting, setWaiting ] = useState<boolean>(true);
	
	useEffect(() => {
		let mounted = true;
		let game_starting = false;
		let no_pending_game = false;
		let id:number = -1;
		if (match)
			id = match.id;
		
		masterSocket?.on('game_starting', (data:any) => {
			// console.log("game starting !", data);
			if (mounted)
			{
				setMatch(data);
				setWaiting(false);
				setShowCountdown(true);
			}
			if (!game_starting)
				game_starting = true;
			if (id === -1)
				id = data.id;
		});
		
		masterSocket?.on('new_frame', (data:any) => {
			// console.log("new frame :", data);
			if (mounted) {
				if (waiting)
					setWaiting(false);
				setShowCountdown(false);
				setPuck(data.puck);
				setPaddleLeft(data.paddle_player1);
				setPaddleRight(data.paddle_player2);
				setScore([data.score_player1, data.score_player2]);
			}
		});

		masterSocket?.on('finish_game', (data:any) => {
			if (mounted) {
				setEndScreen(true);
				setPuck({ x: -100, y: -100, r: 12, boost_activated: [] });
			}
			// console.log("game finished !");
		});
		
		masterSocket?.on('interrupted_game', (data:any) => {
			if (mounted) {
				setInterrupted(true);
				setEndScreen(true);
				setPuck({ x: -100, y: -100, r: 12, boost_activated: [] });
			}
			// console.log("game interrupted !");
		});

		masterSocket?.on('no_pending_game', (data:any) => {
			if (mounted)
				setNoPending(true);
			if (!no_pending_game)
				no_pending_game = true;
		});

		masterSocket?.on('invit_decline', (data:any) => {
			if (!id)
				id = data.id;
			// console.log("They declined !", data);
			if (!game_starting && mounted)
				setDeclined(data.users ? data.users[1].name : "Your opponent");
		});

		masterSocket?.on('cancel_game', (data:any) => {
			// console.log("game cancel", data);
			if (!id)
				id = data.id;
			if (mounted)
				setCanceledGame(data.users ? data.users[0].name : "your opponent");
		})

		masterSocket?.on('challenged_user_offline', (data:any) => {
			// console.log("challenged user offline", data);
			if (!id)
				id = data.id;
			if (mounted)
				setUserOffline(data.users ? data.users[1].name : "Your opponent");
		})

		return () => {
			if (no_pending_game === false && id !== -1)
			{
				masterSocket.emit('leave_game', id);
				setMatch(null);
			}
			mounted = false
		}
	}, [masterSocket]) // eslint-disable-line

	useEffect(() => {
		let mounted = true;
		if (mounted) {
			setEndScreen(false);
			setNoPending(false);
			setInterrupted(false);
		}
		return () => {
			mounted = false
		}
	}, [ match ])
	
	// ------------- CANVAS
	function separation(p5: p5Types) {
		let wd = 6;
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
		p5.disableFriendlyErrors = true;
		if (match.map !== 1)
			p5.strokeWeight(2.3);
		else
			p5.noStroke();
		p5.frameRate(50);
	};

	const draw = (p5: p5Types) => {
		p5.clear();
		if (match.map === 1)
			separation(p5);
		p5.ellipse(puck.x, puck.y, puck.r * 2, puck.r * 2);
		p5.fill(255, 205, 39);
		puck.boost_activated.forEach(sensor => {
			p5.ellipse(sensor.x, sensor.y, puck.r * 2, puck.r *2);
		});
		p5.fill(255);
		p5.rect(paddleLeft.x, paddleLeft.y, paddleLeft.w, paddleLeft.h);
		p5.rect(paddleRight.x, paddleRight.y, paddleRight.w, paddleRight.h);
	};

	const keyPressed = (p5: p5Types) => {
        if (p5.key === "ArrowUp" && !waiting) {
            masterSocket.emit('paddle_movement', { id_game: match.id, move: "up"})
        } else if (p5.key === "ArrowDown" && !waiting) {
            masterSocket.emit('paddle_movement', { id_game: match.id, move: "down"})
        }
    };

    const keyReleased = (p5: p5Types) => {
        if (p5.key === "ArrowUp" && !waiting) {
            masterSocket.emit('paddle_movement', { id_game: match.id, move: "stop"})
        } else if (p5.key === "ArrowDown" && !waiting) {
            masterSocket.emit('paddle_movement', { id_game: match.id, move: "stop"})
		}
	};

	let header;
	if (noPending)
		header = "[ NO PENDING GAME ]";
	else if (declined)
		header = "[ MATCH REQUEST DECLINED ]";
	else if (canceledGame)
		header = "[ MATCH CANCELED ]";
	else if (userOffline)
		header = "[ USER OFFLINE ]"
	else if (waiting)
		header = "[ WAITING FOR PLAYER 2 ]";
	else
		header = <>
			<div><i className="fas fa-flag-checkered"></i><span>{ match.goal }</span></div>
			<div><i className="fas fa-tachometer-alt"></i><span>{ match.speed === 0 ? "slow" : match.speed === 1 ? "normal" : "fast"}</span></div>
			<div><i className="fas fa-meteor" aria-hidden="true"></i><span>{ match.boost_available ? "on" : "off"}</span></div>
			<div><i className="fas fa-map" aria-hidden="true"></i><span>{ match.map === 1 ? "space" : match.map === 2 ? "mario" : "street"}</span></div>
			</>
	return (
		<div id="pong_game">
			<div className="window_header" >
				<i className="fas fa-arrow-left back_button" onClick={ ()=> setToDisplay("landing") }/>
				<div>{ header }</div>
			</div>

			{ endScreen && <EndScreen user1={ match.users[0] } user2={ match.users[1] } score1={ score[0] } score2={ score[1] } setToDisplay={ setToDisplay } interrupted={ interrupted }/> }
			{ noPending && <InfoError setToDisplay={ setToDisplay } type={ 1 } /> }
			{ declined && <InfoError setToDisplay={ setToDisplay } type={ 2 } user={ declined }/> }
			{ canceledGame && <InfoError setToDisplay={ setToDisplay } type={ 3 } user={ canceledGame }/> }
			{ userOffline && <InfoError setToDisplay={ setToDisplay } type={ 4 } user={ userOffline }/> }
			{ showCountdown && <Countdown map={match.map}/> }
			
			{ !waiting && match.map === 1 && 
				<Space
					p1={ match.users[0].name } 
					p2={ match.users[1].name } 
					scoreP1={ score[0] } 
					scoreP2={ score[1] }
				/>
			}

			{ !waiting && match.map === 2 && 
				<Mario
					p1={ match.users[0].name } 
					p2={ match.users[1].name } 
					scoreP1={ score[0] } 
					scoreP2={ score[1] }
					allP1={ match.users[0].points } 
					allP2={ match.users[1].points }
				/>
			}
			
			{ !waiting && match.map === 3 && 
				<Street
					p1={ match.users[0].name }
					p2={ match.users[1].name }
					scoreP1={ score[0] } 
					scoreP2={ score[1] } 
					goal={ match.goal } 
					allP1={ match.users[0].points } 
					allP2={ match.users[1].points }
				/>
			}

			{ !waiting && !noPending && 
				<Sketch
					setup={ setup }
					draw={ draw }
					keyPressed={ keyPressed }
					keyReleased={ keyReleased }
			/> }
			
			{ waiting && !noPending && !declined && !canceledGame && !userOffline &&
				<div id="waiting">
					<i className="fas fa-spinner" />
					<p>Waiting for a second player ...</p>
				</div>
			}
		
		</div>
)}

export default Pong;