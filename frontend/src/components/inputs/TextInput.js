import { useState } from "react";
import "styles/components/inputs/textinput.scss";

const TextInput = (props) => {

    const { type, placeholder, value = "", onChange, className, min, max, disabled, allowTyping = true, icons = [], maxDecimals = 0 } = props;

    const validateNumberDecimals = (number) => {
        if (maxDecimals > -1) {
            let stringNumber = `${number}`
            let splitNumber = stringNumber.split(".");

            if (splitNumber.length > 1) {
                const wholePart = splitNumber[0];
                let decimalPart = splitNumber[1];
                decimalPart = decimalPart.substring(0, maxDecimals);
                console.log(decimalPart);
                decimalPart = decimalPart.replace(/\.?0+$/, '');
                const newNumberString = `${wholePart}.${decimalPart}`
                number = Number(newNumberString);
            }
        }

        return number;
    }

    const classNameValidated = className ? ` ${className}` : "";
    const valueValidated = (type === "number") ? Number(value) : value;

    const [focus, setFocus] = useState(false);

    const focusClass = focus ? " focus" : "";
    const hasTextClass = valueValidated !== "" ? " has-text" : "";
    const disabledClass = disabled ? " disabled" : "";
    const dontAllowTypingClass = !allowTyping ? " dont-allow-typing" : "";

    const onInputChange = (e) => {
        let newValue = e.target.value;

        if (type === "number") {
            newValue = Number(newValue);
            let newValueValidated = newValue;

            // Min and max number checks
            let minNumber = Number(min);
            let maxNumber = Number(max);

            if (!isNaN(minNumber) && newValueValidated < minNumber) {
                newValueValidated = minNumber;
            } else if (!isNaN(maxNumber) && newValueValidated > maxNumber) {
                newValueValidated = maxNumber;
            }

            newValueValidated = validateNumberDecimals(newValueValidated);
            newValue = newValueValidated
        }

        if (newValue === value) {
            return;
        }

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