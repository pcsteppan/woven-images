import { useEffect, useState } from 'react';
import { IndexedThreadPalette, Thread, ThreadDataSource } from '../../types';
import { createThread, createThreadDataSource } from '../../utils';
import './ThreadEditor.css'
var cloneDeep = require('lodash/cloneDeep');

interface ThreadEditorProps {
    indexedThreadPalette: IndexedThreadPalette
    onSelectThreadDataSource: (index: number) => void
    onSetThreadDataSource: (threadDataSource: ThreadDataSource) => void
    onAddThreadDataSource: (threadDataSource: ThreadDataSource) => void
}

export const ThreadEditor = (props: ThreadEditorProps) => {
    const [newThreadDataSource, setNewThreadDataSource] = useState<ThreadDataSource>(createThreadDataSource("000000"));
    const [paletteLock, setPaletteLock] = useState<boolean>(false);

    const handleColorPickerOnChange = (e: any) => {
        if (!paletteLock) {
            const newThreadDataSource = { ...props.indexedThreadPalette.threadPalette[props.indexedThreadPalette.selectedIndex], color: e.target.value }
            props.onSetThreadDataSource(newThreadDataSource);
        }
        setNewThreadDataSource({ ...newThreadDataSource, color: e.target.value })
    }

    const handleAddThreadOnClick = (e: any) => {
        props.onAddThreadDataSource(newThreadDataSource);
    }

    const togglePaletteLock = () => {
        setPaletteLock(!paletteLock);
    }

    const threadItems = props.indexedThreadPalette.threadPalette.map((threadDataSource, i) => {
        const classes = "Thread" + ((i == props.indexedThreadPalette.selectedIndex) ? " selected" : "");
        // console.log(threadDataSource.color);
        return <div className={classes}
            id={"thread-" + i.toString()}
            style={{ backgroundColor: threadDataSource.color }}
            onClick={(e: any) => { props.onSelectThreadDataSource(e.target.id.split('-')[1]) }} />
    })

    return (
        <div className="ThreadEditorContainer Panel">
            <h1>Thread Palette</h1>
            <div className="PanelContent">
                <div className="ThreadContainer">
                    {threadItems}
                    <button className="AddThreadButton"
                        onClick={handleAddThreadOnClick}>+</button>
                </div>
                <div className="ThreadAttributeDesigner">
                    <input className="ColorPicker" type="color" id="ColorPicker" onChange={handleColorPickerOnChange}></input>
                </div>
                <button className="LockBtn" onClick={togglePaletteLock}>{paletteLock ? "Unlock Palette" : "Lock Palette"}</button>
            </div>
        </div>
    )
}