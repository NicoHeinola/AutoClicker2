import "styles/components/popup/popupwindow.scss";

const PopupWindow = (props) => {

    const { visible, onVisibilityChange, className, children } = props;

    const visibleClass = (visible) ? " visible" : " hidden";

    const closePopup = () => {
        if (!onVisibilityChange) {
            return;
        }

        onVisibilityChange(!visible);
    }


    return (
        <div className={"popup-window" + visibleClass + ((className) ? ` ${className}` : "")}>
            <div onClick={closePopup} className="bg"></div>
            <div className="items">
                {children}
            </div>
        </div>
    )
};

export default PopupWindow;