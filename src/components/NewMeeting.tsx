"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react'
import VideoControlButtons from './VideoControlButtons';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import useSocketStore from '@/store/socketStore';
import usePeerStore from '@/store/peerStore';

function NewMeeting({roomId, joinerName}: {
    roomId?: string,
    joinerName?: string
}) {

  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [remoteName, setRemoteName] = useState<string>("");
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const session = useSession();
  const { socket, createSocket } = useSocketStore();
  const { peer, createPeer } = usePeerStore();

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

  const handlerTestEvent = ({message}: {message: string}) => {
    try {
      console.log(message);
    } catch (error) {
      console.error(error);
    }
  }

  const handleReceiveAnswer = async ({answer, from}: {
    answer: RTCSessionDescription,
    from: string
  }) => {
    try {
      console.log("receiving answer from:", from);
      await peer?.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("peer:", peer);
    } catch (error) {
      console.log("Error receiving answer");
    }
  }

  useEffect(() => {

    if(!socket) {
      console.log("socket is missing");
      return;
    }

    if(!peer) {
      console.log("Peer not found in NewMeeting");
      return;
    }

    socket?.on('disconnect', () => {
      console.log("socket disconnected");
    });

    console.log("socket connected:", socket.connected);

    socket?.on('user:joined', handlerUserJoined);
    socket?.on('receive-offer', handleReceiveOffer);
    socket?.on('test:event',   handlerTestEvent);
    socket?.on('receive-answer', handleReceiveAnswer);

    return () => {
      socket?.off('user:joined', handlerUserJoined);
      socket?.off('receive-offer', handleReceiveOffer);
      socket?.off('test:event', handlerTestEvent);
      socket?.off('receive-answer', handleReceiveAnswer);
    }

  }, [socket, peer]);

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