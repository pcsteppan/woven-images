import './Container.scss';
import Loom from '../LoomEditor/LoomEditor';
import { useReducer, useState } from 'react';
import { CameraMode, LoomActionType, LoomState, Harness, Thread, Treadle, LoomAction, LoomStateDict, SerializedLoomState } from '../../types';
import { createThread, createTreadle, createHarness, defaultWarpThreadPaletteIndex, defaultWeftThreadPaletteIndex } from '../../utils';
import ToolBar from '../ToolBar/ToolBar';
import useLocalStorage from '../../Hooks/useLocalStorage';
import { convertJSONToLoomState, convertLoomStateToJSON, createLoomState, createLoomStateFromStringDataRepesentation, createUUID, dimensionDefault } from '../../utils';
import Dialog from '../Dialog/Dialog';
import { getPresetPattern } from '../../presets/presetWeavingPatterns';
import { ScriptBox } from '../ScriptBox/ScriptBox';
import { useStateWithScriptBox } from '../ScriptBox/ScriptBoxHelpers';
var cloneDeep = require('lodash/cloneDeep');



function reducer(state: LoomState, action: LoomAction): LoomState {
    const stateCopy: LoomState = cloneDeep(state);

    switch (action.type) {
        case LoomActionType.SET_HARNESSTOTHREADATTACHMENTS:
            // LEFT TABLE
            { // block-scope for local consts
                const harness: Harness = stateCopy.harnesses[action.harnessID];
                const thread: Thread = stateCopy.warpThreads[action.threadID];

                if (harness.threads.has(thread)) {
                    harness.threads.delete(thread);
                } else {
                    for (let i = 0; i < stateCopy.harnesses.length; i++) {
                        if (stateCopy.harnesses[i].threads.has(thread)) {
                            stateCopy.harnesses[i].threads.delete(thread);
                        }
                    }
                    harness.threads.add(thread);
                }
            }
            break;
        case LoomActionType.SET_TREADLETOHARNESSATTACHMENTS:
            // TIEUP
            { // block-scope for local consts
                const treadle: Treadle = stateCopy.treadles[action.treadleID];
                const harness: Harness = stateCopy.harnesses[action.harnessID];

                if (treadle.harnesses.has(harness)) {
                    treadle.harnesses.delete(harness);
                } else {
                    treadle.harnesses.add(harness);
                }
            }
            break;
        case LoomActionType.SET_TREADLINGINSTRUCTION:
            // RIGHT TABLE
            {
                const treadle: Treadle = stateCopy.treadles[action.treadleID];
                if (stateCopy.treadlingInstructions[action.instructionIndex] === treadle) {
                    stateCopy.treadlingInstructions[action.instructionIndex] = null;
                } else {
                    stateCopy.treadlingInstructions[action.instructionIndex] = treadle;
                }
            }
            break;
        // create a new SET_TREADLINGINSTRUCTIONS action
        case LoomActionType.SET_HARNESSCOUNT:
            if (action.harnessCount > stateCopy.harnesses.length) {
                while (stateCopy.harnesses.length < action.harnessCount) {
                    stateCopy.harnesses.unshift(createHarness());
                }
            } else {
                const removedHarnesses = stateCopy.harnesses.splice(0, stateCopy.harnesses.length - action.harnessCount);
                stateCopy.treadles.forEach(treadle => {
                    removedHarnesses.forEach(harness => {
                        treadle.harnesses.delete(harness);
                    })
                })
            }
            stateCopy.dimensions.harnessCount = action.harnessCount;
            break;
        case LoomActionType.SET_TREADLECOUNT:
            if (action.treadleCount > stateCopy.treadles.length) {
                while (stateCopy.treadles.length < action.treadleCount) {
                    stateCopy.treadles.push(createTreadle());
                }
            } else {
                const removedTreadles = stateCopy.treadles.splice(action.treadleCount);
                stateCopy.treadlingInstructions.forEach(instruction => {
                    removedTreadles.forEach(removedTreadle => {
                        instruction = (instruction === removedTreadle) ? null : instruction;
                    })
                })
            }
            stateCopy.dimensions.treadleCount = action.treadleCount;
            break;
        case LoomActionType.SET_WARPCOUNT:
            if (action.warpCount > state.warpThreads.length) {
                while (stateCopy.warpThreads.length < action.warpCount) {
                    stateCopy.warpThreads.unshift(createThread(stateCopy.warpThreads.length, defaultWarpThreadPaletteIndex));
                }
            } else {
                stateCopy.warpThreads.splice(0, stateCopy.warpThreads.length - action.warpCount);
            }
            stateCopy.warpThreads.forEach((wt, i) => {
                wt.id = i;
            });
            stateCopy.dimensions.warpCount = action.warpCount;
            break;
        case LoomActionType.SET_WEFTCOUNT:
            // weft and treadling instruction
            if (action.weftCount > state.weftThreads.length) {
                while (stateCopy.weftThreads.length < action.weftCount) {
                    stateCopy.weftThreads.push(createThread(stateCopy.weftThreads.length, defaultWeftThreadPaletteIndex));
                    stateCopy.treadlingInstructions.push(null);
                }
            } else {
                stateCopy.weftThreads.splice(action.weftCount);
                stateCopy.treadlingInstructions.splice(action.weftCount);
            }
            stateCopy.dimensions.weftCount = action.weftCount;
            break;
        case LoomActionType.SET_STATE:
            const newState = action.state;
            return newState;
        case LoomActionType.SET_WARPTHREADTHREADPALETTEINDEX:
            // stateCopy.warpThreads[action.warpThreadID].dataSource = stateCopy.indexedThreadPalette.threadPalette[stateCopy.indexedThreadPalette.selectedIndex];
            stateCopy.warpThreads[action.warpThreadID].threadPaletteIndex = stateCopy.indexedThreadPalette.selectedIndex;
            break;
        case LoomActionType.SET_WEFTTHREADTHREADPALETTEINDEX:
            // stateCopy.weftThreads[action.weftThreadID].dataSource = stateCopy.indexedThreadPalette.threadPalette[stateCopy.indexedThreadPalette.selectedIndex];
            stateCopy.weftThreads[action.weftThreadID].threadPaletteIndex = stateCopy.indexedThreadPalette.selectedIndex;
            break;
        case LoomActionType.SET_SELECTEDTHREADDATASOURCE:
            stateCopy.indexedThreadPalette.threadPalette[stateCopy.indexedThreadPalette.selectedIndex] = action.dataSource;
            break;
        case LoomActionType.ADD_THREADDATASOURCE:
            stateCopy.indexedThreadPalette.threadPalette.push(cloneDeep(action.dataSource));
            break;
        case LoomActionType.SET_SELECTEDTHREADDATASOURCEINDEX:
            stateCopy.indexedThreadPalette.selectedIndex = action.dataSourceIndex;
            break;
    }
    return stateCopy;
}

const Container = () => {
    const [saveStateDict, setSaveStateDict] = useLocalStorage<LoomStateDict>('saveStates', {});
    const [saveStateNames, setSaveStateNames] = useLocalStorage<{ [id: string]: string }>('saveStateNames', {});
    const initialPreset = getPresetPattern("Cross of Tennessee");
    const initialState: LoomState = initialPreset
        ? createLoomStateFromStringDataRepesentation(initialPreset)
        : createLoomState(dimensionDefault);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [currentDialog, setCurrentDialog] = useState<JSX.Element>();
    // const [liveStateRef, setLiveStateRef] = useState<LoomState>(currentState);
    const [cameraMode, setCameraMode] = useState<CameraMode>(CameraMode.Orthographic);
    const [currentState, dispatch] = useReducer(reducer, initialState);
    const handleCurrentStateScriptBox = useStateWithScriptBox(currentState, dispatch);

    // const updateLiveStateRef = (ref: LoomState) => {
    //     setLiveStateRef(ref);
    //     dispatch(ref);
    // }

    // save new state to state ref with ID
    const handleSave = () => {
        const serializedLoomState: SerializedLoomState = convertLoomStateToJSON(currentState);
        setSaveStateDict({ ...saveStateDict, [currentState.id]: serializedLoomState });
        setSaveStateNames({ ...saveStateNames, [currentState.id]: currentState.name });
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
        dispatch({ type: LoomActionType.SET_STATE, state: newState });
    }

    const handleSaveAs = (e: any) => {
        setOpenDialog(false);
        e.preventDefault();

        const newUUID = createUUID();
        const stateClone = cloneDeep(currentState);
        const newName = e.target["newFileName"].value;
        stateClone.name = newName;
        stateClone.id = newUUID;

        const serilizedState: SerializedLoomState = convertLoomStateToJSON(currentState);
        setSaveStateDict({ ...saveStateDict, [newUUID]: serilizedState });
        setSaveStateNames({ ...saveStateNames, [stateClone.id]: stateClone.name });
        dispatch(stateClone);
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
        dispatch({ type: LoomActionType.SET_STATE, state: state });
    }

    const handleLoadPreset = (state: LoomState) => {
        dispatch({ type: LoomActionType.SET_STATE, state: state });
    }

    const SaveAsDialog = (
        <Dialog>
            <form className="w100" onSubmit={handleSaveAs}>
                <div className="w100">
                    <span>New file name:</span>
                    <input type="text" name="newFileName" className="underline w100" placeholder={currentState.name}></input>
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
                    state={currentState}
                    dispatch={dispatch}
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