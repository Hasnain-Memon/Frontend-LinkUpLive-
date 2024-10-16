"use client"
import React from 'react'
import Logo from './Logo';
import { signIn, signOut, useSession } from "next-auth/react"
import Link from 'next/link';

function Header() {

  const session = useSession();

  return <nav className='sticky bg-[#FAFAFA] top-0 h-16 w-full flex items-center justify-between px-24'>
    <Logo />
    <div className='flex items-center gap-4'>
      {session.data?.user && <Link href={`/profile/@${session.data.user.name}`}>
        <div className='flex items-center gap-2 bg-gray-300 py-2 px-4 rounded-md hover:bg-gray-200'>
          <p className='text-sm font-light text-gray-800'>{session.data.user.name}</p>
          <img src={`${session.data.user.image}`} 
          alt='profile image'
          className='rounded-full h-6 w-6'
          />
        </div>
      </Link>}

      {session.data?.user && <button className='bg-[#202253] font-medium text-gray-100 rounded-md px-4 py-2 hover:bg-[#202253dc]' onClick={() => signOut()} >Logout</button>}

      {!session.data?.user && <button 
      className='bg-[#202253] font-medium text-gray-100 rounded-md px-4 py-2 hover:bg-[#202253dc]'
      onClick={() => signIn()}
      >
        SignIn
      </button>}
    </div>
  </nav>
}

export default Header;