"use client";
import React, { useEffect, useRef, useState } from 'react'
import VideoControlButtons from './VideoControlButtons';
import { useSocket } from '@/context/SocketContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Modal from './Modal';
import Image from 'next/image';

function NewMeeting({roomId}: {
    roomId: string,
}) {

  const session = useSession();

  const router = useRouter();

  const searchParams = useSearchParams();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);

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

  const onClose = () => {
    setModalOpen(false);
  }

  const { socket } = useSocket();

  async function setupMeeting(e: React.FormEvent) {
    e.preventDefault();

    setIsCreate(true);
    setModalOpen(false);

    try {

      // creating media stream
      let localStream;
      try { 
        localStream = await navigator.mediaDevices.getUserMedia({
          video: isCameraOn,
          audio: isMicOn,
        })
        setLocalStream(localStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.log("Error creating local stream", error);
        return;
      }

      //creating peer
      const peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.stunprotocol.org"
          }
        ]
      });

      // add local stream to peer
      localStream?.getTracks().forEach((track) => peer.addTrack(track, localStream));

      peer.ontrack = (event) => {
        const [stream] = event.streams;
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate to server');
          socket?.emit('ice-candidate', { candidate: event.candidate, roomId });
        }
      };

      // creating offer
      try {
        const localOffer = await peer.createOffer();
        await peer.setLocalDescription(new RTCSessionDescription(localOffer));
    
        socket?.emit('offer', {offer: localOffer, name});
      } catch (error) {
        console.log("error creating offer", error);
      }

      socket?.on('receive-ice-candidate', async ({candidate, senderName}) => {
        console.log('Received ICE candidate from:', senderName);
    
          try {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('ICE candidate added successfully');
          } catch (error) {
            console.error('Error adding received ICE candidate:', error);
          }
      })

      socket?.on('recieve-answer', async ({sdp: answer, senderName}) => {
        console.log('receiving anser from server(client)', senderName);
  
        try {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
          console.error('Error setting remote description:', error);
        }
      });
      
    } catch (error) {
      console.log("Error in setup meeting", error);
      throw new Error('Error in setup meeting', {
        cause: error
      })
    }
    
  }

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
                    {session.data?.user?.name}
                </p>
            </div>
        </div>
        <VideoControlButtons isCameraOn={isCameraOn} isMicOn={isMicOn} onCamera={onCamera} onMic={onMic} roomId={roomId} />

        <Modal isOpen={isModalOpen} onClose={setupMeeting}>
          <h2 className='text-xl font-semibold text-gray-900'>
            Create New Meeting
          </h2>
          <p className='text-gray-600'>Are you sure you want to create a new meeting?</p>
        </Modal>
    </div>
    
}

export default NewMeeting;