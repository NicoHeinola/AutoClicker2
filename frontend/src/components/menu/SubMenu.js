import { useCallback, useState } from "react";
import "styles/components/menu/submenu.scss";

const SubMenu = (props) => {

    const { visible, onClick, items = [] } = props;

    const [visibleName, setVisibleName] = useState("");

    const onHoverItem = useCallback((name) => {
        setVisibleName(name);
    }, []);

    const onUnHoverItem = useCallback(() => {
        setVisibleName("");
    }, []);

    const click = useCallback((item) => {
        if (visibleName !== item.name || !visible) {
            return;
        }

        if (onClick) {
            onClick();
        }

        if (item.onClick) {
            item.onClick();
        }
    }, [visibleName, visible, onClick]);

    return (
        <div className={"sub-menu" + (visible ? " visible" : "")}>
            {items.map(item =>
                <div onMouseLeave={onUnHoverItem} key={item.name} className={"item" + ((visibleName === item.name && visible) ? " hovered" : "")}>
                    <div className="info" onClick={() => click(item)} onMouseEnter={() => onHoverItem(item.name)}>
                        <p>{item.name}</p>
                        {
                            item.type === "menu" ?
                                <img alt="arrow" className="icon" src="icons/right-arrow.png" />
                                :
                                <></>
                        }
                    </div>
                    {
                        item.type === "menu" ?
                            <SubMenu onClick={onClick} visible={item.name === visibleName} items={item.items} />
                            :
                            <></>
                    }
                </div>
            )}
        </div>
    )
}

export default SubMenu;