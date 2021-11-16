import '../../styles/profile/Avatar.scss';
import { useState, useEffect } from "react";
import axios from "axios";

type Props = {
    size: string;
    id: number;
    name?: string;
    namespec?: boolean;
    avatar?: boolean;
    avaspec?: boolean;
}

function Avatar ({ size, id, name = "", namespec = false, avatar = false, avaspec = false } : Props) {
	const [ username, setUsername ] = useState<string>("");
	const [ hasAvatar, setHasAvatar ] = useState<boolean>(false);
    const [ src, setSrc ] = useState<string>(process.env.REACT_APP_BACK_URL + "/api/users/avatar/" + id);

    useEffect(() => {
        let mounted = true;

        if (mounted) {
            setUsername(name);
            setHasAvatar(avatar);
            setSrc(process.env.REACT_APP_BACK_URL + "/api/users/avatar/" + id);
        }
        if (!namespec || !avaspec)
        {
            axios.get("/users/infos/" + id)
            .then( response => {
                if (mounted) {
                    setHasAvatar(response.data.avatar !== null);
                    setUsername(response.data.name);
                }
            })
            .catch( error => { console.log(error.response); })
        }

        return () => { mounted = false };
	}, [id, name, avatar, namespec, avaspec]);

    return (
        <div className={"avatar " + size}>
            { hasAvatar && <img src={ src } alt="avtr"/> }
            { !hasAvatar && <span>{ username.charAt(0) }</span> }
        </div>
    )
}

export default Avatar;