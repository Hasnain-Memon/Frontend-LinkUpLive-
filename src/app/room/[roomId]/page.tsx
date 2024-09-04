import React from 'react';
import NewMeeting from '@/components/NewMeeting';

function CreatedRoom({params}: {params: { roomId: string }}) {
  const roomId = params.roomId;

  return <div>
    <NewMeeting roomId={roomId}/>
  </div>
}

export default CreatedRoom;