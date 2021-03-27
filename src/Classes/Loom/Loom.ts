import Treadle from '../Treadle/Treadle'
import Harness from '../Harness/Harness'

interface ILoom {
    treadles: number;
    harnesses: number;
    harnessConnections: Array<Harness>;
    treadlingInstructions: Array<Treadle>;
    tieup: Map<Treadle, Harness>;


}

// class Loom implements ILoom {
//     treadles: number;
//     harnesses: number;
//     harnessConnections: Harness[];
//     treadlingInstructions: Treadle[];
//     tieup: Map<Treadle, Harness>;
    
// }


// export default Loom;