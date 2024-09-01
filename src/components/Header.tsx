"use client"
import React from 'react'
import Logo from './Logo';
import { signIn, signOut, useSession } from "next-auth/react"

function Header() {

  const session = useSession();

  return <nav className='sticky bg-white top-0 h-16 w-full flex items-center justify-between px-4'>
    <Logo />
    <div>
      {session.data?.user && <button className='bg-blue-600 font-semibold text-gray-100 rounded-md px-4 py-2' onClick={() => signOut()} >Logout</button>}
      {!session.data?.user && <button 
      className='bg-blue-600 font-semibold text-gray-100 rounded-md px-4 py-2'
      onClick={() => signIn()}
      >
        SignIn
      </button>}
    </div>
  </nav>
}

export default Header;