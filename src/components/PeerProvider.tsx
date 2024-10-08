"use client";
import usePeerStore from '@/store/peerStore';
import React, { useEffect } from 'react';

const PeerProvider = ({children}: {
    children: React.ReactNode
}) => {

    const { createPeer, peer } = usePeerStore();

    useEffect(() => {
        try {
            createPeer();
        } catch (error) {
            console.log("Error creating peer");
        }

        return () => {
            if (peer) {
                peer.close();
                console.log("Peer closed");
            }
        }
    }, []);

    return <>{children}</>
}

export default PeerProvider;