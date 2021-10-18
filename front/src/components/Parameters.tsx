import * as api from '../API';
import axios from 'axios';
import React, { useEffect } from 'react';
import { AuthContext, ContextType} from '../contexts/AuthContext';
import { useHistory } from "react-router-dom";
import '../styles/Parameters.scss';

function Parameters() {
	const { logout } = React.useContext(AuthContext) as ContextType;
	const [modalVisible, setModalVisible] = React.useState<boolean>(false);
	const [is2FA, setIs2FA] = React.useState<boolean>(false);
	const [nameWasChanged, setNameWasChanged] = React.useState<boolean>(false);
	const [nameNotChanged, setNameNotChanged] = React.useState<boolean>(false);
	const [avatarNotChanged, setAvatarNotChanged] = React.useState<boolean>(false);
	const [oldUsername, setOldUsername] = React.useState<string>("");
	const [newUsername, setNewUsername] = React.useState<string>("");
	const [userId, setUserId] = React.useState<number>(-1);
	const [avatar, setAvatar] = React.useState<string>("");
	const [qrCode, setQrCode] = React.useState<string>("");
	const [twofaCode, setTwofaCode] = React.useState<string>("");
	const history = useHistory();
	const coderef = React.createRef<HTMLInputElement>();

	useEffect(() => {
		axios.get("/users/infos/me")
		.then(response => { setNewUsername(response.data.name);
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
		.then(response => { setAvatarNotChanged(false);
							window.location.reload();
						})
		.catch(error => { console.log(error.response);
							setAvatarNotChanged(true);
						});
	}

	const toggle2FA = () : void => {
		setModalVisible(true);

		axios.post("/2fa/generate")
		.then( response => { setQrCode(response.data); })
		.catch( error => { console.log(error.reponse); })
	}

	const sendCode = (code : string) : void => {
		setTwofaCode(code);
		if (code.length === 6)
		{
			const node = coderef.current;
			if (node)
				node.blur();

			if (is2FA) {
				axios.post("/2fa/turn-off", { twoFactorAuthenticationCode: code })
				.then(response => { setModalVisible(false); setIs2FA(false); setTwofaCode(""); })
				.catch(error => { console.log(error.response); setTwofaCode(""); });
			}
			else {
				axios.post("/2fa/turn-on", { twoFactorAuthenticationCode: code })
				.then(response => { setModalVisible(false); setIs2FA(true); setTwofaCode(""); })
				.catch(error => { setTwofaCode(""); });
			}
		}
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
			<div className="param_container">
				<h1 className="param_h1">Parameters</h1>
			</div>
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
					<i id="closed_door" className="fas fa-door-closed fa-lg"></i>
					<i id="open_door" className="fas fa-door-open fa-lg"></i>
					<span id="logout_text"> Log out</span>
				</button>
			</div>
			<div className={"modal" + (modalVisible ? " visible" : "" )} /*onClick={() => {setModalVisible(false)}}*/>
				<div className={"modal_content" + (modalVisible ? " visible" : "" )}>
					<img className="qr_code" src={qrCode} alt="2FA QR Code"></img>
					<p>Scan the QR Code with Google Authenticator</p>
					<p>and type the code you get below</p>
					<input
							className="twofa_code"
							type="text"
							value={twofaCode}
							onChange={e => sendCode(e.target.value)}
							ref={coderef}
							maxLength={6}>
					</input>
					<button id="close_button" className="fas fa-times fa-3x" onClick={() => { setModalVisible(false); setTwofaCode(""); }}></button>
				</div>
			</div>
		</div>
	);
  }
  
  export default Parameters;