import React from "react";
import { useEffect, useRef } from "react";
import { DrawingInstruction } from "../../types";
import './WeaveDisplay.css';

interface WeaveDisplayProps { 
    dimensions: { x: number; y: number; }; 
    drawingInstructions: DrawingInstruction[];
    repetitions: number;
}

const WeaveDisplay = (props: WeaveDisplayProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
    // Initialize
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext('2d');
            let ctx = canvasCtxRef.current; // Assigning to a temp variable
            ctx!.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
            
            // Note the Non Null Assertion
            // ctx!.arc(95, 50, 40, 0, 2 * Math.PI);
            // ctx!.rect(0,0,100,100);
            
            props.drawingInstructions.forEach(instruction => {
                if(ctx){
                    ctx.beginPath();
                    instruction(ctx);
                    ctx.fill();
                }
            })

            if(ctx) {
                const pattern = ctx.createPattern(canvasRef.current, 'repeat');
                pattern?.setTransform(new DOMMatrix().scaleSelf(1/props.repetitions, 1/props.repetitions, 0, 0));
                if(pattern){
                    ctx.fillStyle = pattern;
                    ctx.fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
                }
            }
        }
    }, [props]);
    

    return <canvas className="Canvas" width={props.dimensions.x} height={props.dimensions.y} ref={canvasRef}/>
}

export default WeaveDisplay;