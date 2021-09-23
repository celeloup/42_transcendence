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
	toggleDisplayList: () => void
}

interface Props {
	children: JSX.Element;
}

export const ChannelContext = createContext<Partial<ContextType>>({});

export const ChannelProvider = ({ children } : Props) => {

	const [channel, setChannel] = useState<Channel | null>();
	const [displayList, setDisplayList] = useState<boolean>(false);

	const toggleDisplayList = () => {
		setDisplayList(!displayList);
	}

	return ( <ChannelContext.Provider value={{ channel: channel, setChannel: setChannel, displayList: displayList, toggleDisplayList: toggleDisplayList}}>{ children }</ChannelContext.Provider> );
}
