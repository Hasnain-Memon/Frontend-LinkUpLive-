import React from 'react'

function Room({params}: {params: {roomId: string}}) {

  const roomId = params.roomId;

  return (
    <div>Room {roomId}</div>
  )
}

export default Room;