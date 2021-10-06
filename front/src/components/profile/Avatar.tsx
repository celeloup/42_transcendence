import WindowBorder from "../ui_components/WindowBorder";

function Avatar() {
    return (
        <WindowBorder w='500px' h='500px'>
        <div id="game">
            <img src={require('./logo.jpg')} />
        </div>
        </WindowBorder>
    )
}
export default Avatar;