import { threadId } from 'node:worker_threads';
import React, { CSSProperties, MouseEventHandler } from 'react';
import { IndexedThreadPalette, Thread, ThreadDataSource } from '../../types';
import './Button.css';

interface ButtonProps {
    styleDataSource?: ThreadDataSource,
    value?: boolean,
    row: number,
    col: number,
    cellSize: number | {width: number, height: number},
    palette: IndexedThreadPalette,
    thread?: Thread,
    onClickHandler: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Button = (props: ButtonProps) => {
    const style : CSSProperties = {
        gridRow: props.row+1,
        gridColumn: props.col+1
    }

    if(props.thread) {
        style["backgroundColor"] = props.palette.threadPalette[props.thread.threadPaletteIndex].color;
    }

    return <div className={"button " + (props.value ? "isActive" : "")}
                style={style}
                onClick={props.onClickHandler}></div>
}

export default Button;