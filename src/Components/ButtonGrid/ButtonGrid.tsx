import React, { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { SubGridType } from '../../types';
import Button from '../Button/Button';
import './ButtonGrid.scss';

interface ButtonGridProps {
    gridValues: boolean[][]; 
    // setGridValues: Dispatch<SetStateAction<boolean[][]>>;
    cellSize: number;
    subGridType: SubGridType;
    onClickHandler: (e: React.MouseEvent<HTMLDivElement>, type: SubGridType) => void;
}

const ButtonGrid = (props: ButtonGridProps) => {

    const handleButtonClick = (e: React.MouseEvent<HTMLDivElement>) => {
        props.onClickHandler(e, props.subGridType);
    }

    const arrayOfButtons = props.gridValues.map((row, rowIndex) => {
        return row.map((value, colIndex) => {
            return <Button value={value}
                           row={rowIndex}
                           col={colIndex}
                           cellSize={props.cellSize}
                           onClickHandler={handleButtonClick}/>
        })
    })

    return (
        <div className="ButtonGrid"
             style={{gridTemplateRows: `repeat(1fr, ${props.gridValues.length})`,
                     gridTemplateColumns: `repeat(1fr, ${props.gridValues[0].length})`,
                     width: `${props.gridValues[0].length*props.cellSize}px`,
                     height: `${props.gridValues.length*props.cellSize}px`}}>
            {arrayOfButtons}
        </div>
    )
}

export default ButtonGrid;