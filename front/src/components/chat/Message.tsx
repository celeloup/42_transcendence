import { useState, useEffect } from 'react';
import axios from 'axios';

type MessageProps = {
	id: number,
	username: string,
	message: string
	// ADD PROFILE PIC
}

type CardProps = {
	id: number,
	setDisplayCard: (set:boolean) => void
}

function ProfileCard( {id, setDisplayCard}: CardProps) {
	const [ user, setUser ] = useState<any>(null);
	const [ me, setMe ] = useState<any>(null);
	const [ isFriend, setIsFriend ] = useState(false);
	const [ isBlocked, setIsBlocked ] = useState(false);
	
	useEffect(() => {
		axios.get(`/users/infos/${id}`)
		.then( res => {
			console.log("GET USER", res);
			setUser(res.data);
			
		})
		.catch (err => {
			console.log("Error:", err);
		})
		axios.get(`/users/infos/me`)
		.then( res => {
			console.log("GET ME", res);
			setMe(res.data);
			if (id !== res.data.id)
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
	}, [id]);
	
	const [ loadingBlock, setLoadingBlock ] = useState(false);
	const BlockUser = () => {
		setLoadingBlock(true);
		if (isBlocked)
		{
			axios.delete(`/users/block/me`, {
				data: { userId: id}
			})
			.then( res => {
				// console.log(res.data);
				setIsBlocked(false);
				setLoadingBlock(false);
			})
			.catch( err => { console.log("Error:", err)});
		}
		else {
			axios.put(`/users/block/me`, {
				userId: id
			})
			.then( res => {
				// console.log(res.data);
				setIsBlocked(true);
				setLoadingBlock(false);
			})
			.catch( err => { console.log("Error:", err)});
		}
	}
	
	const [ loadingFriend, setLoadingFriend ] = useState(false);
	

	const FriendUser = () => {
		setLoadingFriend(true);
		if (isFriend)
		{
			axios.delete(`/users/friend/me`, {
				data: { userId: id}
			})
			.then( res => {
				console.log(res.data);
				setIsFriend(false);
				setLoadingFriend(false);
			})
			.catch( err => { 
				console.log("Error:", err);
				setLoadingFriend(false);
			});
		}
		else {
			axios.put(`/users/friend/me`, {
				userId: id
			})
			.then( res => {
				console.log(res.data);
				setIsFriend(true);
				setLoadingFriend(false);
			})
			.catch( err => { 
				console.log("Error:", err);
				setLoadingFriend(false);
			});
		}
	}

	var myself = <div className="button" id="profile_button">See my profile</div>
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
		<div className="button" id="challenge_button">
			CHALLENGE<i className="fas fa-rocket"></i>
		</div>
		</>
	
	return (
		<div className="profile_card">
			 <i className="fas fa-times close_icon" onClick={()=> setDisplayCard(false)}> </i> 
			{ user && me && <>
				<div className="profile_pic">
					{ user.name.charAt(0) }
					<div className="user_status online"></div>
				</div>
				<div className="username">{ user.name }</div>
				<div className="stats"> { user.victories } victories | { user.defeats } defeat</div>
				{ user.id === me.id ? myself : someone }
			</>}
			{ !user && <span>Loading...</span> }
		</div>
	)
}

export function Message ({ id, username, message }: MessageProps) {
	
	const [ displayCard, setDisplayCard ] = useState(false);
	
	const closeCard = (event: any) => {
		const id = event.target.id;
		if (id === "card_modal")
			setDisplayCard(false);
	}

	return (
		<div className="chat_message">
			<div className="chat_profile_pic" onClick={ () => setDisplayCard(true)}>
				{ username.charAt(0) }
			</div>
			<div className="chat_message_content">
				<div className="chat_message_username" onClick={ () => setDisplayCard(true)}>{ username }</div>
				<div className="chat_message_text">{ message }</div>
			</div>
			{ displayCard && 
				<div id="card_modal" onClick={ closeCard }>
					<ProfileCard id={id} setDisplayCard={setDisplayCard}/>
				</div>
			}
		</div>
	)
}
