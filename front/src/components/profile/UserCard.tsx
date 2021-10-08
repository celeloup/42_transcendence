import WindowBorder from "../ui_components/WindowBorder";
import calamityImage from "./logo.jpg";
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
           <div className={`dot_status ${state}`} ></div>
           <p>{state}</p>
        </div>
    )
}

function UserCard ({ user_name }: UserCardProps) {
	const [online, setOnline] = useState(true);
	const status = online ? <StatusDisplay state='online' /> : <StatusDisplay state='offline'/>;
    return (
        <WindowBorder id='user_window' w='319' h='208'>
            <div id='user_card'>
                <img id='avatar' src={calamityImage} alt='cowgirl'/>
                <div id='column_right'>
                    <p>{user_name}</p>
                    <StatusDisplay state={online ? 'online' : 'offline'} />
                </div>
            </div>
        </WindowBorder>
    )
}
export default UserCard;
