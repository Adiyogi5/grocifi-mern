import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:9000"); // Connect to backend

const useOnlineStatus = (userId) => {
    const [isOnline, setIsOnline] = useState(false);
   
    useEffect(() => {
        if (!userId) return; // Prevent running effect if userId is missing
     
        socket.emit("user-online", userId);

        const handleStatusUpdate = (data) => {
            if (data.userId === userId) {
                setIsOnline(data.isOnline);
            }
        };

        socket.on("update-user-status", handleStatusUpdate);

        return () => {
            socket.off("update-user-status", handleStatusUpdate);
        };
    }, [userId]);

    return isOnline;
};

export default useOnlineStatus;
