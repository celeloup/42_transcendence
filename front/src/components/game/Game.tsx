import { useState, useContext } from 'react';
import WindowBorder from '../ui_components/WindowBorder';
import { GameContext, ContextType } from '../../contexts/GameContext';

import axios from "axios";
import '../../styles/Game.scss';
import Landing from './Landing';
import GameCreation from './GameCreation';


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
	var { toDisplay } = useContext(GameContext) as ContextType;
	const [ match, setMatch ] = useState<any>(null);
	const [ matchID, setMatchID ] = useState<string>("");

	// const matchmaking = () => {
	// 	socket.emit('match_player');
	// }

	var content;
	if (toDisplay === "create")
		content = <GameCreation />
	else
		content = <Landing />

	return (
		<WindowBorder w='782px' h='670px' id="game">
			{ content }
			
			{/* <div id="game">
				<div className="window_header" >
					<button onClick={ create_game }>CREATE GAME</button>
					
					<button onClick={ matchmaking }>MATCH MAKING</button>
				</div>
				
				<div id="game_window" >
					
				</div>
			</div> */}
		</WindowBorder>
	)}

export default Game;