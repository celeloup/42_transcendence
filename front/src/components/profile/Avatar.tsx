import '../../styles/profile/Avatar.scss';
import { useState, useEffect } from "react";
import axios from "axios";

type Props = {
    size: string;
    id: number;
}

function Avatar ({ size, id } : Props) {
	const [ hasAvatar, setHasAvatar ] = useState<boolean>(false);
	const [ username, setUsername ] = useState<string>("");

    useEffect(() => {
        axios.get("/users/infos/" + id)
        .then( response => { setHasAvatar(response.data.avatar !== null); setUsername(response.data.name); } )
        .catch( error => { console.log(error.response); })
	}, []);

    return (
        <div className={"avatar " + size}>
            { hasAvatar && <img src={ process.env.REACT_APP_BACK_URL + "/api/users/avatar/" + id } alt="user avatar"/> }
            { !hasAvatar && <span>{ username.charAt(0) }</span> }
        </div>
    )
}

export default Avatar;