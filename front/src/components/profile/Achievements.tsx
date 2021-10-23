import WindowBorder from "../ui_components/WindowBorder";
import '../../styles/Profile.scss';

function Achievements () {
    return (
        <WindowBorder w='620' h='175'>
            <>
                <div className="window_header header_title" ><i>_</i>achievements_</div>
                <div id='achievement_imgs'>
                    <div className="achievement">
                        <i className="fas fa-question-circle"></i>
                        <span>Achievement hidden...</span>
                    </div>
                    <div className="achievement">
                        <i className="fas fa-question-circle"></i>
                        <span>Achievement hidden...</span>
                    </div>
                    <div className="achievement">
                        <i className="fas fa-question-circle"></i>
                        <span>Achievement hidden...</span>
                    </div>
                </div>
            </>
        </WindowBorder>
    )
}
export default Achievements;