import { CSSProperties } from "react"

export enum SubGridType {
  WARPTHREADTABLE,
  WEFTTHREADTABLE,
  TIEUPTABLE,
  HARNESSTOTHREADTABLE,
  TREADLINGTABLE 
}

export enum Orientation {
  VERTICAL,
  HORIZONTAL
}

export enum ContainerActionType {
  SET_WARPCOUNT,
  SET_WEFTCOUNT,
  SET_TREADLECOUNT,
  SET_HARNESSCOUNT
}
  
export type ContainerAction =
| { type: ContainerActionType.SET_WARPCOUNT; warpCount: number;}
| { type: ContainerActionType.SET_WEFTCOUNT; weftCount: number;}
| { type: ContainerActionType.SET_TREADLECOUNT; treadleCount: number;}
| { type: ContainerActionType.SET_HARNESSCOUNT; harnessCount: number;}








export enum LoomActionType {
    SET_HARNESSTOTHREADATTACHMENTS,
    SET_TREADLETOHARNESSATTACHMENTS,
    SET_TREADLINGINSTRUCTION,
    SET_HARNESSCOUNT,
    SET_TREADLECOUNT,
    SET_WEFTCOUNT,
    SET_WARPCOUNT,
    SET_CELLSIZE,
    SET_STATE,
    SET_WARPTHREADDATASOURCE,
    SET_WEFTTHREADDATASOURCE,
    SET_SELECTEDTHREADDATASOURCEINDEX,
    SET_SELECTEDTHREADDATASOURCE,
    SET_SCALAR,
    ADD_THREADDATASOURCE,
    OVERWRITE_SAVE
}

export type LoomAction =
| { type: LoomActionType.SET_HARNESSTOTHREADATTACHMENTS; harnessID: number; threadID: number; }
| { type: LoomActionType.SET_TREADLETOHARNESSATTACHMENTS; treadleID: number; harnessID: number; }
| { type: LoomActionType.SET_TREADLINGINSTRUCTION; treadleID: number; instructionIndex: number; }
| { type: LoomActionType.SET_HARNESSCOUNT; harnessCount: number; }
| { type: LoomActionType.SET_TREADLECOUNT; treadleCount: number; }
| { type: LoomActionType.SET_WARPCOUNT; warpCount: number; }
| { type: LoomActionType.SET_WEFTCOUNT; weftCount: number; }
| { type: LoomActionType.SET_CELLSIZE; cellSize: number; }
| { type: LoomActionType.SET_STATE; state: LoomState; }
| { type: LoomActionType.SET_WARPTHREADDATASOURCE; warpThreadID: number; }
| { type: LoomActionType.SET_WEFTTHREADDATASOURCE; weftThreadID: number; }
| { type: LoomActionType.SET_SELECTEDTHREADDATASOURCEINDEX; dataSourceIndex: number; }
| { type: LoomActionType.ADD_THREADDATASOURCE; dataSource: ThreadDataSource; }
| { type: LoomActionType.SET_SELECTEDTHREADDATASOURCE; dataSource: ThreadDataSource; }
| { type: LoomActionType.SET_SCALAR; scalar: number; }

export type LoomDimensions = {
  [property: string]: number
}

export type LoomState = {
  name: string;
  dimensions: LoomDimensions;
  harnesses: Harness[];
  warpThreads: Thread[];
  weftThreads: Thread[];
  treadles: Treadle[];
  treadlingInstructions: (Treadle | null)[];
  threadDataSource: ThreadDataSource;
  indexedThreadPalette: IndexedThreadPalette
  weaveScalar: number;
}

export type LoomStateStringRepresentation = {
  name: string,
  data: {
    threading:  string,
    tieup:      string,
    treadling:  string
  }
}

export type Harness = {
  threads: Set<Thread>
}

export type Treadle = {
  harnesses: Set<Harness>
}

export type Thread = {
  id: number
  dataSource: ThreadDataSource
}

export type ThreadDataSource = {
  color: Color
}

export type IndexedThreadPalette = {
  threadPalette: ThreadDataSource[];
  selectedIndex: number
}

export type Color = string

export type DrawingInstruction = (ctx: CanvasRenderingContext2D) => void

// type DrawInstructions = {
//   // [instructionName: string] : (arg0: value) => value;
// }

// type Filter = {
//   [propertyName: string] : (arg0: number) => number;
// }

// const apply = (f: Filter, DI: DrawInstructions) {
 
// }

// const a: Filter = {
//   'red' : (v) => v*2,
//   'blue' : (v) => v*2,
//   'green' : (v) => v*1.5
// }

// // function which contains calls to argument
// function draw(ctx: CanvasRenderingContext2D) {
  
//   ctx.rect(0,0,10,10);
// }

