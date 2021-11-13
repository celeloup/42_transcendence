import { useContext, useEffect, useState } from 'react';
import { AuthContext, ContextType as AuthContextType} from '../../contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import Sabers from '../../assets/img/sabers.svg';
import Ticket from '../../assets/img/join_game_ticket.svg';
import Create from '../../assets/img/create_game.svg';
import "../../styles/game/Landing.scss";

function Landing() {
	var { setToDisplay, masterSocket } = useContext(AuthContext) as AuthContextType;
	const [leaderboard, setLeaderboard] = useState<any[]>([]);
	const [matches, setMatches] = useState<any[]>([]);

	useEffect(() => {
		let mounted = true;

		axios.get("/users/ranked")
		.then(response => {
			if (mounted) {
				setLeaderboard(response.data);
			}
		})
		.catch(error => { console.log(error.response); })

		masterSocket?.emit("get_current_games");
		masterSocket?.on("current_games", (data : number[]) => {
			// console.log(data);
			if (mounted) {
				resolveMatches(data);
			}
		});

		return () => { mounted = false };
	}, [masterSocket]);

	function find_match() {
		masterSocket.emit('match_player');
		setToDisplay("pong");
	}

	function resolveMatches (matches : number[]) {
		Promise.all(
			matches.map(async (match) => {
				let matchInfo = await axios.get("/matches/" + match);
				return ({
					name1: matchInfo.data.users[0].name,
					name2: matchInfo.data.users[1].name,
					score1: matchInfo.data.score_user1,
					score2: matchInfo.data.score_user2
				});
			})
		)
		.then( response => { setMatches(response); })
		.catch( error => { console.log(error.response); })
	}

	return (
		<div id="landing_game">
			<div className="window_header" >
			<i className="fas fa-rocket"></i>game_
			</div>
			<div id="game_start_buttons">
				<img src={ Create } alt="Create a game" onClick={ () => setToDisplay("create") } />
				<span>OR</span>
				<img src={ Ticket } alt="Join a game" onClick={ find_match } />
			</div>
			<div id="landing_displays">
				<div className="match_list">
					{ matches.length === 0 &&
						<div>
							<span>No one is playing, or waiting for an opponent.</span>
						</div>
					}
					{ matches.length > 0 &&
						matches.map((match, i) =>
							<div key={i}>
								<span className="name">{ match.name1 }</span>
								<img className="logo" src={ Sabers } alt="sabers" />
								<span className="name">{ match.name2 }</span>
								<i className="fas fa-eye"></i>
							</div>
						)
					}
				</div>
				<div className="leaderboard">
					<div className="leaderbox">
						{
							leaderboard.slice(0, 100).map((user, i) => 
								<NavLink to={ "/profile/" + user.id } className="navlink" key={i}>
									<span className="rank">#{i + 1}</span>
									<span className="name">{ user.name }</span>
									<span className="points">{ user.points }</span>
								</NavLink>
							)
						}
					</div>
				</div>
			</div>
		</div>
)}

export default Landing;