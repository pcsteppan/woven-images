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
  | { type: ContainerActionType.SET_WARPCOUNT; warpCount: number; }
  | { type: ContainerActionType.SET_WEFTCOUNT; weftCount: number; }
  | { type: ContainerActionType.SET_TREADLECOUNT; treadleCount: number; }
  | { type: ContainerActionType.SET_HARNESSCOUNT; harnessCount: number; }

export enum LoomActionType {
  SET_HARNESSTOTHREADATTACHMENTS,
  SET_TREADLETOHARNESSATTACHMENTS,
  SET_TREADLINGINSTRUCTION,
  SET_HARNESSCOUNT,
  SET_TREADLECOUNT,
  SET_WEFTCOUNT,
  SET_WARPCOUNT,
  SET_STATE,
  SET_WARPTHREADTHREADPALETTEINDEX,
  SET_WEFTTHREADTHREADPALETTEINDEX,
  SET_SELECTEDTHREADDATASOURCEINDEX,
  SET_SELECTEDTHREADDATASOURCE,
  ADD_THREADDATASOURCE
}

export type LoomAction =
  | { type: LoomActionType.SET_HARNESSTOTHREADATTACHMENTS; harnessID: number; threadID: number; }
  | { type: LoomActionType.SET_TREADLETOHARNESSATTACHMENTS; treadleID: number; harnessID: number; }
  | { type: LoomActionType.SET_TREADLINGINSTRUCTION; treadleID: number; instructionIndex: number; }
  | { type: LoomActionType.SET_HARNESSCOUNT; harnessCount: number; }
  | { type: LoomActionType.SET_TREADLECOUNT; treadleCount: number; }
  | { type: LoomActionType.SET_WARPCOUNT; warpCount: number; }
  | { type: LoomActionType.SET_WEFTCOUNT; weftCount: number; }
  | { type: LoomActionType.SET_STATE; state: LoomState; }
  | { type: LoomActionType.SET_WARPTHREADTHREADPALETTEINDEX; warpThreadID: number; }
  | { type: LoomActionType.SET_WEFTTHREADTHREADPALETTEINDEX; weftThreadID: number; }
  | { type: LoomActionType.SET_SELECTEDTHREADDATASOURCEINDEX; dataSourceIndex: number; }
  | { type: LoomActionType.ADD_THREADDATASOURCE; dataSource: ThreadDataSource; }
  | { type: LoomActionType.SET_SELECTEDTHREADDATASOURCE; dataSource: ThreadDataSource; }

export type LoomDimensions = {
  [property: string]: number
}

export type LoomState = {
  name: string;
  id: string;
  dimensions: LoomDimensions;
  harnesses: Harness[];
  warpThreads: Thread[];
  weftThreads: Thread[];
  treadles: Treadle[];
  treadlingInstructions: (Treadle | null)[];
  threadDataSource: ThreadDataSource;
  indexedThreadPalette: IndexedThreadPalette
}

export type SerializedLoomState = string;

export type LoomStateDict = {
  [uuid: string]: SerializedLoomState
}

export type LoomStateStringRepresentation = {
  name: string,
  data: {
    threading: string,
    tieup: string,
    treadling: string
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
  threadPaletteIndex: number
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
export type DrawingInstructionWGL = (ctx: WebGL2RenderingContext, colorLocation: any, program: any) => void

export enum CameraMode {
  Orthographic,
  Perspective
}
