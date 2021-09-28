import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { AuthContext, ContextType }  from '../../contexts/AuthContext';
import '../../styles/CreateChan.scss';

type User = {
	id: number,
	name: string
};

type channelSettings = {
	type: number,
	name: string,
	password: string,
	members: [],
	owner_id: number
};

type CreateChanProps = {
	type : number,
	hide : (type: number) => void
};

function CreateChan({ type, hide } : CreateChanProps) {
	const { user } = useContext(AuthContext) as ContextType;

	// -------- List users
	const [users, setUsers] = useState<User[]>([]);
	useEffect(() => {
		const getUsers = async () => {
			try {
				const res = await axios.get('/users');
				// console.log(res);
				setUsers(res.data);
			}catch (err) {
				console.log(err);
			}
		};
		getUsers();
	}, []);
	
	var usersList;
	if (users.length !== 0)
		usersList = users.map((user:any) => <option key={user.id} value={user.name}/>)
	else
		usersList = <p className="no_chan">No user found.</p>

	// ------ Style password
	const [ typePassword, setTypePassword ] = useState(true);

	// ------- Channel data
	const [ chanType, setChanType ] = useState<number>(type);
	const [ chanName, setChanName ] = useState<string>("");
	const [ chanPassword, setChanPassword ] = useState<string>("");
	const [ userDM, setUserDM ] = useState<User>();
	// const [ chanSettings, setChanSettings ] = useState<channelSettings>(
	// {
	// 	type: type, 
	// 	name: "", 
	// 	password: "", 
	// 	members: [], 
	// 	owner_id: user? user.id : 1 // TO CHANGE LATER OR TO REMOVE
	// });
	const handleSubmit = (e:any) => {
		e.preventDefault();
		let chanRegex = /^[^-\s][a-zA-Z0-9_\s-]+$/;
		console.log(chanRegex.test(chanName));
		console.log(chanType);
		console.log(chanName);
		console.log(chanPassword);
		// if (chanType === 1)
		// {
		// 	chanSettings.type = 1;
		// 	chanSettings.password = "";
		// 	chanSettings.members = [];
		// }
		// else if (chanType === 2)
		// {
		// 	chanSettings.type = 2;
		// 	chanSettings.members = [];
		// }
		// else if (chanType === 3)
		// {
		// 	chanSettings.type = 3;
		// 	chanSettings.name = "";
		// }
		// setChanSettings(prevState => ({
		// 	...prevState,
		// 	type: chanType
		// }));
		// console.log(chanSettings);
	}

	// const handleChange = (e:any) => {
	// 	const { name, value } = e.target;
	// 	setChanSettings(prevState => ({
	// 		...prevState,
	// 		[name]: value
	// 	}));
	// 	// console.log(chanSettings);
	// };

	return (
		<div id="addChanWrapper">
			<div id="addChan">
				<p>Choose the channel's type</p>
				<i className="fas fa-times closeIcon" onClick={ () => hide(0) }></i>
				<div id="typeChanSelect">
					<div className={ chanType === 1 ? "selected" : "" } onClick={ () => setChanType(1) } >Public</div>
					<div className={ chanType === 2 ? "selected" : "" } onClick={ () => setChanType(2) } >Private</div>
					<div className={ chanType === 3 ? "selected" : "" } onClick={ () => setChanType(3) } >DM</div>
				</div>
				<div className="infosChan">
					{ chanType === 1 && "/i\\ This channel will be accessible to everyone."}
					{ chanType === 2 && "/i\\ This channel will only be accessible to the members of your choosing."}
					{ chanType === 3 && "/i\\ Start a private conversation with an other member."}
				</div>
				<form onSubmit={ handleSubmit }>
					{ (chanType === 1 || chanType === 2) && 
						<label>
							Name your channel
							<input 
								autoFocus={true}
								autoComplete="off"
								id="channelName"
								name="name"
								value={ chanName }
								onChange={ (e) => setChanName(e.target.value) }
							/>
						</label>
					}
					{ chanType === 2 && 
						<label id="passwordLabel">
							Set a password
							<input
								autoComplete="off"
								className={ typePassword ? "passwordInput" : ""} 
								type="text"
								value={ chanPassword }
								onChange={ (e) => setChanPassword(e.target.value) }
							/>
							<span>optional</span>
							<i className={ typePassword ? "fas fa-eye-slash" : "fas fa-eye" } onClick={ () => setTypePassword(!typePassword)}></i>
						</label>
					}
					{ chanType === 3 && 
						<div id="selectUser">
							ADD USER SELECT HERE
							{/* <input autoFocus={true} placeholder="Select a user" list="userMp" />
							<datalist id="userMp">
								{usersList}
							</datalist> */}
							{/* <i className="fas fa-search"></i> */}
							{/* <div>
								<ul>{usersList}</ul>
							</div> */}
						</div>
					}
					<input className={ chanName != "" ? "readyToSubmit" : "" }type="submit" value="Create channel"/>
				</form>
			</div>
		</div>
	)
}

export default CreateChan;