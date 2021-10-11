import * as api from '../API';
import React from 'react';
import { AuthContext, ContextType} from '../contexts/AuthContext';
import { useHistory } from "react-router-dom";
import '../styles/Parameters.scss';

function Parameters() {
	const { logout, user } = React.useContext(AuthContext) as ContextType;
	let [is2fa, setis2fa] = React.useState<boolean>(true);
	let [newUsername, setNewUsername] = React.useState<string>("my_current_username");
	const history = useHistory();
	
	async function paramLogout() {
		logout();
		await api.logout();
		history.push("/");
	}

	async function exportUsername (newUsername : string) {
		alert(newUsername);
	}

	async function changePicture () {
		alert("change picture ?");
	}

	return (
		<div className="parameters">
			<div id="layer">
				<h1>Parameters</h1>
			</div>
			<div id="layer">
				<div className="sublayer left">
					<button className="profile_pic" onClick={changePicture}>
						{/* { newUsername.charAt(0) } */}
					</button>
					<div className="modify">
						<i className="fas fa-pen"></i>
					</div>
				</div>
				<div className="sublayer right">
					<input
						id="nameChangeBar"
						type="text"
						value={newUsername}
						onChange={e => setNewUsername(e.target.value)}
						maxLength={30}
					>
					</input>
					<button className="btn namechange" onClick={() => {exportUsername(newUsername)}}>
						Change username
					</button>
				</div>
			</div>
			<div id="layer">
				<button className={is2fa ? "btn twofa enable" : "btn twofa disable"} onClick={() => {setis2fa(!is2fa)}}>
					2FA {is2fa ? 'Enabled' : 'Disabled'}
				</button>
				<button className="btn logout" onClick={paramLogout}>
					Log out
				</button>
			</div>
		</div>
	);
  }
  
  export default Parameters;