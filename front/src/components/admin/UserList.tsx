import WindowBorder from "../ui_components/WindowBorder";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import UserCategory from './UserCategory';
import '../../styles/admin/UserList.scss';

type User = {
	id: number;
	name: string;
	site_banned: boolean;
	site_moderator: boolean;
	site_owner: boolean;
}

type Button = {
	class: string;
	icon: string;
	text: string;
	function: (id: number) => void;
}

function UserList () {
	const [admins, setAdmins] = useState<User[]>([]);
	const [moderators, setModerators] = useState<User[]>([]);
	const [others, setOthers] = useState<User[]>([]);
	const [banned, setBanned] = useState<User[]>([]);
	const [searched, setSearched] = useState<string>("");

	useEffect(() => {
		axios.get('/users')
		.then ( response => {
			setAdmins(response.data.filter(function(user : User) {
				return (!user.site_banned && user.site_owner);
			}));
			setModerators(response.data.filter(function(user : User) {
				return (!user.site_banned && !user.site_owner && user.site_moderator);
			}));
			setOthers(response.data.filter(function(user : User) {
				return (!user.site_banned && !user.site_owner && !user.site_moderator);
			}));
			setBanned(response.data.filter(function(user : User) {
				return (user.site_banned);
			}));
		})
		.catch ( error => {
			console.log(error.response); 
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const makeAdmin : Button = {
		class: "admin",
		icon: "crown",
		text: "Make admin",
		function: (id : number) => {
			// Route doesn't exist (yet ?)
		}
	}

	const removeAdmin : Button = {
		class: "not-admin",
		icon: "user-slash",
		text: "Remove admin",
		function: (id : number) => {
			// Route doesn't exist (yet ?)
		}
	}

	const makeMod : Button = {
		class: "mod",
		icon: "wrench",
		text: "Make mod",
		function: (id : number) => {
			axios.put('/users/moderator/me', { userId: id })
			.then (response => { console.log("successfully made mod"); } )
			.catch (error => { console.log(error.response); });
		}
	}

	const removeMod : Button = {
		class: "not-mod",
		icon: "user-slash",
		text: "Remove mod",
		function: (id : number) => {
			axios.delete('/users/moderator/me', { data: { userId: id } })
			.then (response => { console.log("successfully revoked mod"); } )
			.catch (error => { console.log(error.response); });
		}
	}

	const banUser : Button = {
		class: "ban",
		icon: "times-circle",
		text: "Ban user",
		function: (id : number) => {
			axios.put('/users/block/me', { userId: id })
			.then (response => { console.log("successfully banned user"); } )
			.catch (error => { console.log(error.response); });
		}
	}

	const unbanUser : Button = {
		class: "unban",
		icon: "plus-circle",
		text: "Unban user",
		function: (id : number) => {
			// Route doesn't exist (yet ?)
		}
	}

	return (
		<WindowBorder w='450px' h='450px'>
			<div className="wrapper">
				<div className="search_bar">
					<input
						className="search_input"
						type="text"
						value={searched}
						onChange={e => setSearched(e.target.value)}
						placeholder="Search user">
					</input>
					<i className="search_button fas fa-search"></i>
				</div>
				<div className="list">
					<UserCategory list={admins} type="admins" search={searched}
						buttons={[]}/>
					<UserCategory list={moderators} type="moderators" search={searched}
						buttons={[makeAdmin, removeMod, banUser]}/>
					<UserCategory list={others} type="users" search={searched}
						buttons={[makeAdmin, makeMod, banUser]}/>
					<UserCategory list={banned} type="banned" search={searched}
						buttons={[unbanUser]}/>
				</div>
			</div>
		</WindowBorder>
	);
}

export default UserList;