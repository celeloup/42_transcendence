type MessageProps = {
	username: string,
	message: string
	// ADD PROFILE PIC
}


// ADD PROFILE CARD WHEN CLICK ON PROFILE

export function Message ({ username, message }: MessageProps) {
	return (
		<div className="chat_message">
			<div className="chat_profile_pic">
				{ username.charAt(0) }
			</div>
			<div className="chat_message_content">
				<div className="chat_message_username">{username}</div>
				<div className="chat_message_text">{message}</div>
			</div>
		</div>
	)
}
