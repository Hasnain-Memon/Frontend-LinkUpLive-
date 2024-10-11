"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSocketStore from '@/store/socketStore';

const JoinBtn = () => {

    const [roomCode, setRoomCode] = useState<string>("");

    const router = useRouter();
    const session = useSession();
    const { socket } = useSocketStore();

    const name = session.data?.user?.name;

    async function joinRoom(e: React.FormEvent) {
        e.preventDefault();
       try {
        console.log('name:', name);
        console.log('roomCode:', roomCode);

        socket?.emit('join-room', {name, roomId: roomCode});

        router.push(`/room/${roomCode}?joinerName=${name}`);
       } catch (error) {
        console.log('Error joining room');
       }
    }

  return <>
    <form onSubmit={joinRoom} className="space-y-4 border border-gray-400 p-4 rounded-md">
        <h4 className="text-center text-lg text-gray-800 font-semibold">
            Enter Existing Meeting
        </h4>
        <input name="room-code" type="text" placeholder="Enter a Code" className="border border-gray-400 p-3 rounded-md outline-none text-gray-600"
        onChange={(e) => setRoomCode(e.target.value)} />
        <button onClick={joinRoom} type="submit" className="text-gray-400 font-semibold bg-transparent text-center w-[245px] hover:text-[#202253] py-4 border border-[#202253] rounded-md">join</button>
    </form>
  </>
}

export default JoinBtn