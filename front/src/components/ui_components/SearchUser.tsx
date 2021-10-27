import "../../styles/UI.scss";
import { useState } from 'react';

type SearchUserProps = {
	theme: string,
	list: any[],
	select: (id:number) => void
}

function SearchUser({ theme, list, select } : SearchUserProps) {
	const [ search, setSearch ] = useState("");
	const [ selected, setSelected ] = useState<number>(0);

	const pick = (id: number) => {
		setSelected(id);
		select(id);
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
						return <div onClick={ () => pick(user.id) } key={ user.id } className={ selected === user.id ? "selected" : "" }>{ user.name }</div>
					} ) }
			</div>
		</div>
	)
}

export default SearchUser;