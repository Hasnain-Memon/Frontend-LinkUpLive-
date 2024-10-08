"use client";
import Link from 'next/link';
import React, { useEffect } from 'react'
import Image from 'next/image';
import landing_image_new from "../../public/landing_image_new.png";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'

function Landing() {

  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if(session.status === "authenticated"){
      router.push('/');
    }
  }, [session.status, router]);

  return <div className='h-[calc(h-screen-6rem)] w-full flex gap-8 px-20 pt-6'>
    <div className='px-6 w-1/2 flex flex-col justify-center h-[calc(100vh-6rem)] gap-8'>
      <h1 className='text-5xl font-semibold font-sans text-gray-800 tracking-wide leading-tight'>
      Connect Seamlessly <br /> with LinkUpLive Today
      </h1>
      <p className="font-normal text-gray-500 text-md">
        Experience the future of online meeting with LinkUpLive. <br />
        Our platform offers high-quality video calls and user-friendly <br />
        features to keep you connected.
      </p>
      <button className='font-bold bg-[#202253] hover:bg-[#202253dc] w-28 px-2 py-2 rounded-md text-gray-100'>
        <Link href='/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Flanding'>Get started</Link>
      </button>
    </div>

    <div className='w-1/2 flex items-center justify-center px-6 h-full'>
      <Image 
      src={landing_image_new}
      alt='landing image'
      width={500}
      />
    </div>
  </div>
}

export default Landing;