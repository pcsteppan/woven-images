import { ReactNode } from "react";
import './ToolBarMenuNode.css'

// interface ToolBarMenuNodeProps {
//     children: ReactNode[];
//     text: string
// }

const ToolBarMenuNode = (props: any) => {
    return (
        <div onClick={props.onClick} className={props.className ? props.className : "ToolBarMenuNode"}>
            <span>{props.text}</span>
            <div className={"ToolBarMenuSubNodes "+ (props.children ? "populated" : "")}>
                {props.children}
            </div>
        </div>
    )
}

export default ToolBarMenuNode;