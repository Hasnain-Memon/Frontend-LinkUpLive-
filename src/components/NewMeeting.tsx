"use client";
import React, { useEffect, useRef, useState } from 'react'
import VideoControlButtons from './VideoControlButtons';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import useSocketStore from '@/store/socketStore';

function NewMeeting({roomId}: {
    roomId: string,
}) {

  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [remoteName, setRemoteName] = useState<string>("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const session = useSession();
  const { socket } = useSocketStore();

  const name = session.data?.user?.name;

  const handlerUserJoined = ({name: PeerName, id: peerId}:{
    name: string,
    id: string
  }) => {
    try {
      console.log("new user joined,", PeerName, peerId);
      setRemoteName(PeerName);
    } catch (error) {
      console.log("Error in handlerUserJoined", error);
    }
  }

  useEffect(() => {

    socket?.on('user:joined', handlerUserJoined);

    return () => {
      socket?.off('user:joined', handlerUserJoined);
    }

  }, [socket, handlerUserJoined]);

  return <div className= 'h-[calc(100vh-8rem)]'>
      <div className='w-full flex h-full items-center justify-center gap-4'>
          <div className='space-y-2'>
            <div className='bg-gray-200 rounded-sm h-[300px] w-[500px] overflow-hidden flex items-center justify-center'>
              {isCameraOn ? (
                  <video
                  ref={localVideoRef}
                  width={500}
                  autoPlay={true}
                  />
                
              ) : (
                <Image width={200} height={200} src={`${session.data?.user?.image}`} alt={`${session.data?.user?.name} image`} className='rounded-full'/>
              )}
            </div>
            <p className='text-gray-600 font-medium bg-gray-200 rounded-sm px-2 py-2'>
                {session.data?.user?.name}
            </p>
          </div>
          <div className='space-y-2'>
              <video 
                  ref={remoteVideoRef}
                  className='bg-gray-200 rounded-sm h-[300px]'
                  width={500}
                  autoPlay
              />
              <p className='text-gray-600 font-medium bg-gray-200 rounded-sm px-2 py-2'>
                  {remoteName ? remoteName : null}
              </p>
          </div>
      </div>
      <VideoControlButtons roomId={roomId} />
  </div>
    
}

export default NewMeeting;