import React, { useReducer, useState } from 'react';
import { Action, ActionType } from '../../types';
import Loom from '../Loom/Loom';

interface ContainerState {
    warpCount: number,
    weftCount: number,
    harnessCount: number,
    treadleCount: number
}

const initialState : ContainerState = {
    warpCount: 16,
    weftCount: 16,
    harnessCount: 4,
    treadleCount: 4
};

function reducer(state: ContainerState, action: Action) {
    switch(action.type) {
        case ActionType.SET_WARPCOUNT:
            return {...state, warpCount: action.warpCount};
        case ActionType.SET_WEFTCOUNT:
            return {...state, weftCount: action.weftCount};
        case ActionType.SET_HARNESSCOUNT:
            return {...state, harnessCount: action.harnessCount};
        case ActionType.SET_TREADLECOUNT:
            return {...state, treadleCount: action.treadleCount};
        default:
            throw new Error();
    }
}

const Container = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [inputWarpCount, setInputWarpCount] = useState<number>(state.warpCount);
    const [inputWeftCount, setInputWeftCount] = useState<number>(state.weftCount);
    const [inputHarnessCount, setInputHarnessCount] = useState<number>(state.harnessCount);
    const [inputTreadleCount, setInputTreadleCount] = useState<number>(state.treadleCount);

    return (
        <>
            <div>
                <form onSubmit={e => {
                    e.preventDefault();
                    dispatch({type: ActionType.SET_WARPCOUNT, warpCount: inputWarpCount})
                    dispatch({type: ActionType.SET_WEFTCOUNT, weftCount: inputWeftCount})
                    dispatch({type: ActionType.SET_HARNESSCOUNT, harnessCount: inputHarnessCount})
                    dispatch({type: ActionType.SET_TREADLECOUNT, treadleCount: inputTreadleCount})
                    }
                }>
                    <label htmlFor="warp count">Warp Count:</label>
                    <input 
                        type="text" 
                        name="warp count" 
                        value={inputWarpCount}
                        onChange={e => {
                            const i : number = Number(e.target.value);
                            typeof i === 'number' && !Number.isNaN(i) && setInputWarpCount(i);
                        }}
                    >
                    </input><br/>

                    <label htmlFor="weft count">Weft Count:</label>
                    <input 
                        type="text" 
                        name="weft count" 
                        value={inputWeftCount}
                        onChange={e => {
                            const i : number = Number(e.target.value);
                            typeof i === 'number' && !Number.isNaN(i) && setInputWeftCount(i);
                        }}
                    >
                    </input><br/>

                    <label htmlFor="harness count">Harness Count:</label>
                    <input 
                        type="text" 
                        name="harness count" 
                        value={inputHarnessCount}
                        onChange={e => {
                            const i : number = Number(e.target.value);
                            typeof i === 'number' && !Number.isNaN(i) && setInputHarnessCount(i);
                        }}
                    >
                    </input><br/>

                    <label htmlFor="treadle count">Treadle Count:</label>
                    <input
                        type="text"
                        name="treadle count"
                        value={inputTreadleCount}
                        onChange={e => {
                            const i : number = Number(e.target.value);
                            typeof i === 'number' && !Number.isNaN(i) && setInputTreadleCount(i);
                        }}
                    >
                    </input><br/>

                    <input type="submit" value="apply changes"></input>
                </form>
                warp count: {state.warpCount}<br/>
                weft count: {state.weftCount}<br/>
                harness count: {state.harnessCount}<br/>
                treadle count: {state.treadleCount}
            </div>
            <Loom 
                warpCount={state.warpCount}
                weftCount={state.weftCount}
                harnessCount={state.harnessCount}
                treadleCount={state.treadleCount}
            />
        </>
    )
}

export default Container;