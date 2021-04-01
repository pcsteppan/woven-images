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
  SET_TREADLINGINSTRUCTION
}

export type LoomAction =
| { type: LoomActionType.SET_HARNESSTOTHREADATTACHMENTS; harnessID: number; threadID: number; }
| { type: LoomActionType.SET_TREADLETOHARNESSATTACHMENTS; treadleID: number; harnessID: number; }
| { type: LoomActionType.SET_TREADLINGINSTRUCTION; treadleID: number; instructionIndex: number; }

export type LoomState = {
  harnesses: Harness[];
  warpThreads: Thread[];
  weftThreads: Thread[];
  treadles: Treadle[];
  treadlingInstructions: (Treadle | null)[];
}

export type Harness = {
  threads: Set<Thread>
}

export type Treadle = {
  harnesses: Set<Harness>
}

export type Thread = {
  value: boolean
}

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

