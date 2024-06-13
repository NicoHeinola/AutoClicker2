import "styles/views/frontpageview.scss";

import { connect } from "react-redux";
import GroupBox from "components/group/GroupBox";
import TextInput from "components/inputs/TextInput";
import CustomButton from "components/inputs/CustomButton";
import RadioButton from "components/inputs/RadioButton";
import { loadSettingsCall, updateSettingsCall } from "store/reducers/settingsReducer";
import { useCallback, useEffect } from "react";
import { loadPlayStateCall, startClickingCall, stopClickingCall } from "store/reducers/clickReducer";
import KeyboardListeningInput from "components/inputs/KeyboardListeningInput";

const FrontPageView = (props) => {

    const { updateSettingsCall, loadSettingsCall, settings, playState, startClickingCall, stopClickingCall, loadPlayStateCall } = props;

    useEffect(() => {
        loadSettingsCall();
        loadPlayStateCall();
    }, [loadSettingsCall, loadPlayStateCall]);

    const clickIntervalMS = settings["click-interval-ms"];
    const clicksPerSecond = settings["clicks-per-second"];
    const speedType = settings["click-speed-type"];
    const positionType = settings["click-position-type"];
    const clickButton = settings["click-button"];
    const clickAction = settings["click-action"];
    const clickX = settings["click-x"];
    const clickY = settings["click-y"];

    const startKeyDisplay = settings["start-hotkey-display"];
    const stopKeyDisplay = settings["stop-hotkey-display"];
    const toggleKeyDisplay = settings["toggle-hotkey-display"];

    const isPlaying = playState === "playing";
    const followMouse = positionType === "current";

    const setClicksPerSecond = useCallback((value) => {
        const conversion = value > 0 ? 1000 / value : 0;

        updateSettingsCall({ "clicks-per-second": value, "click-interval-ms": conversion });
    }, [updateSettingsCall]);

    const setClickIntervalMS = useCallback((value) => {
        const conversion = value > 0 ? 1000 / value : 0;

        updateSettingsCall({ "click-interval-ms": value, "clicks-per-second": conversion });
    }, [updateSettingsCall]);

    const setSpeedType = useCallback((value) => {
        updateSettingsCall({ "click-speed-type": value });
    }, [updateSettingsCall]);

    const setPositionType = useCallback((value) => {
        updateSettingsCall({ "click-position-type": value });
    }, [updateSettingsCall]);

    const setClickX = useCallback((value) => {
        updateSettingsCall({ "click-x": value });
    }, [updateSettingsCall]);

    const setClickY = useCallback((value) => {
        updateSettingsCall({ "click-y": value });
    }, [updateSettingsCall]);

    const setClickButton = useCallback((value) => {
        updateSettingsCall({ "click-button": value });
    }, [updateSettingsCall]);

    const setClickAction = useCallback((value) => {
        updateSettingsCall({ "click-action": value });
    }, [updateSettingsCall]);

    const startClicking = useCallback(() => {
        startClickingCall();
    }, [startClickingCall]);

    const stopClicking = useCallback(() => {
        stopClickingCall();
    }, [stopClickingCall]);

    const setStartKey = useCallback((code, name) => {
        updateSettingsCall({ "start-hotkey": code, "start-hotkey-display": name });
    }, [updateSettingsCall]);

    const setStopKey = useCallback((code, name) => {
        updateSettingsCall({ "stop-hotkey": code, "stop-hotkey-display": name });
    }, [updateSettingsCall]);

    const setToggleKey = useCallback((code, name) => {
        updateSettingsCall({ "toggle-hotkey": code, "toggle-hotkey-display": name });
    }, [updateSettingsCall]);

    const clickSpeed = (speedType === "cps") ? clicksPerSecond : clickIntervalMS;
    const clickSpeedInputPlaceholder = (speedType === "cps") ? "Clicks per second" : "Click interval (ms)"
    const clickSpeedChangeFunc = (speedType === "cps") ? setClicksPerSecond : setClickIntervalMS;

    return (
        <div className="front-page-view">
            <div className="row-box w-100 grow">
                <GroupBox title="Speed">
                    <div className="row-box">
                        <RadioButton disabled={isPlaying} onChecked={setSpeedType} value="cps" text="Clicks per second" isChecked={speedType === "cps"} />
                        <RadioButton disabled={isPlaying} onChecked={setSpeedType} value="interval" text="Interval (ms)" isChecked={speedType === "interval"} />
                    </div>
                    <TextInput disabled={isPlaying} onChange={clickSpeedChangeFunc} value={clickSpeed} min={0} max={100000000000} type="number" placeholder={clickSpeedInputPlaceholder} />
                </GroupBox>
            </div>
            <div className="row-box w-100 grow">
                <div className="row-box w-50">
                    <GroupBox title="Button" className="w-50">
                        <RadioButton disabled={isPlaying} onChecked={setClickButton} value="left" text="Left" isChecked={clickButton === "left"} />
                        <RadioButton disabled={isPlaying} onChecked={setClickButton} value="middle" text="Middle" isChecked={clickButton === "middle"} />
                        <RadioButton disabled={isPlaying} onChecked={setClickButton} value="right" text="Right" isChecked={clickButton === "right"} />
                    </GroupBox>
                    <GroupBox title="Action" className="w-50">
                        <RadioButton disabled={isPlaying} onChecked={setClickAction} value="click" text="Click" isChecked={clickAction === "click"} />
                        <RadioButton disabled={isPlaying} onChecked={setClickAction} value="hold" text="Hold" isChecked={clickAction === "hold"} />
                        <RadioButton disabled={isPlaying} onChecked={setClickAction} value="release" text="Release" isChecked={clickAction === "release"} />
                    </GroupBox>
                </div>
                <GroupBox title="Position" className="w-50">
                    <div className="row-box">
                        <RadioButton disabled={isPlaying} onChecked={setPositionType} value="current" text="Follow" isChecked={positionType === "current"} />
                        <RadioButton disabled={isPlaying} onChecked={setPositionType} value="at" text="Pick" isChecked={positionType === "at"} />
                    </div>
                    <CustomButton disabled={isPlaying || followMouse} >Pick a position</CustomButton>
                    <div className="row-box">
                        <TextInput disabled={isPlaying || followMouse} type="number" onChange={setClickX} placeholder="X" min={0} max={9999999999} value={clickX}></TextInput>
                        <TextInput disabled={isPlaying || followMouse} type="number" onChange={setClickY} placeholder="Y" min={0} max={9999999999} value={clickY}></TextInput>
                    </div>
                </GroupBox>
            </div>
            <div className="row-box w-100 grow">
                <GroupBox title="Hotkeys" className="w-50">
                    <div className="row-box">
                        <KeyboardListeningInput value={startKeyDisplay} onChange={setStartKey} disabled={isPlaying} placeholder="Start" />
                        <KeyboardListeningInput value={stopKeyDisplay} onChange={setStopKey} disabled={isPlaying} placeholder="Stop" />
                        <KeyboardListeningInput value={toggleKeyDisplay} onChange={setToggleKey} disabled={isPlaying} placeholder="Toggle" />
                    </div>
                </GroupBox>
            </div>
            <div className="row-box w-100 grow">
                <GroupBox title="Other" className="w-50">
                </GroupBox>
            </div>
            <div className="row-box w-100 grow">
                <CustomButton disabled={isPlaying} onClick={startClicking} className="grow">Start</CustomButton>
                <CustomButton disabled={!isPlaying} onClick={stopClicking} className="grow">Stop</CustomButton>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        settings: state.settings.settings,
        playState: state.click.playState,
    };
};

const mapDispatchToProps = {
    loadSettingsCall,
    updateSettingsCall,
    startClickingCall,
    stopClickingCall,
    loadPlayStateCall
};

export default connect(mapStateToProps, mapDispatchToProps)(FrontPageView);