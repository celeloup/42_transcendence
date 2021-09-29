import WindowBorder from '../ui_components/WindowBorder';
import { useContext, useState, useEffect } from 'react';
import ChannelList from '../chat/ChannelList';
import { Message } from '../chat/ChannelConversation';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import { io } from "socket.io-client";
import '../../styles/Chat.scss';

// import { emit } from 'process';
// import { AuthContext, ContextType as AuthContextType} from '../contexts/AuthContext';
// import CreateChan from "./chat/CreateChan";

// props = type conv(string), name conv(string), notif ?
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

// type messageType = {
// 	content: string,
// 	recipient: any
// }

// state : notif, current channel, messageInput
export function Chat() {

	// var { user } = useContext(AuthContext) as AuthContextType;

	// ---- DISPLAY
	var { displayList, channel } = useContext(ChannelContext) as ContextType;

	// ---- SOCKETS
	// const [socket, setSocket] = useState<any>(null);
	// useEffect(() => {
	// 	setSocket(io("http://localhost:8080/channel", { transports: ["websocket"] }));
	// }, [])

	// // - Handle error socket
	// useEffect(() => {
	// 	socket?.on("connect_error", (err:any) => {
	// 		console.error(`Connection error: ${err.message}, restart in 15 secondes...`);
	// 		setTimeout(() => {
	// 		  socket.connect();
	// 		}, 15000);
	// 	  });
	// }, [socket])

	// useEffect(() => {
	// 	socket?.on('receive_message', (data:any) => {
	// 		setMessages(messages.concat(data));
	// 	})
	// })

	// ---- CONVERSATION
	const [ messages, setMessages ] = useState<any[]>([]);
	const [ newMessage, setNewMessage ] = useState("");
	// useEffect(() => {
	// 	if (channel)
	// 	{
	// 		socket?.emit('request_messages', channel);
	// 		console.log("requested channel");
	// 		socket?.on('messages_channel', (data:any) => {
	// 			// console.log(data);
	// 			setMessages(data);
	// 		});
	// 	}
	// }, [channel, socket])

	const handleSubmit = (e:any) => {
		e.preventDefault();
		const message : any = {
			content: newMessage,
			recipient: channel
		};
		// setMessages(messages.concat(message));
		setNewMessage("");
		// socket.emit('send_message', message);
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
				{ displayList && <ChannelList/> }
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