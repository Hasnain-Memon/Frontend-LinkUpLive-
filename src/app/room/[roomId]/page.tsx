"use client";
import { useSocket } from '@/context/SocketContext';
import React, { useEffect, useRef, useState } from 'react'

function Room({params}: {params: {roomId: string}}) {
  const roomId = params.roomId;

  // refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // local tracks
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  // const [localAudio, setLocalAudio] = useState<any>(null);

  // remote tracks
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  // const [remoteAudio, setRemoteAudio] = useState<any>(null);

  const { socket } = useSocket();

  useEffect(() => {

    async function setupMeeting() {

      // creating media stream
      let localStream;
      try { 
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
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
    }

    setupMeeting();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      socket?.off('receive-ice-candidate');
      socket?.off('recieve-answer');
    };

  }, [socket, roomId]);

  useEffect(() => {

    async function joinMeeting() {

    let remoteStream;
    try { 
      remoteStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setRemoteStream(remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    } catch (error) {
      console.log("Error creating local stream", error);
      return;
    }

    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org"
        }
      ]
    });

    // Add local stream tracks to the peer connection
    remoteStream.getTracks().forEach(track => peer.addTrack(track, remoteStream));

    // handle offer
    socket?.on('offer', async ({offer, name: remoteName}) => {
      console.log("Receiving offer from", remoteName);

      try {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));

        const localAnswer = await peer.createAnswer();
        await peer.setLocalDescription(new RTCSessionDescription(localAnswer));

        socket.emit('answer', { sdp: localAnswer });
      } catch (error) {
        console.error('Error handling offer/answer:', error);
      }
    
    });

    socket?.on('receive-ice-candidate', async ({candidate, senderName}) => {
      console.log('Received ICE candidate from:', senderName);

      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        
      }
    })

    }

    joinMeeting();

  }, [socket, roomId]);

  return (
    <div>
      Room {roomId}
      {/* <br />
      <button onClick={ComingFromCreateMethod} className='bg-blue-600 p-2 text-gray-100 m-4 rounded-md'>Create</button> */}
      <br />
      <video autoPlay ref={localVideoRef} width={400} height={300} />
      <video autoPlay ref={remoteVideoRef} width={400} height={300} />
    </div>
  )
}

export default Room;