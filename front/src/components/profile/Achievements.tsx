import WindowBorder from "../ui_components/WindowBorder";
import { useState, useEffect } from "react";
import '../../styles/profile/Achievements.scss';

type Achievement = {
    name: string;
    description: string;
    type: number;
    level: number;
}

const Hidden : Achievement = {
    name: "Achievement hidden...",
    description: "",
    type: 0,
    level: 0
}

type Props = {
    achievements: any[];
}

function Achievements ({ achievements } : Props) {
    const colors = ["default", "bronze", "silver", "gold"];
    const icons = ["question-circle", "gamepad", "trophy", "users"];

    const makeAchievement = ( data : any ) => {
        return (
        <div className={"achievement " + colors[data.level]}>
            <i className={"fas fa-" + icons[data.type]}></i>
            <p>{ data.name }</p>
            { data.type > 0 && <span>{ data.description }</span> }
        </div>
        )
    }

    const [gamesAchievement, setGamesAchievement] = useState<any>(makeAchievement(Hidden));
    const [victoriesAchievement, setVictoriesAchievement] = useState<any>(makeAchievement(Hidden));
    const [friendsAchievement, setFriendsAchievement] = useState<any>(makeAchievement(Hidden));
    const setTable = [setGamesAchievement, setVictoriesAchievement, setFriendsAchievement];

    useEffect(() => {
        for (let t = 1 ; t < 4 ; t++) {
            setTable[t - 1](makeAchievement(Hidden));
            for (let l = 3 ; l > 0 ; l--) {
                let achievement = achievements.find(a => (a['type'] === t && a['level'] === l));
                if (achievement) {
                    setTable[t - 1](makeAchievement(achievement));
                    break ;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [achievements]);

    return (
        <WindowBorder w='620' h='175'>
            <>
                <div className="window_header header_title" ><i>_</i>achievements_</div>
                <div id='achievement_imgs'>
                    { gamesAchievement }
                    { victoriesAchievement }
                    { friendsAchievement }
                </div>
            </>
        </WindowBorder>
    )
}
export default Achievements;