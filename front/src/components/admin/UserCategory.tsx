import React from 'react';
import UserLine from './UserLine';
import '../../styles/admin/Admin.scss';
import '../../styles/admin/UserCategory.scss';

type User = {
	id: number;
	name: string;
	site_banned: boolean;
	site_moderator: boolean;
	site_owner: boolean;
}

type Button = {
	class: string;
	icon: string;
	text: string;
	function: (id: number) => void;
}

type UserCategoryProps = {
	list: User[];
	type: string;
	search: string;
	buttons: Button[];
}

function UserCategory({ list, type, search, buttons } : UserCategoryProps) {
	const [displayCategory, setDisplayCategory] = React.useState(true);

	const toggleDisplayCategory = (): void => {
		setDisplayCategory(!displayCategory);
	};
	
	return (
		<>
			<div className="toggler">
				<div onClick={ toggleDisplayCategory }>
					<i className={ displayCategory ? "fas fa-chevron-down" : "fas fa-chevron-right" } ></i>
					<span className="text"> {type}_</span>
				</div>
			</div>
			{ displayCategory && <div className="users">
				{list.map( (user, i) => {  
					if (user.name.includes(search))
						return (<UserLine infos={user} buttons={buttons} key={i}></UserLine>);
					else
						return (<React.Fragment key={i}></React.Fragment>);
				})}
			</div> }
		</>
	)
}

export default UserCategory;
