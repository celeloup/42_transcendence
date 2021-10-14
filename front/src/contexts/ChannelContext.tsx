import { useState, createContext } from "react";

export type Channel = {
	id: number,
	name: string,
	type: number
}

export type ContextType = {
	channel: Channel | null,
	setChannel: (chan:Channel) => void,
	displayList: boolean,
	toggleDisplayList: () => void,
	displayAdmin: boolean,
	toggleDisplayAdmin: () => void,
	changeChannel: (chan:Channel) => void,
	socket: any | null,
	setSocket: (sok:any) => void
}

interface Props {
	children: JSX.Element;
}

export const ChannelContext = createContext<Partial<ContextType>>({});

export const ChannelProvider = ({ children } : Props) => {

	const [ channel, setChannel ] = useState<Channel | null>(null);
	const [ displayList, setDisplayList ] = useState<boolean>(false);
	const [ displayAdmin, setDisplayAdmin ] = useState<boolean>(false);
	const [ socket, setSocket ] = useState<any>(null);

	const toggleDisplayList = () => {
		setDisplayList(!displayList);
	}
	const toggleDisplayAdmin = () => {
		setDisplayAdmin(!displayAdmin);
	}

	const changeChannel = (chan: Channel) => {
		if (channel)
			socket.emit('leave_chan', channel.id);
		setChannel(chan);
		socket.emit('join_chan', chan.id);
	}

	return ( <ChannelContext.Provider 
			value={{ 
				channel: channel,
				setChannel: setChannel,
				displayList: displayList,
				toggleDisplayList: toggleDisplayList,
				changeChannel: changeChannel,
				socket: socket,
				setSocket: setSocket,
				toggleDisplayAdmin: toggleDisplayAdmin,
				displayAdmin: displayAdmin
			}}>
				{ children }
			</ChannelContext.Provider> );
}
