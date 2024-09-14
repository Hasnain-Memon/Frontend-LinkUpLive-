"use client";
import React, { useEffect, useRef, useState } from 'react'
import VideoControlButtons from './VideoControlButtons';
import { useSocket } from '@/context/SocketContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import usePeerStore from '@/store/peerStore';
import { Socket } from "socket.io-client";

interface RecieveAnswer {
  answer: RTCSessionDescription,
  senderName: string,
  id: string
}

function NewMeeting({roomId}: {
    roomId: string,
}) {

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [remoteName, setRemoteName] = useState<string>("");

  const session = useSession();
  const name = session.data?.user?.name;

  const  {socket} = useSocket();
  const peer = usePeerStore((state) => state.peer);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  

  const onMic = () => {
    setIsMicOn((prev) => {
      const newState = !prev;
      if (localStream) {
        localStream.getAudioTracks().forEach((track) => (track.enabled = newState));
      }
      return newState;
    })
  }

  const onCamera = () => {
    setIsCameraOn((prev) => {
      const newState = !prev;
      if (localStream) {
        localStream.getVideoTracks().forEach((track) => (track.enabled = newState))
      }
      return newState;
    });
  }

  async function createUserMedia() {
    let localStream;
    try { 
      localStream = await navigator.mediaDevices.getUserMedia({
        video: isCameraOn,
        audio: false,
      })
      setLocalStream(localStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
    } catch (error) {
      console.log("Error creating local stream", error);
    }
  }

  async function createOffer(peer: RTCPeerConnection) {
    try {
      const localOffer = await peer!.createOffer();
      await peer!.setLocalDescription(new RTCSessionDescription(localOffer));
      return localOffer;
    } catch (error) {
      console.log("error creating offer", error);
    }
  }

  async function setupMeeting() {

    try {
      // add local stream to peer
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          const isTrackAlreadyAdded = peer!.getSenders().some((sender) => sender.track === track);
          
          if (!isTrackAlreadyAdded) {
            peer!.addTrack(track, localStream);
          }
        });
      }

      peer!.ontrack = (event) => {
        const [stream] = event.streams;
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };
      
    } catch (error) {
      console.log("Error in setup meeting", error);
      throw new Error('Error in setup meeting', {
        cause: error
      })
    }

  } // setup meeting ending here

  async function handleUserJoined({ name, userId }: {
    name: string,
    userId: string
  }) {
    try {
      console.log('user joined', name, userId);
      try {
        const localOffer = await createOffer(peer!);
        socket?.emit('offer', {offer: localOffer, name, roomCode: roomId});
        return localOffer;
      } catch (e) {
        console.error("Error emiting offer:", e);
      }
    } catch (error) {
      console.error("Error user joined event:", error);
    }
  }

  async function handleRecieveAnswer({answer, senderName, id: answerSenderId}: RecieveAnswer) {

    try {
      console.log('receiving answer from server(client)', senderName, answer, answerSenderId);

      await peer!.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("remote description setted");

      peer!.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate to server');
          socket?.emit('ice-candidate', { candidate: event.candidate, name, roomcode: roomId });
        }
      };
    } catch (error) {
      console.error('Error setting remote description:', error);
    }

  }

  const handleReceivePeerCandidate = async ({candidate: peerCandidate, name: senderName}: {
    candidate: RTCIceCandidate,
    name: string
  }) => {

    try {
      console.log("Receiving peer candidate", senderName);

      await peer!.addIceCandidate(new RTCIceCandidate(peerCandidate));
      console.log('ICE candidate added successfully');
    } catch (error) {
      console.error('Error adding received ICE candidate:', error);
    }

  }

  useEffect(() => {
    createUserMedia();

    return () => {
      if (peer) {
        peer.close();
        console.log("Peer connection closed.");
      }
      socket?.off('offer');
    };

  }, []);

  useEffect(() => {

    setupMeeting();

    if(!peer) {
      console.log("peer is empty");
      return;
    }

    socket?.on('user-joined', handleUserJoined)
    socket?.on('receive-answer', handleRecieveAnswer);
    socket?.on('receive-peer-candidate', handleReceivePeerCandidate);

    return () => {
      socket?.off('recieve-answer', handleRecieveAnswer);
      socket?.off('receive-peer-candidate', handleReceivePeerCandidate);
    }

  }, [socket, 
      peer,
      handleUserJoined,
      handleRecieveAnswer, 
      handleReceivePeerCandidate,
      // setIsMicOn, setIsCameraOn, 
      // isCameraOn, isMicOn
      ]);

  console.log("peer after all the logic:", peer);

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
      <VideoControlButtons isCameraOn={isCameraOn} isMicOn={isMicOn} onCamera={onCamera} onMic={onMic} roomId={roomId} />
  </div>
    
}

export default NewMeeting;