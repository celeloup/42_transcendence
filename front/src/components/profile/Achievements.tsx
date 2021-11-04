import WindowBorder from "../ui_components/WindowBorder";
import '../../styles/Profile.scss';

type Achievement = {
    id: string;
    name: string;
    desc: string;
    color: string;
}

function Achievements () {

    const Played1 : Achievement = {
        id: "played1",
        name: "Newbie",
        desc: "Play your first game",
        color: "bronze"
    }

    const Played2 : Achievement = {
        id: "played2",
        name: "Casual",
        desc: "Play 10 games",
        color: "silver"
    }

    const Played3 : Achievement = {
        id: "played3",
        name: "Nolife",
        desc: "Play 100 games",
        color: "gold"
    }

    const Won1 : Achievement = {
        id: "won1",
        name: "Must Be Luck",
        desc: "Win your first game",
        color: "bronze"
    }

    const Won2 : Achievement = {
        id: "won2",
        name: "Getting there",
        desc: "Win 10 games",
        color: "silver"
    }

    const Won3 : Achievement = {
        id: "won3",
        name: "Pro Gamer",
        desc: "Win 50 games",
        color: "gold"
    }

    const Friend1 : Achievement = {
        id: "friend1",
        name: "So Alone...",
        desc: "Make your first friend",
        color: "bronze"
    }

    const Friend2 : Achievement = {
        id: "friend2",
        name: "Not So Alone",
        desc: "Make 5 friends",
        color: "silver"
    }

    const Friend3 : Achievement = {
        id: "friend3",
        name: "Social Butterfly",
        desc: "Make 10 friends",
        color: "gold"
    }

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