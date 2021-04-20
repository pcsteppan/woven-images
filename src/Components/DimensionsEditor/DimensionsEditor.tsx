import { useEffect, useState } from "react";
import { LoomDimensions } from "../../types"
import { decamelize } from "../../utils";
import './DimensionsEditor.css'

interface DimensionsEditorProps {
    dimensions: LoomDimensions
    onDimensionsChange : (...args: any) => void
    weaveDisplayScalarOnChange: (e: any) => void
}

export const DimensionsEditor = (props: DimensionsEditorProps) => {

    const [localDimensions, setLocalDimensions] = useState(props.dimensions);
    
    useEffect( () => {
        setLocalDimensions(props.dimensions);
    }, [props.dimensions])



    const onSubmit = (e: any) => {
        e.preventDefault();
        props.onDimensionsChange(localDimensions);
    }

    const handleChange = (e : any) => {
        e.preventDefault();
        setLocalDimensions({...localDimensions, [e.target.name]: e.target.value});
    }

    const formItems = Object.keys(props.dimensions).map((dimensionKey : string) => {
        return (
            <>
            <label className="InputLabel" htmlFor={dimensionKey}>{decamelize(dimensionKey, " ") + " "}</label>
            <input className="InputField" style={{display: "inline"}} type="textfield" name={dimensionKey} onChange={handleChange} placeholder={props.dimensions[dimensionKey].toString()}></input>
            <p className="CurrentDimension" style={{display: "inline"}}>{`→ ${props.dimensions[dimensionKey]}`}</p>
            <br/>
            </>
        )
    })

    return (
        <div className="Panel">
        <h1 className="FormHeader">Dimensions Editor</h1>
        <div className="PanelContent">
            <form className="DimensionsForm" onSubmit={onSubmit}>
                {formItems}
                <label style={{verticalAlign: "top"}} htmlFor="scaleSlider">scale </label>
                <input type="range" min="1" max="8" defaultValue="1" id="scaleSlider" onChange={props.weaveDisplayScalarOnChange}/><br/>
                <button className="ApplyBtn" type="submit">Apply</button>
            </form>
        </div>
        </div>
    )
}