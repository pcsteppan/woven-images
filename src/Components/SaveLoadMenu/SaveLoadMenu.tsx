import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LoomDimensions, LoomState, LoomStateStringRepresentation } from "../../types"
import { createLoomState, createLoomStateFromStringDataRepesentation, decamelize } from "../../utils";
import { patterns as presetPatterns } from '../../presets/presetWeavingPatterns'
import '../DimensionsEditor/DimensionsEditor.css'
import './SaveLoadMenu.css'

interface SaveLoadMenuProps {
    currentState: LoomState,
    onLoadSave : (...args: any) => void
}

export const SaveLoadMenu = (props: SaveLoadMenuProps) => {
    const [saveStates, setSaveStates] = useState<LoomState[]>([]);

    const stateAsListItem = (state : LoomState, index: number) => {
        return (
            <li id={"saveFile-"+index.toString()} className="FileListItem">
                <span className="FileName">{state.name}</span>
                <button className="OverwriteBtn" onClick={handleOverwriteSave}>Overwrite</button>
                <button className="LoadBtn" onClick={()=>props.onLoadSave(state)}>Load</button>
            </li>
        )
    }

    const saveStateListItems = (states : LoomState[]) : JSX.Element[] => {
        return states.map((state : LoomState, i) => stateAsListItem(state, i));
    }

    const presetStateListItems = (stateStrings : Array<LoomStateStringRepresentation>) : JSX.Element[] => {
        return stateStrings
                .map(stateString => createLoomStateFromStringDataRepesentation(stateString))
                .map((state, i) => stateAsListItem(state, i+saveStates.length));
    }

    const handleOverwriteSave = (e : any) => {
        const index = e.target.id.split('-')[1];
        const saveStatesCopy = [...saveStates];
        saveStatesCopy[index] = props.currentState;
        setSaveStates(saveStatesCopy);
    }

    const handleSaveState = () => {
        setSaveStates([...saveStates, props.currentState]);
    }

    return (
        <div className="Panel">
            <h1 className="FormHeader">Save+Load File</h1>
            <div className="SaveLoadContainer">
            <div className="PanelContent">
                <ol>
                    {saveStateListItems(saveStates)}
                    {presetStateListItems(presetPatterns)}
                </ol>
                <button className="SaveBtn" onClick={handleSaveState}>New save</button>
            </div>
            </div>
        </div>
    )
}