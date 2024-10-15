import { create } from "zustand";

interface PeerStore {
    peer: RTCPeerConnection | null;
    createPeer: () => void;
}

const usePeerStore = create<PeerStore>((set, get) => ({
    peer: null,
    createPeer: () => {
        const peer = get().peer;

        if(!peer){
            const newPeer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.stunprotocol.org"
                    }
                ]
            });

            set({peer: newPeer});
            console.log("New peer setted");
        } else {
            console.log("Peer is already created");
        }
    }
}));

export default usePeerStore;