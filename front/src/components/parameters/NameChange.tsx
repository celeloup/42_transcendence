import axios from 'axios';
import React, { useEffect } from 'react';
import '../../styles/parameters/Parameters.scss'
import '../../styles/parameters/NameChange.scss';

function NameChange () {
	const [nameWasChanged, setNameWasChanged] = React.useState<boolean>(false);
	const [nameNotChanged, setNameNotChanged] = React.useState<boolean>(false);
	const [oldUsername, setOldUsername] = React.useState<string>("");
	const [newUsername, setNewUsername] = React.useState<string>("");

	useEffect(() => {
		axios.get("/users/infos/me")
		.then(response => { setNewUsername(response.data.name);
							setOldUsername(response.data.name);
						})
		.catch(error => { console.log(error.response); });
	}, []);

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

	return (
		<div className="subcontainer right">
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
	);
  }
  
  export default NameChange;