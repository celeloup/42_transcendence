import Avatar from "../profile/Avatar";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory, NavLink } from "react-router-dom";
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';

type MessageProps = {
	id: number,
	online: boolean,
	playing: boolean,
	username: string,
	message: string,
	setBlockedUsers: (blocked:any) => void,
	blocked:boolean
	// ADD PROFILE PIC
}

type CardProps = {
	id: number,
	online: boolean,
	playing: boolean,
	user: any,
	setDisplayCard: (set:boolean) => void,
	setBlockedUsers: (blocked:any) => void
}

function ProfileCard( {id, online, playing, user, setDisplayCard, setBlockedUsers }: CardProps) {
	const [ me, setMe ] = useState<any>(null);
	const [ isFriend, setIsFriend ] = useState(false);
	const [ isBlocked, setIsBlocked ] = useState(false);
	var { setChallenged, setToDisplay } = useContext(AuthContext) as AuthContextType;
	const history = useHistory();
	
	useEffect(() => {
		let mounted = true;

		axios.get(`/users/infos/me`)
		.then( res => {
			// console.log("GET ME", res);
			if (mounted) {
				setMe(res.data);
			}
			if (mounted && id !== res.data.id)
			{
				if (res.data.friends.find((x:any) => x.id === id))
					setIsFriend(true);
				else
					setIsFriend(false);
				if (res.data.blocked.find((x:any) => x.id === id))
					setIsBlocked(true);
				else
					setIsBlocked(false);
			}
		})
		.catch (err => {
			console.log("Error:", err);
		})

		return () => { mounted = false };
	}, [id]);
	
	const [ loadingBlock, setLoadingBlock ] = useState(false);
	const BlockUser = () => {
		let mounted = true;

		if (mounted) {
			setLoadingBlock(true);
		}
		if (isBlocked)
		{
			axios.delete(`/users/block/me`, {
				data: { userId: id}
			})
			.then( res => {
				// console.log(res.data);
				if (mounted) {
					setBlockedUsers(res.data);
					setIsBlocked(false);
					setLoadingBlock(false);
				}
			})
			.catch( err => { console.log("Error:", err)});
		}
		else {
			axios.put(`/users/block/me`, {
				userId: id
			})
			.then( res => {
				// console.log(res.data);
				if (mounted) {
					setBlockedUsers(res.data);
					setIsBlocked(true);
					setLoadingBlock(false);
				}
			})
			.catch( err => { console.log("Error:", err)});
		}

		return () => { mounted = false };
	}
	
	const [ loadingFriend, setLoadingFriend ] = useState(false);
	const FriendUser = () => {
		let mounted = true;

		if (mounted) {
			setLoadingFriend(true);
		}
		if (isFriend)
		{
			axios.delete(`/users/friend/me`, {
				data: { userId: id}
			})
			.then( res => {
				if (mounted) {
					setIsFriend(false);
					setLoadingFriend(false);
				}
			})
			.catch( err => { 
				console.log("Error:", err);
				if (mounted) {
					setLoadingFriend(false);
				}
			});
		}
		else {
			axios.put(`/users/friend/me`, {
				userId: id
			})
			.then( res => {
				if (mounted) {
					setIsFriend(true);
					setLoadingFriend(false);
				}
			})
			.catch( err => { 
				console.log("Error:", err);
				if (mounted) {
					setLoadingFriend(false);
				}
			});
		}

		return () => { mounted = false };
	}

	const Challenge = () => {
		let mounted = true;
		if (mounted) {
			setChallenged(user);
			setToDisplay("create");
		}
		history.push("/");
		return () => { mounted = false };
		// console.log("challenging ", user);
	}

	var myself = <NavLink to={"/profile/" + id}><div className="button" id="profile_button">See my profile</div></NavLink>
	var someone = <> 
		<div className="flex">
			<div className="button" onClick={ FriendUser }>
				{ !loadingFriend ? <>
					<i className={ isFriend ? "fas fa-user-minus" : "fas fa-user-plus" }></i>
					{ isFriend ? "Unfriend" : "Add friend" }
					</>
				: <span>Loading...</span>}
			</div>
			<div className="button" onClick={ BlockUser }>
				{ !loadingBlock ? <>
					<i className="fas fa-ban"></i>
					{ isBlocked ? "Unblock" : "Block" }
				</>
				: <span>Loading...</span>}
			</div>
		</div>
		<div className="button" id="challenge_button" onClick={ Challenge }>
			CHALLENGE<i className="fas fa-rocket"></i>
		</div>
		</>
	
	return (
		<div className="profile_card">
			<i className="fas fa-times close_icon" onClick={()=> setDisplayCard(false)}> </i> 
			{ user && me && <>
				<div>
					<NavLink to={"/profile/" + user.id}>
						<Avatar size={"medium"} id={id} name={user?.name} namespec={true} avatar={user?.avatar !== null} avaspec={true}/>
						<div className={"user_status " + ( playing ? 'playing' : (online ? "online" : "offline" ) ) }></div>
					</NavLink>
					<div>
						<NavLink to={"/profile/" + user.id}>
							<div className="username">
								{ user.name }
							</div>
						</NavLink>
						<div className="stats_profile_card">
							 { user.victories } victories | { user.defeats } defeats
						</div>
					</div>
				</div>
				{ user.id === me.id ? myself : someone }
			</>}
			{ !user && <span>Loading...</span> }
		</div>
	)
}

export function Message ({ id, online, playing, username, message, setBlockedUsers, blocked }: MessageProps) {
	const [ displayCard, setDisplayCard ] = useState(false);
	const [ user, setUser ] = useState<any>(null);

	useEffect(() => {
		let mounted = true;
		axios.get(`/users/infos/${id}`)
		.then( res => {
			// console.log("GET USER", res);
			if (mounted)
				setUser(res.data);
		})
		.catch (err => {
			console.log("Error:", err);
		})
		return () => { mounted = false };
	}, [id]);
	
	const closeCard = (event: any) => {
		const id = event.target.id;
		if (id === "card_modal")
			setDisplayCard(false);
	}

	const blockMsg = <><i className="fas fa-info-circle"></i>You have blocked this user.</>

	return (
		<div className={ blocked ? "chat_message blocked" : "chat_message" }>
			<div className="pic" onClick={ () => setDisplayCard(true)}>
				<Avatar size={"small"} id={id} name={username} namespec={true}/>
				<div className={"user_status " + ( playing ? 'playing' : (online ? "online" : "offline" ) )}></div>
			</div>
			<div className="content">
				<div className="username" onClick={ () => setDisplayCard(true)}>{ username }</div>
				<div className="text">{ blocked ? blockMsg : message }</div>
			</div>
			{ displayCard &&
				<div id="card_modal" onClick={ closeCard }>
					<ProfileCard id={ id } online={ online } playing={ playing } user={ user } setDisplayCard={ setDisplayCard } setBlockedUsers={ setBlockedUsers }/>
				</div>
			}
		</div>
	)
}
