import { useContext, useEffect } from 'react';
import WindowBorder from '../ui_components/WindowBorder';
// import { GameContext, ContextType } from '../../contexts/GameContext';
import { AuthContext, ContextType as AuthContextType} from '../../contexts/AuthContext';
import '../../styles/game/Game.scss';
import Landing from './Landing';
import GameCreation from './GameCreation';
import Pong from './Pong';

function Game() {
	var { toDisplay, setToDisplay } = useContext(AuthContext) as AuthContextType;

	useEffect(
		() => {
		  setToDisplay("false");
		},
	[setToDisplay]);
	
	// const matchmaking = () => {
	// 	socket.emit('match_player');
	// }

	var content;
	if (toDisplay === "create")
		content = <GameCreation />
	else if (toDisplay === "pong")
		content = <Pong />
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