import { useEffect, useMemo, useState } from "react";
import { LoomDimensions } from "../../types"
import { decamelize } from "../../utils";
import './DimensionsEditor.css'

interface DimensionsEditorProps {
    dimensions: LoomDimensions
    onDimensionsChange: (...args: any) => void
}

export const DimensionsEditor = (props: DimensionsEditorProps) => {

    const [localDimensions, setLocalDimensions] = useState(props.dimensions);

    useEffect(() => {
        setLocalDimensions(props.dimensions);
    }, [props.dimensions])


    const onSubmit = (e: any) => {
        e.preventDefault();
        props.onDimensionsChange(localDimensions);
    }

    const handleChange = (e: any) => {
        e.preventDefault();
        setLocalDimensions({ ...localDimensions, [e.target.name]: parseInt(e.target.value) });
    }

    const dimensionsAreUnmodified = useMemo(() => Object.keys(localDimensions).every(key => localDimensions[key] === props.dimensions[key])
        , [props.dimensions, localDimensions]);

    const formItems = Object.keys(props.dimensions).map((dimensionKey: string) => {
        return (
            <>
                <label className="InputLabel" htmlFor={dimensionKey}>{decamelize(dimensionKey, " ") + " "}</label>
                <input className="InputField input-dimension"
                    style={{ display: "inline" }}
                    type="textfield"
                    name={dimensionKey}
                    onChange={handleChange}
                    value={localDimensions[dimensionKey]} />
                <span>→</span>
                <p className="CurrentDimension" style={{ display: "inline" }}>{props.dimensions[dimensionKey]}</p>
            </>
        )
    })

    return (
        <div className="Panel">
            <h1 className="FormHeader">Dimensions Editor</h1>
            <div className="PanelContent">
                <form className="DimensionsForm input-grid input-grid-4" onSubmit={onSubmit}>
                    {formItems}
                    <button
                        className="ApplyBtn"
                        type="submit"
                        disabled={dimensionsAreUnmodified}>
                        Apply
                    </button>
                </form>
            </div>
        </div>
    )
}