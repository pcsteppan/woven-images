import { Harness, IndexedThreadPalette, LoomDimensions, LoomState, LoomStateStringRepresentation, Preset, Thread, ThreadDataSource, Treadle } from "../types";
// import { uuidv4 }  from 'uuid';
const { v4: uuidv4 } = require('uuid');
var cloneDeep = require('lodash/cloneDeep');


export const dimensionDefault: LoomDimensions = {
    harnessCount: 4,
    treadleCount: 4,
    warpCount: 16,
    weftCount: 16
}

// weft 0, warp 1
export const defaultWeftThreadColor = '#FFFFFF';
export const defaultWarpThreadColor = '#000000';
export const defaultWeftThreadPaletteIndex = 0;
export const defaultWarpThreadPaletteIndex = 1;

const defaultIndexedThreadPalette: IndexedThreadPalette = {
    threadPalette: [createThreadDataSource(defaultWeftThreadColor), createThreadDataSource(defaultWarpThreadColor)],
    selectedIndex: 0
};

export const defaultWeftThread: Thread = {
    id: 0,
    threadPaletteIndex: defaultWeftThreadPaletteIndex
}

export const defaultWarpThread: Thread = {
    id: 0,
    threadPaletteIndex: defaultWarpThreadPaletteIndex
}


export const rFromHexString = (str: String): number => parseInt(str.substring(1, 3), 16);
export const gFromHexString = (str: String): number => parseInt(str.substring(3, 5), 16);
export const bFromHexString = (str: String): number => parseInt(str.substring(5, 7), 16);

export function decamelize(str: string, separator: string) {
    separator = typeof separator === 'undefined' ? '_' : separator;

    return str
        .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
        .toLowerCase();
}

export const createHarness = (): Harness => {
    return { threads: new Set<Thread>() }
}

export const createTreadle = (): Treadle => {
    return { harnesses: new Set<Harness>() }
}

export const createThread = (id: number, threadPaletteIndex: number): Thread => {
    return {
        id,
        threadPaletteIndex
    }
}

export function loomDimensionsFromString(obj: LoomStateStringRepresentation): LoomDimensions {
    const { threading, tieup, treadling } = obj.data;
    const tieupNumbers: number[] = numbersFromString(tieup);

    return {
        warpCount: threading.split(',').length,
        weftCount: expandPatternString(treadling).split(',').length,
        treadleCount: tieup.split(',').length,
        harnessCount: Math.max(...tieupNumbers)
    }
}

// pattern strings are compressed ways of expressing repeated sequences
// an example is '1x4' which would be expanded to '1,1,1,1,' 
function expandPatternString(str: string): string {
    const regex = /(\d+)x(\d+)/g;
    let newStr = str.replaceAll(regex, (_, p1, p2) => {
        const newSubstring = (p1 + ',').repeat(p2)
        return newSubstring
    })

    newStr = newStr.replaceAll(/,,/g, ',')
    if (newStr.endsWith(','))
        newStr = newStr.substring(0, newStr.length - 1);

    return newStr;
}

function numbersFromString(str: string): number[] {
    const regex = /(\d+)/g;
    const matches = str.match(regex);
    return matches ?
        matches.map(s => parseInt(s)) :
        [];
}

export function createThreadDataSource(color: string): ThreadDataSource {
    return {
        color: color
    }
}

export function createUUID(): string {
    return uuidv4();
}

export function createArray(length: number, generatorFunction: () => any) {
    return new Array(length).fill(null).map(_ => generatorFunction());
}

export function createLoomState(dimensions: LoomDimensions): LoomState {
    const harnesses = (harnessCount: number): Array<Harness> => createArray(harnessCount, createHarness);
    const treadles = (treadleCount: number): Array<Treadle> => createArray(treadleCount, createTreadle);
    const treadlingInstructions = (weftCount: number) => createArray(weftCount, () => null);
    const warpThreads = (warpCount: number): Array<Thread> => {
        return new Array(warpCount).fill(null).map((_, i) => createThread(i, defaultWarpThreadPaletteIndex));
    }
    const weftThreads = (warpCount: number): Array<Thread> => {
        return new Array(warpCount).fill(null).map((_, i) => createThread(i, defaultWeftThreadPaletteIndex));
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

export const convertLoomStateToJSON = (state: LoomState): string => {
    return JSON.stringify({
        id: state.id,
        dimensions: state.dimensions,
        treadles: convertLoomPartToJSON(state.treadles, state.harnesses),
        harnesses: convertLoomPartToJSON(state.harnesses, state.warpThreads),
        treadlingInstructions: state.treadlingInstructions.map(treadle => treadle ? state.treadles.indexOf(treadle) : -1),
        warpThreads: state.warpThreads,
        weftThreads: state.weftThreads,
        threadDataSource: state.threadDataSource,
        name: state.name,
        indexedThreadPalette: state.indexedThreadPalette
    })
}

export const convertJSONToLoomState = (jsonData: string): LoomState => {
    const state = JSON.parse(jsonData);
    state.harnesses = state.harnesses.map((subArr: Array<number>) => {
        const harness: Harness = createHarness();
        subArr.forEach((index: number) => { harness.threads.add(state.warpThreads[index]) });
        return harness;
    })
    state.treadles = state.treadles.map((subArr: Array<number>) => {
        const treadle: Treadle = createTreadle();
        subArr.forEach((index: number) => { treadle.harnesses.add(state.harnesses[index]) });
        return treadle;
    })
    state.treadlingInstructions = state.treadlingInstructions.map((index: number) => state.treadles[index]);
    return state;
}

// treadlingInstructions is an array of references to treadles
// a harness is an object containing a property which is a set of threads
// a treadle is an object containing a property which is a set of harnesses
// a thread is a datasource
function convertLoomPartToJSON<T>(partArr: Array<LoomPart<T>>, refArr: Array<T>): Array<Array<number>> {
    // iterate through all items in set, push indexOf item in refArr to newArr
    const indexes: Array<Array<number>> = [];
    partArr.forEach((part, i) => {
        indexes.push([]);
        if ("harnesses" in part) {
            // part is treadle, T is harness
            part.harnesses.forEach((harness: T) => {
                indexes[i].push(refArr.indexOf(harness));
            })

        } else if ("threads" in part) {
            // part is harness, T is thread
            part.threads.forEach((thread: T) => {
                indexes[i].push(refArr.indexOf(thread));
            })
        }
    })
    return indexes;
}

export function createLoomStateFromStringDataRepesentation(loomStateString: LoomStateStringRepresentation): LoomState {
    const state = createLoomState(loomDimensionsFromString(loomStateString));
    const { threading, tieup, treadling } = loomStateString.data;

    // parse threading
    // connect harness to warp threads
    threading.split(',')
        .reverse()
        .map(s => parseInt(s))
        .forEach((harnessIndex, warpThreadIndex) => {
            const invertedHarnessIndex = state.harnesses.length - harnessIndex; //  (n - [1,n]) -> [n-1, 0]
            state.harnesses[invertedHarnessIndex].threads.add(state.warpThreads[warpThreadIndex])
        })

    // parse tieup
    // connect treadles to harnesses
    tieup.split(',')
        .map(treadleConnections => treadleConnections.split('+')
            .map(s => parseInt(s)))
        .forEach((harnessIndexes, treadleIndex) => {
            harnessIndexes.forEach(harnessIndex => {
                const inverseHarnessIndex = (state.harnesses.length - 1) - (harnessIndex - 1);
                state.treadles[treadleIndex].harnesses.add(state.harnesses[inverseHarnessIndex])
            })
        })

    // parse treadling
    // write treadling instructions
    expandPatternString(treadling)
        .split(',')
        .map(s => parseInt(s))
        .forEach((treadleIndex, treadlingInstructionIndex) => {
            state.treadlingInstructions[treadlingInstructionIndex] = state.treadles[treadleIndex - 1];
        })

    state.name = loomStateString.name;

    return state;
}

export function setRectangle(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}