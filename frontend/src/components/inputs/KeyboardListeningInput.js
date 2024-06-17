import { useCallback, useEffect, useState } from "react";
import socket from "socket/socketManager";
import TextInput from "./TextInput";
import "styles/components/inputs/keyboardlisteninginput.scss";

const KeyboardListeningInput = (props) => {

    const { placeholder, disabled, onChange, className = "", value = "" } = props;

    const [timeLeftMS, setTimeLeftMS] = useState(0);
    const [isListeningInterval, setIsListeningInterval] = useState(null);
    const [displayValue, setDisplayValue] = useState(value);
    const [actualValue, setActualValue] = useState("");
    const [sendUpdate, setSendUpdate] = useState(false);

    const placeholderText = timeLeftMS > 0 ? `Listening for ${(timeLeftMS / 1000).toFixed(1)}s` : placeholder;

    const displayValueValidated = isListeningInterval ? displayValue : value;

    useEffect(() => {
        if (!sendUpdate) {
            return;
        }

        setSendUpdate(false);

        if (onChange) {
            onChange(actualValue, displayValue);
        }

    }, [sendUpdate, onChange, actualValue, displayValue]);

    // Handles key presses
    useEffect(() => {
        // If not listening for keys
        if (!isListeningInterval) {
            return;
        }

        const on_key_press = (data) => {
            const displayString = Object.values(data["all"]).sort((a, b) => b.length - a.length).join(" + ").toLowerCase();
            const keyCodeString = Object.keys(data["all"]).join("+").toLowerCase();
            setDisplayValue(displayString);
            setActualValue(keyCodeString);
        }

        socket.on("press", on_key_press);

        return () => {
            socket.off("press", on_key_press);
        }
    }, [isListeningInterval, actualValue, displayValue]);

    const startListening = useCallback(() => {
        // If we are already listening to keys
        if (isListeningInterval) {
            return;
        }

        const durationMS = 2000;

        setTimeLeftMS(durationMS);
        setDisplayValue("");
        setActualValue("");

        // Update the timer ui
        const interval = setInterval(() => {
            setTimeLeftMS(prev => {
                return Math.max(prev - 100, 0);
            });
        }, 100);

        // Stop the listening after a certain amount of time
        setTimeout(() => {
            clearInterval(interval);
            setIsListeningInterval(null);
            setTimeLeftMS(0);
            setSendUpdate(true);
            socket.emit("stop-listening-keys");
        }, durationMS);

        setIsListeningInterval(interval);

        socket.emit("start-listening-keys");
    }, [isListeningInterval]);

    const icons = [{ key: "keyboard", alt: "keyboard", src: "icons/keyboard.png", onClick: startListening }];

    return (
        <div className={"keyboard-listening-input " + className}>
            <TextInput value={displayValueValidated} disabled={disabled} placeholder={placeholderText} allowTyping={false} icons={icons} />
        </div>
    )
}

export default KeyboardListeningInput;