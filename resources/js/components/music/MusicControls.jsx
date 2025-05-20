import React from "react";
import {
    PlayIcon,
    PauseIcon,
    BackwardIcon,
    ForwardIcon,
} from "@heroicons/react/24/solid";

const MusicControls = ({ isPlaying, onPlay, onNext, onPrevious, disabled }) => {
    return (
        <div className="flex items-center justify-center space-x-4">
            <button
                onClick={onPrevious}
                disabled={disabled}
                className={`text-gray-300 hover:text-white focus:outline-none ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Previous"
            >
                <BackwardIcon className="h-6 w-6" />
            </button>

            <button
                onClick={onPlay}
                disabled={disabled}
                className={`bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? (
                    <PauseIcon className="h-5 w-5" />
                ) : (
                    <PlayIcon className="h-5 w-5" />
                )}
            </button>

            <button
                onClick={onNext}
                disabled={disabled}
                className={`text-gray-300 hover:text-white focus:outline-none ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Next"
            >
                <ForwardIcon className="h-6 w-6" />
            </button>
        </div>
    );
};

export default MusicControls;
