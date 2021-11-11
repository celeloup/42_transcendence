import { useEffect, useContext, useState } from 'react';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import axios from 'axios';

type Member = {
	id: number,
	name: string,
	owner: boolean,
	site_admin: boolean,
	admin: boolean,
	banned: boolean,
	muted: boolean,
	me: number
}

type MemberCardProps = {
	hasRights: boolean,
	member:Member,
	channelID?: number,
	setRefresh: (val:boolean) => void,
	refresh: boolean,
	ownerID: number,
	setError: (val:string) => void
}

type BannedCardProps = {
	banMember: any,
	refresh: boolean,
	setRefresh: (val:boolean) => void,
	channelID?: number,
	setError: (val:string) => void
}

export function BannedCard({ banMember, refresh, setRefresh, channelID, setError } : BannedCardProps) {

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
				setError("You don't have the rights to perform this action !");
				// console.log("You don't have the rights to perform this action !");
				setRefresh(!refresh);
			}
			else if (err.response.status === 404)
			{
				setError("No current banned user correspond to this user..")
				// console.log("No current banned user correspond to this user..")
				setRefresh(!refresh);
			}
			else {
				console.log("Error:", err);
				setBanState("");
			}
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

export function MemberCard ( { member, channelID, setRefresh, refresh, hasRights, ownerID, setError } : MemberCardProps) {
	var { socket } = useContext(ChannelContext) as ContextType;
	const { name, id, admin, site_admin, banned, muted, me, owner } = member;
	const [ adminState, setAdminState ] = useState<string>("");
	const [ bannedState, setBannedState ] = useState<string>("");
	const [ mutedState, setMutedState ] = useState<string>("");
	const [ mutePopup, setMutePopup ] = useState(false);
	// const [ error, setError ] = useState("You don't have the rights to perform this action !");

	useEffect(() => {
		let mounted = true;

		if (mounted) {
			admin ? setAdminState("active") : setAdminState("inactive");
			banned ? setBannedState("active") : setBannedState("inactive");
			muted ? setMutedState("active") : setMutedState("inactive");
		}

		return () => { mounted = false };
	}, [admin, banned, muted])

	function adminUpdate(admin:string) {
		if (admin === "inactive")
		{
			setError("");
			setAdminState("loading");
			axios.put(`/channel/admins/${ channelID }`, { "userId": id })
			.then( res => {
				// console.log("RES put admin", res);
				setAdminState("active");
			})
			.catch (err => {
				if (err.response.status === 403)
				{
					setError("You don't have the rights to perform this action !");
					// console.log("You don't have the rights to perform this action !");
					setRefresh(!refresh);
				}
				else if (err.response.status === 404)
				{
					setError("This user is not in the channel.")
					// console.log("This user is not in the channel.")
					setRefresh(!refresh);
				}
				else {
					console.log("Error:", err);
					setAdminState("active");
				}
			})
		}
		else {
			setError("");
			setAdminState("loading");
			axios.delete(`/channel/admins/${ channelID }`, { data: { userId: id}})
			.then( res => {
				// console.log("RES delete admin", res);
				setAdminState("inactive");
			})
			.catch (err => {
				if (err.response.status === 403)
				{
					setError("You don't have the rights to perform this action !");
					// console.log("You don't have the rights to perform this action !");
					setRefresh(!refresh);
				}
				else if (err.response.status === 404)
				{
					setError("This user is not an admin.")
					// console.log("This user is not an admin.")
					setRefresh(!refresh);
				}
				else {
					console.log("Error:", err);
					setAdminState("active");
				}
			})
		}
	}

	function banUpdate(banned:string) {
		if (banned === "inactive")
		{
			setError("");
			setBannedState("loading");
			axios.put(`/channel/ban/${ channelID }`, { "userId": id })
			.then( res => {
				// console.log("RES put ban", res);
				socket.emit("ban_user", {channelID: channelID, memberID: id});
				setRefresh(!refresh);
				// setBannedState("active");
			})
			.catch (err => {
				if (err.response.status === 403)
				{
					setError("You don't have the rights to perform this action !");
					// console.log("You don't have the rights to perform this action !");
					setRefresh(!refresh);
				}
				else if (err.response.status === 404)
				{
					setError("This user is not in the channel.")
					// console.log("This user is not in the channel.")
					setRefresh(!refresh);
				}
				else {
					console.log("Error:", err);
					setBannedState("inactive");
				}
			})
		}
	}

	function muteUpdate(muted:string, time:number) {
		if (muted === "inactive")
		{
			setMutedState("loading");
			setMutePopup(false);
			setError("");
			axios.put(`/channel/mute/${ channelID }`, { "userId": id, "timeInMilliseconds": time })
			.then( res => {
				// console.log("RES put mute", res);
				socket.emit("mute_user", {channelID: channelID, memberID: id});
				setRefresh(!refresh);
				setMutedState("active");
			})
			.catch (err => {
				if (err.response.status === 403)
				{
					setError("You don't have the rights to perform this action !");
					// console.log("You don't have the rights to perform this action !");
					setRefresh(!refresh);
				}
				else if (err.response.status === 404)
				{
					setError("This user is not in the channel.")
					// console.log("This user is not in the channel.")
					setRefresh(!refresh);
				}
				console.log("Error:", err);
				setMutedState("inactive");
			})
		}
		else {
			setMutedState("loading");
			setMutePopup(false);
			setError("");
			axios.put(`/channel/unmute/${ channelID }`, { "userId": id })
			.then( res => {
				// console.log("RES unmute", res);
				socket.emit("unmute_user", {channelID: channelID, memberID: id});
				setRefresh(!refresh);
				setMutedState("inactive");
			})
			.catch (err => {
				if (err.response.status === 403)
				{
					setError("You don't have the rights to perform this action !");
					// console.log("You don't have the rights to perform this action !");
					setRefresh(!refresh);
				}
				else if (err.response.status === 404)
				{
					setRefresh(!refresh);
					setMutedState("inactive");
					// console.log("This user is not muted.");
					setError("This user is not muted.");
				}
				else {
					console.log("Error:", err);
				}
			})
		}
	}

	return (
		<div className="member_card">
			
			{ mutePopup && 
				<div id="card_modal" onClick={ (e:any) => { if (e.target.id === "card_modal") setMutePopup(false)}}>
					<div id="mute_popup">
						<i className="fas fa-times" onClick={ () => setMutePopup(false) }/>
						<div id="time_options">
							<div onClick={ () => muteUpdate(mutedState, 60000) }>1 min</div>
							<div onClick={ () => muteUpdate(mutedState, 300000) }>5 min</div>
							<div onClick={ () => muteUpdate(mutedState, 31536000000) }>forever</div>
						</div>
					</div>
				</div>
			}
			<p>{ name }</p>
			<div className="member_status">
				{ hasRights && id !== me && !site_admin &&<>
					{ owner && <i className="fas fa-crown" /> }
					{ !owner && <>
						<i className={ `fas fa-shield-alt ${ adminState } ` + ((adminState === "inactive") || (me === ownerID) ? `action good ` : "") } onClick={ () => adminUpdate(adminState) } />
						<i className={ `fas fa-user-slash action bad ${ bannedState }` } onClick={ () => banUpdate(bannedState) } />
						<i className={ `fas fa-comment-slash action bad ${ mutedState }` } onClick={ () => mutedState === "active" ? muteUpdate(mutedState, 0) : setMutePopup(true) } />
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