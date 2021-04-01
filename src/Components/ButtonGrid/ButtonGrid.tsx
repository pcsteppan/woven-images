import React, { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import Button from '../Button/Button';
import './ButtonGrid.scss';

interface ButtonGridProps {
    gridValues: boolean[][]; 
    // setGridValues: Dispatch<SetStateAction<boolean[][]>>;
    onClickHander(row: number, col: number) : (...args: any) => void;
}

const ButtonGrid = (props: ButtonGridProps) => {

    const arrayOfButtons = props.gridValues.map((row, rowIndex) => {
        return row.map((value, colIndex) => {
            return <Button value={value}
                           row={rowIndex}
                           col={colIndex}
                           onClickHandler={props.onClickHander}/>
        })
    })

    return (
        <div className="ButtonGrid"
             style={{gridTemplateRows: `repeat(1fr, ${props.gridValues.length})`,
                     gridTemplateColumns: `repeat(1fr, ${props.gridValues[0].length})`,
                     width: `${props.gridValues[0].length*16}px`,
                     height: `${props.gridValues.length*16}px`}}>
            {arrayOfButtons}
        </div>
    )
}

export default ButtonGrid;