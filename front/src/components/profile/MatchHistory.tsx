import WindowBorder from "../ui_components/WindowBorder";
import Avatar from "./Avatar"
import React, { useEffect } from "react";
import axios from "axios";
import Sabers from '../../assets/img/sabers.svg';
import '../../styles/Profile.scss';


type MatchType = {
	boost_available: boolean;
	createdDate: string;
	friendly: boolean;
	goal: number;
	id: number;
	map: number;
	score_user1: number;
	score_user2: number;
	speed: number;
	user1_id: number;
	user2_id: number;
	winner: number;
}

type Player = {
    id: number;
    name: string;
    score: number;
    winner: boolean;
}

type MatchProps = {
    data: MatchType;
    my_id: number;
    focus: boolean;
    setFocus: (key: number) => void;
}

type HistoryProps = {
    matches: MatchType[];
    my_id: number;
}

function Match ( { data, my_id, focus, setFocus } : MatchProps ) {
    const [player1, setPlayer1] = React.useState<Player>({
        id: data.user1_id,
        name: "",
        score: data.score_user1,
        winner: data.winner === data.user1_id
    });
    const [player2, setPlayer2] = React.useState<Player>({
        id: data.user2_id,
        name: "",
        score: data.score_user2,
        winner: data.winner === data.user2_id
    });

    useEffect(() => {
        axios.get("/users/infos/" + data.user1_id)
		.then(response => { setPlayer1({ id: data.user1_id,
                                        name: response.data.name,
                                        score: data.score_user1,
                                        winner: data.winner === data.user1_id
                                    });
						})
		.catch(error => { console.log(error.response); });

		axios.get("/users/infos/" + data.user2_id)
		.then(response => { setPlayer2({ id: data.user2_id,
                                        name: response.data.name,
                                        score: data.score_user2,
                                        winner: data.winner === data.user2_id
                                    });
						})
		.catch(error => { console.log(error.response); });
	}, [data]);

    let me, them;
    if (my_id === data.user1_id) {
        me = player1;
        them = player2;
    }
    else {
        me = player2;
        them = player1;
    }

    const speeds = ["slow", "normal", "fast"];
    const maps = ["", "space", "mario", "street fighter"];

    return (
        <div className={"match_wrapper" + ( focus ? "_focus" : "" )} onClick={() => { setFocus(data.id); }}>
            <div className="match_info">
                <Avatar size={"medium"} id={me.id}/>
                <div className="name_display">
                    { me.winner && <i className="fas fa-crown"></i>}
                    <span>{ me.name }</span>
                </div>
                <div className="score_display">
                    <span>{ me.score }</span>
                </div>
                <div className="sabers_display" >
                    <img src={ Sabers } alt="sabers"/>
                </div>
                <div className="score_display">
                    <span>{ them.score }</span>
                </div>
                <div className="name_display">
                    { them.winner && <i className="fas fa-crown"></i>}
                    <span>{ them.name }</span>
                </div>
                <Avatar size={"medium"} id={them.id}/>
            </div>
            { focus && 
                <div className="match_focus">
                    <div>
                        <i className="fas fa-flag-checkered"></i>
                        <span> { data.goal }</span>
                    </div>
                    <div>
                        <i className="fas fa-tachometer-alt"></i>
                        <span> { speeds[data.speed] }</span>
                    </div>
                    <div>
                        <i className="fas fa-meteor"></i>
                        <span> { data.boost_available ? "on" : "off"}</span>
                    </div>
                    <div>
                        <i className="fas fa-map"></i>
                        <span> { maps[data.map] }</span>
                    </div>
                </div>
            }
        </div>
    )
}

function MatchHistory ( { matches, my_id } : HistoryProps ) {
    const [focus, setFocus] = React.useState<number>(-1);
    const match_divs = matches.map((match) => <Match key={match.id} data={match} my_id={my_id} focus={focus === match.id} setFocus={setFocus}/>)

    return (
        <WindowBorder id='history_window' w='620' h='480'>
            <div>
                <div className="window_header header_title"><i>_</i>match_history_</div>
                { match_divs.length > 0 && <div id='list_matches'>{ match_divs }</div>}
                { match_divs.length === 0 && <span className="empty">No matches to show...</span>}
            </div>
        </WindowBorder>
    )
}
export default MatchHistory;