import '../../styles/admin/Admin.scss';
import '../../styles/admin/UserLine.scss';

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

type UserLineProps = {
	infos: User;
	buttons: Button[];
}

function UserLine ( { infos, buttons } : UserLineProps ) {

	return (
		<div className="userLine">
			<div>
				<span>{infos.name}</span>
			</div>
			{buttons.map( (button, i) => {
				return (
					<div className={"user_button " + button.class} onClick={ () => { button.function(infos.id); } } key={i}>
						<i className={"fas fa-" + button.icon}>
							<span className="tooltiptop">
								<span className="tooltiptext">{button.text}</span>
							</span>
						</i>
					</div>
				);
			})}
		</div>
	);
}

export default UserLine;
