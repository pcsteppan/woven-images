const ImageEditor = (props: any) => {
    return (
        <div className="Panel">
            <h1 className="FormHeader">Image Editor</h1>
            <div className="PanelContent">
                {props.children}
            </div>
        </div>
    )
}

export default ImageEditor;