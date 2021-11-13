import React, { useEffect, useContext } from 'react';
import axios from "axios";
import UserCard from './profile/UserCard';
import Buttons from './profile/Buttons';
import Friends from './profile/Friends';
import MatchHistory from './profile/MatchHistory';
import Achievements from './profile/Achievements';
import '../styles/Profile.scss';
import { AuthContext, ContextType as AuthContextType } from '../contexts/AuthContext';

type Friend = {
	id: number;
	name: string;
	site_owner: boolean;
	site_moderator: boolean;
	site_banned: boolean;
}

function Profile (props : any) {
	const [loading, setLoading] = React.useState<boolean>(true);
	const [username, setUsername] = React.useState<string>("");
	const [hasAvatar, setHasAvatar] = React.useState<boolean>(false);
	const [matches, setMatches] = React.useState<any[]>([]);
	const [nbVictories, setNbVictories] = React.useState<number>(0);
	const [nbDefeats, setNbDefeats] = React.useState<number>(0);
	const [nbPoints, setNbPoints] = React.useState<number>(0);
	const [rank, setRank] = React.useState<number>(0);
	const [friends, setFriends] = React.useState<Friend[]>([]);
	const [achievements, setAchievements] = React.useState<any[]>([]);
	const [online, setOnline] = React.useState<number[]>([]);
	const [playing, setPlaying] = React.useState<number[]>([]);
	const { masterSocket, user } = useContext(AuthContext) as AuthContextType;
	
	const userId = +props.match.params.id;

	useEffect(() => {
		let mounted = true;

		axios.get("/users/infos/" + userId)
		.then(response => {
			if (mounted) {
				setUsername(response.data.name);
				setHasAvatar(response.data.avatar !== null);
				setNbVictories(response.data.victories);
				setNbDefeats(response.data.defeats);
				setNbPoints(response.data.points);
				setFriends(response.data.friends);
				setAchievements(response.data.achievements);
				setLoading(false);
			}
		})
		.catch(error => { console.log(error.response); });

		axios.get("/users/matches/" + userId)
		.then(response => {
			if (mounted) {
				setMatches(response.data);
			}				
		})
		.catch(error => { console.log(error.response); })

		axios.get("/users/ranked")
		.then(response => {
			if (mounted) {
				setRank(response.data.map((e : any) => e.id).indexOf(userId));
			}				
		})
		.catch(error => { console.log(error.response); })

		masterSocket?.emit("get_users");
		masterSocket?.on("connected_users", (onlineList : any, playingList : any) => {
			if (mounted) {
				setOnline(onlineList);
				setPlaying(playingList);
			}
		});

		masterSocket?.on("update_online_users", (data : any) => {
			if (mounted) {
				setOnline(data);
			}
		});

		return () => { mounted = false };
	}, [userId, masterSocket]);

	return (
		<>
			{ loading && <div>Loading...</div>}
			{ !loading && <>
				<div className="profile">
					<div id="column_left">
						<UserCard user_name={username} user_id={userId} has_avatar={hasAvatar} rank={rank}
							nb_victories={nbVictories} nb_defeats={nbDefeats} nb_points={nbPoints} online={ online.includes(userId) } playing={ playing.includes(userId) }/>
						{ user!.id !== userId && <Buttons id={userId}/>}
						<Friends friends={friends} online={online} playing={playing} me={ user!.id === userId }/>
					</div>
					<div id="column_right">
						<MatchHistory matches={matches} my_id={userId}/>
						<Achievements achievements={achievements}/>
					</div>
				</div>
			</>}
		</>
	);
  }
  
  export default Profile;