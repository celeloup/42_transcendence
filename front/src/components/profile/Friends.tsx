import WindowBorder from "../ui_components/WindowBorder";
import '../../styles/Profile.scss';

type friendsProp = {
    login: string,
	list_friends: string[],
}

type friendProp = {
    login: string,
}

function Friend ({login}: friendProp) {
    return (
        <div> {login} </div>
    )
}

function Friends ( {login, list_friends}: friendsProp) {
    const friends = list_friends.map((friend) => <Friend login={friend}/>)
    return (
        <WindowBorder w='200' h='200'>
            <div id='friends'><p>{login} friends: </p>{friends}</div>
        </WindowBorder>
    )
}
export default Friends;