"use client";
import Landing from '@/components/Landing'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if(session.status === "authenticated"){
      router.push('/');
    }
  }, [session.status, router])

  return <>
    <Landing />
  </>
}

export default page