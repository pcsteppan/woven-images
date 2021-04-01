import React, { useReducer, useState } from "react";
import WeaveDisplay from "../WeaveDisplay/WeaveDisplay"
import ButtonGrid from "../ButtonGrid/ButtonGrid"
import {LoomActionType, LoomAction, LoomState, Harness, Treadle, Thread} from '../../types';

interface LoomProps {
    warpCount: number,
    weftCount: number,
    harnessCount: number,
    treadleCount: number
}

// function toggleSetElement<Type>(s : Set<Type>, e : Type) : Set<Type> {
//     s.has(e) ? s.delete(e) : s.add(e);
// }

function reducer(state: LoomState, action: LoomAction) : LoomState {
    const stateCopy : LoomState = {
        harnesses: [...state.harnesses],
        warpThreads: [...state.warpThreads],
        weftThreads: [...state.weftThreads],
        treadles: [...state.treadles],
        treadlingInstructions: [...state.treadlingInstructions]
    };

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
                // stateCopy.harnesses.forEach(h => {
                //     if(h.threads.has(thread)) {
                //         h.threads.delete(thread);
                //     }
                // });
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
            }
            }
            break;
    }
    // actions
    return stateCopy;
}

const NewHarness = () : Harness => {
    return {threads: new Set<Thread>()} 
}

const NewTreadle = () : Treadle => {
    return {harnesses: new Set<Harness>()} 
}

const initialState: LoomState = {
    harnesses: new Array<Harness>(4).fill(NewHarness()).map(_ => NewHarness()),
    treadles: new Array<Treadle>(4).fill(NewTreadle()).map(_ => NewTreadle()),
    warpThreads: new Array<Thread>(16).fill({value: false}).map(_ => ({value: false})),
    weftThreads: new Array<Thread>(16).fill({value: true}).map(_ => ({value: true})),
    treadlingInstructions: new Array<Treadle>(16).map(_ => (null))
}

const Loom = (props: LoomProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    // const [gridValues, setGridValues] = useState([[false, false, false],[false, true, false],[true, false, true]]);

    const buttonGridOnClickHandler = (row: number, col: number) => (): void => {
        console.log(row, col);
        dispatch({type: LoomActionType.SET_HARNESSTOTHREADATTACHMENTS, harnessID: row, threadID: col});
    }

    const topGridValues = (warpThreads: Thread[], harnesses: Harness[]) : Array<Array<boolean>> => {
        console.log(harnesses);
        const gridValues : boolean[][] = new Array<Array<boolean>>(harnesses.length).fill(new Array<boolean>()).map((_, rowIndex) => {
            return new Array<boolean>(warpThreads.length).fill(false).map((_, colIndex) => {
                return harnesses[rowIndex].threads.has(warpThreads[colIndex]);
            })
        });
        return gridValues;
    }

    return (
        <>
        <ButtonGrid gridValues={topGridValues(state.warpThreads, state.harnesses)} onClickHander={buttonGridOnClickHandler}/>
        {/* <WeaveDisplay /> */}
        </>
    )
}

export default Loom;