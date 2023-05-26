import { useState } from "react";
import ButtonGrid from "../ButtonGrid/ButtonGrid"
import { LoomActionType, LoomState, Harness, Treadle, Thread, LoomDimensions, Orientation, SubGridType, ThreadDataSource, CameraMode } from '../../types';
import './LoomEditor.scss'
import { DimensionsEditor } from "../DimensionsEditor/DimensionsEditor";
import { ThreadEditor } from "../ThreadEditor/ThreadEditor";
import ThreadButtonGrid from "../ThreadButtonGrid/ThreadButtonGrid";
import ImageEditor from "../ImageEditor/ImageEditor";
import Scene from "../WeaveDisplay/WeaveDisplayThree";
import { Canvas } from 'react-three-fiber';
import { InfoPanel } from "../InfoPanel/InfoPanel";
import { Panel } from "../Panel/Panel";


interface LoomProps {
    state: LoomState,
    cameraMode: CameraMode,
    dispatch: (...args: any) => void
}

const Loom = ({ cameraMode, dispatch, state }: LoomProps) => {
    // IMAGE PROPERTIES
    const [imageCellSize, setImageCellSize] = useState<number>(16);
    const [imageScale, setImageScale] = useState<number>(1);

    const loomGridOnClickEventHandler = (e: any, type: SubGridType) => {
        const target = e.target as HTMLDivElement;
        const gridRow: number = parseInt(target.style.gridRow) - 1;
        const gridCol: number = parseInt(target.style.gridColumn) - 1;
        switch (type) {
            case SubGridType.HARNESSTOTHREADTABLE:
                dispatch({ type: LoomActionType.SET_HARNESSTOTHREADATTACHMENTS, harnessID: gridRow, threadID: gridCol });
                break;
            case SubGridType.TIEUPTABLE:
                dispatch({ type: LoomActionType.SET_TREADLETOHARNESSATTACHMENTS, treadleID: gridCol, harnessID: gridRow });
                break;
            case SubGridType.TREADLINGTABLE:
                dispatch({ type: LoomActionType.SET_TREADLINGINSTRUCTION, treadleID: gridCol, instructionIndex: gridRow });
                break;
            case SubGridType.WEFTTHREADTABLE:
                // Weft thread data source change
                dispatch({ type: LoomActionType.SET_WEFTTHREADTHREADPALETTEINDEX, weftThreadID: gridRow });
                break;
            case SubGridType.WARPTHREADTABLE:
                // Warp thread data source change
                dispatch({ type: LoomActionType.SET_WARPTHREADTHREADPALETTEINDEX, warpThreadID: gridCol });
                break;
        }
    }

    const topGridValues = (warpThreads: Thread[], harnesses: Harness[]): Array<Array<boolean>> => {
        const gridValues: boolean[][] = new Array<Array<boolean>>(harnesses.length).fill(new Array<boolean>()).map((_, rowIndex) => {
            return new Array<boolean>(warpThreads.length).fill(false).map((_, colIndex) => {
                return harnesses[rowIndex].threads.has(warpThreads[colIndex]);
            })
        });
        return gridValues;
    }

    const tieup = (harnesses: Harness[], treadles: Treadle[]) => {
        const gridValues: boolean[][] = new Array<Array<boolean>>(harnesses.length).fill(new Array<boolean>()).map((_, rowIndex) => {
            return new Array<boolean>(treadles.length).fill(false).map((_, colIndex) => {
                return treadles[colIndex].harnesses.has(harnesses[rowIndex]);
            })
        });
        return gridValues;
    }

    const rightGridValues = (treadles: Treadle[], treadlingInstructions: (Treadle | null)[]) => {
        const gridValues: boolean[][] = new Array<Array<boolean>>(treadlingInstructions.length).fill(new Array<boolean>()).map((_, rowIndex) => {
            return new Array<boolean>(treadles.length).fill(false).map((_, colIndex) => {
                return treadlingInstructions[rowIndex] === treadles[colIndex];
            })
        });
        return gridValues;
    }

    // array to be used for generating datatexture,
    const weaveDisplayColorBuffer = (state: LoomState): string[] => {
        const width = state.dimensions.warpCount;
        const height = state.dimensions.weftCount;
        const colorBuffer = new Array(width * height).fill("#000000");
        const index = (row: number, col: number) => row * (width) + col;
        state.treadlingInstructions.forEach((treadleInstruction, row) => {
            const currentWeftThread = state.weftThreads[row];
            const activeWarpThreads = new Set();
            treadleInstruction?.harnesses.forEach((harness) => {
                harness.threads.forEach(thread => activeWarpThreads.add(thread));
            });
            state.warpThreads.forEach((currentWarpThread, col) => {
                colorBuffer[index(row, col)] = activeWarpThreads.has(currentWarpThread)
                    ? state.indexedThreadPalette.threadPalette[currentWarpThread.threadPaletteIndex].color
                    : state.indexedThreadPalette.threadPalette[currentWeftThread.threadPaletteIndex].color;
            });
        });
        return colorBuffer;
    }

    const getValidDimension = (dimension: number) => {
        return !isNaN(dimension) && dimension > 0 ? dimension : 1;
    }

    const getValidatedDimensions = (dimensions: LoomDimensions) => Object.fromEntries(
        Object.entries(dimensions)
            .map(([k, v]) => [k, getValidDimension(v)])
    ) as LoomDimensions;

    const handleDimensionsChange = (dimensions: LoomDimensions) => {
        dimensions = getValidatedDimensions(dimensions);
        dispatch({ type: LoomActionType.SET_HARNESSCOUNT, harnessCount: dimensions.harnessCount });
        dispatch({ type: LoomActionType.SET_TREADLECOUNT, treadleCount: dimensions.treadleCount });
        dispatch({ type: LoomActionType.SET_WARPCOUNT, warpCount: dimensions.warpCount });
        dispatch({ type: LoomActionType.SET_WEFTCOUNT, weftCount: dimensions.weftCount });
    }

    const handleSelectThreadDataSource = (selectedThreadDataSourceIndex: number) => {
        dispatch({ type: LoomActionType.SET_SELECTEDTHREADDATASOURCEINDEX, dataSourceIndex: selectedThreadDataSourceIndex });
    }

    const handleOnAddThreadDataSource = (threadDataSourceToAdd: ThreadDataSource) => {
        dispatch({ type: LoomActionType.ADD_THREADDATASOURCE, dataSource: threadDataSourceToAdd });
    }

    const handleSetThreadDataSource = (newthreadDataSource: ThreadDataSource) => {
        dispatch({ type: LoomActionType.SET_SELECTEDTHREADDATASOURCE, dataSource: newthreadDataSource })
    }

    const treadlingText: string = state.treadlingInstructions.map(instruction => state.treadles.findIndex(treadle => treadle === instruction)).join('');
    // const threadingText = state.treadlingInstructions
    // const tieupText = state.treadlingInstructions

    const handleTreadlingChange = (e: any) => {

    }

    // const handleThreadingChange = (e: any) => {

    // }

    // const handleTieupChange = (e: any) => {

    // }

    return (
        <div className="LoomEditorContainer">
            <div className="LoomPane">
                <div className="LoomContainer"
                    style={{
                        gridTemplateColumns: (state.dimensions.warpCount * imageCellSize) + "px auto auto",
                        gridTemplateRows: "auto auto " + (state.dimensions.weftCount * imageCellSize) + "px"
                    }}>
                    <ThreadButtonGrid
                        subGridType={SubGridType.WARPTHREADTABLE}
                        cellSize={{ width: imageCellSize, height: (imageCellSize / 2.) }}
                        gridValues={state.warpThreads}
                        orientation={Orientation.HORIZONTAL}
                        onClickHandler={loomGridOnClickEventHandler}
                        palette={state.indexedThreadPalette}
                        className={"justifyEnd"} />
                    <span className="void">&nbsp;</span>
                    <span className="void">&nbsp;</span>
                    <ButtonGrid
                        subGridType={SubGridType.HARNESSTOTHREADTABLE}
                        cellSize={imageCellSize}
                        gridValues={topGridValues(state.warpThreads, state.harnesses)}
                        onClickHandler={loomGridOnClickEventHandler}
                        palette={state.indexedThreadPalette}
                        className={"justifyEnd"} />
                    <ButtonGrid
                        subGridType={SubGridType.TIEUPTABLE}
                        cellSize={imageCellSize}
                        gridValues={tieup(state.harnesses, state.treadles)}
                        onClickHandler={loomGridOnClickEventHandler}
                        palette={state.indexedThreadPalette} />
                    <span className="void">&nbsp;</span>

                    <div className="CanvasContainer">
                        <Canvas
                            className="CanvasWrapper"
                            gl={{ preserveDrawingBuffer: true }}>
                            <Scene
                                warpThreadCount={state.dimensions.warpCount}
                                weftThreadCount={state.dimensions.weftCount}
                                unitSize={imageCellSize}
                                repeats={imageScale}
                                colorBuffer={weaveDisplayColorBuffer(state)}
                                cameraMode={cameraMode}
                            />
                        </Canvas>
                        <div id="CanvasResizer"
                            onMouseDown={(e) => console.log("mdown", e)}
                            onMouseMove={(e) => console.log("mmove", e)}
                            onMouseUp={(e) => console.log("mup", e)} />
                    </div>
                    <ButtonGrid
                        subGridType={SubGridType.TREADLINGTABLE}
                        cellSize={imageCellSize}
                        gridValues={rightGridValues(state.treadles, state.treadlingInstructions)}
                        onClickHandler={loomGridOnClickEventHandler}
                        palette={state.indexedThreadPalette} />
                    <ThreadButtonGrid
                        subGridType={SubGridType.WEFTTHREADTABLE}
                        cellSize={{ width: (imageCellSize / 2.), height: imageCellSize }}
                        gridValues={state.weftThreads} orientation={Orientation.VERTICAL}
                        onClickHandler={loomGridOnClickEventHandler}
                        palette={state.indexedThreadPalette} />
                </div>
            </div>
            <div className="EditorPanes">
                <DimensionsEditor
                    dimensions={state.dimensions}
                    onDimensionsChange={handleDimensionsChange}
                />
                <ImageEditor>
                    <label style={{ verticalAlign: "top" }} htmlFor="cellSize">cell size </label>
                    <input type="range" min="2" max="16" defaultValue="16" name="cellSize" id="cellSizeSlider" onChange={({ target }) => setImageCellSize(parseInt(target.value))} />
                    <label style={{ verticalAlign: "top" }} htmlFor="scaleSlider">pattern scale </label>
                    <input type="range" min="1" max="16" defaultValue="1" name="scaleSlider" id="scaleSlider" onChange={({ target }) => setImageScale(parseInt(target.value))} />
                </ImageEditor>
                <ThreadEditor
                    onSelectThreadDataSource={handleSelectThreadDataSource}
                    onSetThreadDataSource={handleSetThreadDataSource}
                    onAddThreadDataSource={handleOnAddThreadDataSource}
                    indexedThreadPalette={state.indexedThreadPalette} />
                <Panel>
                    <h1>Text Editors (experimental)</h1>
                    Treadling
                    <textarea className="EditorPanes--text-editors" value={treadlingText} onChange={handleTreadlingChange}></textarea>
                    {/* Threading
                    <textarea className="EditorPanes--text-editors" value={threadingText} onChange={handleThreadingChange}></textarea>
                    Tie-up
                    <textarea className="EditorPanes--text-editors" value={tieupText} onChange={handleTieupChange}></textarea> */}
                </Panel>
                <div className="divider" />
                <InfoPanel />
            </div>
        </div>
    )
}

export default Loom;
