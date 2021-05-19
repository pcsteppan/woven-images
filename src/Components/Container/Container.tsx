import './Container.scss';
import Loom from '../LoomEditor/LoomEditor';
// import { SaveLoadMenu } from '../SaveLoadMenu/SaveLoadMenu';
import React, { useEffect, useState } from 'react';
import { CameraMode, LoomState, LoomStateDict, SerializedLoomState } from '../../types';
import ToolBarFileMenu from '../ToolBar/ToolBar';
import ToolBar from '../ToolBar/ToolBar';
import useLocalStorage from '../../Hooks/useLocalStorage';
import { convertJSONToLoomState, convertLoomStateToJSON, createLoomState, createUUID, dimensionDefault } from '../../utils';
import { reduceEachLeadingCommentRange } from 'typescript';
import Dialog from '../Dialog/Dialog';
var cloneDeep = require('lodash/cloneDeep');


const Container = () => {
    const [saveStateDict, setSaveStateDict] = useLocalStorage<LoomStateDict>('saveStates', {});
    const [saveStateNames, setSaveStateNames] = useLocalStorage<{[id: string]: string}>('saveStateNames', {});
    const initialState : LoomState = createLoomState(dimensionDefault);
    const [currentState, setCurrentState] = useState<LoomState>(initialState);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [currentDialog, setCurrentDialog] = useState<JSX.Element>();
    const [liveStateRef, setLiveStateRef] = useState<LoomState>(currentState);
    const [cameraMode, setCameraMode] = useState<CameraMode>(CameraMode.Orthographic);

    const updateLiveStateRef = (ref: LoomState) => {
        setLiveStateRef(ref);
    }

    // save new state to state ref with ID
    const handleSave = () => {
        const serializedLoomState: SerializedLoomState = convertLoomStateToJSON(liveStateRef); 
        setSaveStateDict({...saveStateDict, [liveStateRef.id]: serializedLoomState});
        setSaveStateNames({...saveStateNames, [liveStateRef.id]: liveStateRef.name});
    }

    // push new state with newly generated uuid with new name

    // DIALOGS - CLICK OPENS
    const handleSaveAsClickOpen = () => {
        setCurrentDialog(SaveAsDialog);
        setOpenDialog(true);
    }

    const handleCreateNewClickOpen = () => {
        setCurrentDialog(CreateNewDialog);
        setOpenDialog(true);
    }
    //

    // DIALOG HANDLERS
    const handleCreateNew = (e: any) => {
        setOpenDialog(false);
        e.preventDefault();
        
        const newState = createLoomState(dimensionDefault);
        const newName = e.target["fileName"].value;
        newState.name = newName;
        setCurrentState(newState);
    }

    const handleSaveAs = (e: any) => {
        setOpenDialog(false);
        e.preventDefault();
        
        const newUUID = createUUID();
        const stateClone = cloneDeep(liveStateRef);
        const newName = e.target["newFileName"].value;
        stateClone.name = newName;
        stateClone.id = newUUID;
        
        const serilizedState : SerializedLoomState = convertLoomStateToJSON(liveStateRef);
        setSaveStateDict({...saveStateDict, [newUUID]: serilizedState});
        setSaveStateNames({...saveStateNames, [stateClone.id]: stateClone.name});
        setCurrentState(stateClone);
    }
    //

    const handleClose = () => {
        setOpenDialog(false);
    }

    const handleLoad = (stateID: string) => {
        const serializedState : SerializedLoomState = saveStateDict[stateID];
        const state : LoomState = convertJSONToLoomState(serializedState);
        setCurrentState(state);
    }

    const handleLoadPreset = (state: LoomState) => {
        setCurrentState(state);
    }


    const SaveAsDialog = (
        <Dialog>
            <form className="w100" onSubmit={handleSaveAs}>
                <div className="w100">
                    <span>New file name:</span>
                    <input type="text" name="newFileName" className="underline w100" placeholder={liveStateRef.name}></input>
                </div>
                <div className="w100" style={{"marginTop":"1em"}}>
                    <button className="cancelBtn" style={{"width":"50%"}} onClick={handleClose}>Cancel</button>
                    <button type="submit" className="saveBtn" style={{"width":"50%"}}>Save</button>
                </div>
            </form>
        </Dialog>
    )

    const CreateNewDialog = (
        <Dialog>
            <form className="w100" onSubmit={handleCreateNew}>
                <div className="w100">
                    <span>File name:</span>
                    <input type="text" name="fileName" className="underline w100" placeholder="untitled"></input>
                </div>
                <div className="w100" style={{"marginTop":"1em"}}>
                    <button className="cancelBtn" style={{"width":"50%"}} onClick={handleClose}>Cancel</button>
                    <button type="submit" className="saveBtn" style={{"width":"50%"}}>Create</button>
                </div>
            </form>
        </Dialog>
    )

    return (
        <div className="Container">
            <ToolBar
                saveStateDict={saveStateDict}
                saveStateNames={saveStateNames}
                onCreateNew={handleCreateNewClickOpen}
                onLoad={handleLoad}
                onLoadPreset={handleLoadPreset}
                onSaveAs={handleSaveAsClickOpen}
                onSave={handleSave}
                onDimensionChange={ (newMode) => setCameraMode(newMode) }/>
            <Loom
                currentState={currentState}
                onChange={updateLiveStateRef}
                cameraMode={cameraMode}/>

            {/* if dialog is open show current dialog */}
            {openDialog && currentDialog}
            {/* Dialog if Save As or Create New are selected in the file menu */}
        </div>
    )
}

export default Container;