import { useState, useEffect } from "react";

export default function useCurrentTime() {
    const [currentTime, setCurrentTime] = useState(Date.now());

    // on mount, start a timer to keep updating current time
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(Date.now());
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return currentTime;
}
