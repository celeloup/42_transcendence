import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import '../../styles/ChatAdmin.scss';

type ChannelAdminProps = {
	chanId: number
}

type MemberCardProps = {
	member:any,
	channel:any
}

function MemberCard ( { member, channel } : MemberCardProps) {
	const { name, id } = member;

	var owner = id === channel.owner.id;
	var admin = channel.admins.some((adm:any) => adm[id] === id) ? "active" : "inactive";
	var banned = channel.banned.some((ban:any) => ban[id] === id) ? "active" : "inactive";
	var muted = channel.muted.some((mute:any) => mute[id] === id) ? "active" : "inactive";

	return (
		<div className="member_card">
			{ name }
			<div className="member_status">
				{ owner && <i className="fas fa-crown"></i> }
				{ !owner && <i className={ `fas fa-shield-alt action good ${ admin }` }></i> }
				{ !owner && <i className={ `fas fa-user-slash action bad ${ banned }` }></i> }
				{ !owner && <i className={ `fas fa-comment-slash action bad ${ muted }` }></i> }
			</div>
		</div>
	)
}

export function ChannelAdmin () {
	
	const [ chan, setChan ] = useState<any>(null);
	var { toggleDisplayAdmin, channel } = useContext(ChannelContext) as ContextType;
	
	useEffect(() => {
		if (channel)
		{
			axios.get(`/channel/infos/${ channel.id }`)
			.then( res => {
				// console.log("RES chan infos", res);
				setChan(res.data);
			})
			.catch (err => {
				console.log("Error:", err);
			})
		}
	}, []);

	var members;
	if (chan)
		members = chan.members.map((m:any) => <MemberCard key={ m.id } member={ m } channel={ chan }/>);
	else
		members = <p>Loading...</p>

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
			<div id="member_list">
				{ members }
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