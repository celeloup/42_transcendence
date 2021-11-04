import axios from "axios";
import React, { useEffect } from 'react';
import '../../styles/parameters/AvatarChange.scss';
import '../../styles/parameters/Parameters.scss';

function AvatarChange () {
	const [avatarNotChanged, setAvatarNotChanged] = React.useState<boolean>(false);
	const [username, setUsername] = React.useState<string>("");
	const [userId, setUserId] = React.useState<number>(-1);
	const [hasAvatar, setHasAvatar] = React.useState<boolean>(false);

	useEffect(() => {
		axios.get("/users/infos/me")
		.then(response => { setUsername(response.data.name);
							setUserId(response.data.id);
							setHasAvatar(response.data.avatar !== null);
						})
		.catch(error => { console.log(error.response); });
	}, []);

	const changePicture = (e: any) : void => {
		const formData = new FormData();
		formData.append('avatar', e.target.files[0]);
		axios.post("/users/avatar/me", formData)
		.then(response => { setAvatarNotChanged(false);
							window.location.reload();
						})
		.catch(error => { console.log(error.response);
							setAvatarNotChanged(true);
						});
	}

	const proPicPath = (id: number, hasAvatar: boolean) => {
		if (id !== -1 && hasAvatar) {
			return {
				backgroundImage: `url(${process.env.REACT_APP_BACK_URL}/api/users/avatar/${id})`,
				backgroundSize: "cover",
			}
		}
		return {}
	};

	return (
		<div className="subcontainer left">
			<div className="pic_wrapper">
				{ hasAvatar && <input
                    style={proPicPath(userId, hasAvatar)}
                    className="pic_input" type="file"
                    onChange={changePicture}> 
                </input> }
				{ !hasAvatar && <>
					<div className="pic_base_text">
					<input
						className="pic_input" type="file"
						onChange={changePicture}>
					</input>
                	    <span>{ username.charAt(0) }</span>
            		</div>
				</> }
				<i className="pic_pencil fas fa-pen"></i>
			</div>
			{ avatarNotChanged && 
				<p className="field_changed">
                    Avatar could not be changed ❌
                </p>
			}
		</div>
	);
  }
  
  export default AvatarChange;