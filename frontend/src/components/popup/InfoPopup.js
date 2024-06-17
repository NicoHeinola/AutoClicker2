import "styles/components/popup/infopopup.scss";
import PopupWindow from 'components/popup/PopupWindow';
import CustomButton from "components/inputs/CustomButton";

const InfoPopup = (props) => {
    const { visible, onVisibilityChange, title = "", texts = [], theme = "info", icon = "question", buttons = [{ text: "Ok", onClick: null }] } = props;

    return (
        <PopupWindow visible={visible} onVisibilityChange={onVisibilityChange}>
            <div className="info-popup">
                <div className="icon-container">
                    <div className={"icon-wrapper " + theme}>
                        <div className={"icon " + icon}></div>
                    </div>
                </div>
                <div className="items">
                    <div className="texts">
                        {title ?
                            <h1 className="title">{title}</h1>
                            :
                            <></>
                        }
                        {
                            texts.map(text =>
                                <p key={text} className="text">{text}</p>
                            )
                        }
                    </div>
                    <div className="buttons">
                        {
                            buttons.map(button =>
                                <CustomButton onClick={button.onClick} key={button.text}>{button.text}</CustomButton>
                            )
                        }
                    </div>
                </div>
            </div>
        </PopupWindow>
    )
}

export default InfoPopup;