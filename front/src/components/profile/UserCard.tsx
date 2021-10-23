import WindowBorder from "../ui_components/WindowBorder";
import '../../styles/Profile.scss';

type StatusDisplayProps = {
    state: string;
}

type UserCardProps = {
	user_name: string,
    user_id: number,
    has_avatar: boolean,
    nb_matches: number,
    nb_victories: number,
    nb_points: number,
}

export function StatusDisplay ( { state }: StatusDisplayProps) {
    return (
        <div className='status'>
           <div className={`dot_status ${state}`} ></div>
           <p>{state}</p>
        </div>
    )
}

function UserCard ({ user_name, user_id, has_avatar, nb_matches, nb_victories, nb_points }: UserCardProps) {
    return (
        <WindowBorder id='user_window' w='319' h='208'>
            <div id='user_card'>
                <div id='row_top'>
                   <div className="profile_display">
                        <span>{ user_name.charAt(0) }</span>
                        { has_avatar && <img src={ process.env.REACT_APP_BACK_URL + "/api/users/avatar/" + user_id } alt="user avatar"/> }
                    </div>
                    <div className="column_right">
                        <span className="name">{user_name}</span>
                        <span>[status ?]</span>
                        {/* <StatusDisplay state={online ? 'online' : 'offline'} /> */}
                        <div className="rank">
                            <span>RANK</span>
                            <span>#?</span>
                        </div>
                    </div>
                </div>
                <div className="mid_banner">
                    <div>
                        <span>{nb_victories}</span>
                        <span>victories</span>
                    </div>
                    <i className="fas fa-trophy"></i>
                    <div>
                        <span>{nb_matches - nb_victories}</span>
                        <span>defeats</span>
                    </div>
                </div>
                <span className="stats">
                    <i>{">> "}</i>
                    <i>{nb_points}</i>
                    {" points in "}
                    <i>{nb_matches}</i>
                    {" matches"}
                    <i>{" <<"}</i>
                </span>
            </div>
        </WindowBorder>
    )
}
export default UserCard;
