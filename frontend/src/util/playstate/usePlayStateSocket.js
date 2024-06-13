import { useEffect } from "react";
import socket from "socket/socketManager";

const usePlayStateSocket = (setPlayStateCall) => {
    useEffect(() => {
        const onStartedPlaying = () => {
            setPlayStateCall("playing");
        }

        const onStoppedPlaying = () => {
            setPlayStateCall("stopped");
        }

        socket.on("started-clicking", onStartedPlaying);
        socket.on("stopped-clicking", onStoppedPlaying);

        return () => {
            socket.off("started-clicking", onStartedPlaying);
            socket.off("stopped-clicking", onStoppedPlaying);
        }

    }, [setPlayStateCall]);
}

export default usePlayStateSocket;