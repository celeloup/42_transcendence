import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';
import '../../styles/chat/ChatAdmin.scss';
import SearchUser from 'components/ui_components/SearchUser';
import { MemberCard, BannedCard } from './ChannelAdminMemberCard';

type EditPasswordProps = {
	password: string,
	chan: number,
	display: (val:boolean) => void,
	refresh: boolean,
	setRefresh: (val:boolean) => void
}

const EditPassword = ({ password, chan, display, setRefresh, refresh,} : EditPasswordProps) => {
	const [ pass, setPass ] = useState(password);
	const [ typePassword, setTypePassword ] = useState(true);
	const [ isLoading, setIsLoading ] = useState(false);

	const changePass = (passw:string) => {
		setIsLoading(true);
		axios.put(`/channel/password/${ chan }`, { "password": passw })
		.then( res => {
			console.log("RES change password", res);
			setRefresh(!refresh);
			display(false);
		})
		.catch (err => {
			console.log("Error:", err);
			setIsLoading(false);
		})
	}

	const handleSubmit = (e:any) => {
		e.preventDefault();
		let passwordRegex = /[ -~]/;
		if (passwordRegex.test(pass) === false)
			console.log("WRONG");
		else
			changePass(pass);
			// temp_errors.push({key:"password", value:"The password cannot contain non printable characters."});
	}
	return (
		<div id="edit_password_popup">
			<i className="fas fa-times" onClick={ () => display(false) }/>
			[ Add, edit or remove the password. ]
			<form onSubmit={ handleSubmit }>
				<label id="passwordLabel">
					<input
						autoFocus={ true }
						autoComplete="off"
						className={ typePassword ? "passwordInput" : ""} 
						type="text"
						value={ pass }
						onChange={ (e) => setPass(e.target.value) }
					/>
					<i className={ typePassword ? "fas fa-eye-slash" : "fas fa-eye" } onClick={ () => setTypePassword(!typePassword)}></i>
				</label>
				<input 
						className={ (pass !== "" && pass !== password) ? "readyToSubmit" : "" }
						type="submit" 
						value={ isLoading ? "Loading..." : "Submit" }
					/>
			</form>
			{ password !== "" && <div id="remove_password" onClick={ () => { changePass(""); }}><i className="fas fa-trash" />Remove password</div> }
		</div>
	)
}

type AddMemberProps = {
	chan: any,
	display: (val:boolean) => void,
	refresh: boolean,
	setRefresh: (val:boolean) => void
}

const AddMember = ({ chan, display, refresh, setRefresh } : AddMemberProps) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ missingMembers, setMissingMembers ] = useState<any[]>([]);
	const [ user, setUser ] = useState(0);
	const [ error, setError ] = useState<string>("");

	useEffect(() => {
		axios.get(`/users`)
		.then( res => {
			// console.log(res.data);
			setMissingMembers(res.data);
		})
		.catch( err => {
			console.log(err);
		})
	}, []);

	const handleSubmit = () => {
		if (user !== 0)
		{
			setIsLoading(true);
			axios.put(`/channel/members/${ chan.id }`, { "userId": user })
			.then( res => {
				// console.log(res.data);
				if (res.data.message === "User is already a member of this channel") {
					setError("User is already a member of this channel");
					setIsLoading(false);
				}
				else {
					setRefresh(!refresh);
					display(false);
				}
			})
			.catch (err => {
				if (err.response.status === 403)
					setError("You don't have the rights to add this member");
				else if (err.response.status === 404)
					setError("This user doesn't exist");
				console.log("Error:", err);
				setIsLoading(false);
			})
		}
	}

	return (
		<div id="add_member_popup">
			{ error !== "" && <div id="add_member_error"><i className="fas fa-exclamation-triangle" /> { error }</div> }
			<i className="fas fa-times" onClick={ () => display(false) }/>
			[ select a user ]
			<SearchUser theme="yo" list={ missingMembers } select={ setUser }/>
			<div className={ user !== 0 ? "ready" : "" } id="submit" onClick={ handleSubmit }>{ isLoading ? "Loading..." : "Submit" }</div>
		</div>
	)
}

export function ChannelAdmin () {
	var { toggleDisplayAdmin, channel, toggleDisplayList, changeChannel } = useContext(ChannelContext) as ContextType;
	var { user } = useContext(AuthContext) as AuthContextType;
	
	const [ hasRights, setHasRights ] = useState<boolean>(false);
	const [ list, setList ] = useState<string[]>(["members"]);
	const [ members, setMembers ] = useState<any>(null);
	const [ banned, setBanned ] = useState<any>(null);
	const [ refresh, setRefresh ] = useState<boolean>(false);
	const [ ownerID, setOwnerID ] = useState<number>(-1);
	const [ loadingLeave, setLoadingLeave ] = useState(false);
	const [ displayEditPassword, setDisplayEditPassword ] = useState(false);
	const [ password, setPassword ] = useState("");
	const [ displayAddMember, setDisplayAddMember ] = useState(false);
	const [ error, setError ] = useState<string>("");
	
	useEffect(() => {
		if (channel)
		{
			axios.get(`/channel/infos/${ channel.id }`)
			.then( res => {
				setPassword(res.data.password);
				// console.log("RES chan infos", res);
				// ********* SET MEMBERS LIST
				var memb = res.data.members.map( (m:any) => {
					return( {
						id: m.id,
						name: m.name,
						owner: m.id === res.data.owner.id,
						site_admin: (m.site_owner || m.site_moderator),
						admin: res.data.admins.some((adm:any) => adm.id === m.id) ? true : false,
						banned: res.data.banned.some((ban:any) => ban.id === m.id) ? true : false,
						muted: res.data.muted.some((mut:any) => mut.id === m.id) ? true : false,
						me: user?.id
					});
				})
				// console.log(memb);
				memb.sort((a:any, b:any) => {
					if (a.owner || b.owner)
						return (1)
					if ((a.admin || a.site_admin) && (b.admin || b.site_admin))
					{
						if ((a.admin && b.admin) || (a.site_admin && b.site_admin))
							return 0;
						else if (a.admin && b.site_admin)
							return 1;
						else return -1
					}
					else if ((a.admin || a.site_admin) && !(b.admin || b.site_admin))
						return -1;
					else
						return 1;
				});
				setMembers(memb);
				setOwnerID(res.data.owner.id);

				// ********* SET BANNED LIST
				var ban = res.data.banned.map((b:any) => {
					return({
						id: b.id,
						name: b.name
					})
				})
				setBanned(ban);

				// ******* HAS RIGHTS TO SEE STUFF
				var admin = res.data.admins.some((adm:any) => adm.id === user?.id) ? true : false;
				if (res.data.type !== 3 && (user?.site_owner === true || user?.site_moderator === true || admin === true))
					admin = true;
				else
					admin = false;
				setHasRights(admin);
				if (admin && res.data.banned.length !== 0)
					setList(["members", "banned"]);
			})
			.catch (err => {
				console.log("Error:", err);
			})
		}
	}, [refresh]); // eslint-disable-line

	function leave_chan() {
		if (channel && !loadingLeave)
		{
			setLoadingLeave(true);
			axios.put(`/channel/leave/${ channel.id }`, { "id": channel.id })
			.then( res => {
				// console.log(res);
				toggleDisplayAdmin();
				toggleDisplayList();
				changeChannel(null);
			})
			.catch (err => {
				setLoadingLeave(false);
				console.log(err);
			})
		}
	}

	var description;
	if (channel && channel.type === 1)
		description = "This channel is public. Everyone can join it.";
	else if (channel && channel.type === 2 && password === "")
		description = "This channel is private. Nobody except the added members can see this channel. Add a password to make it visible to everyone and restrict access.";
	else if (channel && channel.type === 2 && password !== "")
		description = "This channel is private. Everyone can try to access it by providing a password. Remove the password to hide the channel to any non-member."
	else
		description = "This is a private conversation. Only you and your correspondant can see it."
	
	var name;
	if (channel && channel.type !== 3)
		name = channel.name;
	else if (channel && channel.type === 3)
		name = channel.members[0].id === user?.id ? channel.members[1].name : channel.members[0].name

	return (
		<div id="channel_admin">
			{ channel && displayEditPassword && 
				<div id="card_modal" onClick={ (e:any) => { if (e.target.id === "card_modal") setDisplayEditPassword(false)}}>
				<EditPassword
					password={ password }
					chan={ channel.id }
					display={ setDisplayEditPassword }
					refresh={ refresh }
					setRefresh={ setRefresh }
				/>
				</div>
			}
			{ channel && displayAddMember &&
				<div id="card_modal" onClick={ (e:any) => { if (e.target.id === "card_modal") setDisplayAddMember(false)}}>
				<AddMember
					chan={ channel }
					display={ setDisplayAddMember }
					refresh={ refresh }
					setRefresh={ setRefresh }
				/>
				</div>
			}
			<i className="fas fa-times close_icon" onClick={ toggleDisplayAdmin }></i>
			<div id="name_description">
				<i className="fas fa-user-friends"></i> { name }
				<p>{ description }</p>
			</div>
			{ error !== "" && 
				<div id="error">
					<i className="fas fa-exclamation-triangle" /> { error }<i className="fas fa-times" onClick={ () => setError("") }/>
				</div>
			}
			<div id="info_members" style={ channel?.type === 3 ? {"marginTop": "30px"} : {} }>
				<i className="fas fa-info-circle"></i>
				<div>
					<span><i className="fas fa-crown"></i>Owner</span>
					<span><i className="fas fa-user-shield"></i>Site admin</span>
					<span><i className="fas fa-shield-alt"></i>Admin</span>
					<span><i className="fas fa-comment-slash"></i>Muted</span>
					<span><i className="fas fa-user-slash"></i>Banned</span>
				</div>
			</div>
			<div id="lists" style={ channel?.type === 3 ? {"marginTop": "30px"} : {} }>
				<div className="tab" onClick={() => setList(["members", "banned"])}>members_</div>
				{ (list[1] === "banned" || list[0] === "banned") && 
					<div className="tab" onClick={() => setList(["banned", "members"])}>banned_</div> }
				<div id="list">
					{ list[0] === "members" && 
					<div className="member_list">
						{ members
							? members.map((m:any) => 
								<MemberCard 
									key={ m.id }
									hasRights={ hasRights}
									member={ m }
									channelID={ channel?.id }
									ownerID={ ownerID }
									setRefresh={ setRefresh }
									refresh={ refresh }
									setError={ setError }/>)
							: <p>Loading ...</p> }
					</div> }
					{ hasRights && list[0] === "banned" && 
					<div className="member_list" id="banned_list">
						{ banned
							? ( banned.length !== 0 ? 
								banned.map((m:any) => 
									<BannedCard
										key={ m.id }
										banMember={ m }
										setRefresh={ setRefresh }
										refresh={ refresh }
										channelID={ channel?.id }
										setError={ setError }/>) 
								: <p>No banned user</p> )
							: <p>Loading ...</p> }
					</div> }
				</div>
			</div>
			{ channel?.type === 2 && hasRights &&
				<div id="add_member_button" onClick={ () => setDisplayAddMember(true) }>
					<i className="fas fa-user-plus" />
					Add a member
				</div>
			}
			{ channel?.type === 2 && user?.id === ownerID && 
				<div id="password_button" onClick={ () => setDisplayEditPassword(true) }>
					<i className="fas fa-key" />
					{ password ? "Edit password" : "Add a password" }
				</div>
			}
			<div id="leave_button" onClick={ leave_chan } >
				<i className="fas fa-door-closed" />
				<i className="fas fa-door-open" />
				{ loadingLeave ? "Loading..." : "Leave the channel" }
			</div>
		</div>
	)
}