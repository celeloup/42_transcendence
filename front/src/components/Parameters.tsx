import * as api from '../API';
import axios from 'axios';
import React, { useEffect } from 'react';
import { AuthContext, ContextType} from '../contexts/AuthContext';
import { useHistory } from "react-router-dom";
import '../styles/Parameters.scss';

function Parameters() {
	const { logout } = React.useContext(AuthContext) as ContextType;
	const [is2FA, setIs2FA] = React.useState<boolean>(false);
	const [nameWasChanged, setNameWasChanged] = React.useState<boolean>(false);
	const [nameNotChanged, setNameNotChanged] = React.useState<boolean>(false);
	const [avatarWasChanged, setAvatarWasChanged] = React.useState<boolean>(false);
	const [avatarNotChanged, setAvatarNotChanged] = React.useState<boolean>(false);
	const [oldUsername, setOldUsername] = React.useState<string>("");
	const [newUsername, setNewUsername] = React.useState<string>("");
	const [userId, setUserId] = React.useState<number>(-1);
	const [avatar, setAvatar] = React.useState<string>("");
	const history = useHistory();

	useEffect(() => {
		axios.get("/users/infos/me")
		.then(response => { //console.log(response.data);
							setNewUsername(response.data.name);
							setOldUsername(response.data.name);
							setUserId(response.data.id);
							setAvatar(response.data.avatar);
						})
		.catch(error => { console.log(error.response); });
	}, []);

	useEffect(() => {
		axios.get("/authentication")
		.then(response => { setIs2FA(response.data.isTwoFactorAuthenticationEnabled); })
		.catch(error => { console.log(error.response); });
	}, []);

	async function paramLogout() {
		logout();
		await api.logout();
		history.push("/");
	}

	function nameIsSame () : boolean {
		return (newUsername === oldUsername)
	}

	async function changeUsername (newUsername : string) {
		axios.put("/users/me", { name: newUsername })
		.then(response => { setNewUsername(response.data.name);
							setOldUsername(response.data.name);
							setNameWasChanged(true);
							setNameNotChanged(false);
						})
		.catch(error => { //console.log(error.response);
							setNameNotChanged(true);
							setNameWasChanged(false);
						});
	}

	const changePicture = (e: any) : void => {
		const formData = new FormData();
		formData.append('avatar', e.target.files[0]);
		axios.post("/users/avatar/me", formData)
		.then(response => { //console.log("success!");
							setAvatarWasChanged(true);
							setAvatarNotChanged(false);
							console.log(document.getElementsByClassName("param_profile_pic"));
							window.location.reload();
						})
		.catch(error => { console.log(error.response);
							setAvatarNotChanged(true);
							setAvatarWasChanged(false);
						});
	}

	const toggle2FA = () : void => {
		// axios.put("/2fa/turn-on")
		// .then(response => { setIs2FA(!is2FA); })
		// .catch(error => { console.log(error.response); });
		setIs2FA(!is2FA);
	}

	const proPicStyle = (id: number, avatar: string) => {
		if (id !== -1 && avatar !== null) {
			return {
				backgroundImage: `url(${process.env.REACT_APP_BACK_URL}/api/users/avatar/${id})`,
				backgroundSize: "cover",
			}
		}
		return {}
	};


	return (
		<div className="parameters">
			{/* <div className="param_container">
				<h1 className="param_h1">Parameters</h1>
			</div> */}
			<div className="param_container">
				<div className="param_subcontainer left">
					<div className="pic_wrapper">
						<div className="pic_base">
							<p className="pic_base_text">{ oldUsername.charAt(0) }</p>
						</div>
						<input style={proPicStyle(userId, avatar)} className="pic_input" type="file" onChange={changePicture}></input>
						<i className="pic_pencil fas fa-pen"></i>
					</div>
					{ avatarNotChanged && 
						<p className="field_changed">Avatar could not be changed ❌</p>
					}
				</div>
				<div className="param_subcontainer right">
					<div className="name_wrapper">
						<input
							className="name_changebar"
							type="text"
							value={newUsername}
							onChange={e => setNewUsername(e.target.value)}
							maxLength={28}>
						</input>
					</div>
					{ nameWasChanged &&
						<p className="field_changed">Username was successfully changed ✔️</p>
					}
					{ nameNotChanged && 
						<p className="field_changed">Username could not be changed ❌</p>
					}
					<button className={"btn namechange" + (nameIsSame() ? "_disabled" : "")} onClick={() => {changeUsername(newUsername)}}>
						<i className="fas fa-save fa-lg"></i> save
					</button>
				</div>
			</div>
			<div className="param_container">
				<button className="btn twofa" onClick={toggle2FA}>
					{is2FA
						? <div><i className="fas fa-lock fa-lg"></i> 2FA enabled</div>
						: <div><i className="fas fa-lock-open fa-lg"></i> 2FA disabled</div>
					}
				</button>
			</div>
			<div className="param_container">
				<button className="btn logout" onClick={paramLogout}>
					<i className="fas fa-door-closed fa-lg"></i> Log out
				</button>
			</div>
		</div>
	);
  }
  
  export default Parameters;