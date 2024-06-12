import "styles/components/inputs/custombutton.scss";

const CustomButton = (props) => {

    const { children, onClick } = props;

    const clicked = (e) => {
        if (onClick) {
            onClick(e)
        }
    }

    return (
        <div className="custom-button">
            <button onClick={clicked}>{children}</button>
        </div>
    )
}

export default CustomButton;