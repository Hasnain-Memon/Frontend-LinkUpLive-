"use client";
import usePeerStore from '@/store/peerStore'
import React, { FC, ReactNode, useEffect } from 'react'

interface PeerProviderProps {
    children: ReactNode,
}

const PeerProvider: FC<PeerProviderProps> = ({children}) => {

    const peer = usePeerStore((state) => state.peer);
    const setPeer = usePeerStore((state) => state.setPeer);

    useEffect(() => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [
              {
                urls: "stun:stun.stunprotocol.org"
              }
            ]
        });

        setPeer(peerConnection);
    }, []);
    
    console.log("peer after setted in a state:", peer);

  return <>
    {children}
  </>
}

export default PeerProvider;