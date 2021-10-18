import { useContext } from 'react';
import { GameContext, ContextType } from '../../contexts/GameContext';

function Landing() {

	var { setToDisplay } = useContext(GameContext) as ContextType;

	return (
		<div id="landing_game">
			<div className="window_header" >
			<i className="fas fa-rocket"></i>game_
			</div>
			<div id="game_start_buttons">
				<div onClick={ () => setToDisplay("create") }>CREATE GAME <br/>(a changer par image)</div>
				<div>JOIN GAME <br/>(matchmaking)<br/>(a changer par image)</div>
			</div>
			<div id="current_game_list">
				[ list of games here ]
			</div>
		</div>
)}

export default Landing;