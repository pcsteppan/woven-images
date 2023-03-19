import './Container.scss';
import Loom from '../LoomEditor/LoomEditor';
import { useState } from 'react';
import { CameraMode, LoomState, LoomStateDict, SerializedLoomState } from '../../types';
import ToolBar from '../ToolBar/ToolBar';
import useLocalStorage from '../../Hooks/useLocalStorage';
import { convertJSONToLoomState, convertLoomStateToJSON, createLoomState, createLoomStateFromStringDataRepesentation, createUUID, dimensionDefault } from '../../utils';
import Dialog from '../Dialog/Dialog';
import { getPresetPattern } from '../../presets/presetWeavingPatterns';
import { ScriptBox } from '../ScriptBox/ScriptBox';
import { useStateWithScriptBox } from '../ScriptBox/ScriptBoxHelpers';
var cloneDeep = require('lodash/cloneDeep');


const Container = () => {
    const [saveStateDict, setSaveStateDict] = useLocalStorage<LoomStateDict>('saveStates', {});
    const [saveStateNames, setSaveStateNames] = useLocalStorage<{ [id: string]: string }>('saveStateNames', {});
    const initialPreset = getPresetPattern("Cross of Tennessee");
    const initialState: LoomState = initialPreset
        ? createLoomStateFromStringDataRepesentation(initialPreset)
        : createLoomState(dimensionDefault);
    const [currentState, setCurrentState, handleCurrentStateScriptBox] = useStateWithScriptBox(initialState);
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
        setSaveStateDict({ ...saveStateDict, [liveStateRef.id]: serializedLoomState });
        setSaveStateNames({ ...saveStateNames, [liveStateRef.id]: liveStateRef.name });
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

    const handleExportAsPngClickOpen = () => {
        setCurrentDialog(ExportAsPngDialog);
        setOpenDialog(true);
    }

    // DIALOG - HANDLERS
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

        const serilizedState: SerializedLoomState = convertLoomStateToJSON(liveStateRef);
        setSaveStateDict({ ...saveStateDict, [newUUID]: serilizedState });
        setSaveStateNames({ ...saveStateNames, [stateClone.id]: stateClone.name });
        setCurrentState(stateClone);
    }

    const handleExportAsPng = (e: any) => {
        setOpenDialog(false);
        e.preventDefault();

        const downloadLink = document.createElement('a');
        const rawFileName: string = e.target["fileName"].value;
        const fileName = rawFileName.length === 0
            ? 'woven_image.png'
            : rawFileName.endsWith('.png')
                ? rawFileName
                : rawFileName + '.png';
        downloadLink.setAttribute('download', fileName);
        const canvas: HTMLCanvasElement | null = document.querySelector('.CanvasWrapper > canvas');

        if (!canvas) {
            console.error("Couldn't find canvas element");
            return;
        }

        const link = document.createElement('a');
        link.setAttribute('download', fileName);
        link.setAttribute('href', canvas!.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
        link.click();
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const handleLoad = (stateID: string) => {
        const serializedState: SerializedLoomState = saveStateDict[stateID];
        const state: LoomState = convertJSONToLoomState(serializedState);
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
                <div className="w100" style={{ "marginTop": "1em" }}>
                    <button className="cancelBtn" style={{ "width": "50%" }} onClick={handleClose}>Cancel</button>
                    <button type="submit" className="saveBtn" style={{ "width": "50%" }}>Save</button>
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
                <div className="w100" style={{ "marginTop": "1em" }}>
                    <button className="cancelBtn" style={{ "width": "50%" }} onClick={handleClose}>Cancel</button>
                    <button type="submit" className="saveBtn" style={{ "width": "50%" }}>Create</button>
                </div>
            </form>
        </Dialog>
    )

    const ExportAsPngDialog = (
        <Dialog>
            <form className="w100" onSubmit={handleExportAsPng}>
                <div className="w100">
                    <span>File name:</span>
                    <input type="text" name="fileName" className="underline w100" placeholder="untitled"></input>
                </div>
                <div className="w100" style={{ "marginTop": "1em" }}>
                    <button className="cancelBtn" style={{ "width": "50%" }} onClick={handleClose}>Cancel</button>
                    <button type="submit" className="saveBtn" style={{ "width": "50%" }}>Save</button>
                </div>
            </form>
        </Dialog>
    )

    return (
        <div className="Container">
            <div className="container-main">
                <ToolBar
                    saveStateDict={saveStateDict}
                    saveStateNames={saveStateNames}
                    onCreateNew={handleCreateNewClickOpen}
                    onExportAsPng={handleExportAsPngClickOpen}
                    onLoad={handleLoad}
                    onLoadPreset={handleLoadPreset}
                    onSaveAs={handleSaveAsClickOpen}
                    onSave={handleSave}
                    onDimensionChange={(newMode) => setCameraMode(newMode)} />
                <Loom
                    currentState={currentState}
                    onChange={updateLiveStateRef}
                    cameraMode={cameraMode} />

                {/* if dialog is open show current dialog */}
                {openDialog && currentDialog}
                {/* Dialog if Save As or Create New are selected in the file menu */}
            </div>

            <ScriptBox transformState={handleCurrentStateScriptBox}></ScriptBox>
        </div>
    )
}

export default Container;