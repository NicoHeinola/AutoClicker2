import { appWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
import appAPI from "apis/appAPI";

const useWindowHandler = () => {
    useEffect(() => {
        const isDev = process.env.NODE_ENV === 'development';

        const onWindowClose = async () => {
            appAPI.minimizeApp();

            // If we are running a production build, close the window
            if (!isDev) {
                appWindow.close();
            }
        };

        const unlisten = appWindow.listen('tauri://close-requested', onWindowClose);

        return () => {
            unlisten.then((f) => f());
        };

    }, []);
}

export default useWindowHandler;