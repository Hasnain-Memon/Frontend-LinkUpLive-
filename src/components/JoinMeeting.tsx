"use client";
import React, { useEffect, useRef, useState } from 'react'
import VideoControlButtons from './VideoControlButtons';
import { useSocket } from '@/context/SocketContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import usePeerStore from '@/store/peerStore';
import { Socket } from 'dgram';


interface RecieveOffer {
  offer : RTCSessionDescription;
  name: string;
  roomCode: string;
  id: string;
}

function JoinMeeting({joinerName}: {
    joinerName: string,
}) {

  const { socket } = useSocket();
  const session = useSession();
  const peer = usePeerStore((state) => state.peer);
  
  const name = session.data?.user?.name;

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [remoteName, setRemoteName] = useState<string>("");

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

  async function joinMeeting() {

      try {

      // Add local stream tracks to the peer connection
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          const isTrackAlreadyAdded = peer!.getSenders().some((sender) => sender.track === track);
          
          if (!isTrackAlreadyAdded) {
            peer!.addTrack(track, localStream);
          }
        });
      }

      // Handle remote stream
      peer!.ontrack = (event) => {
          const [stream] = event.streams;
          setRemoteStream(stream);
          if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          }
      };

      } catch (error) {
      console.log("Error in join Meeting", error);
      throw new Error("Error in join Meeting", {
          cause: error
      });
      }
  
  } // join meeting ending here

  // Define the handler for 'receive-ice-candidate' event
  const handleReceiveIceCandidate = async ({ candidate, senderName, sender }: {
    candidate: RTCIceCandidate,
    senderName: string,
    sender: Socket
  }) => {
    console.log('Received ICE candidate from (server):', senderName);

    try {
      await peer!.addIceCandidate(new RTCIceCandidate(candidate));

      // Emit ICE Candidates
      peer!.onicecandidate = (event) => {
        if (event.candidate) {
            sender.emit('receive-peer-candidate', { candidate: event.candidate, name });
        }
      };
    } catch (error) {
      console.error('Error adding ICE Candidate', error);
    }
  };

  const handleReceiveOffer = async ({ offer, name: remoteName, roomCode, id }: RecieveOffer) => {
    console.log("Receiving offer from", remoteName, offer);
    setRemoteName(remoteName);

    try {
      await peer!.setRemoteDescription(new RTCSessionDescription(offer));

      const localAnswer = await peer!.createAnswer();
      await peer!.setLocalDescription(new RTCSessionDescription(localAnswer));

      socket?.emit('answer', { answer: localAnswer, name, roomCode, senderId: id });
    } catch (error) {
      console.error('Error handling offer/answer:', error);
    }
  };

  useEffect(() => {

    createUserMedia()
      .then(() => console.log("user media created"))
      .catch(() => console.log("Error creating user media"));
    
  }, []);

  useEffect(() => {

    joinMeeting();

    socket?.on('receive-offer', handleReceiveOffer);
    socket?.on('receive-ice-candidate', handleReceiveIceCandidate);

    return () => {
      socket?.off('receive-offer', handleReceiveOffer);
      socket?.off('receive-ice-candidate', handleReceiveIceCandidate);
    };

  }, [socket, peer, handleReceiveOffer, handleReceiveIceCandidate]);


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
                  {remoteName}
              </p>
          </div>
      </div>
      <VideoControlButtons isCameraOn={isCameraOn} isMicOn={isMicOn} onCamera={onCamera} onMic={onMic} />
  </div>
}

export default JoinMeeting;