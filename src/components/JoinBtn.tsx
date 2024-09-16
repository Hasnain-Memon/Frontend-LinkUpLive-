"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const JoinBtn = () => {

    const [existingRoomCode, setExistingRoomCode] = useState<string>("");

    const router = useRouter();
    const session = useSession();

    const name = session.data?.user?.name;

    async function joinRoom(e: React.FormEvent) {
        e.preventDefault();
        
        if (!(name && existingRoomCode && socket)) {
            console.log("Existing(name, roomCode) & socket is not set");
            throw new Error("Existing(name, roomCode) & socket is not set");
        }

        router.push(`/room/${existingRoomCode}/join-meeting/${name}`);
      } // join

  return <>
    <form onSubmit={joinRoom} className="space-y-4 border border-gray-400 p-4 rounded-md">
        <h4 className="text-center text-lg text-gray-800 font-semibold">
            Enter Existing Meeting
        </h4>
        <input name="room-code" type="text" placeholder="Enter a Code" className="border border-gray-400 p-3 rounded-md outline-none text-gray-600"
        onChange={(e) => setExistingRoomCode(e.target.value)} />
        <button type="submit" className="text-gray-400 font-semibold bg-transparent text-center w-[245px] hover:text-blue-600 py-4 border border-blue-600 rounded-md">join</button>
    </form>
  </>
}

export default JoinBtn