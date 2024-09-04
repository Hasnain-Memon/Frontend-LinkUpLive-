"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/context/SocketContext';

function Page({ params }: { params: { joinerName: string } }) {
  const joinerName = params.joinerName;
  const { socket } = useSocket();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {

    async function joinMeeting() {

      try {
        
        // Get local stream
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setLocalStream(localStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        // Create a new peer connection
        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.stunprotocol.org",
            },
          ],
        });

        // Add local stream tracks to the peer connection
        localStream?.getTracks().forEach((track) => peer.addTrack(track, localStream));

        // Handle remote stream
        peer.ontrack = (event) => {
          const [stream] = event.streams;
          setRemoteStream(stream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        };

        // handle offer
        socket?.on('offer', async ({ offer, name: remoteName }) => {
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

        // ICE Candidate handling
        socket?.on('receive-ice-candidate', async ({ candidate, senderName }) => {
          console.log('Received ICE candidate from:', senderName);

          try {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {
            console.error('Error adding ICE Candidate', error);
          }

          // Emit ICE Candidates
          peer.onicecandidate = (event) => {
            if (event.candidate) {
              socket?.emit('send-ice-candidate', { candidate: event.candidate });
            }
          };

      });

      } catch (error) {
        console.log("Error in join Meeting", error);
        throw new Error("Error in join Meeting", {
          cause: error
        })
      }
      
    }

    joinMeeting();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      socket?.off('offer');
      socket?.off('receive-ice-candidate');
    };
    
  }, [socket]);

  return (
    <div>
      Join Page
      <p>joiner name: {joinerName}</p>
      <br />
      <video autoPlay ref={localVideoRef} width={400} height={300} />
      <video autoPlay ref={remoteVideoRef} width={400} height={300} />
    </div>
  );
}

export default Page;
