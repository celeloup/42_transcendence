import { useContext, useEffect, useState } from 'react';
import { AuthContext, ContextType as AuthContextType} from '../../contexts/AuthContext';
import { GameContext, ContextType } from '../../contexts/GameContext';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import Sabers from '../../assets/img/sabers.svg';
import Ticket from '../../assets/img/join_game_ticket.svg';
import Create from '../../assets/img/create_game.svg';
import "../../styles/game/Landing.scss";

function SpectateMatch(matchToSpectate:any, setToDisplay: (s:string) => void, masterSocket:any, setMatch: (m:any) => void)
{
	setMatch(matchToSpectate);
	// console.log(matchToSpectate.id);
	setToDisplay('pong');
	masterSocket.emit('join_game', matchToSpectate.id);
}

function Landing() {
	var { setToDisplay, masterSocket } = useContext(AuthContext) as AuthContextType;
	let { setMatch} = useContext(GameContext) as ContextType;
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
		masterSocket?.on("current_games", (data : any[]) => {
			let test = data.map((m:any) => {
				return (m[1]);
			})
			if (mounted)
				setMatches(test);
			// if (mounted) {
			// 	resolveMatches(data);
			// }
		});

		masterSocket?.on("update_current_games", (data : any[]) => {
			let test = data.map((m:any) => {
				return (m[1]);
			})
			if (mounted)
				setMatches(test);
		});

		return () => { mounted = false };
	}, [masterSocket]);

	function find_match() {
		masterSocket.emit('match_player');
		setToDisplay("pong");
	}

	// function resolveMatches (matches : number[]) {
	// 	Promise.all(
	// 		matches.map(async (match) => {
	// 			let matchInfo = await axios.get("/matches/" + match);
	// 			return ({
	// 				name1: matchInfo.data.users[0].name,
	// 				name2: matchInfo.data.users[1].name,
	// 				score1: matchInfo.data.score_user1,
	// 				score2: matchInfo.data.score_user2,
	// 				id: matchInfo.data.id
	// 			});
	// 		})
	// 	)
	// 	.then( response => { setMatches(response); })
	// 	.catch( error => { console.log(error.response); })
	// }

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
				<div className="left_displays">
					<span className="title">How to play ?</span>
					<span className="rules">
						→ Create a game with custom settings, or join a pending game.
						<br></br>
						→ Move your paddle up and down with the UP ↑ and DOWN ↓ keys.
						<br></br>
						→ Have fun !
					</span>
					<span className="title">Watch a live game !</span>
					{ matches.length === 0 &&
						<span className="rules">No one is playing right now.</span>
					}
					{ matches.length > 0 &&
						<div className="match_list">
							{ matches.map((match, i) =>
								<div key={i} onClick={ () => { SpectateMatch(match, setToDisplay, masterSocket, setMatch); }}>
									<span className="name">{ match.users[0].name }</span>
									<img className="logo" src={ Sabers } alt="sabers" />
									<span className="name">{ match.users[1].name }</span>
									<i className="fas fa-eye"></i>
								</div>
							)}
						</div>
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