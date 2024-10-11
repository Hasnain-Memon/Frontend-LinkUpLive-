import JoinMeeting from '@/components/JoinMeeting';
import NewMeeting from '@/components/NewMeeting';
import React from 'react';

function Page({ params }: { params: { joinerName: string } }) {

  const joinerName = params.joinerName;
  

  return <>
    <NewMeeting joinerName={joinerName}/>
  </>;
}

export default Page;
