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
      const newSocket = io('localhost:8000');
      set({socket: newSocket});
      console.log("New socket created:", newSocket.id);
    } else {
      console.log("using previou socket", socket.id);
    }
  }

}));

export default useSocketStore;