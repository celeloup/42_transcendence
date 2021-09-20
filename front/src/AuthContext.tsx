import * as React from "react";

export type ContextType = {
	isAuth: boolean,
	login: () => void,
	logout: () => void,
  }

interface Props {
	children: JSX.Element;
  }

export const AuthContext = React.createContext<Partial<ContextType>>({});

export const AuthProvider= ({ children } : Props) => {
	
	const [isAuth, setIsAuth] = React.useState<boolean>(false);
	const loginContext = () => {
		// do stuff here ?
		setIsAuth(true);
	};
	const logoutContext = () => {
		// do stuff here ? 
		setIsAuth(false);
	}
	return ( <AuthContext.Provider value={{isAuth: isAuth, login: loginContext, logout: logoutContext}}>{ children }</AuthContext.Provider> );
}
