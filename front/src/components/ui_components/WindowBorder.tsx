// import React from 'react';
import '../../styles/UI.scss';

type Props = {
	w: string;
	h: string;
	children: JSX.Element;
	id?: string;
	double?: boolean;
}

function WindowBorder( { w, h, children, id, double = false }: Props) {
	return (
		<div id={ id ? id : "" } style={{ height: h, width: w }} className="window">
			<div className={ "border_div border_top" + ( double ? " double" : "" ) }></div>
			<div className={ "border_div border_bottom" + ( double ? " double" : "" ) }></div>
			<div className={ "border_div border_right" + ( double ? " double" : "" ) }></div>
			<div className={ "border_div border_left" + ( double ? " double" : "" ) }></div>
			<div>
				{ children }
			</div>
		</div>
	)
}

export default WindowBorder;