import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/UI.scss';

type Props = {
	name: string;
	icon: string;
	link: string;
}

function NavButton({ name, icon, link }: Props) {
	return (
		<NavLink to={ link } className="navButton">
			<i className={"fas rotate_left " + icon}></i>
			<span>{ name }</span>
		</NavLink>
	)
}

export default NavButton;