// resources/js/components/pomodoro/TimerControls.jsx
import React from "react";
import { usePomodoro } from "@/contexts/PomodoroContext";
import {
    PlayIcon,
    PauseIcon,
    ArrowPathIcon,
    ForwardIcon,
} from "@heroicons/react/24/solid";

const TimerControls = () => {
    const { isActive, startTimer, pauseTimer, resetTimer, skipToNext } =
        usePomodoro();

    return (
        <div className="mt-8 flex justify-center items-center space-x-4">
            {isActive ? (
                <button
                    onClick={pauseTimer}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    title="Pause"
                >
                    <PauseIcon className="h-8 w-8" />
                </button>
            ) : (
                <button
                    onClick={startTimer}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    title="Start"
                >
                    <PlayIcon className="h-8 w-8" />
                </button>
            )}

            <button
                onClick={resetTimer}
                className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-3 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                title="Reset"
            >
                <ArrowPathIcon className="h-6 w-6" />
            </button>

            <button
                onClick={skipToNext}
                className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-3 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                title="Skip to next"
            >
                <ForwardIcon className="h-6 w-6" />
            </button>
        </div>
    );
};

export default TimerControls;
