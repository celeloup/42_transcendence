import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, ContextType as AuthContextType} from '../../contexts/AuthContext';

function Logo() {
	const { setToDisplay } = useContext(AuthContext) as AuthContextType;
	return (
	<div id="logo">
		<NavLink to='/' onClick={ ()=> setToDisplay("landing") }>
			<p>PonG</p>
			<p>warS</p>
		</NavLink>
	</div>
	)
}

export default Logo;