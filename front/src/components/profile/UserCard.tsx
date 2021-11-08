import WindowBorder from "../ui_components/WindowBorder";
import Avatar from './Avatar';
import '../../styles/Profile.scss';

type StatusDisplayProps = {
    state: string;
}

type UserCardProps = {
	user_name: string,
    user_id: number,
    rank: number,
    nb_victories: number,
    nb_defeats: number,
    nb_points: number,
    online: boolean,
}

export function StatusDisplay ( { state }: StatusDisplayProps) {
    return (
        <div className='status'>
           <div className={`dot_status ${state}`} ></div>
           <p>{state}</p>
        </div>
    )
}

function UserCard ({ user_name, user_id, rank, nb_victories, nb_defeats, nb_points, online }: UserCardProps) {
    return (
        <WindowBorder id='user_window' w='319' h='208' double={true}>
            <div id='user_card'>
                <div id='row_top'>
                    <Avatar size={"large"} id={user_id}/>
                    <div className="column_right">
                        <span className="name">{user_name}</span>
                        <StatusDisplay state={online ? 'online' : 'offline'} />
                        <div className="rank">
                            <span>RANK</span>
                            <span>#{ rank + 1 }</span>
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
                        <span>{nb_defeats}</span>
                        <span>defeats</span>
                    </div>
                </div>
                <span className="stats">
                    <i>{">> "}</i>
                    <i>{nb_points}</i>
                    {" points in "}
                    <i>{nb_victories + nb_defeats}</i>
                    {" matches"}
                    <i>{" <<"}</i>
                </span>
            </div>
        </WindowBorder>
    )
}
export default UserCard;
