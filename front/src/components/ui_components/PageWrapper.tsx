import '../../styles/UI.scss';
import Logo from './Logo';
import NavButton from './NavButton';
import { useContext } from 'react';
import { AuthContext, ContextType } from '../../contexts/AuthContext';

import Arrows from '../../assets/img/arrows.svg';
import Fusibles from './Fusibles';
import HistogramBar from '../../assets/img/histogram_bar.svg';
import Squares from '../../assets/img/little_squares.svg';
// import Radar from '../../assets/img/radar.svg';
// import Time from './Time';
import Temp from '../../assets/img/temp.svg';
import Viseur from '../../assets/img/viseur.svg';

type Props = {
	children: JSX.Element;
}

function PageWrapper( { children }: Props) {
	var { isAuth, user } = useContext(AuthContext) as ContextType;

	var display : boolean = (isAuth || window.location.pathname === '/2fa');
	return (
		<>
		{ display && <header className="App-header">
			<img className="square" src={ Squares } alt="Decoration (squares)"/>
			{/* <Time /> */}
			<img className="temp" src={ Temp } alt="Decoration (temp)"/>
			<div id="logo_wrapper">
				<Logo />
				<img className="viseur" src={ Viseur } alt="Decoration (viseur)"/>
			</div>
			<div className="radar"/>
			<img className="square flip" src={ Squares } alt="Decoration (squares)"/>
		</header>}
		{ isAuth && <div id="navBar" className="rotate_right">
			<NavButton name="Parameters" icon="fa-cog" link="/parameters"></NavButton>
			<NavButton name="Profile" icon="fa-user-circle" link={ user ? "/profile/" + user.id : "/" }></NavButton>
		{ (user?.site_owner || user?.site_moderator) && <NavButton name="Admin" icon="fa-cog" link="/admin"></NavButton> }
		</div>} 
		<div className="body_wrapper">
			{ children }
		</div>
		{ display && <footer>
			<img className="arrows flip" src={ Arrows } alt="Decoration (arrows)"/>
			<img className="histogram" src={ HistogramBar } alt="Decoration (Histogram)" />
			<Fusibles />
			<img className="arrows" src={ Arrows } alt="Decoration (arrows)"/>
		</footer>}
		</>
	)
}

export default PageWrapper;