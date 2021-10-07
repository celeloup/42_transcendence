import WindowBorder from "../ui_components/WindowBorder";
import calamityImage from "./logo.jpg";
import '../../styles/Profile.scss';

type UserCardProps = {
	user_name: string,
}

function UserCard ({ user_name }: UserCardProps) {
    return (
        <WindowBorder id='user_window' w='319' h='208'>
            <div id='user_card'>
                <img id='avatar' src={calamityImage} alt='cowgirl'/>
                <p>{user_name}</p>
            </div>
        </WindowBorder>
    )
}
export default UserCard;