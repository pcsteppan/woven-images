import { LoomState, LoomStateDict, LoomStateStringRepresentation, SerializedLoomState } from "../../types";
import { createLoomStateFromStringDataRepesentation } from "../../utils";
import ToolBarMenu from "../ToolBarMenu/ToolBarMenu";
import ToolBarMenuNode from "../ToolBarMenuNode/ToolBarMenuNode";
import {patterns as presetPatterns} from '../../presets/presetWeavingPatterns'

interface ToolBarProps {
    saveStateDict: LoomStateDict,
    saveStateNames: {[id: string]: string}
    onLoad: (stateID: string) => void,
    onSaveAs: (...args: any) => void,
    onSave: (...args: any) => void,
    onLoadPreset: (state: LoomState) => void
}

const ToolBar = (props: ToolBarProps) => {
    //serializedState: SerializedLoomState
    const stateIDAsToolBarMenuNode = (id: string) => {
        return <ToolBarMenuNode 
                    className="ToolBarMenuSubNode"
                    text={props.saveStateNames[id]}
                    onClick={() => props.onLoad(id)}/>
    }

    const saveStateToolBarMenuNodes : React.ReactNode[] = Object.keys(props.saveStateDict).map((stateID : string) => {
        return stateIDAsToolBarMenuNode(stateID);
    })

    const presetStateAsToolBarMenuNode = (state: LoomState) => {
        return <ToolBarMenuNode
                    className="ToolBarMenuSubNode"
                    text={state.name}
                    onClick={() => props.onLoadPreset(state)}/>
    }

    const presetStateToolBarMenuNodes = (stateStrings : Array<LoomStateStringRepresentation>) : React.ReactNode[] => {
        return stateStrings
                .map(stateString => createLoomStateFromStringDataRepesentation(stateString))
                .map((state, i) => presetStateAsToolBarMenuNode(state));
    }

    const handleSave = () => {
        // alert("Saved successfully");
        props.onSave();
    }

    const handleSaveAs = () => {
        // alert("save as");
        props.onSaveAs();
    }

    return (
        <ToolBarMenu name={"File"}>
            <ToolBarMenuNode
                text="Create New"
                onClick={() => console.log("create new")}
                />
            <ToolBarMenuNode
                text="Save"
                onClick={handleSave}
                />
            <ToolBarMenuNode
                text="Save As"
                onClick={handleSaveAs}
                />
            <ToolBarMenuNode
                text="Load">
                {[...saveStateToolBarMenuNodes]}
            </ToolBarMenuNode>
            <ToolBarMenuNode
                text="Load Preset">
                {[...presetStateToolBarMenuNodes(presetPatterns)]}
            </ToolBarMenuNode>
        </ToolBarMenu>
    )
}

export default ToolBar;