import WindowBorder from "../ui_components/WindowBorder";
import '../../styles/Profile.scss';
import { useState } from "react";
import calamityImage from "./logo.jpg";

type friendsProp = {
	list_friends: string[],
}

type friendProp = {
    username: string,
}

function Friend ({username}: friendProp) {
	const [online, setOnline] = useState(false);
    return (
        <div className ='friends_info'>
            <div id='avatar' className='generated'>{ username.charAt(0)}</div>
			<p>{username}</p>
	    	<div className={`dot_status ${online ? 'online': 'offline'}`} ></div>
			{/* div:hover */}
	    </div>
    )
}

function Friends (  {list_friends}: friendsProp) {
    const friends = list_friends.map((friend) => <Friend key={friend} username={friend}/>)
    return (
        <WindowBorder w='318' h='451' id="friend_window" >
            <div id ='friends_card'>
                <div className="window_header header_title">friends_</div>
                <div id='list_friends'>{friends}</div>
            </div>
        </WindowBorder>
    )
}
export default Friends;