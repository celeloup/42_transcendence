import React, { useEffect } from 'react';
import axios from "axios";
import UserCard from './profile/UserCard';
import Friends from './profile/Friends';
import MatchHistory from './profile/MatchHistory';
import Achievements from './profile/Achievements';
import '../styles/Profile.scss';

type Match = {
	boost_available: boolean;
	createdDate: string;
	friendly: boolean;
	goal: number;
	id: number;
	map: number;
	score_user1: number;
	score_user2: number;
	speed: number;
	user1_id: number;
	user2_id: number;
	winner: number;
}

type Friend = {
	id: number;
	name: string;
	site_owner: boolean;
	site_moderator: boolean;
	site_banned: boolean;
}

function Profile (props : any) {
	const [username, setUsername] = React.useState<string>("");
	const [hasAvatar, setHasAvatar] = React.useState<boolean>(false);
	const [matches, setMatches] = React.useState<Match[]>([]);
	const [nbMatches, setNbMatches] = React.useState<number>(0);
	const [nbVictories, setNbVictories] = React.useState<number>(0);
	const [nbPoints, setNbPoints] = React.useState<number>(0);
	const [rank, setRank] = React.useState<number>(0);
	const [friends, setFriends] = React.useState<Friend[]>([]);

	useEffect(() => {
		axios.get("/users/infos/" + props.match.params.id)
		.then(response => { setUsername(response.data.name);
							setHasAvatar(response.data.avatar !== null)
						})
		.catch(error => { console.log(error.response); });

		axios.get("/users/matches/" + props.match.params.id)
		.then(response => { setMatches(response.data);
							setNbMatches(response.data.length);
							setNbVictories(response.data.filter(function(match : Match) {
								return (match.winner === props.match.params.id);
							}).length);
							setNbPoints(response.data.map(function(match : Match) {
								if (match.user1_id === props.match.params.id)
									return (match.score_user1);
								else
									return (match.score_user2);
							}).reduce((prev : number, current : number) => prev + current))
		})
		.catch(error => { console.log(error.response); })

		axios.get("/users/friends/" + props.match.params.id)
		.then(response => { setFriends(response.data); })
		.catch(error => { console.log(error.response); });

		axios.get("/users/ranked")
		.then(response => { setRank(response.data.map((e : any) => e.id).indexOf(props.match.params.id)); })
		.catch(error => { console.log(error.response); })
	}, [props.match.params.id]);

	return (
			<div className="profile">
				<div id="column_left">
					<UserCard user_name={username} user_id={props.match.params.id} has_avatar={hasAvatar} rank={rank}
						nb_matches={nbMatches} nb_victories={nbVictories} nb_points={nbPoints}/>
					<Friends friends={friends}/>
				</div>
				<div id="column_right">
					<MatchHistory matches={matches} my_id={props.match.params.id}/>
					<Achievements />
				</div>
			</div>
	);
  }
  
  export default Profile;