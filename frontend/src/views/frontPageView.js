import "styles/views/frontpageview.scss";

import { connect } from "react-redux";
import GroupBox from "components/group/GroupBox";
import TextInput from "components/inputs/TextInput";
import CustomButton from "components/inputs/CustomButton";
import RadioButton from "components/inputs/RadioButton";


const FrontPageView = () => {

    const clickIntervalMS = 1000;
    const clicksPerSecond = 1;
    const speedType = "cps";
    const positionType = "current"
    const clickButton = "left"
    const clickAction = "click"
    const clickX = 100
    const clickY = 100

    const setClicksPerSecond = (value) => {

    }

    const setClickIntervalMS = (value) => {

    }

    const setSpeedType = (value) => {

    }

    const setPositionType = (value) => {

    }

    const setClickButton = (value) => {

    }

    const setClickAction = (value) => {

    }

    const clickSpeed = (speedType === "cps") ? clicksPerSecond : clickIntervalMS;
    const clickSpeedInputPlaceholder = (speedType === "cps") ? "Clicks per second" : "Click interval"
    const clickSpeedChangeFunc = (speedType === "cps") ? setClicksPerSecond : setClickIntervalMS;

    return (
        <div className="front-page-view">
            <div className="row-box">
                <GroupBox title="Speed">
                    <div className="row-box">
                        <RadioButton onChange={setSpeedType} value="cps" text="Clicks per second" isChecked={speedType === "cps"} />
                        <RadioButton onChange={setSpeedType} value="interval" text="Interval (ms)" isChecked={speedType === "interval"} />
                    </div>
                    <TextInput onChange={clickSpeedChangeFunc} value={clickSpeed} min={0} max={100000} type="number" placeholder={clickSpeedInputPlaceholder} />
                </GroupBox>
            </div>
            <div className="row-box">
                <div className="row-box">
                    <GroupBox title="Button" className="small">
                        <RadioButton onChange={setClickButton} value="left" text="Left" isChecked={clickButton === "left"} />
                        <RadioButton onChange={setClickButton} value="middle" text="Middle" isChecked={clickButton === "middle"} />
                        <RadioButton onChange={setClickButton} value="right" text="Right" isChecked={clickButton === "right"} />
                    </GroupBox>
                    <GroupBox title="Action" className="small">
                        <RadioButton onChange={setClickAction} value="click" text="Click" isChecked={clickAction === "click"} />
                        <RadioButton onChange={setClickAction} value="hold" text="Hold" isChecked={clickAction === "hold"} />
                        <RadioButton onChange={setClickAction} value="release" text="Release" isChecked={clickAction === "release"} />
                    </GroupBox>
                </div>
                <GroupBox title="Position">
                    <div className="row-box">
                        <RadioButton onChange={setPositionType} value="current" text="Follow" isChecked={positionType === "current"} />
                        <RadioButton onChange={setPositionType} value="current" text="Pick" isChecked={speedType === "at"} />
                    </div>
                    <CustomButton>Pick a position</CustomButton>
                    <div className="row-box">
                        <TextInput placeholder="X" min={0} value={clickX}></TextInput>
                        <TextInput placeholder="Y" min={0} value={clickY}></TextInput>
                    </div>
                </GroupBox>
            </div>
            <div className="row-box">
                <GroupBox title="Hotkeys">
                </GroupBox>
                <GroupBox title="Other">
                </GroupBox>
            </div>
            <div className="row-box">
                <CustomButton>Start</CustomButton>
                <CustomButton>Stop</CustomButton>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(FrontPageView);