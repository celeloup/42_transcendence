import WindowBorder from "./ui_components/WindowBorder";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import UserList from './admin/UserList';
import '../styles/admin/Admin.scss';

function Admin () {
	const [status, setStatus] = useState<any>(<p className="stats">Welcome, <i>Admin</i>.</p>);
	const [message, setMessage] = useState<any>(<p className="stats"><i>What</i> will you do ?</p>);
	const [nbUsers, setNbUsers] = useState<number>(0);
	const [matches, setMatches] = useState<any[]>([]);

	useEffect(() => {
		axios.get('/users')
		.then ( response => { setNbUsers(response.data.length); })
		.catch ( error => { console.log(error.response); })

		axios.get('/matches')
		.then ( response => { setMatches(response.data); })
		.catch ( error => { console.log(error.response); })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
							<p className="stats"><i>{"?"}</i> of them are online.</p>
							<p className="stats">They've played a total of <i>{ matches.length }</i> matches.</p>
							<p className="stats"><i>{ "?" /*matches.filter((m: any) => m.winner === null).length*/ }</i> of those are currently being played.</p>
						</div>
					</WindowBorder>
				</div>
			</div>
		</div>
	);
}

export default Admin;
