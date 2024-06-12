import "styles/views/frontpageview.scss";

import { connect } from "react-redux";
import GroupBox from "components/group/GroupBox";
import TextInput from "components/inputs/TextInput";
import CustomButton from "components/inputs/CustomButton";
import RadioButton from "components/inputs/RadioButton";
import { loadSettingsCall, updateSettingsCall } from "store/reducers/settingsReducer";
import { useEffect } from "react";


const FrontPageView = (props) => {

    const { updateSettingsCall, loadSettingsCall, settings } = props;

    useEffect(() => {
        loadSettingsCall();
    }, [loadSettingsCall]);

    const clickIntervalMS = settings["click-interval-ms"];
    const clicksPerSecond = settings["clicks-per-second"];
    const speedType = settings["click-speed-type"];
    const positionType = settings["click-position-type"];
    const clickButton = settings["click-button"];
    const clickAction = settings["click-action"];
    const clickX = settings["click-x"];
    const clickY = settings["click-y"];

    const setClicksPerSecond = (value) => {
        const conversion = value > 0 ? 1000 / value : 0;

        updateSettingsCall({ "clicks-per-second": value, "click-interval-ms": conversion });
    }

    const setClickIntervalMS = (value) => {
        const conversion = value > 0 ? 1000 / value : 0;

        updateSettingsCall({ "click-interval-ms": value, "clicks-per-second": conversion });
    }

    const setSpeedType = (value) => {
        updateSettingsCall({ "click-speed-type": value });
    }

    const setPositionType = (value) => {
        updateSettingsCall({ "click-position-type": value });
    }

    const setClickX = (value) => {
        updateSettingsCall({ "click-x": value });
    }

    const setClickY = (value) => {
        updateSettingsCall({ "click-y": value });
    }

    const setClickButton = (value) => {
        updateSettingsCall({ "click-button": value });
    }

    const setClickAction = (value) => {
        updateSettingsCall({ "click-action": value });
    }

    const clickSpeed = (speedType === "cps") ? clicksPerSecond : clickIntervalMS;
    const clickSpeedInputPlaceholder = (speedType === "cps") ? "Clicks per second" : "Click interval (ms)"
    const clickSpeedChangeFunc = (speedType === "cps") ? setClicksPerSecond : setClickIntervalMS;

    return (
        <div className="front-page-view">
            <div className="row-box w-100 grow">
                <GroupBox title="Speed">
                    <div className="row-box">
                        <RadioButton onChecked={setSpeedType} value="cps" text="Clicks per second" isChecked={speedType === "cps"} />
                        <RadioButton onChecked={setSpeedType} value="interval" text="Interval (ms)" isChecked={speedType === "interval"} />
                    </div>
                    <TextInput onChange={clickSpeedChangeFunc} value={clickSpeed} min={0} max={100000000000} type="number" placeholder={clickSpeedInputPlaceholder} />
                </GroupBox>
            </div>
            <div className="row-box w-100 grow">
                <div className="row-box w-50">
                    <GroupBox title="Button" className="w-50">
                        <RadioButton onChecked={setClickButton} value="left" text="Left" isChecked={clickButton === "left"} />
                        <RadioButton onChecked={setClickButton} value="middle" text="Middle" isChecked={clickButton === "middle"} />
                        <RadioButton onChecked={setClickButton} value="right" text="Right" isChecked={clickButton === "right"} />
                    </GroupBox>
                    <GroupBox title="Action" className="w-50">
                        <RadioButton onChecked={setClickAction} value="click" text="Click" isChecked={clickAction === "click"} />
                        <RadioButton onChecked={setClickAction} value="hold" text="Hold" isChecked={clickAction === "hold"} />
                        <RadioButton onChecked={setClickAction} value="release" text="Release" isChecked={clickAction === "release"} />
                    </GroupBox>
                </div>
                <GroupBox title="Position" className="w-50">
                    <div className="row-box">
                        <RadioButton onChecked={setPositionType} value="current" text="Follow" isChecked={positionType === "current"} />
                        <RadioButton onChecked={setPositionType} value="at" text="Pick" isChecked={positionType === "at"} />
                    </div>
                    <CustomButton>Pick a position</CustomButton>
                    <div className="row-box">
                        <TextInput type="number" onChange={setClickX} placeholder="X" min={0} max={9999999999} value={clickX}></TextInput>
                        <TextInput type="number" onChange={setClickY} placeholder="Y" min={0} max={9999999999} value={clickY}></TextInput>
                    </div>
                </GroupBox>
            </div>
            <div className="row-box w-100 grow">
                <GroupBox title="Hotkeys" className="w-50">
                </GroupBox>
                <GroupBox title="Other" className="w-50">
                </GroupBox>
            </div>
            <div className="row-box w-100 grow">
                <CustomButton className="grow">Start</CustomButton>
                <CustomButton className="grow">Stop</CustomButton>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        settings: state.settings.settings,
    };
};

const mapDispatchToProps = {
    loadSettingsCall,
    updateSettingsCall
};

export default connect(mapStateToProps, mapDispatchToProps)(FrontPageView);