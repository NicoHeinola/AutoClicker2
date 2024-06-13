const { useEffect } = require("react");

const useDisableHotkeys = () => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Prevent default action for common hotkeys
            const isCtrlOrCmd = event.ctrlKey || event.metaKey; // Support for both Windows (Ctrl) and Mac (Cmd) users

            const key = event.key.toLowerCase();

            // Disable Save (Ctrl+S or Cmd+S)
            if (isCtrlOrCmd && key === 's') {
                event.preventDefault();
            }

            // Disable Print (Ctrl+P or Cmd+P)
            else if (isCtrlOrCmd && key === 'p') {
                event.preventDefault();
            }

            // Disable refresh
            /*else if (isCtrlOrCmd && key === 'r') {
                event.preventDefault();
            }*/

            const notAllowedKeys = { "f5": null, "f6": null, "f7": null, "f8": null, "f9": null, "f10": null, "f11": null, "f12": null };

            if (key in notAllowedKeys) {
                event.preventDefault();
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);
}

export default useDisableHotkeys;