"use client"
import Link from "next/link";
import camera_gif from "../../public/camera_gif.gif";
import Image from "next/image";
import AnimatedImage from "@/components/AnimatedImage";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { useSession } from "next-auth/react";


const URL = "http://localhost:8000";

export default function Home() {
  const { socket } = useSocket();

  const session = useSession();

  // states of form -> Creating New Meeting
  const [name, setName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  // states of form -> Enter Existing Meeting
  const [existingName, setExistingName] = useState<string>("");
  const [existingRoomCode, setExistingRoomCode] = useState<string>("");
    
  const router = useRouter();

  async function createRoom(e: React.FormEvent) {
    e.preventDefault();

    if (!(socket && name && roomId)) {
      console.log('Socket, name, or roomId is not set');
      return
    }

    socket?.emit('create-room', {name, roomId});

    router.push(`/room/${roomId}?author=${session.data?.user?.name}`);
  }

  async function joinRoom(e: React.FormEvent) {
    e.preventDefault();

    console.log("existingName:", existingName);
    console.log("ExistingRoomCode:", existingRoomCode);
    console.log('socket:', socket);
    
    console.log("first");
    if (!(existingName && existingRoomCode && socket)) {
      console.log("Existing(name, roomCode) & socket is not set");
      throw new Error("Existing(name, roomCode) & socket is not set");
    }
    console.log("second");

    socket.on('room-error', (error) => {
      console.error("Room error from server:", error.message);
      alert(`Error: ${error.message}`)
      return;
    })

    try {
      console.log("Emiting join-room");
      socket.emit('join-room', {name: existingName, roomCode: existingRoomCode});
      console.log("emitted join room");
    } catch (error) {
      throw new Error('Error emiting join-room event');
    }

    console.log("third");

    // // creating media stream
    // let localStream;
    // try { 
    //   localStream = await navigator.mediaDevices.getUserMedia({
    //     video: true,
    //     audio: true,
    //   })
    // } catch (error) {
    //   console.log("Error creating local stream", error);
    //   return;
    // }

    // const peer = new RTCPeerConnection({
    //   iceServers: [
    //     {
    //       urls: "stun:stun.stunprotocol.org"
    //     }
    //   ]
    // });

    // // Add local stream tracks to the peer connection
    // localStream.getTracks().forEach(track => peer.addTrack(track, localStream));

    // // handle offer
    // socket?.on('offer', async ({offer, name: remoteName}) => {
    //   console.log("Receiving offer from", remoteName);

    //   try {
    //     await peer.setRemoteDescription(new RTCSessionDescription(offer));

    //     const localAnswer = await peer.createAnswer();
    //     await peer.setLocalDescription(new RTCSessionDescription(localAnswer));

    //     socket.emit('answer', { sdp: localAnswer, existingName });
    //   } catch (error) {
    //     console.error('Error handling offer/answer:', error);
    //   }
    
    // });

    // socket?.on('receive-ice-candidate', async ({candidate, senderName}) => {
    //   console.log('Received ICE candidate from:', senderName);

    //   try {
    //     await peer.addIceCandidate(new RTCIceCandidate(candidate));
    //   } catch (error) {
        
    //   }
    // })

    console.log("redirecting to existing room");
    router.push(`/room/${existingRoomCode}/join-meeting/${existingName}`);
    console.log("successfully redirected to existing room");
  }

  useEffect(() => {
    const id: string = uuidv4();
    setRoomId(id);
    console.log("room is setted in state:", id);
  }, []);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push('/landing');
    }
  }, [session.status, router]);

  if (session.status === "loading") {
    return <div className="h-[calc(100vh-6rem)] w-full flex items-center justify-center">
      <h3 className="text-3xl font-semibold text-gray-500">Loading...</h3>
    </div>
  }

  return <div className="px-24 h-screen w-full flex ">
    <div className=" w-1/2 flex flex-col justify-center px-6 gap-8">
      <div id="hero-text" className="space-y-4">
        <h2 className="text-gray-800 font-semibold text-4xl">
          Video calls and <br />meetings for everyone
        </h2>
        <p className="font-normal text-gray-500 text-xl">Connect, collaborate and celebrate from <br /> anywhere with Link Up Live</p>
      </div>
      <div className="flex gap-8 items-center border-b border-black pb-8 mr-12">
        
        <div className="flex gap-4">
          <form onSubmit={createRoom} className="space-y-4 border border-gray-400 p-4 rounded-md">
            <h4 className="text-center text-lg text-gray-800 font-semibold">
              Create New Meeting
            </h4>
            <input name="name" type="text" placeholder="Enter your name" className="border border-gray-400 p-3 rounded-md outline-none text-gray-600"
            onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className=' text-gray-100 px-4 py-3 rounded-md font-semibold flex items-center justify-center gap-2 bg-blue-600 w-full hover:bg-blue-500'>
              <Image priority={true} src={camera_gif} alt="camera_gif" className="w-8 mr-4"/>
              <span className="mr-12">New meeting</span>
            </button>
            <p className="text-xs text-center text-gray-700">Do you want to join existing meeting? Check out the form at the right side.</p>
          </form>

          <form onSubmit={joinRoom} className="space-y-4 border border-gray-400 p-4 rounded-md">
            <h4 className="text-center text-lg text-gray-800 font-semibold">
              Enter Existing Meeting
            </h4>
            <input name="existing-name" type="text" placeholder="Enter a name" className="border border-gray-400 p-3 rounded-md outline-none text-gray-600"
            onChange={(e) => setExistingName(e.target.value)} />
            <input name="room-code" type="text" placeholder="Enter a Code" className="border border-gray-400 p-3 rounded-md outline-none text-gray-600"
            onChange={(e) => setExistingRoomCode(e.target.value)} />
            <button type="submit" className="text-gray-400 font-semibold bg-transparent text-center w-[245px] hover:text-blue-600 py-4 border border-blue-600 rounded-md">join</button>
          </form>
        </div>
      </div>
      <div>
        <span className="text-xs text-gray-600"><Link className="text-blue-600" href='about'>Learn more</Link> about Link Up Live</span>
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