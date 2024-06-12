import "styles/components/inputs/custombutton.scss";

const CustomButton = (props) => {

    const { children, onClick, className } = props;

    const classNameValidated = className ? ` ${className}` : "";

    const clicked = (e) => {
        if (onClick) {
            onClick(e)
        }
    }

    return (
        <div className={"custom-button" + classNameValidated}>
            <button onClick={clicked}>{children}</button>
        </div>
    )
}

export default CustomButton;