export enum ActionType {
    SET_WARPCOUNT,
    SET_WEFTCOUNT,
    SET_TREADLECOUNT,
    SET_HARNESSCOUNT
  }
  
export type Action =
| { type: ActionType.SET_WARPCOUNT; warpCount: number;}
| { type: ActionType.SET_WEFTCOUNT; weftCount: number;}
| { type: ActionType.SET_TREADLECOUNT; treadleCount: number;}
| { type: ActionType.SET_HARNESSCOUNT; harnessCount: number;}