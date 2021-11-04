import { useContext, useEffect, useState } from 'react';
import { GameContext, ContextType } from '../../contexts/GameContext';
import { AuthContext, ContextType as AuthContextType} from '../../contexts/AuthContext';
import { Socket } from 'dgram';
import axios from "axios";
import Sabers from '../../assets/img/sabers.svg';
import "../../styles/game/Landing.scss";

function Landing() {
	var { setToDisplay, masterSocket } = useContext(AuthContext) as AuthContextType;
	const [leaderboard, setLeaderboard] = useState<any[]>([]);
	const [matches, setMatches] = useState<any[]>([]);

	useEffect(() => {
		axios.get("/users/ranked")
		.then(response => { setLeaderboard(response.data); })
		.catch(error => { console.log(error.response); })

		masterSocket.emit("get_current_games");
		masterSocket?.on("current_games", (data : any) => { console.log(data);
			setMatches(data);
		});
		// setMatches([{ user1_id:"yoooo", score_user1: 42, user2_id: 3, score_user2: 24},
		// 			{ user1_id: "cclaude", score_user1: 1, user2_id: 4, score_user2: 7},
		// 			{ user1_id: "boooooooooooooooooooo", score_user1: 10, user2_id: 2, score_user2: 99},
		// 			{ user1_id: "cclaude", score_user1: 1, user2_id: 4, score_user2: 7},
		// 			{ user1_id: "boooooooooooooooooooo", score_user1: 14, user2_id: 2, score_user2: 99},
		// 			{ user1_id: "cclaude", score_user1: 1, user2_id: 4, score_user2: 7},
		// 			{ user1_id: "boooooooooooooooooooo", score_user1: 40, user2_id: 2, score_user2: 99},
		// 			{ user1_id: "cclaude", score_user1: 1, user2_id: 4, score_user2: 7},
		// 			{ user1_id: "boooooooooooooooooooo", score_user1: 66, user2_id: 2, score_user2: 99},
		// 			]);
	}, []);

	function find_match() {
		masterSocket.emit('match_player');
		setToDisplay("pong");
	}

	const leaderboard_divs = leaderboard.slice(0, 100).map((user, i) => 
		<a href={ "/profile/" + user.id } key={i}>
			<span className="rank">#{i + 1}</span>
			<span className="name">{ user.name }</span>
			<span className="points">{ user.points }</span>
		</a>
	);

	const match_divs = matches.map((match, i) => 
		<div>
			<span className="name">{ match.user1_id }</span>
			<span className="score">{ match.score_user1 }</span>
			<img className="logo" src={ Sabers } alt="sabers"></img>
			<span className="score">{ match.score_user2 }</span>
			<span className="name">{ match.user2_id }</span>
		</div>
	);

	return (
		<div id="landing_game">
			<div className="window_header" >
			<i className="fas fa-rocket"></i>game_
			</div>
			<div id="game_start_buttons">
				<div onClick={ () => setToDisplay("create") }>CREATE GAME <br/>(a changer par image)</div>
				<div onClick={ find_match }>JOIN GAME <br/>(matchmaking)<br/>(a changer par image)</div>
			</div>
			<div id="landing_displays">
				<div className="match_list">
					{ match_divs }
				</div>
				<div className="leaderboard">
					<div className="leaderbox">
						{ leaderboard_divs }
					</div>
				</div>
			</div>
		</div>
)}

export default Landing;