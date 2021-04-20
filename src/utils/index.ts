import { Harness, IndexedThreadPalette, LoomDimensions, LoomState, LoomStateStringRepresentation, Thread, ThreadDataSource, Treadle } from "../types";
var cloneDeep = require('lodash/cloneDeep');

export const dimensionDefault : LoomDimensions = {
    harnessCount: 4,
    treadleCount: 4,
    warpCount: 16,
    weftCount: 16,
    cellSize: 16
}

export const defaultWarpThreadColor = "#FFFFFF";
export const defaultWeftThreadColor = "#000000";

export const defaultWarpThread : Thread = {
    id: 0,
    dataSource: {
        color: defaultWarpThreadColor
    }
}

export const defaultWeftThread : Thread = {
    id: 0,
    dataSource: {
        color: defaultWeftThreadColor
    }
}

export function decamelize(str: string, separator: string){
    separator = typeof separator === 'undefined' ? '_' : separator;
    
    return str
    .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
    .toLowerCase();
}

export const createHarness = () : Harness => {
    return { threads: new Set<Thread>() } 
}

export const createTreadle = () : Treadle => {
    return { harnesses: new Set<Harness>() } 
}

export const createThread = (id: number, color: string) : Thread => {
    return {
        id,
        dataSource: {
            color
        }
    }
}

// export function arrayDimensionsFromString(str: String) : {rows: number, cols: number} {
//     let min = Number.MAX_VALUE;
//     let max = Number.MIN_VALUE;
//     let sepStr = str.split(",");
//     let length = 0;
//     sepStr.forEach(substring => {
//         if(substring.includes("-")) {
//             substring.split("-").forEach(num => {
//                 min = Math.min(min, parseInt(num));
//                 max = Math.max(max, parseInt(num));
//             })
//         } else {
//             min = Math.min(min, parseInt(substring));
//             max = Math.max(max, parseInt(substring));
//         }
//         length += 1;
//     })
//     const numCols = length;
//     const numRows = max-min;
//     return {
//         rows: numRows+1,
//         cols: numCols,
//     }
// }

export function loomDimensionsFromString(obj: LoomStateStringRepresentation) : LoomDimensions {
    const {threading, tieup, treadling} = obj.data;
    const tieupNumbers : number[] = numbersFromString(tieup);
    console.log(Math.max(...tieupNumbers));
    return {
        warpCount: threading.split(',').length,
        weftCount: expandPatternString(treadling).split(',').length,
        treadleCount: tieup.split(',').length,
        harnessCount: Math.max(...tieupNumbers),
        cellSize: 12
    }
}

function expandPatternString(str: string) : string {
    // 1x4 = 1,1,1,1,
    const regex = /(\d+)x(\d+)/g;
    let newStr = str.replaceAll(regex, (match, p1, p2) => {
        const newSubstring = (p1+",").repeat(p2)
        return newSubstring
    })
    
    newStr = newStr.replaceAll(/,,/g, ",")
    if (newStr.endsWith(",")) 
        newStr = newStr.substring(0, newStr.length-1);
    
    return newStr;
}

function numbersFromString(str: string) : number[] {
    const regex = /(\d+)/g;
    const matches = str.match(regex);
    return matches ? 
        matches.map(s => parseInt(s)) :
        [];
}

export function createThreadDataSource(color: string) : ThreadDataSource {
    return {
        color: color
    }
}

export function createLoomState(dimensions: LoomDimensions) : LoomState {

    const harnesses = (harnessCount: number) : Array<Harness> => {
        return new Array(harnessCount).fill(createHarness()).map(_ => createHarness());
    }

    const warpThreads = (warpCount: number) : Array<Thread> => {
        return new Array(warpCount).fill(defaultWarpThread).map((_, i) => createThread(i, defaultWarpThreadColor));
    }

    const weftThreads = (warpCount: number) : Array<Thread> => {
        return new Array(warpCount).fill(defaultWeftThread).map((_, i) => createThread(i, defaultWeftThreadColor));
    }

    const treadles = (treadleCount: number) : Array<Treadle> => {
        return new Array(treadleCount).fill(createTreadle()).map(_ => createTreadle());
    }

    const treadlingInstructions = (weftCount: number) => {
        return new Array(weftCount).fill(null);
    }

    return {
        dimensions,
        harnesses: harnesses(dimensions.harnessCount),
        warpThreads: warpThreads(dimensions.warpCount),
        weftThreads: weftThreads(dimensions.weftCount),
        treadles: treadles(dimensions.treadleCount),
        treadlingInstructions: treadlingInstructions(dimensions.weftCount),
        threadDataSource: { color: "#FFFFFF" },
        weaveScalar: 1,
        name: "untitled",
        indexedThreadPalette: (cloneDeep(defaultIndexedThreadPalette))
    }
}

const defaultIndexedThreadPalette : IndexedThreadPalette = {
    threadPalette: [createThreadDataSource("#FFFFFF"), createThreadDataSource("#000000")],
    selectedIndex: 0
}; 

export function createLoomStateFromStringDataRepesentation(obj: LoomStateStringRepresentation) : LoomState {
    const state = createLoomState(loomDimensionsFromString(obj));
    const {threading, tieup, treadling} = obj.data;

    // parse threading
    // connect harness to warp threads
    threading.split(',')
        .map(s => parseInt(s))
        .forEach((harnessIndex, warpThreadIndex) => {
            state.harnesses[harnessIndex-1].threads.add(state.warpThreads[warpThreadIndex])
        })

    // parse tieup
    // connect treadles to harnesses
    tieup.split(',')
         .map(treadleConnections => treadleConnections.split('+')
                                                       .map(s => parseInt(s)))
         .forEach((harnessIndexes, treadleIndex) => {
            harnessIndexes.forEach(harnessIndex => {
                const inverseHarnessIndex = (state.harnesses.length-1) - (harnessIndex-1);
                state.treadles[treadleIndex].harnesses.add(state.harnesses[inverseHarnessIndex])
            })
         })
    

    // parse treadling
    // write treadling instructions
    expandPatternString(treadling)
        .split(',')
        .map(s => parseInt(s))
        .forEach((treadleIndex, treadlingInstructionIndex) => {
            state.treadlingInstructions[treadlingInstructionIndex] = state.treadles[treadleIndex-1];
        })

    state.name = obj.name;

    return state;
}