import * as React from "react";
import { EffectCallback, useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

function InvitationNotification({socket, match}:any) {
	
	const accept = () => {
		socket.emit('accept_match', match);
	}

	const decline = () => {
		socket.emit('decline_match', match);
	}
	
	return (<div>
		<div onClick={ accept }>ACCEPT</div>
		<div onClick={ decline }>DECLINE</div>
	</div>
)}


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
	masterSocket: any,
	setToDisplay: (page:string) => void,
	toDisplay: string
  }

interface Props {
	children: JSX.Element;
  }

export const AuthContext = React.createContext<Partial<ContextType>>({});

export const AuthProvider= ({ children } : Props) => {
	
	const [ isAuth, setIsAuth ] = useState<boolean>(false);
	const [ user, setUser ] = useState<User | null>();
	const [ socket, setSocket ] = useState<any>(null);
	const [ connect, setConnect ] = useState<boolean>(false);
	const [ toDisplay, setToDisplay ] = useState<string>("landing");

	useEffect(() : ReturnType<EffectCallback> => {
		if (connect) {
			const newSocket:any = io(`${process.env.REACT_APP_BACK_URL}/game`, { transports: ["websocket"] });
			setSocket(newSocket);
			return () => newSocket.close();
		}
	}, [setSocket, connect]);

	useEffect(() => {
		socket?.on('invitation', (data: any) => {
			console.log("received invitation", data);
			toast(<InvitationNotification socket={ socket } match={ data } />);
		})
	}, [socket])

	const loginContext = (userIN:User) => {
		// console.log("Context login : ", user);
		setIsAuth(true);
		if (!user)
			setConnect(true);
		setUser(userIN);
	};
	const logoutContext = () => {
		setIsAuth(false);
		setUser(null);
		setConnect(false);
	};

  return ( <AuthContext.Provider 
		value={{ 
			isAuth: isAuth, 
			login: loginContext, 
			logout: logoutContext, 
			user: user, 
			setUser:setUser, 
			masterSocket: socket,
			toDisplay: toDisplay,
			setToDisplay: setToDisplay
			}}>
				{ children }
				<ToastContainer draggable={false} />
		</AuthContext.Provider> );
}
