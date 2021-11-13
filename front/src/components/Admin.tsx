import WindowBorder from "./ui_components/WindowBorder";
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext, ContextType as AuthContextType } from '../contexts/AuthContext';
import axios from "axios";
import UserList from './admin/UserList';
import '../styles/admin/Admin.scss';

function Admin () {
	const [status, setStatus] = useState<any>(<p className="stats">Welcome, <i>Admin</i>.</p>);
	const [message, setMessage] = useState<any>(<p className="stats"><i>What</i> will you do ?</p>);
	const [nbUsers, setNbUsers] = useState<number>(0);
	const [matches, setMatches] = useState<any[]>([]);
	const [online, setOnline] = React.useState<number[]>([]);
	const [playing, setPlaying] = React.useState<number[]>([]);
	const { masterSocket, user } = useContext(AuthContext) as AuthContextType;

	useEffect(() => {
		let mounted = true;

		axios.get('/users')
		.then ( response => {
			if (mounted) {
				setNbUsers(response.data.length);
			}
		})
		.catch ( error => { console.log(error.response); })

		axios.get('/matches')
		.then ( response => {
			if (mounted) {
				setMatches(response.data);
			}
		})
		.catch ( error => { console.log(error.response); })

		return () => { mounted = false };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let mounted = true;

		masterSocket?.emit("get_users");
		masterSocket?.on("connected_users", (onlineList : any, playingList : any) => {
			if (mounted) {
				setOnline(onlineList);
				setPlaying(playingList);
			}
		});

		masterSocket?.on("update_online_users", (data : any) => {
			if (mounted) {
				setOnline(data);
			}
		});

		return () => { mounted = false };
	}, [masterSocket]);

	return (
		<div className="admin_page">
			<div className="container">
				<h1>Admin</h1>
			</div>
			<div className="container">
				<div className="subcontainer left">
					<UserList setStatus={setStatus} setMessage={setMessage}></UserList>
				</div>
				<div className="subcontainer right">
					<WindowBorder w="450px" h="100px">
						<div>
							{ status }
							{ message }
						</div>
					</WindowBorder>
					<WindowBorder w="450px" h="320px">
						<div>
							<p className="stats"><i>Stats</i></p>
							<p className="stats">There is a total of <i>{nbUsers}</i> users.</p>
							<p className="stats"><i>{online.length}</i> of them are online.</p>
							<p className="stats"><i>{playing.length}</i> of them are playing.</p>
							<p className="stats">A total of <i>{ matches.length }</i> matches have been played.</p>
						</div>
					</WindowBorder>
				</div>
			</div>
		</div>
	);
}

export default Admin;
