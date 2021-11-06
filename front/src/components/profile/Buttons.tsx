import '../../styles/Profile.scss';
import { useState, useEffect } from "react";
import axios from "axios";

// type FriendType = {
// 	id: number;
// 	name: string;
// 	site_owner: boolean;
// 	site_moderator: boolean;
// 	site_banned: boolean;
// }

// type Prop = {
//     infos: FriendType;
//     online: boolean;
// }

type Props = {
    id: number;
}

function Buttons ({ id } : Props) {
	const [ isFriend, setIsFriend ] = useState(false);
	const [ isBlocked, setIsBlocked ] = useState(false);

    useEffect(() => {
		let mounted = true;

		axios.get(`/users/infos/me`)
		.then( res => {
			if (id !== res.data.id)
			{
				if (mounted) {
					if (res.data.friends.find((x:any) => x.id === id))
						setIsFriend(true);
					else
						setIsFriend(false);
					if (res.data.blocked.find((x:any) => x.id === id))
						setIsBlocked(true);
					else
						setIsBlocked(false);
				}
			}
		})
		.catch (err => {
			console.log("Error:", err);
		})

		return () => { mounted = false };
	}, [id]);
	
	const BlockUser = () => {
		if (isBlocked)
		{
			axios.delete(`/users/block/me`, {
				data: { userId: id}
			})
			.then( res => {
				setIsBlocked(false);
			})
			.catch( err => { console.log("Error:", err)});
		}
		else {
			axios.put(`/users/block/me`, {
				userId: id
			})
			.then( res => {
				setIsBlocked(true);
			})
			.catch( err => { console.log("Error:", err)});
		}
	}

	const FriendUser = () => {
		if (isFriend)
		{
			axios.delete(`/users/friend/me`, {
				data: { userId: id}
			})
			.then( res => {
				console.log(res.data);
				setIsFriend(false);
			})
			.catch( err => { 
				console.log("Error:", err);
			});
		}
		else {
			axios.put(`/users/friend/me`, {
				userId: id
			})
			.then( res => {
				console.log(res.data);
				setIsFriend(true);
			})
			.catch( err => { 
				console.log("Error:", err);
			});
		}
	}

    return (
        <div className="buttons">
            <div>
                <button onClick={FriendUser}>
                    <i className={ isFriend ? "fas fa-user-minus" : "fas fa-user-plus" }></i>
                    { isFriend ? "Unfriend" : "Add friend" }
                </button>
                <button onClick={BlockUser}>
                    <i className="fas fa-ban"></i>
                    { isBlocked ? "Unblock" : "Block" }
                </button>
            </div>
            <div>
                <button>
                    CHALLENGE
                    <i className="fas fa-rocket"></i>
                </button>
            </div>
        </div>
    )
}

export default Buttons;