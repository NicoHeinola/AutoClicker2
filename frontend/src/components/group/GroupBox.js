import "styles/components/group/groupbox.scss";

const GroupBox = (props) => {

    const { title, className, children } = props;

    return (
        <div className={"group-box" + ((className) ? ` ${className}` : "")}>
            <div className="decoration">
                <div className="left">
                    <div className="bottom"></div>
                </div>
                <div className="middle">
                    <p className="title">{title}</p>
                </div>
                <div className="right"></div>
            </div>
            <div className="content">
                {children}
            </div>
        </div>
    );
}

export default GroupBox;