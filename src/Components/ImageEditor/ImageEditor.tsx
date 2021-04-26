const ImageEditor = (props: any) => {
    return (
        <div className="Panel">
            <h1 className="FormHeader">Image Editor</h1>
            <div className="PanelContent">
                {props.children}
                {/* <form className="ImageForm" onSubmit={onSubmit}>
                    {formItems}
                    <label style={{verticalAlign: "top"}} htmlFor="scaleSlider">scale </label>
                    <input type="range" min="1" max="8" defaultValue="1" id="scaleSlider" onChange={props.weaveDisplayScalarOnChange}/><br/>
                    <button className="ApplyBtn" type="submit">Apply</button>
                </form> */}
            </div>
        </div>
    )
}

export default ImageEditor;