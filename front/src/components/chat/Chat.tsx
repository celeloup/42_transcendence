import WindowBorder from '../ui_components/WindowBorder';
import { useRef, useContext, useState, useEffect, EffectCallback } from 'react';
import ChannelList from '../chat/ChannelList';
import { ChannelAdmin } from './ChannelAdmin';
import { Message } from './Message';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';
import { io } from "socket.io-client";
import '../../styles/chat/Chat.scss';
import axios from 'axios';

type BanPopUpProps = {
	channel: string,
	close: (val:number) => void
}

function BanPopup({ channel, close } : BanPopUpProps) {
	return (
		<div id="ban_pop_up">
			<i className="fas fa-book-dead" />
			<p>You have been banned from <span className="chan" >{ channel }</span>. <br/>Shame on you.<br/>You can no longer join again until an admin forgives your sins and unban you.</p>
			<div id="back_button" onClick={ () => close(-1) }><i className="fas fa-arrow-left" />go back</div>
		</div>
	)
}


type AskPasswordProps = {
	channel: string,
	chanID: number,
	socket: any,
	setAskPassword: (val:boolean) => void
}

function AskPassword({ channel, chanID, socket, setAskPassword } : AskPasswordProps) {
	const [ typePassword, setTypePassword ] = useState(true);
	const [ chanPassword, setChanPassword ] = useState<string>("");
	const [ isLoading, setIsLoading ] = useState(false);
	const [ imsg, setimsg ] = useState(-1);

	var erroMsg = ["Wrong password.", "Nope.", "Try again.", "Want a hint ?", "You really suck at it.", "Just give up."];

	const handleSubmit = (e:any) => {
		e.preventDefault();
		setIsLoading(true);
		console.log(chanPassword);
		axios.put(`/channel/join/${ chanID }`, { "password": chanPassword })
		.then( res => {
			socket.emit('join_chan', chanID);
			setAskPassword(false);
		})
		.catch (err => {
			setimsg(imsg + 1);
			setIsLoading(false);
			console.log("Error:", err);
		})
	}

	return (
		<div id="ask_password">
			{ imsg !== -1 && <div id="error_msg"><i className="fas fa-exclamation-triangle" />{ erroMsg[imsg < 6 ? imsg : 0 ] }</div> }
			<span className="chan" >{ channel }</span> is a private channel and requires a password to join.
			<form onSubmit={ handleSubmit }>
				<label id="passwordLabel">
					<input
						autoFocus={ true }
						autoComplete="off"
						className={ typePassword ? "passwordInput" : ""} 
						type="text"
						value={ chanPassword }
						onChange={ (e) => setChanPassword(e.target.value) }
					/>
					<i className={ typePassword ? "fas fa-eye-slash" : "fas fa-eye" } onClick={ () => setTypePassword(!typePassword)}></i>
				</label>
				<input 
						className={ chanPassword !== "" ? "readyToSubmit" : "" }
						type="submit" 
						value={ isLoading ? "Loading..." : "Submit" }
					/>
			</form>
		</div>
	)
}

type ChatHeaderProps = {
	hasBeenBanned: Number,
	askPassword: boolean
}

function ChatHeader({ hasBeenBanned, askPassword} : ChatHeaderProps) {
	var { channel, toggleDisplayList, toggleDisplayAdmin } = useContext(ChannelContext) as ContextType;
	var { user } = useContext(AuthContext) as AuthContextType;

	var name;
	if (channel && channel.type !== 3)
		name = channel.name;
	else if (channel && channel.type === 3)
		name = channel.members[0].id === user?.id ? channel.members[1].name : channel.members[0].name
	else
		name = "chat_";
		
	return (
		<div className="window_header chat_header">
			<i className="fas fa-bars header_button" onClick={ toggleDisplayList }></i>
			<div className="header_title">
				<i className="fas fa-user-friends"></i>{ name }
			</div>
			{ channel && !askPassword && hasBeenBanned !== channel.id && <i className="fas fa-cog header_button" onClick={ toggleDisplayAdmin }></i> }
		</div>
	)
}

export function Chat() {
	const [ messages, setMessages ] = useState<any[]>([]);
	const [ newMessage, setNewMessage ] = useState("");
	const [ msgIsLoading, setMsgIsLoading ] = useState(false);
	const [ blockedUsers, setBlockedUsers ] = useState<any[]>([]);
	var { displayList, displayAdmin, channel, socket, setSocket, setChannel, setDisplayList, toggleDisplayAdmin } = useContext(ChannelContext) as ContextType;
	var { user } = useContext(AuthContext) as AuthContextType;
	const [ hasBeenBanned, setHasBeenBanned ] = useState<Number>(-1);
	const [ askPassword, setAskPassword ] = useState(false);
	const { masterSocket } = useContext(AuthContext) as AuthContextType;
	const [ usersOnline, setUsersOnline ] = useState<any[]>([]);
	const [ usersPlaying, setUsersPlaying ] = useState<any[]>([]);

	const joinChan = () => {
		axios.put(`/channel/join/${ channel?.id }`, { "password": "" })
		.then( res => {
			socket.emit('join_chan', channel?.id);
		})
		.catch (err => {
			console.log("Error:", err);
		})
	}

	useEffect(() => {
		let mounted = true;

		// select first channel if exist
		if (!channel)
		{
			axios.get(`/channel/1`)
			.then((res) => {
				if (mounted) {
					setChannel(res.data);
				}
			})
			.catch((err) => console.log(err))
		}

		return () => { mounted = false };
	}, [])  // eslint-disable-line
	
	// ---------- SOCKETS
	useEffect(() : ReturnType<EffectCallback> => {
		let mounted = true;
		const newSocket:any = io(`${process.env.REACT_APP_BACK_URL}/channel`, { transports: ["websocket"] });
		if (mounted)
			setSocket(newSocket);
		return () => { mounted = false; newSocket.close() };
	}, [setSocket]);

	useEffect(() => {
		let mounted = true;

		socket?.on('receive_message', (data:any) => {
			// console.log("RECEIVED :", data);
			if (mounted) {
				setMessages(oldArray => [...oldArray, data]);
			}
		});

		socket?.on('room_join', (data:any) => {
			// console.log("JOINED ROOM", data, channel);
			if (mounted) {
				setDisplayList(false);
				setMsgIsLoading(true);
			}
			axios.get(`/channel/messages/${ data }`)
			.then( res => {
				// console.log("GET MESSAGES", res);
				if (mounted) {
					setMessages(res.data);
					setMsgIsLoading(false);
				}
			})
			.catch (err => {
				console.log("Error:", err);
				if (mounted) {
					setMsgIsLoading(false);
				}
			})
		});
		
		socket?.on('user_banned', (data:any) => {
			console.log("I HAVE BEEN BANNED", data, channel);
			if (mounted) {
				setHasBeenBanned(data);
			}
		})

		socket?.on('user_muted', (data:any) => {
			console.log("I HAVE BEEN MUTED", data, channel);
			// setHasBeenBanned(data);
		})

		socket?.on('user_unmuted', (data:any) => {
			console.log("I HAVE BEEN UNMUTED", data, channel);
			// setHasBeenBanned(data);
		})

		return () => { mounted = false };
	}, [socket]) // eslint-disable-line

	useEffect(() => {
		// console.log(channel);
		if (hasBeenBanned !== -1 && channel && channel.id === hasBeenBanned)
		{
			// console.log(channel?.id, data);
			if (displayAdmin)
				toggleDisplayAdmin();
			socket.emit('leave_chan', channel.id);
		}
	}, [hasBeenBanned]) // eslint-disable-line
	
	// ---------- JOIN && GET BLOCKED USERS
	useEffect(() => {
		let mounted = true;

		if (mounted) {
			setAskPassword(false);
			setHasBeenBanned(-1);
		}
		if (channel)
		{
			axios.get(`/channel/infos/${ channel.id }`)
			.then( res => {
				// console.log(res);
				var banned = res.data.banned.some((ban:any) => ban.id === user?.id) ? true : false;
				var member = res.data.members.some((mem:any) => mem.id === user?.id) ? true : false;
				if (banned)
				{
					if (mounted && channel)
						setHasBeenBanned(channel.id);
				}
				if (!member)
				{
					if (mounted && (user?.site_owner || user?.site_moderator))
						joinChan();
					else if (mounted && channel && channel.type === 1)
						joinChan();
					else if (mounted && channel && channel.type === 2)
						setAskPassword(true);
				}
				else
					socket.emit('join_chan', channel?.id);
			})
			.catch (err => {
				console.log("Error:", err);
			})
		}
		if (mounted) {
			setMsgIsLoading(true);
		}
		
		axios.get(`/users/infos/me`)
			.then( res => {
				// console.log("GET infos me", res);
				if (mounted) {
					setBlockedUsers(res.data.blocked);
				}
			})
			.catch (err => {
				console.log("Error:", err);
			})

		return () => { mounted = false };
	}, [channel]) // eslint-disable-line

	// ----------- USERS ONLINE
	useEffect(() => {
		let mounted = true;

		masterSocket?.emit("get_users");
		masterSocket?.on("connected_users", (data : any) => {
			// console.log(data);
			if (mounted) {
				setUsersOnline(data);
			}
		});

		masterSocket?.on("connected_users", (onlineList : any, playingList : any) => {
			if (mounted) {
				setUsersOnline(onlineList);
				setUsersPlaying(playingList);
			}
		});

		return () => { mounted = false };
	}, [masterSocket]);

	const closeBan = () => {
		setHasBeenBanned(-1);
		setChannel(null);
		setDisplayList(true);
	}

	// ---------- SCROLL
	const messagesEndRef = useRef<any>(null);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}
	useEffect(() => {
		scrollToBottom();
	}, [messages])


	// ---------- SUBMIT MESSAGE
	const inputRef = useRef<any>(null);
	const handleSubmit = (e:any) => {
		e.preventDefault();
		if (newMessage !== "" && channel !== null)
		{
			const message : any = {
				content: newMessage,
				recipient: channel
			};
			setNewMessage("");
			socket.emit('send_message', message);
			// console.log("SENT :", message);
			inputRef.current?.focus();
		}
	}

	// ---------- MESSAGE LIST
	var messageList;
	if (messages.length !== 0) {
		// console.log(test);
		messageList = messages.map((mes:any) =>
			<Message 
			key={ mes.id }
			id={ mes.author.id }
			online={ usersOnline.includes(mes.author.id) }
			playing={ usersPlaying.includes(mes.author.id) }
			username={ mes.author.name }
			message={ mes.content }
			setBlockedUsers={ setBlockedUsers }
			blocked={ blockedUsers.find((x:any) => x.id === mes.author.id) !== undefined ? true : false } />)
	}
	else
		messageList = <p className="no_msg">No message yet.</p>

	return (
		<WindowBorder w='382px' h='670px'>
			<div id="chat">
				{ displayList && <ChannelList/> }
				{ displayAdmin && <ChannelAdmin/> }
				<ChatHeader hasBeenBanned={ hasBeenBanned } askPassword={ askPassword }/>
				{ channel && hasBeenBanned === channel.id && <BanPopup channel={ channel ? channel.name : "" } close={ closeBan }/> }
				{ channel && askPassword && <AskPassword channel={ channel.name } chanID={ channel.id } socket={ socket } setAskPassword={ setAskPassword }/> }
				<div id="chat_messages">
					{ channel === null && 
						<div className="no_chan_msg">
							<i className="fas fa-comment-dots"></i><br/>
							Select a channel to start chatting
						</div>
					}
					{ channel && !askPassword && hasBeenBanned === -1 &&
						<div>
							{ msgIsLoading ? "Loading..." : messageList }
							<div ref={messagesEndRef} />
						</div>
					}
				</div>
				<div id="chat_input" className={ channel === null ? "disabled" : ""}>
					<i className="fas fa-chevron-right"></i>
					<form onSubmit={ handleSubmit }>
						<input 
							type="text"
							autoFocus={true}
							id="message_input"
							autoComplete="off"
							onChange={ (e) => setNewMessage(e.target.value) }
							value={ newMessage }
							ref={inputRef}
							disabled={ channel === null ? true : false }
						>
						</input>
					<i className="fas fa-paper-plane" onClick={ handleSubmit }></i>
					</form>
				</div>
			</div>
		</WindowBorder>
	)
}