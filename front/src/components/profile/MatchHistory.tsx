import WindowBorder from "../ui_components/WindowBorder";
import '../../styles/Profile.scss';

function MatchHistory () {
    return (
        <WindowBorder id='history_window' w='620' h='480'>
            <div>
                <div className="window_header header_title">match_history_</div>
            </div>
        </WindowBorder>
    )
}
export default MatchHistory;