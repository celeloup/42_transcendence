import "../../styles/UI.scss";
import { useState } from 'react';

type SearchUserProps = {
	theme: string,
	list: any[],
	select: (user:any) => void,
	byID?: boolean
}

function SearchUser({ theme, list, select, byID = true } : SearchUserProps) {
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
				{ list.map((user:any) => {
					if (user.name.includes(search))
						return <div onClick={ () => pick(user) } key={ user.id } className={ selected === user.id ? "selected" : "" }>{ user.name }</div>
					else
						return <></>
					} ) }
			</div>
		</div>
	)
}

export default SearchUser;