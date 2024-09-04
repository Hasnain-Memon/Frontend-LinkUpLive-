"use client";
import { useRouter } from 'next/navigation';
import React, { FC } from 'react'

interface Modal {
    isOpen: boolean;
    onClose: any;
    children: React.ReactNode;
}

const Modal: FC<Modal>  = ({ children, isOpen, onClose }) => {

    if (!isOpen) return null;

    const router = useRouter();

    const onNo = () => {
        router.push('/');
    }
  
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
          <div className="bg-white p-8 rounded shadow-lg z-10 space-y-6">
            {children}
            <div className='flex justify-between gap-12'>
                <button onClick={onNo} className="mt-4 bg-red-500 hover:bg-red-400 text-white p-2 rounded w-1/2 font-semibold">
                No
                </button>
                <button onClick={onClose} className="mt-4 border border-gray-400 text-gray-700 p-2 rounded w-1/2 hover:bg-gray-200 font-semibold">
                Yes
                </button>
            </div>
          </div>
        </div>
    );
}

export default Modal