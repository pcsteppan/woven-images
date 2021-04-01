import React from "react";
import { useEffect, useRef } from "react";

// interface WeaveDisplayProps {
//     Array<DrawingInstruction> 
// }

const WeaveDisplay = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
    // Initialize
    if (canvasRef.current) {
        canvasCtxRef.current = canvasRef.current.getContext('2d');
        let ctx = canvasCtxRef.current; // Assigning to a temp variable
        ctx!.beginPath(); // Note the Non Null Assertion
        // ctx!.arc(95, 50, 40, 0, 2 * Math.PI);
        ctx!.rect(0,0,100,100);
        // ctx!.stroke();
        ctx!.fill();
    }
    }, []);
    

    return <canvas ref={canvasRef}/>
}

export default WeaveDisplay;