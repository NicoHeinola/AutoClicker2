import "styles/components/menu/menu.scss";
import SubMenu from "./SubMenu";
import { useCallback, useState } from "react";

const Menu = (props) => {

    const { items = [] } = props;

    const [visibleName, setVisibleName] = useState("");

    const onHoverItem = useCallback((name) => {
        setVisibleName(name);
    }, []);

    const onUnHoverItem = useCallback(() => {
        setVisibleName("");
    }, []);

    const onClick = useCallback((item) => {
        if (visibleName !== item.name) {
            return;
        }

        if (item.onClick) {
            item.onClick();
        }

    }, [visibleName]);

    return (
        <div className="menu">
            {items.map(item =>
                <div onMouseLeave={onUnHoverItem} key={item.name} className={"menu-item-container" + ((visibleName === item.name) ? " hovered" : "")}>
                    <p onClick={() => onClick(item)} onMouseEnter={() => onHoverItem(item.name)} className="text">{item.name}</p>
                    <SubMenu onClick={onUnHoverItem} visible={item.name === visibleName} items={item.items}></SubMenu>
                </div>
            )}
        </div>
    )
}

export default Menu;