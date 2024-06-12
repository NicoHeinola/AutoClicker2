import "styles/components/inputs/custombutton.scss";

const CustomButton = (props) => {

    const { children, onClick, className, disabled } = props;

    const classNameValidated = className ? ` ${className}` : "";
    const disabledClass = disabled ? " disabled" : "";

    const clicked = (e) => {
        if (onClick) {
            onClick(e)
        }
    }

    return (
        <div className={"custom-button" + classNameValidated + disabledClass}>
            <button onClick={clicked} className={disabledClass}>{children}</button>
        </div>
    )
}

export default CustomButton;