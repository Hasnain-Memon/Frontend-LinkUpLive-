import JoinMeeting from '@/components/JoinMeeting';
import React from 'react';

function Page({ params }: { params: { joinerName: string } }) {

  const joinerName = params.joinerName;
  

  return <>
    <JoinMeeting joinerName={joinerName}/>
  </>;
}

export default Page;
