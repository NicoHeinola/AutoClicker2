import { useState } from "react";
import "styles/components/inputs/textinput.scss";

const TextInput = (props) => {

    const { type, placeholder, value, onChange, className, min, max, disabled, allowTyping = true, icons = [] } = props;

    const classNameValidated = className ? ` ${className}` : "";
    const valueValidated = (value !== undefined && value !== null) ? value : "";

    const [focus, setFocus] = useState(false);

    const focusClass = focus ? " focus" : "";
    const hasTextClass = valueValidated !== "" ? " has-text" : "";
    const disabledClass = disabled ? " disabled" : "";
    const dontAllowTypingClass = !allowTyping ? " dont-allow-typing" : "";

    const onInputChange = (e) => {
        let newValue = e.target.value;

        if (type === "number") {
            newValue = Number(newValue);

            // Min and max number checks
            let minNumber = Number(min);
            let maxNumber = Number(max);

            if (!isNaN(minNumber) && newValue < minNumber) {
                newValue = minNumber;
            } else if (!isNaN(maxNumber) && newValue > maxNumber) {
                newValue = maxNumber;
            }
        }

        newValue = Math.round(newValue);

        if (onChange) {
            onChange(newValue);
        }
    }

    const onIconClicked = (icon) => {
        if (disabled) {
            return;
        }

        icon.onClick();
    }

    return (
        <div className={"text-input" + dontAllowTypingClass + classNameValidated + focusClass + hasTextClass + disabledClass}>
            <div className="input">
                <input disabled={disabled || !allowTyping} value={valueValidated} onChange={onInputChange} type={type} onBlur={() => setFocus(false)} onFocus={() => setFocus(true)} />
                <p className={"placeholder" + hasTextClass}>{placeholder}</p>
            </div>
            <div className={"underline" + focusClass}>
                <div className="color"></div>
            </div>
            <div className="icons">
                {icons.map(icon =>
                    <img className={"icon" + disabledClass} key={icon.key} alt={icon.alt} src={icon.src} onClick={() => onIconClicked(icon)} />
                )}
            </div>
        </div >
    )
}

export default TextInput;