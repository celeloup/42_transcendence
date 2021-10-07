import WindowBorder from '../ui_components/WindowBorder';
import { useRef, useContext, useState, useEffect, EffectCallback } from 'react';
import ChannelList from '../chat/ChannelList';
import { ChannelAdmin } from './ChannelAdmin';
import { Message } from './Message';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import { io } from "socket.io-client";
import '../../styles/Chat.scss';
import axios from 'axios';

function ChatHeader() {
	var { channel, toggleDisplayList, toggleDisplayAdmin } = useContext(ChannelContext) as ContextType;
	var name = channel ? channel.name : "chat_";
	return (
		<div className="window_header chat_header">
			<i className="fas fa-bars header_button" onClick={ toggleDisplayList }></i>
			<div className="header_title">
				<i className="fas fa-user-friends"></i>{ name }
			</div>
			<i className="fas fa-cog header_button" onClick={ toggleDisplayAdmin }></i>
			{/* <i className="fas fa-comment-alt"></i> */}
		</div>
	)
}

export function Chat() {
	const [ messages, setMessages ] = useState<any[]>([]);
	const [ newMessage, setNewMessage ] = useState("");
	const [ msgIsLoading, setMsgIsLoading ] = useState(false);
	const [ blockedUsers, setBlockedUsers ] = useState<any[]>([]);
	var { displayList, displayAdmin, channel, socket, setSocket } = useContext(ChannelContext) as ContextType;
	
	// ---------- SOCKETS
	useEffect(() : ReturnType<EffectCallback> => {
		const newSocket:any = io(`http://localhost:8080/channel`, { transports: ["websocket"] });
		setSocket(newSocket);
		return () => newSocket.close();
	}, [setSocket]);

	useEffect(() => {
		socket?.on('receive_message', (data:any) => {
			// console.log("RECEIVED :", data);
			setMessages(oldArray => [...oldArray, data]);
		})
	}, [socket])
	
	
	// ---------- GET MESSAGES
	useEffect(() => {
		// console.log("CURRENT CHANNEL: ", channel);
		if (channel) {
			setMsgIsLoading(true);
			axios.get(`/channel/messages/${channel.id}`)
			.then( res => {
				// console.log("GET MESSAGES", res);
				setMessages(res.data);
				setMsgIsLoading(false);
			})
			.catch (err => {
				console.log("Error:", err);
				setMsgIsLoading(false);
			})
		}
		axios.get(`/users/infos/me`)
			.then( res => {
				// console.log("GET infos me", res);
				setBlockedUsers(res.data.blocked);
			})
			.catch (err => {
				console.log("Error:", err);
			})
	}, [channel])

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
				{ displayList && <ChannelList socket={socket}/> }
				{ displayAdmin && <ChannelAdmin/> }
				<ChatHeader />
				<div id="chat_messages">
					{ channel === null && 
						<div className="no_chan_msg">
							<i className="fas fa-comment-dots"></i><br/>
							Select a channel to start chatting
						</div>
					}
					{ channel && 
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