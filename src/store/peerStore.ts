import { create } from "zustand";

interface PeerStore {
    peer: RTCPeerConnection | null;
    setPeer: (peerConnection: RTCPeerConnection) => void; 
}

const usePeerStore = create<PeerStore>((set) => ({
    peer: null,
    setPeer: (peerConnection: RTCPeerConnection) => set((state) => ({ peer:  peerConnection})),
}));

export default usePeerStore;