import WindowBorder from "../ui_components/WindowBorder";
import '../../styles/Profile.scss';

type friendsProp = {
	list_friends: string[],
}

type friendProp = {
    login: string,
}

function Friend ({login}: friendProp) {
    return (
        //donner une classe avec width de 100 pour cent qui revient a la ligne
        <p> {login}</p>
    )
}

function Friends (  {list_friends}: friendsProp) {
    const friends = list_friends.map((friend) => <Friend key={friend} login={friend}/>)
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