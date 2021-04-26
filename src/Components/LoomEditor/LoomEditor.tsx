import React, { useEffect, useReducer, useRef, useState } from "react";
import WeaveDisplay from "../WeaveDisplay/WeaveDisplay"
import ButtonGrid from "../ButtonGrid/ButtonGrid"
import {LoomActionType, LoomAction, LoomState, Harness, Treadle, Thread, DrawingInstruction, Color, LoomDimensions, Orientation, SubGridType, ThreadDataSource} from '../../types';
import {createThread, createTreadle, createHarness, dimensionDefault, defaultWarpThread, defaultWeftThread, defaultWarpThreadColor, defaultWeftThreadColor, createLoomState} from '../../utils';
import './LoomEditor.scss'
import { DimensionsEditor } from "../DimensionsEditor/DimensionsEditor";
import { SaveLoadMenu } from "../SaveLoadMenu/SaveLoadMenu";
import { ThreadEditor } from "../ThreadEditor/ThreadEditor";
import ThreadButtonGrid from "../ThreadButtonGrid/ThreadButtonGrid";
import ImageEditor from "../ImageEditor/ImageEditor";
import { serialize } from "node:v8";
var cloneDeep = require('lodash/cloneDeep');

function reducer(state: LoomState, action: LoomAction) : LoomState {
    const stateCopy : LoomState = cloneDeep(state);

    switch(action.type) {
        case LoomActionType.SET_HARNESSTOTHREADATTACHMENTS:
            // LEFT TABLE
            { // block-scope for local consts
            const harness : Harness = stateCopy.harnesses[action.harnessID];
            const thread : Thread = stateCopy.warpThreads[action.threadID];

            if(harness.threads.has(thread)) {
                harness.threads.delete(thread);
            } else {
                for(let i = 0; i < stateCopy.harnesses.length; i++) {
                    if(stateCopy.harnesses[i].threads.has(thread)) {
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
            const treadle : Treadle = stateCopy.treadles[action.treadleID];
            const harness : Harness = stateCopy.harnesses[action.harnessID];
            
            if(treadle.harnesses.has(harness)) {
                treadle.harnesses.delete(harness);
            } else {
                treadle.harnesses.add(harness);
            }
            }
            break;
        case LoomActionType.SET_TREADLINGINSTRUCTION:
            // RIGHT TABLE
            {
            const treadle : Treadle = stateCopy.treadles[action.treadleID];
            if(stateCopy.treadlingInstructions[action.instructionIndex] === treadle) {
                stateCopy.treadlingInstructions[action.instructionIndex] = null;
            } else {
                stateCopy.treadlingInstructions[action.instructionIndex] = treadle;
            }
            }
            break;
        case LoomActionType.SET_HARNESSCOUNT:
            if(action.harnessCount > stateCopy.harnesses.length){
                while(stateCopy.harnesses.length < action.harnessCount) {
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
            if(action.treadleCount > stateCopy.treadles.length){
                while(stateCopy.treadles.length < action.treadleCount) {
                    stateCopy.treadles.push(createTreadle());
                }
            } else {
                const removedTreadles = stateCopy.treadles.splice(action.treadleCount);
                stateCopy.treadlingInstructions.forEach(instruction => {
                    removedTreadles.forEach(removedTreadle => {
                        instruction = ( instruction === removedTreadle ) ? null : instruction;
                    })
                })
            }
            stateCopy.dimensions.treadleCount = action.treadleCount;
            break;
        case LoomActionType.SET_WARPCOUNT:
            if (action.warpCount > state.warpThreads.length) {
                while(stateCopy.warpThreads.length < action.warpCount) {
                    stateCopy.warpThreads.unshift(createThread(stateCopy.warpThreads.length, defaultWarpThreadColor));
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
                while(stateCopy.weftThreads.length < action.weftCount) {
                    stateCopy.weftThreads.push(createThread(stateCopy.weftThreads.length, defaultWeftThreadColor));
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
            break;
        case LoomActionType.SET_WARPTHREADDATASOURCE:
            stateCopy.warpThreads[action.warpThreadID].dataSource = stateCopy.indexedThreadPalette.threadPalette[stateCopy.indexedThreadPalette.selectedIndex];
            break;
        case LoomActionType.SET_WEFTTHREADDATASOURCE:
            stateCopy.weftThreads[action.weftThreadID].dataSource = stateCopy.indexedThreadPalette.threadPalette[stateCopy.indexedThreadPalette.selectedIndex];
            break;
        case LoomActionType.SET_SELECTEDTHREADDATASOURCE:
            stateCopy.indexedThreadPalette.threadPalette[stateCopy.indexedThreadPalette.selectedIndex] = action.dataSource;
            break;
        case LoomActionType.ADD_THREADDATASOURCE:
            stateCopy.indexedThreadPalette.threadPalette.push(cloneDeep(action.dataSource));
            break;
        case LoomActionType.SET_SELECTEDTHREADDATASOURCEINDEX:
            stateCopy.indexedThreadPalette.selectedIndex = action.dataSourceIndex;
        // case LoomActionyType.SET_
    }
    // actions
    return stateCopy;
}

interface LoomProps {
    currentState: LoomState,
    onChange: (...args: any) => void
}

const Loom = (props: LoomProps) => {
    const [state, dispatch] = useReducer(reducer, createLoomState(dimensionDefault));

    // IMAGE PROPERTIES
    const [imageCellSize, setImageCellSize] = useState<number>(16);
    const [imageScale, setImageScale] = useState<number>(1);
    const [imageThreadWidth, setImageThreadWidth] = useState<number>(100);
    const [imageBackgroundColor, setImageBackgroundColor] = useState<string>("#000000");

    useEffect(() => {   
        dispatch({ type: LoomActionType.SET_STATE, state: props.currentState });
    }, [props.currentState]); //, [(props.currentState)]

    useEffect(() => {
        props.onChange(state);
    }, [state]);

    const loomGridOnClickEventHandler = (e: any, type: SubGridType) => {
        const target = e.target as HTMLDivElement;
        const gridRow : number = parseInt(target.style.gridRow)-1;
        const gridCol : number = parseInt(target.style.gridColumn)-1;
        switch(type) {
            case SubGridType.HARNESSTOTHREADTABLE:
                dispatch({type: LoomActionType.SET_HARNESSTOTHREADATTACHMENTS, harnessID: gridRow, threadID: gridCol});
                break;
            case SubGridType.TIEUPTABLE:
                dispatch({type: LoomActionType.SET_TREADLETOHARNESSATTACHMENTS, treadleID: gridCol, harnessID: gridRow});
                break;
            case SubGridType.TREADLINGTABLE:
                dispatch({type: LoomActionType.SET_TREADLINGINSTRUCTION, treadleID: gridCol, instructionIndex: gridRow});
                break;
            case SubGridType.WEFTTHREADTABLE:
                // Weft thread data source change
                dispatch({type: LoomActionType.SET_WEFTTHREADDATASOURCE, weftThreadID: gridRow});
                break;
            case SubGridType.WARPTHREADTABLE:
                // Warp thread data source change
                dispatch({type: LoomActionType.SET_WARPTHREADDATASOURCE, warpThreadID: gridCol});
                break;
        }
    }

    const topGridValues = (warpThreads: Thread[], harnesses: Harness[]) : Array<Array<boolean>> => {
        const gridValues : boolean[][] = new Array<Array<boolean>>(harnesses.length).fill(new Array<boolean>()).map((_, rowIndex) => {
            return new Array<boolean>(warpThreads.length).fill(false).map((_, colIndex) => {
                return harnesses[rowIndex].threads.has(warpThreads[colIndex]);
            })
        });
        return gridValues;
    }

    const tieup = (harnesses: Harness[], treadles: Treadle[]) => {
        const gridValues : boolean[][] = new Array<Array<boolean>>(harnesses.length).fill(new Array<boolean>()).map((_, rowIndex) => {
            return new Array<boolean>(treadles.length).fill(false).map((_, colIndex) => {
                return treadles[colIndex].harnesses.has(harnesses[rowIndex]);
            })
        });
        return gridValues;
    }

    const rightGridValues = (treadles: Treadle[], treadlingInstructions: (Treadle | null)[]) => {
        const gridValues : boolean[][] = new Array<Array<boolean>>(treadlingInstructions.length).fill(new Array<boolean>()).map((_, rowIndex) => {
            return new Array<boolean>(treadles.length).fill(false).map((_, colIndex) => {
                return treadlingInstructions[rowIndex] === treadles[colIndex];
            })
        });
        return gridValues;
    }

    const standardWarpDrawInstruction = (x: number, y: number, width: number, height: number, color: string) : DrawingInstruction => {
        return ((ctx: CanvasRenderingContext2D) => {
            ctx.rect(x,y,width,height);
            ctx.fillStyle = color;
        })
    }

    const standardWeftDrawInstruction = (y: number, width: number, height: number, color: string) : DrawingInstruction => {
        return ((ctx: CanvasRenderingContext2D) => {
            ctx.rect(0, y, width, height);
            ctx.fillStyle = color;
        })
    }

    const backgroundWarpDrawInstruction = (x: number, width: number, height: number, color: string) : DrawingInstruction => {
        return ((ctx: CanvasRenderingContext2D) => {
            ctx.rect(x, 0, width, height);
            ctx.fillStyle = color;
        })
    }

    const weaveDisplayDrawingInstructions = (state: LoomState): DrawingInstruction[] => {
        const instructions : DrawingInstruction[] = [];
        const size = imageCellSize;
        const threadSize = imageCellSize * (imageThreadWidth / 100.);
        const halfThreadSizeDifference = (size - threadSize);
        const hTSD = halfThreadSizeDifference;

        state.warpThreads.forEach((warpThread, col) => {
            instructions.push(backgroundWarpDrawInstruction((col*size)+hTSD, size-hTSD, state.weftThreads.length*size, warpThread.dataSource.color));
        })
        
        state.weftThreads.forEach((weftThread, row) => {
            // instructions.push(standardWeftDrawInstruction(row*size, state.warpThreads.length*size, size, weftThread.dataSource.color))
            instructions.push(standardWeftDrawInstruction((row*size)+hTSD, state.warpThreads.length*size, size-hTSD, weftThread.dataSource.color))
        })

        state.treadlingInstructions.forEach((treadle, row) => {
            if(treadle){
                treadle.harnesses.forEach(harness => {
                    harness.threads.forEach(warpThread => {
                        instructions.push(standardWarpDrawInstruction((warpThread.id*size)+hTSD, row*size, size-hTSD, size+hTSD, warpThread.dataSource.color));
                    })
                })
            }
        })
        
        return instructions;
    }

    const handleDimensionsChange = (dimensions: LoomDimensions) => {
        dispatch({ type: LoomActionType.SET_HARNESSCOUNT, harnessCount: dimensions.harnessCount});
        dispatch({ type: LoomActionType.SET_TREADLECOUNT, treadleCount: dimensions.treadleCount});
        dispatch({ type: LoomActionType.SET_WARPCOUNT, warpCount: dimensions.warpCount});
        dispatch({ type: LoomActionType.SET_WEFTCOUNT, weftCount: dimensions.weftCount});
    }

    const handleSelectThreadDataSource = (selectedThreadDataSourceIndex: number) => {
        dispatch({ type: LoomActionType.SET_SELECTEDTHREADDATASOURCEINDEX, dataSourceIndex: selectedThreadDataSourceIndex});
    }

    const handleOnAddThreadDataSource = (threadDataSourceToAdd: ThreadDataSource) => {
        dispatch({ type: LoomActionType.ADD_THREADDATASOURCE, dataSource: threadDataSourceToAdd });
    }

    const handleSetThreadDataSource = (newthreadDataSource: ThreadDataSource) => {
        dispatch({ type: LoomActionType.SET_SELECTEDTHREADDATASOURCE, dataSource: newthreadDataSource})
    }

    return (
        <div className="LoomEditorContainer">
            <div className="LoomPane">
                <div className="LoomContainer">
                    <ThreadButtonGrid 
                        subGridType={SubGridType.WARPTHREADTABLE}
                        cellSize={{width: imageCellSize, height: (imageCellSize/2.)}}
                        gridValues={state.warpThreads}
                        orientation={Orientation.HORIZONTAL}
                        onClickHandler={loomGridOnClickEventHandler}/>
                    <span className="void">&nbsp;</span>
                    <span className="void">&nbsp;</span>
                    <ButtonGrid 
                        subGridType={SubGridType.HARNESSTOTHREADTABLE} 
                        cellSize={imageCellSize}
                        gridValues={topGridValues(state.warpThreads, state.harnesses)}
                        onClickHandler={loomGridOnClickEventHandler}/>
                    <ButtonGrid 
                        subGridType={SubGridType.TIEUPTABLE} 
                        cellSize={imageCellSize}
                        gridValues={tieup(state.harnesses, state.treadles)}
                        onClickHandler={loomGridOnClickEventHandler}/>
                    <span className="void">&nbsp;</span>
                    <WeaveDisplay
                        repetitions={imageScale} 
                        dimensions={{x: state.dimensions.warpCount*imageCellSize, y: state.dimensions.weftCount*imageCellSize}}
                        drawingInstructions={weaveDisplayDrawingInstructions(state)}
                        backgroundClearColor={imageBackgroundColor}/>
                    <ButtonGrid
                        subGridType={SubGridType.TREADLINGTABLE}
                        cellSize={imageCellSize}
                        gridValues={rightGridValues(state.treadles, state.treadlingInstructions)}
                        onClickHandler={loomGridOnClickEventHandler}/>
                    <ThreadButtonGrid 
                        subGridType={SubGridType.WEFTTHREADTABLE} 
                        cellSize={{width: (imageCellSize/2.), height: imageCellSize}}
                        gridValues={state.weftThreads} orientation={Orientation.VERTICAL}
                        onClickHandler={loomGridOnClickEventHandler}/>
                </div>
            </div>
            <div className="EditorPanes">
                <DimensionsEditor
                    dimensions={state.dimensions}
                    onDimensionsChange={handleDimensionsChange}
                    />
                <ImageEditor>
                    <form className="ImageEditorForm">
                        <label style={{verticalAlign: "top"}} htmlFor="cellSize">cell size </label>
                        <input type="range" min="2" max="16" defaultValue="16" id="cellSizeSlider" onChange={({target}) => setImageCellSize(parseInt(target.value))}/><br/>

                        <label style={{verticalAlign: "top"}} htmlFor="scaleSlider">scale </label>
                        <input type="range" min="1" max="16" defaultValue="1" id="scaleSlider" onChange={({target}) => setImageScale(parseInt(target.value))}/><br/>

                        <label style={{verticalAlign: "top"}} htmlFor="threadWidthSlider">thread width </label>
                        <input type="range" min="0" max="100" defaultValue="100" id="threadWidthSlider" onChange={({target}) => setImageThreadWidth(parseInt(target.value))}/><br/>

                        <label style={{verticalAlign: "top"}} htmlFor="threadWidthSlider">background color </label>
                        <input type="color" defaultValue="#000000" id="background" className="ColorPicker" onChange={({target}) => setImageBackgroundColor((target.value))}/><br/>

                    </form>
                </ImageEditor>
                <ThreadEditor
                    onSelectThreadDataSource={handleSelectThreadDataSource}
                    onSetThreadDataSource={handleSetThreadDataSource}
                    onAddThreadDataSource={handleOnAddThreadDataSource}
                    indexedThreadPalette={state.indexedThreadPalette}/>
            </div>
        </div>
    )
}

export default Loom;
