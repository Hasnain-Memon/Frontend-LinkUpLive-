import { MicIcon, MicOff, PhoneOff, VideoIcon, VideoOffIcon } from "lucide-react";
import React from "react";

function VideoControlButtons({ roomId, onCamera, onMic, isCameraOn, isMicOn }: {
    roomId?: string,
    onMic?: any,
    onCamera?: any,
    isMicOn?: boolean,
    isCameraOn?: boolean
}) {


    return <div className="h-16 flex items-center justify-start px-4">
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center justify-center">
                {roomId && <p className="text-gray-500 text-md font-normal text-sm">
                    Room id: {roomId}
                </p>}
            </div>

            <div className="space-x-2">
                <button className="bg-gray-600 rounded-md p-2">
                    {isMicOn ? (
                        <MicIcon className="text-gray-300"/>
                    ) : (
                        <MicOff className="text-gray-300"/>
                    )}
                </button>
                <button className="bg-gray-600 rounded-md p-2">
                    {isCameraOn ? (
                        <VideoIcon className="text-gray-300"/>
                    ): (
                        <VideoOffIcon className="text-gray-300"/>
                    )}
                </button>
                <button className="bg-gray-600 rounded-md p-2">
                    <PhoneOff className="text-red-500"/>
                </button>
            </div>
        </div>
    </div>
}

export default VideoControlButtons;