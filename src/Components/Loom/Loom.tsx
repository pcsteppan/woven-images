import React from "react";
import WeaveDisplay from "../WeaveDisplay/WeaveDisplay"

interface LoomProps {
    warpCount: number,
    weftCount: number,
    harnessCount: number,
    treadleCount: number
}

const Loom = (props: LoomProps) => {
    return (
        <WeaveDisplay />
    )
}

export default Loom;