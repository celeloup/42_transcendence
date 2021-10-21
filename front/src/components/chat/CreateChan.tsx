import axios from 'axios';
import { useState, useContext } from 'react';
// import { AuthContext, ContextType as AuthContextType }  from '../../contexts/AuthContext';
import '../../styles/Chat/CreateChan.scss';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';

// type User = {
// 	id: number,
// 	name: string
// };

type channelSettings = {
	type: number,
	name: string,
	password: string, 
	otherUserIdForPrivateMessage: number
};

type CreateChanProps = {
	type : number,
	hide : (type: number) => void,
	socket: any
};

function CreateChan({ type, hide, socket } : CreateChanProps) {
	// const { user } = useContext(AuthContext) as AuthContextType; // might remove once create chan change
	var { changeChannel, toggleDisplayList } = useContext(ChannelContext) as ContextType;
	const [ isLoading, setIsLoading ] = useState(false);
	// -------- List users
	// const [users, setUsers] = useState<User[]>([]);
	// useEffect(() => {
	// 	const getUsers = async () => {
	// 		try {
	// 			const res = await axios.get('/users');
	// 			// console.log(res);
	// 			setUsers(res.data);
	// 		} catch (err) { console.log(err); }
	// 	};
	// 	getUsers();
	// }, []);
	
	// var usersList = users.length !== 0 
	// 	? users.map((user:any) => <option key={user.id} value={user.name}/>)
	// 	: <p className="no_chan">No user found.</p>;

	// ------ Style password
	const [ typePassword, setTypePassword ] = useState(true);

	// ------- Channel data
	const [ chanType, setChanType ] = useState<number>(type);
	const [ chanName, setChanName ] = useState<string>("");
	const [ chanPassword, setChanPassword ] = useState<string>("");
	// const [ userDM, setUserDM ] = useState<User>();
	const [ errors, setErrors ] = useState<Array<{key:string, value:string}>>([]);
	const handleSubmit = (e:any) => {
		e.preventDefault();
		
		let nameRegex = /^([a-zA-Z0-9_-]+([ ]?[a-zA-Z0-9_-]+)?)+$/;
		let passwordRegex = /[ -~]/;
		
		errors.pop();
		if (nameRegex.test(chanName) === false)
			errors.push({key:"name", value:"The channel's name must not contain special characters or whitespaces at the extremities."});
		if (chanPassword !== "" && passwordRegex.test(chanPassword) === false)
			errors.push({key:"password", value:"The password cannot contain non printable characters."});
		if (errors.length === 0)
		{
			// console.log(errors);
			var chanSettings:channelSettings = {
				type: chanType,
				name: (chanType === 1 || chanType === 2) ? chanName : "", 
				password: chanType === 2 ? chanPassword : "",
				otherUserIdForPrivateMessage: 0
			};
			// console.log(chanSettings);
			const submitNewChannel = async () => {
				setIsLoading(true);
				axios.post('/channel', chanSettings)
				.then( res => {
					// console.log ("RES post new chan", res);
					changeChannel(res.data);
					hide(0);
					toggleDisplayList();
					setIsLoading(false);
				})
				.catch (err => {
					console.log(err);
					setIsLoading(false);
				})
			};
			submitNewChannel();
		}
	};
	// ---------- ??
	var chanInfo;
	var chanForm;
	if (chanType === 1)
	{
		chanInfo = "/i\\ This channel will be accessible to everyone.";
		chanForm = <label>
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
	else if (chanType === 2)
	{
		chanInfo = "/i\\ This channel will only be accessible to the members of your choosing or anyone that knows the password.";
		chanForm = <><label>
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
			</label></>
	}
	else
	{
		chanInfo = "/i\\ Start a private conversation with an other member.";
		chanForm = <div id="selectUser">
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

	var errorList = errors.length !== 0 
		? errors.map((error:any) => <div className="errorChanCreation" key={error.key}><i className="fas fa-skull-crossbones"><span>ERROR</span></i>{error.value}</div>)
		: <></>;

	return (
		<div id="addChanWrapper">
			<div id="addChan">
				<p>Choose the channel's type</p>
				<i className="fas fa-times closeIcon" onClick={ () => hide(0) }></i>
				
				<div id="typeChanSelect">
					<div
						className={ chanType === 1 ? "selected" : "" } 
						onClick={ () => { setChanType(1); setErrors([]); }} >
						Public
					</div>
					<div
						className={ chanType === 2 ? "selected" : "" } 
						onClick={ () => { setChanType(2); setErrors([]); }} >
						Private
					</div>
					<div
						className={ chanType === 3 ? "selected" : "" }
						onClick={ () => { setChanType(3); setErrors([]); } } >
						DM
					</div>
				</div>

				<div className="infosChan"> { chanInfo } </div>
				
				<form onSubmit={ handleSubmit }>
					{ chanForm }
					{ errorList }
					<input 
						className={ chanName !== "" ? "readyToSubmit" : "" }
						type="submit" 
						value={ isLoading ? "Loading..." : "Create channel" }
					/>
				</form>

			</div>
		</div>
	)
}

export default CreateChan;