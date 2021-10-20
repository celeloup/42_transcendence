import WindowBorder from "./ui_components/WindowBorder";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import UserList from './admin/UserList';
import '../styles/admin/Admin.scss';

function Admin () {
	const [nbUsers, setNbUsers] = useState<number>(0);

	useEffect(() => {
		axios.get('/users')
		.then ( response => { setNbUsers(response.data.length); })
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
					<UserList></UserList>
				</div>
				<div className="subcontainer right">
					<WindowBorder w="450px" h="100px">
						<div>
							<p className="stats">Welcome, <span className="special">Admin</span>.</p>
							<p className="stats"><span className="special">What</span> will you do ?</p>
						</div>
					</WindowBorder>
					<WindowBorder w="450px" h="320px">
						<div>
							<p className="stats"><span className="special">Stats</span></p>
							<p className="stats">There is a total of <span className="special">{nbUsers}</span> users.</p>
							<p className="stats"><span className="special">{"?"}</span> of them are online.</p>
							<p className="stats"><span className="special">{"?"}</span> matches are currently being played.</p>
						</div>
					</WindowBorder>
				</div>
			</div>
		</div>
	);
}

export default Admin;
