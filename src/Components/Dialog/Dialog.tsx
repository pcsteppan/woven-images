import './Dialog.css'

const Dialog = (props: any) => {
    return (
        <div className="DialogContainer">
            <div className="DialogBox">
                {props.children}
            </div>
        </div>
    )
}

export default Dialog;