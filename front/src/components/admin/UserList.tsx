import WindowBorder from "../ui_components/WindowBorder";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

type Props = {
	setStatus: (p: any) => void;
	setMessage: (p: any) => void;
}

function UserList ( { setStatus, setMessage } : Props) {
	const [admins, setAdmins] = useState<User[]>([]);
	const [moderators, setModerators] = useState<User[]>([]);
	const [others, setOthers] = useState<User[]>([]);
	const [banned, setBanned] = useState<User[]>([]);
	const [searched, setSearched] = useState<string>("");
	const [rerender, setRerender] = useState<boolean>(true);

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
	}, [rerender]);

	const makeMod : Button = {
		class: "mod",
		icon: "crown",
		text: "Make mod",
		function: (id : number) => {
			axios.put('/users/moderator/me', { userId: id })
			.then (response => {
				setStatus(<p className="stats"><i>Success</i> ✔️</p>);
				setMessage(<p className="stats">Made user <i>moderator</i>.</p>);
				setRerender(!rerender);
			} )
			.catch (error => {
				setStatus(<p className="stats"><i>Failure</i> ❌</p>);
				setMessage(<p className="stats">Couldn't make user <i>moderator</i>.</p>);
				setRerender(!rerender);
			});
		}
	}

	const removeMod : Button = {
		class: "not-mod",
		icon: "user-slash",
		text: "Remove mod",
		function: (id : number) => {
			axios.delete('/users/moderator/me', { data: { userId: id } })
			.then (response => {
				setStatus(<p className="stats"><i>Success</i> ✔️</p>);
				setMessage(<p className="stats"><i>Revoked</i> moderator status.</p>);
				setRerender(!rerender);
			} )
			.catch (error => {
				setStatus(<p className="stats"><i>Failure</i> ❌</p>);
				setMessage(<p className="stats">Couldn't <i>revoke</i> moderator.</p>);
				setRerender(!rerender);
			});
		}
	}

	const banUser : Button = {
		class: "ban",
		icon: "times-circle",
		text: "Ban user",
		function: (id : number) => {
			axios.put('/users/ban/me', { userId: id })
			.then (response => {
				setStatus(<p className="stats"><i>Success</i> ✔️</p>);
				setMessage(<p className="stats">User was <i>banned</i>.</p>);
				setRerender(!rerender);
			} )
			.catch (error => {
				setStatus(<p className="stats"><i>Failure</i> ❌</p>);
				setMessage(<p className="stats">Couldn't <i>ban</i> user.</p>);
				setRerender(!rerender);
			});
		}
	}

	const unbanUser : Button = {
		class: "unban",
		icon: "plus-circle",
		text: "Unban user",
		function: (id : number) => {
			axios.delete('/users/unban/me', { data: { userId: id } })
			.then (response => {
				setStatus(<p className="stats"><i>Success</i> ✔️</p>);
				setMessage(<p className="stats">User was <i>unbanned</i>.</p>);
				setRerender(!rerender);
			} )
			.catch (error => {
				setStatus(<p className="stats"><i>Failure</i> ❌</p>);
				setMessage(<p className="stats">Couldn't <i>unban</i> user.</p>);
				setRerender(!rerender);
			});
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
						buttons={[removeMod, banUser]}/>
					<UserCategory list={others} type="users" search={searched}
						buttons={[makeMod, banUser]}/>
					<UserCategory list={banned} type="banned" search={searched}
						buttons={[unbanUser]}/>
				</div>
			</div>
		</WindowBorder>
	);
}

export default UserList;