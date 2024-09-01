"use client";
import { useSocket } from '@/context/SocketContext';
import React from 'react'

function Room({params}: {params: {roomId: string}}) {
  const roomId = params.roomId;

  const { socket } = useSocket();

  async function ComingFromCreateMethod() {

    // creating media stream
    let localStream;
    try { 
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
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
        socket?.emit('ice-candidate', { candidate: event.candidate, roomId, name });
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

  return (
    <div>
      Room {roomId}
      <video src="" width={400} height={300}></video>
      <video src="" width={400} height={300}></video>
    </div>
  )
}

export default Room;