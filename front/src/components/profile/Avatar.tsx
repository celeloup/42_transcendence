import WindowBorder from "../ui_components/WindowBorder";
import calamityImage from "./logo.jpg";
import '../../styles/Profile.scss';

type ProfileProps = {
	alt_img: string,
    alert_prof: any;
}

function Avatar ({ alt_img, alert_prof }: ProfileProps) {
    return (
        <WindowBorder w='250px' h='250px'>
        <div id='avatar'>
            <img src={calamityImage} alt={alt_img} id='picture' onClick={alert_prof} />
        </div>
        </WindowBorder>
    )
}
export default Avatar;