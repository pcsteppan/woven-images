import './ToolBarMenu.css';

// interface ToolBarMenuProps {
//     name: string,
//     children: JSX.Element[]
// }

const ToolBarMenu = (props: any) => {


    return (
        <div className="ToolBarMenu">
        <div className="ToolBarMenuName">{props.name}</div>
        <div className="ToolBarMenuChildren">
            {props.children}
        </div>
        </div>
    )
}

export default ToolBarMenu;