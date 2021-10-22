import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';
import '../../styles/Chat/ChatAdmin.scss';
import { Socket } from 'socket.io-client';

type Member = {
	id: number,
	name: string,
	owner: boolean,
	site_admin: boolean,
	admin: boolean,
	banned: boolean,
	muted: boolean,
	me: number,
	full_member: any
}

type MemberCardProps = {
	hasRights: boolean,
	member:Member,
	channelID?: number,
	setRefresh: (val:boolean) => void,
	refresh: boolean,
	ownerID: number
}

type BannedCardProps = {
	banMember: any,
	refresh: boolean,
	setRefresh: (val:boolean) => void,
	channelID?: number
}

function BannedCard({ banMember, refresh, setRefresh, channelID } : BannedCardProps) {

	const [ banState, setBanState ] = useState("active");
	const { name, id } = banMember;

	function unban(){
		setBanState("loading");
		axios.put(`/channel/unban/${ channelID }`, { "userId": id })
		.then( res => {
			// console.log("RES delete ban", res);
			setRefresh(!refresh);
			setBanState("");
		})
		.catch (err => {
			if (err.response.status === 403)
			{
				console.log("You don't have the rights to perform this action !");
				setRefresh(!refresh);
			}
			else if (err.response.status === 404)
			{
				console.log("No current banned user correspond to this user.");
				setRefresh(!refresh);
			}
			console.log("Error:", err);
			setBanState("");
		})
	}

	return (
		<div className="member_card">
			<p>{ name }</p>
			<div className="member_status">
				<span onClick={ unban } className="unban_button"><i className={ `fas fa-user-slash ${ banState }` } />unban</span>
			</div>
		</div>
	)
}

function MemberCard ( { member, channelID, setRefresh, refresh, hasRights, ownerID } : MemberCardProps) {
	var { socket, channel } = useContext(ChannelContext) as ContextType;
	const { name, id, admin, site_admin, banned, muted, me, owner, full_member } = member;
	const [ adminState, setAdminState ] = useState<string>("");
	const [ bannedState, setBannedState ] = useState<string>("");
	const [ mutedState, setMutedState ] = useState<string>("");

	useEffect(() => {
		admin ? setAdminState("active") : setAdminState("inactive");
		banned ? setBannedState("active") : setBannedState("inactive");
		muted ? setMutedState("active") : setMutedState("inactive");
	}, [admin, banned, muted])

	function adminUpdate(admin:string) {
		if (admin === "inactive")
		{
			setAdminState("loading");
			axios.put(`/channel/admins/${ channelID }`, { "userId": id })
			.then( res => {
				// console.log("RES put admin", res);
				setAdminState("active");
			})
			.catch (err => {
				if (err.response.status === 403)
				{
					console.log("You don't have the rights to perform this action !");
					setRefresh(!refresh);
				}
				else
					console.log("Error:", err);
				setAdminState("inactive");
			})
		}
		else {
			setAdminState("loading");
			axios.delete(`/channel/admins/${ channelID }`, { data: { userId: id}})
			.then( res => {
				// console.log("RES delete admin", res);
				setAdminState("inactive");
			})
			.catch (err => {
				if (err.response.status === 403)
				{
					console.log("You don't have the rights to perform this action !");
					setRefresh(!refresh);
				}
				console.log("Error:", err);
				setAdminState("active");
			})
		}
	}

	function banUpdate(banned:string) {
		if (banned === "inactive")
		{
			setBannedState("loading");
			axios.put(`/channel/ban/${ channelID }`, { "userId": id })
			.then( res => {
				// console.log("RES put ban", res);
				socket.emit("ban_user", {channelID: channelID, memberID: id});
				setRefresh(!refresh);
				setBannedState("active");
			})
			.catch (err => {
				if (err.response.status === 403)
				{
					console.log("You don't have the rights to perform this action !");
					setRefresh(!refresh);
				}
				else if (err.response.status === 404)
				{
					console.log("This user is not a member of the channel.")
					setRefresh(!refresh);
				}
				console.log("Error:", err);
				setBannedState("inactive");
			})
		}
		// else {
		// 	setBannedState("loading");
		// 	axios.put(`/channel/unban/${ channelID }`, { "userId": id })
		// 	.then( res => {
		// 		console.log("RES delete ban", res);
		// 		setRefresh(!refresh);
		// 		setBannedState("inactive");
		// 	})
		// 	.catch (err => {
		// 		if (err.response.status === 403)
		// 		{
		// 			console.log("You don't have the rights to perform this action !");
		// 			setRefresh(!refresh);
		// 		}
		// 		console.log("Error:", err);
		// 		setBannedState("active");
		// 	})
		// }
	}

	return (
		<div className="member_card">
			<p>{ name }</p>
			<div className="member_status">
				{ hasRights && id !== me && !site_admin &&<>
					{ owner && <i className="fas fa-crown" /> }
					{ !owner && <>
						<i className={ `fas fa-shield-alt ${ adminState } ` + ((adminState === "inactive") || (me === ownerID) ? `action good ` : "") } onClick={ () => adminUpdate(adminState) } />
						<i className={ `fas fa-user-slash action bad ${ bannedState }` } onClick={ () => banUpdate(bannedState) } />
						<i className={ `fas fa-comment-slash action bad ${ mutedState }` } />
					</>}
				</>}
				{ (!hasRights || id === me) && <>
					{ owner && <i className="fas fa-crown" /> }
					{ !owner && (adminState ==="active") && <i className={ `fas fa-shield-alt` } /> }
					{ !owner &&  (bannedState ==="active") && <i className={ `fas fa-user-slash` } /> }
					{ !owner && (mutedState ==="active") && <i className={ `fas fa-comment-slash` } /> }
				</>}
				{ site_admin && <i className="fas fa-user-shield" /> }
			</div>
		</div>
	)
}

export function ChannelAdmin () {
	const [ hasRights, setHasRights ] = useState<boolean>(false);
	var { toggleDisplayAdmin, channel, socket, toggleDisplayList, changeChannel } = useContext(ChannelContext) as ContextType;
	var { user } = useContext(AuthContext) as AuthContextType;
	const [ list, setList ] = useState<string[]>(["members"]);
	const [ members, setMembers ] = useState<any>(null);
	const [ banned, setBanned ] = useState<any>(null);
	const [ refresh, setRefresh ] = useState<boolean>(false);
	const [ ownerID, setOwnerID ] = useState<number>(-1);
	const [ loadingLeave, setLoadingLeave ] = useState(false);
	
	useEffect(() => {
		if (channel)
		{
			axios.get(`/channel/infos/${ channel.id }`)
			.then( res => {
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
						me: user?.id,
						full_member: m
					});
				})
				// console.log(memb);
				memb.sort((a:Member, b:Member) => {
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
				if (user?.site_owner === true || user?.site_moderator === true || admin === true)
					admin = true;
				setHasRights(admin);
				if (admin && res.data.banned.length !== 0)
					setList(["members", "banned"]);
			})
			.catch (err => {
				console.log("Error:", err);
			})
		}
	}, [refresh]);

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
					<span><i className="fas fa-user-shield"></i>Site admin</span>
					<span><i className="fas fa-shield-alt"></i>Admin</span>
					<span><i className="fas fa-comment-slash"></i>Muted</span>
					<span><i className="fas fa-user-slash"></i>Banned</span>
				</div>
			</div>
			<div id="lists">
				<div className="tab" onClick={() => setList(["members", "banned"])}>members_</div>
				{ (list[1] === "banned" || list[0] === "banned") && 
					<div className="tab" onClick={() => setList(["banned", "members"])}>banned_</div> }
				<div id="list">
					{ list[0] === "members" && 
					<div className="member_list">
						{ members
							? members.map((m:any) => <MemberCard key={ m.id } hasRights={ hasRights} member={ m } channelID={ channel?.id } ownerID={ ownerID } setRefresh={ setRefresh } refresh={ refresh }/>)
							: <p>Loading ...</p> }
					</div> }
					{ hasRights && list[0] === "banned" && 
					<div className="member_list" id="banned_list">
						{ banned
							? ( banned.length !== 0 ? 
								banned.map((m:any) => <BannedCard key={ m.id } banMember={ m } setRefresh={ setRefresh } refresh={ refresh } channelID={ channel?.id }/>) 
								: <p>No banned user</p> )
							: <p>Loading ...</p> }
					</div> }
				</div>
			</div>
			<div id="add_member_button">
				<i className="fas fa-user-plus"></i>
				Add a member
			</div>
			<div id="leave_button" onClick={ leave_chan } >
				<i className="fas fa-door-closed"></i>
				<i className="fas fa-door-open"></i>
				{ loadingLeave ? "Loading..." : "Leave the channel" }
			</div>
		</div>
	)
}