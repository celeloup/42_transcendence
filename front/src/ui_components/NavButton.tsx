import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/UI.scss';

type Props = {
	name: string;
	// icon: string;
	link: string;
}

function NavButton({ name, link }: Props) {
	return (
		<NavLink to={ link } className="navButton">
			{/* <span>I</span> */}
			<span>{ name }</span>
		</NavLink>
	)
}

export default NavButton;