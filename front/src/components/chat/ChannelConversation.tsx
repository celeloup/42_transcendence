import { useState } from 'react';

type MessageProps = {
	username: string,
	message: string
	// ADD PROFILE PIC
}

// const ProfileCard = (username:any) => {
	
	
	
// 	return (
		
// 	)
// }

export function Message ({ username, message }: MessageProps) {
	const [ isFriend, setIsFriend ] = useState(false);
	const [ isBlocked, setIsBlocked ] = useState(false);
	const [ displayCard, setDisplayCard ] = useState(false);
	
	var ProfileCard =
		<div className="profile_card">
			<i className="fas fa-times close_icon" onClick={()=> setDisplayCard(false)}></i>
			<div className="profile_pic">
				{ username.charAt(0) }
				<div className="user_status online"></div>
			</div>
			<div className="username">{ username }</div>
			<div className="stats"> 5 victories | 0 defeat</div>
			<div className="flex">
				<div className="button" onClick={()=> setIsFriend(!isFriend)}>
					<i className={ isFriend ? "fas fa-user-minus" : "fas fa-user-plus" }></i>
					{ isFriend ? "Unfriend" : "Add friend" }
				</div>
				<div className="button" onClick={()=> setIsBlocked(!isBlocked)}>
					<i className="fas fa-ban"></i>
					{ isBlocked ? "Unblock" : "Block" }
				</div>
			</div>
			<div className="button" id="challenge_button">
				CHALLENGE<i className="fas fa-rocket"></i>
			</div>
		</div>
	
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
					{ ProfileCard }
				</div>
			}
		</div>
	)
}
