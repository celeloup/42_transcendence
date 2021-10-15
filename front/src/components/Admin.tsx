import WindowBorder from "./ui_components/WindowBorder";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import '../styles/Admin.scss'

type User = {
	id: number;
	name: string;
	site_banned: boolean;
	site_moderator: boolean;
	site_owner: boolean;
}

type UserCategoryProps = {
	list: User[];
	type: string;
	search: string;
	adminFunction: (id: number) => void;
	modFunction: (id: number) => void;
	banFunction: (id: number) => void;
}

type UserLineProps = {
	infos: User;
	adminFunction: (id: number) => void;
	modFunction: (id: number) => void;
	banFunction: (id: number) => void;
	key: number;
}

function UserLine ( { infos, adminFunction, modFunction, banFunction } : UserLineProps ) {

	const callAdmin = () : void => {
		adminFunction(infos.id);
	};

	const callMod = () : void => {
		modFunction(infos.id);
	};

	const callBan = () : void => {
		banFunction(infos.id);
	};

	return (
		<div className="userLine">
			<div>
				<span>{infos.name} </span>
			</div>
			<i id="user_button" className="fas fa-crown" onClick={callAdmin}>
				<span className="tooltiptop">Make admin</span>
			</i>
			<div id="user_button" className="fas fa-wrench" onClick={callMod}>
				<span className="tooltiptop">Make moderator</span>
			</div>
			<i id="user_button" className="fas fa-times-circle" onClick={callBan}>
				<span className="tooltiptop">Ban user</span>
			</i>
		</div>
	);
}

function UserCategory({ list, type, search, adminFunction, modFunction, banFunction } : UserCategoryProps) {
	const [displayCategory, setDisplayCategory] = React.useState(true);

	const toggleDisplayCategory = (): void => {
		setDisplayCategory(!displayCategory);
	};
	
	return (
		<>
			<div className="separator">
				<div onClick={ toggleDisplayCategory }>
					<i className={ displayCategory ? "fas fa-chevron-down" : "fas fa-chevron-right" } ></i>
					{type}s_
				</div>
			</div>
			{ displayCategory && <div className="publicChannels">
				{list.map( (user, i) => {  
					if (user.name.includes(search))
						return (<UserLine infos={user} adminFunction={adminFunction} modFunction={modFunction} banFunction={banFunction} key={i}></UserLine>);
					else
						return (<React.Fragment key={i}></React.Fragment>);
				})}
			</div> }
		</>
	)
}

function Admin () {
	const [admins, setAdmins] = useState<User[]>([]);
	const [moderators, setModerators] = useState<User[]>([]);
	const [others, setOthers] = useState<User[]>([]);
	const [searched, setSearched] = useState<string>("");

	useEffect(() => {
		axios.get('/users')
		.then ( response => {
			setAdmins(response.data.filter(function(user : User) {
				return (user.site_owner);
			  }));
			setModerators(response.data.filter(function(user : User) {
				return (!user.site_owner && user.site_moderator);
			}));
			setOthers(response.data.filter(function(user : User) {
				return (!user.site_owner && !user.site_moderator);
			  }));
		})
		.catch ( error => {
			console.log(error.response); 
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const makeAdmin = (id : number) => {
		// Route doesn't exist (yet ?)
	}

	const makeMod = (id : number) => {
		axios.put('/users/moderators/me', id)
		.then (response => { console.log("successfully made mod"); } )
		.catch (error => { console.log(error.response); });
	}

	const banUser = (id : number) => {
		axios.delete('/users/block/me', {data: id})
		.then (response => { console.log("successfully banned user"); } )
		.catch (error => { console.log(error.response); });
	}

	return (
		<div className="admin_page">
			<div className="admin_container">
				<h1 className="admin_h1">Admin</h1>
			</div>
			<div className="admin_container">
				<div className="admin_subcontainer left">
					<WindowBorder w='382px' h='450px'>
						<div className="userPanel">
							<div className="userListWrapper">
								<div className="userSearchBar">
									<input type="text" value={searched} onChange={e => setSearched(e.target.value)} placeholder="Search user" className="userSearch"></input>
									<i id="userSearchButton" className="fas fa-search"></i>
								</div>

								<div className="userList">
									<UserCategory list={admins} type="admin" search={searched}
										adminFunction={makeAdmin} modFunction={makeMod} banFunction={banUser}/>
									<UserCategory list={moderators} type="moderator" search={searched}
										adminFunction={makeAdmin} modFunction={makeMod} banFunction={banUser}/>
									<UserCategory list={others} type="user" search={searched}
										adminFunction={makeAdmin} modFunction={makeMod} banFunction={banUser}/>
								</div>
							</div>
							{/* <div className="dummyModal" onClick={ toggleDisplayList }></div> */}
						</div>
					</WindowBorder>
				</div>
				<div className="admin_subcontainer right">
					<p>There will be something there</p>
				</div>
			</div>
		</div>
	);
  }

  export default Admin;
