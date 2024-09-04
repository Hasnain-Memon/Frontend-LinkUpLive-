import React from 'react'
import { Prompt } from 'next/font/google';
import logo from '../../public/logo.png'
import Image from 'next/image';

const prompt = Prompt({
    weight: ['400', '700'], // Specify font weights
    subsets: ['latin'], // Specify font subsets
});

function Logo() {
  return <div className='flex items-center gap-1'>
    <Image priority={true} src={logo} alt='logo-image' className='w-12 mb-1'/>
    <h1 className='font-bold text-2xl text-gray-700 cursor-pointer'>
        <span className={prompt.className}>LinkUpLive</span>
    </h1>
  </div>
}

export default Logo