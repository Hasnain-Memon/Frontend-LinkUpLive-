"use client";
import Link from "next/link";
import AnimatedImage from "@/components/AnimatedImage";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NewMeetingBtn from "./NewMeetingBtn";
import JoinBtn from "./JoinBtn";
import { Loader2 } from "lucide-react";
import usePeerStore from "@/store/peerStore";
import useSocketStore from "@/store/socketStore";


export default function InnerHomePage() {

  const [roomId, setRoomId] = useState<string>("");

  const session = useSession();
  const router = useRouter();
  const {createSocket, socket} = useSocketStore();
  const {createPeer, peer} = usePeerStore()

  useEffect(() => {
    createSocket();
    createPeer();
  }, [createSocket, createPeer]);
  
  useEffect(() => {
    const id: string = uuidv4();
    setRoomId(id);
    console.log("room is setted in state:", id);
  }, []);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push('/');
    }
  }, [session.status, router]);

  if (session.status === "loading") {
    return <div className="h-[calc(100vh-6rem)] w-full flex items-center justify-center">
        <h3 className="">
            {/* Loading... */}
            <Loader2 size={50} className="text-3xl font-semibold text-gray-500 animate-spin"/>
        </h3>
    </div>
  }

  return <div className="px-20 h-screen w-full flex ">
    <div className=" w-1/2 flex flex-col justify-center px-6 gap-8">
      <div id="hero-text" className="space-y-4">
        <h2 className="text-gray-800 font-semibold text-4xl">
          Video calls and <br />meetings for everyone
        </h2>
        <p className="font-normal text-gray-500 text-xl">Connect, collaborate and celebrate from <br /> anywhere with Link Up Live</p>
      </div>
      <div className="flex gap-8 items-center border-b border-black pb-8 mr-12">
        <NewMeetingBtn roomId={roomId} />
        <JoinBtn />
      </div>
      <div>
        <span className="text-xs text-gray-600"><Link className="text-[#202253]" href='about'>Learn more</Link> about Link Up Live</span>
      </div>
    </div>

    <div className="w-1/2 flex flex-col justify-center items-center gap-12">
      <AnimatedImage />
      <div className="mb-20 space-y-3">
        <h3 className="text-gray-800 font-medium text-2xl text-center">
          Link with people
        </h3>
        <p className="text-sm text-center text-gray-500">Click <span className="text-gray-800 font-bold">New meeting</span> to get a code that you can send to <br /> people that you want meet with.</p>
      </div>
    </div>
  </div>
}