import "styles/components/inputs/radiobutton.scss";

const RadioButton = (props) => {

    const { value, isChecked, onChecked, text } = props;
    const checkedClass = isChecked ? " checked" : "";

    const checked = () => {
        if (onChecked) {
            onChecked(value);
        }
    }

    return (
        <div className={"radio-button" + checkedClass} onClick={checked} >
            <div className={"input-container" + checkedClass}>
                <div className={"ball" + checkedClass}></div>
            </div>
            <p className="text">{text}</p>
        </div>
    )
}

export default RadioButton;