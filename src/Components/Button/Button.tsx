import React, { MouseEventHandler } from 'react';
import './Button.css';

interface ButtonProps {
    value: boolean,
    row: number,
    col: number,
    onClickHandler(row: number, col: number) : (...args: any) => void;
}

const Button = (props: ButtonProps) => {
    return <div className={"button " + (props.value ? "isActive" : "")}
                style={{gridRow: props.row+1, gridColumn: props.col+1}}
                onClick={props.onClickHandler(props.row, props.col)}></div>
}

export default Button;