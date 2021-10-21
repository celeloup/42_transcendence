import WindowBorder from "../ui_components/WindowBorder";
import '../../styles/Profile.scss';
import { useState, useEffect } from "react";
import axios from "axios";

type Friend = {
	id: number;
	name: string;
	site_owner: boolean;
	site_moderator: boolean;
	site_banned: boolean;
}

type Prop = {
    infos: Friend;
}

type Props = {
    friends: Friend[];
}

function Friend ( { infos } : Prop) {
	const [online, setOnline] = useState(false);
    const [hasAvatar, setHasAvatar] = useState(false);

    useEffect(() => {
		axios.get("/users/avatar/" + infos.id)
		.then(response => { setHasAvatar(true); })
		.catch(error => { setHasAvatar(false); });
	}, []);

    return (
        <div className ='friends_info'>
            <div className="profile_display">
                <span>{ infos.name.charAt(0) }</span>
                { hasAvatar && <img src={ process.env.REACT_APP_BACK_URL + "/api/users/avatar/" + infos.id }/> }
            </div>
			<p>{ infos.name }</p>
	    	<div className={`dot_status ${online ? 'online': 'offline'}`} ></div>
			{/* div:hover */}
	    </div>
    )
}

function Friends (  {friends} : Props) {
    const friend_divs = friends.map((friend) => <Friend key={friend.id} infos={friend}/>)

    return (
        <WindowBorder w='318' h='451' id="friend_window" >
            <div id ='friends_card'>
                <div className="window_header header_title"><i>_</i>friends_</div>
                <div id='list_friends'>{ friend_divs }</div>
            </div>
        </WindowBorder>
    )
}

export default Friends;