"use client";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { FormEvent } from 'react'
import camera_gif from "../../public/camera_gif.gif";
import useSocketStore from '@/store/socketStore';

const NewMeetingBtn = ({roomId} : {
    roomId: string
}) => {

  const router = useRouter();
  const session = useSession();
  const { socket } = useSocketStore();

  const name = session.data?.user?.name;

  const initRoom = (e: FormEvent) => {
    e.preventDefault();
    try {
      socket?.emit('init-room', { name, roomId });
      router.push(`/room/${roomId}?author=${name}`);
    } catch (error) {
      console.log("Error emiting init-room");
    }
  }

  return <div>
    <form className="flex flex-col justify-center space-y-4 border border-gray-400 p-4 rounded-md h-full">
      <h4 className=" relative text-center text-lg text-gray-800 font-semibold">
          New Meeting
      </h4>
      <button onClick={initRoom} type="submit" className=' text-gray-100 px-4 py-3 rounded-md font-semibold flex items-center justify-center gap-2 bg-[#202253] w-[245px] hover:bg-[#202253dc]'>
        <Image priority={true} src={camera_gif} alt="camera_gif" className="w-8 mr-4"/>
        <span className="mr-12">New meeting</span>
      </button>
    </form>
    
  </div>
}

export default NewMeetingBtn