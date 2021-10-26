import WindowBorder from "../ui_components/WindowBorder";
import '../../styles/Profile.scss';
import { useState, useEffect } from "react";
import axios from "axios";

type FriendType = {
	id: number;
	name: string;
	site_owner: boolean;
	site_moderator: boolean;
	site_banned: boolean;
}

type Prop = {
    infos: FriendType;
    online: boolean;
}

type Props = {
    friends: FriendType[];
    online: number[];
}

function Friend ( { infos, online } : Prop) {
    const [hasAvatar, setHasAvatar] = useState(false);

    useEffect(() => {
		axios.get("/users/infos/" + infos.id)
		.then(response => { setHasAvatar(response.data.avatar !== null); })
		.catch(error => { console.log(error.response); });
	}, [infos.id]);

    return (
        <a href={ "/profile/" + infos.id }>
            <div className ='friends_info'>
                <div className="profile_display">
                    <span>{ infos.name.charAt(0) }</span>
                    { hasAvatar && <img src={ process.env.REACT_APP_BACK_URL + "/api/users/avatar/" + infos.id } alt="user avatar"/> }
                </div>
		    	<p>{ infos.name }</p>
	        	<div className={`dot_status ${online ? 'online': 'offline'}`} ></div>
	        </div>
        </a>
    )
}

function Friends (  { friends, online } : Props) {
    const friend_divs = friends.map((friend) => <Friend key={friend.id} infos={friend} online={ online.includes(friend.id) }/>)

    return (
        <WindowBorder w='318' h='451' id="friend_window" >
            <div id ='friends_card'>
                <div className="window_header header_title"><i>_</i>friends_</div>
                { friend_divs.length > 0 && <div id='list_friends'>{ friend_divs }</div>}
                { friend_divs.length === 0 && <span className="empty">No friends to show...</span>}
            </div>
        </WindowBorder>
    )
}

export default Friends;