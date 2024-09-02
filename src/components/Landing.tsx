import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import landing_page_image from "../../public/landing_page_image.png";

function Landing() {
  return <div className='h-[calc(h-screen-6rem)] w-full flex gap-8 px-24'>
    <div className='px-6 w-1/2 flex flex-col justify-center h-[calc(100vh-6rem)] gap-8'>
      <h1 className='text-5xl font-semibold font-sans text-gray-800 tracking-wide leading-tight'>
      Revolutionize <br />Remote Work with <br />Video Meetings
      </h1>
      <p className="font-normal text-gray-500 text-xl">
      Your virtual meeting room for productive <br />and meaningful connections.
      </p>
      <button className='font-bold bg-blue-600 w-28 px-2 py-2 rounded-md text-gray-100'>
        <Link href='/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Flanding'>Get started</Link>
      </button>
    </div>

    <div className='w-1/2 flex items-center justify-center px-6 h-full'>
      <Image 
      src={landing_page_image}
      alt='landing image'
      className='absolute top-0'
      width={500}
      />
    </div>
  </div>
}

export default Landing;