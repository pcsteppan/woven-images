import React, { useReducer, useState } from 'react';
import { ContainerAction, ContainerActionType } from '../../types';
import './Container.scss';
import Loom from '../LoomEditor/LoomEditor';

// interface ContainerState {
//     warpCount: number,
//     weftCount: number,
//     harnessCount: number,
//     treadleCount: number
// }

// const initialState : ContainerState = {
//     warpCount: 16,
//     weftCount: 16,
//     harnessCount: 4,
//     treadleCount: 4
// };

// function reducer(state: ContainerState, action: ContainerAction) {
//     switch(action.type) {
//         case ContainerActionType.SET_WARPCOUNT:
//             return {...state, warpCount: action.warpCount};
//         case ContainerActionType.SET_WEFTCOUNT:
//             return {...state, weftCount: action.weftCount};
//         case ContainerActionType.SET_HARNESSCOUNT:
//             return {...state, harnessCount: action.harnessCount};
//         case ContainerActionType.SET_TREADLECOUNT:
//             return {...state, treadleCount: action.treadleCount};
//         default:
//             throw new Error();
//     }
// }

const Container = () => {
    // const [state, dispatch] = useReducer(reducer, initialState);
    // const [inputWarpCount, setInputWarpCount] = useState<number>(state.warpCount);
    // const [inputWeftCount, setInputWeftCount] = useState<number>(state.weftCount);
    // const [inputHarnessCount, setInputHarnessCount] = useState<number>(state.harnessCount);
    // const [inputTreadleCount, setInputTreadleCount] = useState<number>(state.treadleCount);

    // const saveHandler = (e: any) => {
    //     // dispatch({type: ContainerActionType.TEST, arg: e})
    //     console.log(e);
    // }

    return (
        <div className="Container">
            <Loom 
                // warpCount={state.warpCount}
                // weftCount={state.weftCount}
                // harnessCount={state.harnessCount}
                // treadleCount={state.treadleCount}
                // cellSize={16}
                // onSave={saveHandler}
            />
        </div>
    )
}

export default Container;