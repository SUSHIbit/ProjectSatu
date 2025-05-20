import React from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";

const VolumeControl = ({ volume, onChange }) => {
    const handleChange = (e) => {
        onChange(parseFloat(e.target.value));
    };

    const isMuted = volume === 0;

    const toggleMute = () => {
        if (isMuted) {
            onChange(0.5); // Unmute to 50%
        } else {
            onChange(0); // Mute
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={toggleMute}
                className="text-gray-300 hover:text-white focus:outline-none"
            >
                {isMuted ? (
                    <SpeakerXMarkIcon className="h-5 w-5" />
                ) : (
                    <SpeakerWaveIcon className="h-5 w-5" />
                )}
            </button>

            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleChange}
                className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
            />

            <span className="text-xs text-gray-300 w-8 text-right">
                {Math.round(volume * 100)}%
            </span>
        </div>
    );
};

export default VolumeControl;
