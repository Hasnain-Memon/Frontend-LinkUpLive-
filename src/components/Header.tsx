import React from 'react'
import Link from 'next/link';
import Logo from './Logo';

function Header() {

  return <nav className='sticky bg-white top-0 h-16 w-full flex items-center justify-center px-4'>
    <Logo />
  </nav>
}

export default Header;