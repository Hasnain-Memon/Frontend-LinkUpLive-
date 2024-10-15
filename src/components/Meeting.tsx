"use client";
import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import useSocketStore from '@/store/socketStore';
import usePeerStore from '@/store/peerStore';
import ReactPlayer from 'react-player';
import { MicIcon, MicOff, PhoneOff, VideoIcon, VideoOffIcon } from 'lucide-react';

function Meeting({roomId}: {
    roomId?: string
}) {

  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [remoteName, setRemoteName] = useState<string>("");
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);

  const session = useSession();
  const { socket } = useSocketStore();
  const { peer } = usePeerStore();

  const name = session.data?.user?.name;

  const handlerUserJoined = async ({name: PeerName, id: peerId}:{
    name: string,
    id: string
  }) => {
    try {
      console.log("socket id of joined user:", peerId);
      setRemoteName(PeerName);
      const offer = await peer?.createOffer();
      console.log("offer created");
      console.log("peer:", peer);
      await peer?.setLocalDescription(offer);
      socket?.emit('offer', {offer, to: peerId, name});
    } catch (error) {
      console.log("Error in handlerUserJoined", error);
    }
  }

  const handleReceiveOffer = useCallback(async({offer, from, remoteName: peerName}:{
    offer: RTCSessionDescription,
    from: string,
    remoteName: string
  }) => {
    try {
      // media stream ->
      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      setLocalStream(stream);

      console.log("peer inside handleRecieveOffer", peer);
      console.log("received offer:", offer.sdp);
      console.log("receiving offer on the client side");
      setRemoteName(peerName);

      if (!peer) {
        console.error("Peer is not initialized");
        return;
      }

      await peer?.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer?.createAnswer();
      console.log("answer created");
      await peer?.setLocalDescription(answer);

      socket?.emit('answer', {answer, to: from});
      console.log("answer sent to the server");

    } catch (error) {
      console.log("Error receiving offer on client");
    }
  }, [peer, socket]);

  const handleReceiveAnswer = async ({answer, from}: {
    answer: RTCSessionDescription,
    from: string
  }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      setLocalStream(stream);
      
      console.log("receiving answer from:", from);
      await peer?.setRemoteDescription(new RTCSessionDescription(answer));

      for(const track of localStream!.getTracks()) {
        peer?.addTrack(track, localStream!);
      }
    } catch (error) {
      console.log("Error receiving answer", error);
    }
  }

  useEffect(() => {
    peer?.addEventListener('track', async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream);
    })
  }, [])

  useEffect(() => {

    if(!socket || !peer) {
      console.log("socket or peer is missing");
      return;
    }

    console.log("socket connected:", socket.connected);

    socket?.on('disconnect', () => {
      console.log("socket disconnected");
    });

    socket?.on('user:joined', handlerUserJoined);
    socket?.on('receive-offer', handleReceiveOffer);
    socket?.on('receive-answer', handleReceiveAnswer);

    return () => {
      socket?.off('user:joined', handlerUserJoined);
      socket?.off('receive-offer', handleReceiveOffer);
      socket?.off('receive-answer', handleReceiveAnswer);
    }

  }, [socket, peer]);

  return <div className= 'h-[calc(100vh-4rem)]'>
      <div className='w-full flex h-full items-center justify-center gap-4'>
        <div className='relative'>
          <div className='rounded-xl h-[500px] w-[1000px] overflow-hidden flex items-center justify-center '>
            {isCameraOn ? (
                <ReactPlayer
                  url='https://youtu.be/aU-8BbPRqbo'
                  height={500}
                  width={1000}
                  autoPlay
                  controls={true}
                />
            ) : (
              <Image width={200} height={200} src={`${session.data?.user?.image}`} alt={`${session.data?.user?.name} image`} className='rounded-full'/>
            )}
          </div>
        </div>
          {/* second screen */}
          <div className='rounded-xl absolute bottom-16 h-[200px] w-[300px] right-24 overflow-hidden'>
            <ReactPlayer
              url='https://youtu.be/6e68uZax96w'
              height={200}
              width={300}
              autoPlay
              controls={true}
            />
          </div>
      </div>
      {/* Meeting controls */}
      <div>
        <div className="h-16 flex items-center justify-start px-24">
          <div className="w-full flex items-center justify-between border-t border-gray-400 pt-2">
            <div className="flex items-center justify-center">
                {roomId && <p className="text-gray-500 text-md font-normal text-sm">
                    Room id: {roomId}
                </p>}
            </div>
            <div className="space-x-2">
                <button className="bg-[#202253] hover:bg-[#202253dc] rounded-md p-2">
                    {isMicOn ? (
                        <MicIcon className="text-gray-300"/>
                    ) : (
                        <MicOff className="text-gray-300"/>
                    )}
                </button>
                <button className="bg-[#202253] hover:bg-[#202253dc] rounded-md p-2">
                    {isCameraOn ? (
                        <VideoIcon className="text-gray-300"/>
                    ): (
                        <VideoOffIcon className="text-gray-300"/>
                    )}
                </button>
                <button className="bg-[#202253] hover:bg-[#202253dc] rounded-md p-2">
                    <PhoneOff className="text-red-500"/>
                </button>
            </div>
        </div>
      </div>
    </div>
  </div>
    
}

export default Meeting;