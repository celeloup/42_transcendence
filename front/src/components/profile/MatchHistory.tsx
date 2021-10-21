import WindowBorder from "../ui_components/WindowBorder";
import '../../styles/Profile.scss';

type Match = {
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

type MatchProps = {
    data: Match;
}

type HistoryProps = {
    matches: Match[];
}

function Match ( { data } : MatchProps ) {
    return (
        <div className="match_info">

        </div>
    )
}

function MatchHistory ( { matches } : HistoryProps ) {
    const match_divs = matches.map((match) => <Match key={match.id} data={match}/>)

    return (
        <WindowBorder id='history_window' w='620' h='480'>
            <div>
                <div className="window_header header_title"><i>_</i>match_history_</div>
                <div id='list_matches'>{ match_divs }</div>
            </div>
        </WindowBorder>
    )
}
export default MatchHistory;