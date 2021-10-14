import * as React from "react";

export type User = {
	id: number,
	site_owner: boolean,
	site_moderator: boolean,
	id42: number,
	isTwoFactorAuth: boolean,
	site_banned: boolean
}

export type ContextType = {
	isAuth: boolean,
	login: (user:User) => void,
	logout: () => void,
	user: User | null,
	setUser: (user:User) => void,
  }

interface Props {
	children: JSX.Element;
  }

export const AuthContext = React.createContext<Partial<ContextType>>({});

export const AuthProvider= ({ children } : Props) => {
	
	const [isAuth, setIsAuth] = React.useState<boolean>(false);
	const [user, setUser] = React.useState<User | null>();

	const loginContext = (user:User) => {
		// console.log("Context login : ", user);
		setIsAuth(true);
		setUser(user);
	};
	const logoutContext = () => {
		setIsAuth(false);
		setUser(null);
	};

  return ( <AuthContext.Provider value={{isAuth: isAuth, login: loginContext, logout: logoutContext, user: user, setUser:setUser}}>{ children }</AuthContext.Provider> );
}
