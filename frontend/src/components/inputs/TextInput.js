import { useState } from "react";
import "styles/components/inputs/textinput.scss";

const TextInput = (props) => {

    const { type, placeholder, value, onChange, className, min, max, disabled } = props;

    const classNameValidated = className ? ` ${className}` : "";
    const valueValidated = (value !== undefined && value !== null) ? value : "";

    const [focus, setFocus] = useState(false);

    const focusClass = focus ? " focus" : "";
    const hasTextClass = valueValidated !== "" ? " has-text" : "";
    const disabledClass = disabled ? " disabled" : "";

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

    return (
        <div className={"text-input" + classNameValidated + focusClass + hasTextClass + disabledClass}>
            <input disabled={disabled} value={valueValidated} onChange={onInputChange} type={type} onBlur={() => setFocus(false)} onFocus={() => setFocus(true)} />
            <p className={"placeholder" + hasTextClass}>{placeholder}</p>
            <div className={"underline" + focusClass}></div>
        </div >
    )
}

export default TextInput;