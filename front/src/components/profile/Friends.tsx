import WindowBorder from "../ui_components/WindowBorder";
import Avatar from "./Avatar";
import { NavLink } from 'react-router-dom';
import '../../styles/Profile.scss';

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
    playing: boolean;
}

type Props = {
    friends: FriendType[];
    online: number[];
    playing: number[];
    me?: boolean;
}

function Friend ( { infos, online, playing } : Prop) {
    return (
        <NavLink to={ "/profile/" + infos.id }>
            <div className ='friends_info'>
                <Avatar size={"medium"} id={infos.id} name={infos.name} namespec={true}/>
		    	<p>{ infos.name }</p>
	        	<div className={`dot_status ${( playing ? 'playing' : (online ? "online" : "offline" ) )}`} ></div>
	        </div>
        </NavLink>
    )
}

function Friends (  { friends, online, playing, me = true } : Props) {
    const friend_divs = friends.map((friend) => <Friend key={friend.id} infos={friend} online={ online.includes(friend.id) } playing={ playing.includes(friend.id) }/>)

    return (
        <WindowBorder w='1' h='1' id="friend_window" >
            <>
                <div className="window_header header_title"><i>_</i>friends_</div>
                { friend_divs.length > 0 && <div id='list_friends' style={{ maxHeight: (me ? "321px" : "211px") }}>{ friend_divs }</div>}
                { friend_divs.length === 0 && <span className="empty">No friends to show...</span>}
            </>
        </WindowBorder>
    )
}

export default Friends;