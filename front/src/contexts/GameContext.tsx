import { useState, createContext } from "react";

export type ContextType = {
	toDisplay: string,
	setToDisplay: (page:string) => void
}

interface Props {
	children: JSX.Element;
}

export const GameContext = createContext<Partial<ContextType>>({});

export const GameProvider = ({ children } : Props) => {

	const [ toDisplay, setToDisplay ] = useState<string>("landing");

	return ( <GameContext.Provider 
			value={{ 
				toDisplay: toDisplay,
				setToDisplay: setToDisplay
			}}>
				{ children }
			</GameContext.Provider> );
}
