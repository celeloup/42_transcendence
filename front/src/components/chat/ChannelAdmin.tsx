import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';
import '../../styles/Chat/ChatAdmin.scss';

type ChannelAdminProps = {
	chanId: number
}

type MemberCardProps = {
	member:any,
	channel:any,
	rights: boolean,
	me?: number
}

function MemberCard ( { member, channel, rights, me } : MemberCardProps) {
	const { name, id } = member;
	const [ admin, setAdmin ] = useState<string>("");
	const [ banned, setBanned ] = useState<string>("");
	const [ muted, setMuted ] = useState<string>("");
	var owner = id === channel.owner.id;

	useEffect(() => {
		channel.admins.some((adm:any) => adm.id === id) ? setAdmin("active") : setAdmin("inactive");
		channel.banned.some((ban:any) => ban.id === id) ? setBanned("active") : setBanned("inactive");
		channel.muted.some((mute:any) => mute.id === id) ? setMuted("active") : setMuted("inactive");
	}, [])

	function adminUpdate(admin:string) {
		if (admin === "inactive")
		{
			setAdmin("loading");
			axios.put(`/channel/admins/${ channel.id }`, { "userId": id })
			.then( res => {
				console.log("RES put admin", res);
				setAdmin("active");
			})
			.catch (err => {
				console.log("Error:", err);
				setAdmin("inactive");
			})
		}
		else {
			setAdmin("loading");
			axios.delete(`/channel/admins/${ channel.id }`, { data: { userId: id}})
			.then( res => {
				console.log("RES delete admin", res);
				setAdmin("inactive");
			})
			.catch (err => {
				console.log("Error:", err);
				setAdmin("active");
			})
		}
	}

	function banUpdate(banned:string) {
		if (banned === "inactive")
		{
			setBanned("loading");
			axios.put(`/channel/ban/${ channel.id }`, { "userId": id })
			.then( res => {
				console.log("RES put ban", res);
				setBanned("active");
			})
			.catch (err => {
				console.log("Error:", err);
				setBanned("inactive");
			})
		}
		else {
			setBanned("loading");
			axios.put(`/channel/unban/${ channel.id }`, { "userId": id })
			.then( res => {
				console.log("RES delete ban", res);
				setBanned("inactive");
			})
			.catch (err => {
				console.log("Error:", err);
				setBanned("active");
			})
		}
	}

	return (
		<div className="member_card">
			<p>{ name }</p>
			<div className="member_status">
				{ rights && id !== me && <>
					{ owner && <i className="fas fa-crown"></i> }
					{ !owner && <i className={ `fas fa-shield-alt action good ${ admin }` } onClick={ () => adminUpdate(admin) }></i> }
					{ !owner && <i className={ `fas fa-user-slash action bad ${ banned }` } onClick={ () => banUpdate(banned) }></i> }
					{ !owner && <i className={ `fas fa-comment-slash action bad ${ muted }` }></i> }
				</>}
				{ (!rights || id === me) && <>
					{ owner && <i className="fas fa-crown"></i> }
					{ !owner && (admin ==="active") && <i className={ `fas fa-shield-alt` }></i> }
					{ !owner &&  (banned ==="active") && <i className={ `fas fa-user-slash` }></i> }
					{ !owner && (muted ==="active") && <i className={ `fas fa-comment-slash` }></i> }
				</>}
			</div>
		</div>
	)
}

export function ChannelAdmin () {
	
	const [ chan, setChan ] = useState<any>(null);
	const [ hasRights, setHasRights ] = useState<boolean>(false);
	var { toggleDisplayAdmin, channel } = useContext(ChannelContext) as ContextType;
	var { user } = useContext(AuthContext) as AuthContextType;
	const [ list, setList ] = useState<string>("members");
	const [ members, setMembers ] = useState<any>(null);
	const [ banned, setBanned ] = useState<any>(null);
	
	useEffect(() => {
		if (channel)
		{
			axios.get(`/channel/infos/${ channel.id }`)
			.then( res => {
				// console.log("RES chan infos", res);
				var admin = res.data.admins.some((adm:any) => adm.id === user?.id) ? true : false;
				setChan(res.data);
				setHasRights(admin);
				var mem = res.data.members.map((m:any) => <MemberCard key={ m.id } member={ m } channel={ res.data } rights={ admin } me={ user?.id} />);
				setMembers(mem);
				var ban = res.data.banned.map((m:any) => <MemberCard key={ m.id } member={ m } channel={ res.data } rights={ admin } me={ user?.id} />);
				setBanned(ban);
			})
			.catch (err => {
				console.log("Error:", err);
			})
		}
	}, []);

	return (
		<div id="channel_admin">
			<i className="fas fa-times close_icon" onClick={ toggleDisplayAdmin }></i>
			<div id="name_description">
				<i className="fas fa-user-friends"></i> { channel?.name }
				<p>This channel is public. Everyone can join it.</p>
			</div>
			<div id="info_members">
				<i className="fas fa-info-circle"></i>
				<div>
					<span><i className="fas fa-crown"></i>Owner</span>
					<span><i className="fas fa-shield-alt"></i>Admin</span>
					<span><i className="fas fa-comment-slash"></i>Muted</span>
					<span><i className="fas fa-user-slash"></i>Banned</span>
				</div>
			</div>
			<div id="lists">
				<div className="tab" onClick={() => setList("members")}>members_</div>
				<div className="tab" onClick={() => setList("banned")}>banned_</div>
				<div id="list">
					{ list === "members" && 
					<div className="member_list">
						{ members ? members : <p>Loading ...</p> }
					</div> }
					{ list === "banned" && 
					<div className="member_list" id="banned_list">
						{ banned ? banned : <p>Loading ...</p> }
						{ banned.length === 0 && <p>No ban user</p> }
					</div> }
				</div>
			</div>
			<div id="add_member_button">
				<i className="fas fa-user-plus"></i>
				Add a member
			</div>
			<div id="leave_button">
				<i className="fas fa-door-closed"></i>
				<i className="fas fa-door-open"></i>
				Leave the channel
			</div>
		</div>
	)
}