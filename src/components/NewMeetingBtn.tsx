import { useSocket } from '@/context/SocketContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'
import camera_gif from "../../public/camera_gif.gif";

const NewMeetingBtn = ({roomId} : {
    roomId: string
}) => {

    const router = useRouter();
    const { socket } = useSocket();
    const session = useSession();

    const name = session.data?.user?.name;

    async function createRoom(e: React.FormEvent) {
        e.preventDefault();
    
        if (!(socket && name && roomId)) {
          console.log('Socket, name, or roomId is not set');
          return
        }
    
        socket?.emit('create-room', {name, roomId});
    
        router.push(`/room/${roomId}?author=${name}`);
      }

  return <div>
    <form className="flex flex-col justify-center space-y-4 border border-gray-400 p-4 rounded-md h-full">
      <h4 className=" relative text-center text-lg text-gray-800 font-semibold">
          New Meeting
      </h4>
      <button onClick={createRoom} type="submit" className=' text-gray-100 px-4 py-3 rounded-md font-semibold flex items-center justify-center gap-2 bg-blue-600 w-[245px] hover:bg-blue-500'>
        <Image priority={true} src={camera_gif} alt="camera_gif" className="w-8 mr-4"/>
        <span className="mr-12">New meeting</span>
      </button>
    </form>
    
  </div>
}

export default NewMeetingBtn