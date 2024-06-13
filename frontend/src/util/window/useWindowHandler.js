import { appWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
import appAPI from "apis/appAPI";
import { exit } from '@tauri-apps/api/process';

const useWindowHandler = () => {
    useEffect(() => {
        const onWindowClose = async () => {
            appAPI.minimizeApp();
            exit(1);
        };

        const unlisten = appWindow.listen('tauri://close-requested', onWindowClose);

        return () => {
            unlisten.then((f) => f());
        };

    }, []);
}

export default useWindowHandler;