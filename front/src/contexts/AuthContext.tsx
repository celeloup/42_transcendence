import * as React from "react";
import { EffectCallback, useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import { useHistory} from "react-router-dom";

function InvitationNotification({ closeToast, socket, match, setToDisplay, toDisplay }:any) {
	const history = useHistory();
	let test = false;
	
	useEffect(() => {
		return () => {
			if (!test)
				socket.emit('decline_match', match);
		}
	}, []) // eslint-disable-line

	const accept = () => {
		test = true;
		// if (toDisplay === 'pong')
		// 	setToDisplay('landing');
		setToDisplay('pong');
		socket.emit('accept_match', match);
		history.push("/");
		closeToast();
	}

	const decline = () => {
		closeToast();
	}
	
	return (
	<div id="invitation">
		<p><span>{ match.users[0].name }</span><br/>challenged you !</p>
		<div id="buttons">
			<div onClick={ accept }>ACCEPT</div>
			<div onClick={ decline }>DECLINE</div>
		</div>
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
	toDisplay: string,
	challenged: any,
	setChallenged: (user:any) => void
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
	const [ challenged, setChallenged ] = useState<any>(null);
	const history = useHistory();

	useEffect(() : ReturnType<EffectCallback> => {
		if (connect) {
			const newSocket:any = io(`${process.env.REACT_APP_BACK_URL}/game`, { transports: ["websocket"] });
			setSocket(newSocket);
			return () => newSocket.close();
		}
	}, [setSocket, connect]);

	useEffect(() => {
		socket?.on('invitation', (data: any) => {
			const options = {
				autoClose: 6000,
				type: toast.TYPE.SUCCESS,
				icon: false,
				hideProgressBar: false,
				position: toast.POSITION.TOP_CENTER,
				pauseOnHover: true,
				pauseOnFocusLoss: true,
				draggable: false,
				closeOnClick: false
			};
			// console.log("received invitation", data);
			toast(<InvitationNotification socket={ socket } match={ data } setToDisplay={ setToDisplay } toDisplay={toDisplay}/>, options);
		})

		socket?.on('user_is_ban_site', (data: any) => {
			logoutContext();
			history.push("/");
		})
	}, [socket]) // eslint-disable-line

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
			setToDisplay: setToDisplay,
			challenged: challenged,
			setChallenged: setChallenged
			}}>
				{ children }
				<ToastContainer />
		</AuthContext.Provider> );
}
