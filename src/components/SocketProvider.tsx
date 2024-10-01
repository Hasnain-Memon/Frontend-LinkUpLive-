"use client";
import React, { useEffect } from 'react';
import useSocketStore from '@/store/socketStore';

const SocketProvider = ({children}: {
    children: React.ReactNode
}) => {

    const { createSocket, socket } = useSocketStore();
    
    useEffect(() => {
        try {
            createSocket();
        } catch (error) {
            console.log("Error creating socket", error);
        }

        return () => {
            if (socket) {
                socket.disconnect();
                console.log("Socket disconnected");
            }
        };
    }, []);

    return <>{children}</>;
}

export default SocketProvider;