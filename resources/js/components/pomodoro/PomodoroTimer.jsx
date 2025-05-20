import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePomodoro, TIMER_MODES } from "@/contexts/PomodoroContext";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { formatTime } from "@/utils/formatTime";

const PomodoroTimer = () => {
    const { user } = useAuth();
    const { mode, timeLeft, isActive, completedSessions, switchMode } =
        usePomodoro();

    // Define colors based on current mode
    const modeColors = {
        [TIMER_MODES.FOCUS]: "bg-red-500",
        [TIMER_MODES.SHORT_BREAK]: "bg-green-500",
        [TIMER_MODES.LONG_BREAK]: "bg-blue-500",
    };

    const bgColor = modeColors[mode] || "bg-gray-700";

    // Define mode labels
    const modeLabels = {
        [TIMER_MODES.FOCUS]: "Focus",
        [TIMER_MODES.SHORT_BREAK]: "Short Break",
        [TIMER_MODES.LONG_BREAK]: "Long Break",
    };

    return (
        <div className="max-w-md w-full mx-auto">
            <div
                className={`rounded-2xl shadow-xl p-6 ${
                    user ? bgColor : "bg-gray-700"
                } bg-opacity-90 text-white transition-colors duration-500`}
            >
                {user ? (
                    <>
                        {/* Mode Selection Tabs */}
                        <div className="flex justify-center mb-6">
                            <div
                                className="inline-flex rounded-md shadow-sm"
                                role="group"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        switchMode(TIMER_MODES.FOCUS)
                                    }
                                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                                        mode === TIMER_MODES.FOCUS
                                            ? "bg-white text-red-500"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                >
                                    Focus
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        switchMode(TIMER_MODES.SHORT_BREAK)
                                    }
                                    className={`px-4 py-2 text-sm font-medium ${
                                        mode === TIMER_MODES.SHORT_BREAK
                                            ? "bg-white text-green-500"
                                            : "bg-green-600 text-white hover:bg-green-700"
                                    }`}
                                >
                                    Short Break
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        switchMode(TIMER_MODES.LONG_BREAK)
                                    }
                                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                        mode === TIMER_MODES.LONG_BREAK
                                            ? "bg-white text-blue-500"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                >
                                    Long Break
                                </button>
                            </div>
                        </div>

                        {/* Timer Display */}
                        <TimerDisplay time={timeLeft} mode={mode} />

                        {/* Timer Controls */}
                        <TimerControls />

                        {/* Sessions Counter */}
                        <div className="mt-4 text-center">
                            <p className="text-white text-opacity-80">
                                Completed:{" "}
                                <span className="font-bold">
                                    {completedSessions}
                                </span>{" "}
                                {completedSessions === 1
                                    ? "session"
                                    : "sessions"}
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            Pomodoro Timer
                        </h2>
                        <div className="text-6xl font-mono font-bold mb-6">
                            {formatTime(1500)} {/* Default 25:00 */}
                        </div>
                        <p className="mb-4">
                            Sign in to use the Pomodoro timer
                        </p>
                        <ProtectedRoute>
                            <div></div> {/* This will trigger the auth modal */}
                        </ProtectedRoute>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PomodoroTimer;
