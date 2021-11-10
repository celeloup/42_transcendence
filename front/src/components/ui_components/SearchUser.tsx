import "../../styles/UI.scss";
import React from 'react';
import { useState, useContext } from 'react';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';

type SearchUserProps = {
	theme: string,
	list: any[],
	select: (user:any) => void,
	byID?: boolean
}

function SearchUser({ theme, list, select, byID = true } : SearchUserProps) {
	let { user } = useContext(AuthContext) as AuthContextType;
	const [ search, setSearch ] = useState("");
	const [ selected, setSelected ] = useState<number>(0);

	const pick = (user: any) => {
		setSelected(user);
		if (byID)
			select(user.id);
		else
			select(user)
	}



	return (
		<div id="search_user">
			<div className="search_bar">
				<input type="text" placeholder="Search" id="channelSearch" value={ search } onChange={ e => setSearch(e.target.value) }></input>
				<i id="searchButton" className="fas fa-search"></i>
			</div>
			<div id="list">
				{ list.map((u:any, i:number) => {
					if (u.name.includes(search) && u.id !== user?.id)
						return <div onClick={ () => pick(u) } key={ i } className={ (selected === u.id || selected === u )? "selected" : "" }>{ u.name }</div>
					else
						return (<React.Fragment key={i}></React.Fragment>);
					} ) }
			</div>
		</div>
	)
}

export default SearchUser;