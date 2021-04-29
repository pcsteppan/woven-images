import { Harness, IndexedThreadPalette, LoomDimensions, LoomState, LoomStateStringRepresentation, Thread, ThreadDataSource, Treadle } from "../types";
// import { uuidv4 }  from 'uuid';
const { v4: uuidv4 } = require('uuid');
var cloneDeep = require('lodash/cloneDeep');


export const dimensionDefault : LoomDimensions = {
    harnessCount: 4,
    treadleCount: 4,
    warpCount: 16,
    weftCount: 16
}

export const defaultWarpThreadColor = "#000000";
export const defaultWeftThreadColor = "#FFFFFF";

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

export function loomDimensionsFromString(obj: LoomStateStringRepresentation) : LoomDimensions {
    const {threading, tieup, treadling} = obj.data;
    const tieupNumbers : number[] = numbersFromString(tieup);
    
    return {
        warpCount: threading.split(',').length,
        weftCount: expandPatternString(treadling).split(',').length,
        treadleCount: tieup.split(',').length,
        harnessCount: Math.max(...tieupNumbers)
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

export function createUUID() : string {
    return uuidv4();
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
        id: createUUID(),
        dimensions,
        harnesses: harnesses(dimensions.harnessCount),
        warpThreads: warpThreads(dimensions.warpCount),
        weftThreads: weftThreads(dimensions.weftCount),
        treadles: treadles(dimensions.treadleCount),
        treadlingInstructions: treadlingInstructions(dimensions.weftCount),
        threadDataSource: { color: "#FFFFFF" },
        name: "untitled",
        indexedThreadPalette: (cloneDeep(defaultIndexedThreadPalette))
    }
}

type LoomPart<T> = {
    [setName: string]: Set<T>
}

export const convertLoomStateToJSON = (state: LoomState) : string => {
    return JSON.stringify({
        id: state.id,
        dimensions: state.dimensions,
        treadles: convertLoomPartToJSON(state.treadles, state.harnesses),
        harnesses: convertLoomPartToJSON(state.harnesses, state.warpThreads),
        treadlingInstructions: state.treadlingInstructions.map(treadle => treadle ? state.treadles.indexOf(treadle) : -1),
        warpThreads: state.warpThreads,//.map(thread => convertThreadToJSON(thread)),
        weftThreads: state.weftThreads,//.map(thread => convertThreadToJSON(thread)),
        threadDataSource: state.threadDataSource,
        name: state.name,
        indexedThreadPalette: state.indexedThreadPalette
    })
}

export const convertJSONToLoomState = (jsonData: string) : LoomState => {
    const state = JSON.parse(jsonData);
    state.harnesses = state.harnesses.map((subArr : Array<number>) => {
        const harness: Harness = createHarness();
        subArr.forEach((index: number) => { harness.threads.add(state.warpThreads[index])});
        return harness;
    })
    state.treadles = state.treadles.map((subArr: Array<number>) => {
        const treadle : Treadle = createTreadle();
        subArr.forEach((index: number) => { treadle.harnesses.add(state.harnesses[index])});
        return treadle;
    })
    state.treadlingInstructions = state.treadlingInstructions.map((index: number) => state.treadles[index]);
    return state;
}

// treadlingInstructions is an array of references to treadles
// a harness is an object containing a property which is a set of threads
// a treadle is an object containing a property which is a set of harnesses
// a thread is a datasource
function convertLoomPartToJSON<T>(partArr: Array<LoomPart<T>>, refArr: Array<T>) : Array<Array<number>> {
    // iterate through all items in set, push indexOf item in refArr to newArr
    const indexes : Array<Array<number>> = [];
    partArr.forEach((part, i) => {
        indexes.push([]);
        if("harnesses" in part) {
            // part is treadle, T is harness
            part.harnesses.forEach((harness : T) => {
                indexes[i].push(refArr.indexOf(harness));
            })

        } else if ("threads" in part) {
            // part is harness, T is thread
            part.threads.forEach((thread : T) => {
                indexes[i].push(refArr.indexOf(thread));
            })
        }
    })
    return indexes;
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