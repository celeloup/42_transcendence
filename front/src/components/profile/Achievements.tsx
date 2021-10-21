import WindowBorder from "../ui_components/WindowBorder";
import '../../styles/Profile.scss';

function Achievements () {
    return (
        <WindowBorder w='620' h='175'>
            <>
                <div className="window_header header_title" ><i>_</i>achievements_</div>
                <div id='achievement_imgs'>
                    <div className="empty"></div>
                    <div className="empty"></div>
                    <div className="empty"></div>
                </div>
            </>
        </WindowBorder>
    )
}
export default Achievements;