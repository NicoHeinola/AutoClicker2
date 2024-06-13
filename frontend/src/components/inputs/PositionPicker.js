import { useCallback, useState } from "react";
import clickAPI from "apis/clickAPI";

const { default: CustomButton } = require("./CustomButton")

const PositionPicker = (props) => {

    const { children, disabled, onPick } = props;
    const [timeLeft, setTimeLeft] = useState(0);

    const text = timeLeft > 0 ? `Picking for ${(timeLeft / 1000).toFixed(1)}s` : children;

    const sendNewPosition = useCallback(async () => {
        if (!onPick) {
            return;
        }

        const response = await clickAPI.getMousePosition();
        const mousePosition = response.data;
        const x = mousePosition.x;
        const y = mousePosition.y;

        onPick(x, y);
    }, [onPick]);

    const onClick = useCallback(() => {
        if (timeLeft > 0) {
            return;
        }

        const delayMS = 3000;
        const updateIntervalMS = 75;
        setTimeLeft(delayMS);

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                sendNewPosition();
                return Math.max(prev - updateIntervalMS, 0);
            })
        }, updateIntervalMS);

        setTimeout(async () => {
            clearInterval(interval);
            sendNewPosition();
        }, delayMS);
    }, [timeLeft, setTimeLeft, sendNewPosition]);

    return (
        <div className="position-picker">
            <CustomButton onClick={onClick} disabled={disabled}>{text}</CustomButton>
        </div>
    )
}

export default PositionPicker;