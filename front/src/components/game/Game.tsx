import { useContext } from 'react';
import WindowBorder from '../ui_components/WindowBorder';
// import { GameContext, ContextType } from '../../contexts/GameContext';
import { AuthContext, ContextType as AuthContextType} from '../../contexts/AuthContext';
import '../../styles/game/Game.scss';
import Landing from './Landing';
import GameCreation from './GameCreation';
import Pong from './Pong';

function Game() {
	var { toDisplay } = useContext(AuthContext) as AuthContextType;

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
		</WindowBorder>
	)}

export default Game;