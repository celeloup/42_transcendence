import { useState, createContext } from "react";

export type ContextType = {
	toDisplay: string,
	setToDisplay: (page:string) => void,
	match: any,
	setMatch: (match:any) => void,
	matchID:string,
	setMatchID: (id:string) => void
}

interface Props {
	children: JSX.Element;
}

export const GameContext = createContext<Partial<ContextType>>({});

export const GameProvider = ({ children } : Props) => {

	const [ toDisplay, setToDisplay ] = useState<string>("landing");
	const [ match, setMatch ] = useState<any>(null);
	const [ matchID, setMatchID ] = useState<string>("");

	return ( <GameContext.Provider 
			value={{ 
				toDisplay: toDisplay,
				setToDisplay: setToDisplay,
				match: match,
				setMatch: setMatch,
				matchID: matchID,
				setMatchID: setMatchID
			}}>
				{ children }
			</GameContext.Provider> );
}
