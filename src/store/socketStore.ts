import { io, Socket } from "socket.io-client";
import { create  } from "zustand";

interface SocketStore {
  socket: Socket | null;
  createSocket: () => void
}

const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,

  createSocket: () => {
    const socket = get().socket;

    if(!socket){
      const newSocket = io('ws://localhost:8000');
      set({socket: newSocket});
      console.log("New socket created:");
    } else {
      console.log("using previous socket");
    }
  }

}));

export default useSocketStore;