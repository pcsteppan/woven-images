import { CameraMode, LoomState, LoomStateDict, LoomStateStringRepresentation, SerializedLoomState } from "../../types";
import { createLoomStateFromStringDataRepesentation } from "../../utils";
import ToolBarMenu from "../ToolBarMenu/ToolBarMenu";
import ToolBarMenuNode from "../ToolBarMenuNode/ToolBarMenuNode";
import { presetPatterns as presetPatterns } from '../../presets/presetWeavingPatterns'

interface ToolBarProps {
    saveStateDict: LoomStateDict,
    saveStateNames: { [id: string]: string }
    onLoad: (stateID: string) => void,
    onSaveAs: (...args: any) => void,
    onSave: (...args: any) => void,
    onLoadPreset: (state: LoomState) => void,
    onCreateNew: (...args: any) => void,
    onDimensionChange: (...args: any) => void
    onExportAsPng: (...args: any) => void
}

const ToolBar = (props: ToolBarProps) => {
    const stateIDAsToolBarMenuNode = (id: string) => {
        return <ToolBarMenuNode
            className="ToolBarMenuSubNode"
            text={props.saveStateNames[id]}
            onClick={() => props.onLoad(id)} />
    }

    const saveStateToolBarMenuNodes: React.ReactNode[] = Object.keys(props.saveStateDict).map((stateID: string) => {
        return stateIDAsToolBarMenuNode(stateID);
    })

    const presetStateAsToolBarMenuNode = (state: LoomState) => {
        return <ToolBarMenuNode
            className="ToolBarMenuSubNode"
            text={state.name}
            onClick={() => props.onLoadPreset(state)} />
    }

    const presetStateToolBarMenuNodes = (stateStrings: Array<LoomStateStringRepresentation>): React.ReactNode[] => {
        return stateStrings
            .map(stateString => createLoomStateFromStringDataRepesentation(stateString))
            .map((state, i) => presetStateAsToolBarMenuNode(state));
    }

    return (
        <>
            <ToolBarMenu name={"File"}>
                <ToolBarMenuNode
                    text="Create New"
                    onClick={props.onCreateNew}
                />
                <ToolBarMenuNode
                    text="Save"
                    onClick={props.onSave}
                />
                <ToolBarMenuNode
                    text="Save As"
                    onClick={props.onSaveAs}
                />
                <ToolBarMenuNode
                    text="Export As PNG"
                    onClick={props.onExportAsPng}
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
            <ToolBarMenu name={"View"}>
                <ToolBarMenuNode
                    text="Dimensions">
                    <ToolBarMenuNode
                        text="2D"
                        onClick={() => props.onDimensionChange(CameraMode.Orthographic)} />
                    <ToolBarMenuNode
                        text="3D"
                        onClick={() => props.onDimensionChange(CameraMode.Perspective)} />
                </ToolBarMenuNode>
            </ToolBarMenu>
        </>
    )
}

export default ToolBar;