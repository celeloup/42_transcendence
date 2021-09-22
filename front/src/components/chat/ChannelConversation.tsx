type MessageProps = {
	username: string,
	message: string
	// ADD PROFILE PIC
}

export function Message ({ username, message }: MessageProps) {
	return (
		<div className="chat_message">
			<div className="chat_profile_pic"></div>
			<div className="chat_message_content">
				<div className="chat_message_username">{username}</div>
				<div className="chat_message_text">{message}</div>
			</div>
		</div>
	)
}
