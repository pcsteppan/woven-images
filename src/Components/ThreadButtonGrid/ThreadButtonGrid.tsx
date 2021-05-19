import React, { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { IndexedThreadPalette, Orientation, SubGridType, Thread } from '../../types';
import Button from '../Button/Button';
import '../ButtonGrid/ButtonGrid.scss';

interface ThreadButtonGridProps {
    gridValues: Thread[];
    orientation: Orientation;
    // setGridValues: Dispatch<SetStateAction<boolean[][]>>;
    cellSize: {width: number, height: number};
    subGridType: SubGridType;
    onClickHandler: (e: React.MouseEvent<HTMLDivElement>, subGridType: SubGridType) => void;
    palette: IndexedThreadPalette;
    className?: string;
}

const ThreadButtonGrid = (props: ThreadButtonGridProps) => {

    const buttonOnClickHandler = (e: any) => {
        props.onClickHandler(e, props.subGridType);
    }

    const arrayOfButtons = props.gridValues.map((item, index) => {
        return <Button  styleDataSource={props.palette.threadPalette[item.threadPaletteIndex]}
                        col={(props.orientation===Orientation.HORIZONTAL) ? index : 0}
                        row={(props.orientation===Orientation.VERTICAL) ? index : 0}
                        cellSize={{width: props.cellSize.width, height: props.cellSize.height}}
                        onClickHandler={buttonOnClickHandler}
                        thread={props.gridValues[index]}
                        palette={props.palette}/>
    })

    return (
        <div className={"ButtonGrid " + (props.className ? props.className : "")}
             style={{gridTemplateColumns: `repeat(1fr, ${props.orientation===Orientation.VERTICAL ? props.gridValues.length : 1})`,
                     gridTemplateRows: `repeat(1fr, ${props.orientation===Orientation.HORIZONTAL ? props.gridValues.length : 1})`,
                     width: `${(props.orientation===Orientation.HORIZONTAL ? props.gridValues.length : 1)*props.cellSize.width}px`,
                     height: `${(props.orientation===Orientation.VERTICAL ? props.gridValues.length : 1)*props.cellSize.height}px`}}>
            {arrayOfButtons}
        </div>
    )
}

export default ThreadButtonGrid;