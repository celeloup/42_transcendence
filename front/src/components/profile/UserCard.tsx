import WindowBorder from "../ui_components/WindowBorder";
import calamityImage from "./logo.jpg";
import onlineImage from "./online.jpg";
import '../../styles/Profile.scss';
import React, { useState } from 'react';

type StatusDisplayProps = {
    state: string;
}

type UserCardProps = {
	user_name: string,
}

export function StatusDisplay ( { state }: StatusDisplayProps) {
    return (
        <div className='status'>
           <div className='dot_status' id={state} ></div>
           <p>{state}</p>
        </div>
    )
}

function UserCard ({ user_name }: UserCardProps) {
	const [online, setOnline] = useState(false);
	const status = online ? <StatusDisplay state='online' /> : <StatusDisplay state='offline'/>;
    return (
        <WindowBorder id='user_window' w='319' h='208'>
            <div id='user_card'>
                <img id='avatar' src={calamityImage} alt='cowgirl'/>
                <p>{user_name}</p>
				<p>{status}</p>
            </div>
        </WindowBorder>
    )
}
export default UserCard;
