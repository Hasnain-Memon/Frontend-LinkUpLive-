import { CameraIcon, MicIcon, MicOff, PhoneIcon, PhoneOff, VideoIcon } from "lucide-react";
import React from "react";

function VideoControlButtons({ roomId }: {
    roomId: string
}) {


    return <div className="h-16 flex items-center justify-start px-4">
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center justify-center">
                <p className="text-gray-500 text-md font-normal text-sm">
                    Room id: {roomId}
                </p>
            </div>

            <div className="space-x-2">
                <button className="bg-gray-600 rounded-md p-2">
                    <MicIcon className="text-gray-300"/>
                </button>
                <button className="bg-gray-600 rounded-md p-2">
                    <VideoIcon className="text-gray-300"/>
                </button>
                <button className="bg-gray-600 rounded-md p-2">
                    <PhoneOff className="text-red-500"/>
                </button>
            </div>
        </div>
    </div>
}

export default VideoControlButtons;