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
	const [ username, setUsername ] = useState<string>(name);
	const [ hasAvatar, setHasAvatar ] = useState<boolean>(avatar);

    useEffect(() => {
        let mounted = true;

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
	}, [id, namespec, avaspec]);

    useEffect(() => {
        let mounted = true;

        if (namespec)
            if (mounted) {
                setUsername(name);
            }
        if (avaspec)
            if (mounted) {
                setHasAvatar(avatar);
            }

        return () => { mounted = false };
	}, [name, namespec, avatar, avaspec]);

    return (
        <div className={"avatar " + size}>
            { hasAvatar && <img src={ process.env.REACT_APP_BACK_URL + "/api/users/avatar/" + id } alt="avtr"/> }
            { !hasAvatar && <span>{ username.charAt(0) }</span> }
        </div>
    )
}

export default Avatar;