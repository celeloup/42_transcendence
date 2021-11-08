import * as api from '../API';
import axios from "axios";
import React, { useEffect } from 'react';
import { AuthContext, ContextType} from '../contexts/AuthContext';
import { useHistory } from "react-router-dom";
import '../styles/parameters/Parameters.scss';
import AvatarChange from './parameters/AvatarChange';
import NameChange from './parameters/NameChange';
import TwofaModal from './parameters/TwofaModal';

function Parameters() {
	const [loading, setLoading] = React.useState<boolean>(true);
	const { logout } = React.useContext(AuthContext) as ContextType;
	const [username, setUsername] = React.useState<string>("");
	const [id, setId] = React.useState<number>(0);
	const [hasAvatar, setHasAvatar] = React.useState<boolean>(false);
	const [modalVisible, setModalVisible] = React.useState<boolean>(false);
	const [is2FA, setIs2FA] = React.useState<boolean>(false);
	const [qrCode, setQrCode] = React.useState<string>("");
	const history = useHistory();

	useEffect(() => {
		let mounted = true;

		axios.get("/users/infos/me")
		.then(response => {
			if (mounted) {
				setUsername(response.data.name);
				setId(response.data.id);
				setHasAvatar(response.data.avatar !== null);
				setIs2FA(response.data.isTwoFactorAuthenticationEnabled);
				setLoading(false);
			}
		})
		.catch(error => { console.log(error.response); });	

		return () => { mounted = false };
	}, []);

	async function paramLogout() {
		logout();
		await api.logout();
		history.push("/");
	}

	const showModal = () : void => {
		if (!is2FA)
		{
			axios.post("/2fa/generate")
			.then( response => { setQrCode(response.data); })
			.catch( error => { console.log(error.reponse); })
			setModalVisible(true);
		}
		else {
			axios.post("/2fa/turn-off")
			.then( response => { setIs2FA(false); })
			.catch( error => { console.log(error.reponse); })
		}
	}

	return (
		<>
			{ loading && <div>Loading...</div>}
			{ !loading &&
				<div className="parameters">
				<div className="container">
					<h1>Parameters</h1>
				</div>
				<div className="container">
					<AvatarChange username={username} id={id} hasAvatar={hasAvatar}></AvatarChange>
					<NameChange username={username}></NameChange>
				</div>
				<div className="container">
					<button className="btn twofa" onClick={showModal}>
						{is2FA
							? <div><i className="fas fa-lock fa-lg"></i> 2FA enabled</div>
							: <div><i className="fas fa-lock-open fa-lg"></i> 2FA disabled</div>
						}
					</button>
				</div>
				<div className="container">
					<button className="btn logout" onClick={paramLogout}>
						<i className="closed_door fas fa-door-closed fa-lg"></i>
						<i className="open_door fas fa-door-open fa-lg"></i>
						<span className="logout_text"> Log out</span>
					</button>
				</div>
				<TwofaModal
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
					is2FA={is2FA}
					setIs2FA={setIs2FA}
					qrCode={qrCode}></TwofaModal>
			</div>
			}
		</>
	);
  }
  
  export default Parameters;