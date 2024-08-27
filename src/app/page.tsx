"use client"
import Link from "next/link";
import camera_gif from "../../public/camera_gif.gif";
import Image from "next/image";
import AnimatedImage from "@/components/AnimatedImage";
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';

export default function Home() {

  const router = useRouter();

  const createNewMeeting = async () => {
    const roomId = uuidv4();
    router.push(`/${roomId}`);
  }

  return <div className="px-4 h-screen w-full flex">
    <div className=" w-1/2 flex flex-col justify-center px-6 gap-8">
      <div id="hero-text" className="space-y-4">
        <h2 className="text-gray-800 font-semibold text-4xl">
          Video calls and meetings <br /> for everyone
        </h2>
        <p className="font-normal text-gray-500 text-xl">Connect, collaborate and celebrate from <br /> anywhere with Link Up Live</p>
      </div>
      <div className="flex gap-8 items-center border-b border-black pb-8 mr-12">
        
        <div className="flex gap-4">
          <form onSubmit={createNewMeeting} className="space-y-4 border border-gray-400 p-4 rounded-md">
            <h4 className="text-center text-lg text-gray-800 font-semibold">
              Create New Meeting
            </h4>
            <input type="text" placeholder="Enter your name" className="border border-gray-400 p-3 rounded-md outline-none text-gray-600"/>
            <button type="submit" className=' text-gray-100 px-4 py-3 rounded-md font-semibold flex items-center justify-center gap-2 bg-blue-600 w-full'>
              <Image src={camera_gif} alt="camera_gif" className="w-8 mr-4"/>
              <span className="mr-12">New meeting</span>
            </button>
          </form>

          <form className="space-y-4 border border-gray-400 p-4 rounded-md">
            <h4 className="text-center text-lg text-gray-800 font-semibold">
              Enter Existing Meeting
            </h4>
            <input type="text" placeholder="Enter a Code" className="border border-gray-400 p-3 rounded-md outline-none text-gray-600"/>
            <button type="submit" className="text-gray-400 font-semibold bg-transparent text-center w-[245px] hover:text-blue-600 py-4 border border-blue-600"><p>join</p></button>
          </form>
        </div>
      </div>
      <div>
        <span className="text-xs text-gray-600"><Link className="text-blue-600" href='about'>Learn more</Link> about Link Up Live</span>
      </div>
    </div>

    <div className="w-1/2 flex flex-col justify-center items-center gap-12">
      <AnimatedImage />
      <div className="mb-20 space-y-3">
        <h3 className="text-gray-800 font-medium text-2xl text-center">
          Link with people
        </h3>
        <p className="text-sm text-center text-gray-500">Click <span className="text-gray-800 font-bold">New meeting</span> to get a code that you can send to <br /> people that you want meet with.</p>
      </div>
    </div>
  </div>
}