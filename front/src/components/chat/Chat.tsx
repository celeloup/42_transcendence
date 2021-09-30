import WindowBorder from '../ui_components/WindowBorder';
import { useContext, useState, useEffect, EffectCallback } from 'react';
import ChannelList from '../chat/ChannelList';
import { Message } from '../chat/ChannelConversation';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';
import { io } from "socket.io-client";
import '../../styles/Chat.scss';
import axios from 'axios';

function ChatHeader() {
	var { channel, toggleDisplayList } = useContext(ChannelContext) as ContextType;
	var name = channel ? channel.name : "chat_";
	return (
		<div className="window_header chat_header">
			<i className="fas fa-bars header_button" onClick={ toggleDisplayList }></i>
			<div className="header_title">
				<i className="fas fa-user-friends"></i>{ name }
			</div>
			<i className="fas fa-cog header_button"></i>
			{/* <i className="fas fa-comment-alt"></i> */}
		</div>
	)
}

export function Chat() {
	const { user } = useContext(AuthContext) as AuthContextType;
	const [ messages, setMessages ] = useState<any[]>([]);
	const [ newMessage, setNewMessage ] = useState("");

	// ---- DISPLAY
	var { displayList, channel, socket, setSocket } = useContext(ChannelContext) as ContextType;
	
	// ---- SOCKETS
	// var [socket, setSocket] = useState<any>(null);
	useEffect(() : ReturnType<EffectCallback> => {
		const newSocket:any = io(`http://localhost:8080/channel`, { transports: ["websocket"] });
		setSocket(newSocket);
		return () => newSocket.close();
	}, [setSocket]);

	useEffect(() => {
		socket?.on('receive_message', (data:any) => {
			console.log("RECEIVED :", data);
			setMessages(oldArray => [...oldArray, data]);
		})
	}, [socket])
	
	// ---------- GET MESSAGES
	useEffect(() => {
		console.log("CURRENT CHANNEL: ", channel);
		const getMessages = async () => {
			if (channel)
			{
				try {
					const res = await axios.get(`/channel/messages/${channel.id}`);
					console.log("GET MESSAGES", res);
					setMessages(res.data);
				} catch (err) {
					console.log(err);
				}
			}
		};
		getMessages();
		// if (channel)
		// 	socket.emit('join_chan', channel?.id);
	}, [channel])

	const handleSubmit = (e:any) => {
		e.preventDefault();
		const message : any = {
			content: newMessage,
			recipient: channel
		};
		setNewMessage("");
		socket.emit('send_message', message);
		console.log("SENT :", message);
	}

	var messageList;
	// console.log(messages);
	if (messages.length !== 0)
		messageList = messages.map((mes:any) => <Message key={ mes.id } username={ mes.author ? mes.author.name : "empty" } message={ mes.content }/>)
	else
		messageList = <p className="no_chan">No message yet.</p>

	return (
		<WindowBorder w='382px' h='670px'>		
			<div id="chat">
				{ displayList && <ChannelList socket={socket}/> }
				<ChatHeader/>
				<div id="chat_messages">
					<div>
						{/* <div className="chat_date">13/09/2021</div> */}
						{ messageList }
					</div>
				</div>
				<div id="chat_input">
					<i className="fas fa-chevron-right"></i>
					<input 
						type="text"
						id="message_input"
						autoComplete="off"
						onChange={ (e) => setNewMessage(e.target.value) }
						value={ newMessage }></input>
					<i className="fas fa-paper-plane" onClick={ handleSubmit }></i>
				</div>
			</div>
			
		</WindowBorder>
	)
}