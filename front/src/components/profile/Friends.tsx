import WindowBorder from "../ui_components/WindowBorder";
import Avatar from "./Avatar";
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
}

type Props = {
    friends: FriendType[];
    online: number[];
}

function Friend ( { infos, online } : Prop) {
    return (
        <a href={ "/profile/" + infos.id }>
            <div className ='friends_info'>
                <Avatar size={"medium"} id={infos.id} name={infos.name} namespec={true}/>
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