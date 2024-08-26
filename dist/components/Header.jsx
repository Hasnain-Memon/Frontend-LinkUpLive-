import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
function Header() {
    return <nav className='sticky bg-white top-0 h-12 w-full flex items-center px-4 justify-between'>
    <Logo />
    <div className='flex items-center gap-4'>
        <Link className='font-medium' href='/about'>About</Link>
        <Link className='font-medium' href='/contact'>Contact</Link>
        <Link className='font-semibold bg-blue-600 px-3 py-1 rounded-full text-gray-100' href='/sigin'>Signin</Link>
    </div>
  </nav>;
}
export default Header;
