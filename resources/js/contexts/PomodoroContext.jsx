import React, { createContext, useContext, useEffect, useState } from "react";

// Timer modes
export const TIMER_MODES = {
    FOCUS: "focus",
    SHORT_BREAK: "shortBreak",
    LONG_BREAK: "longBreak",
};

// Default timer durations in seconds
const DEFAULT_DURATIONS = {
    [TIMER_MODES.FOCUS]: 25 * 60, // 25 minutes
    [TIMER_MODES.SHORT_BREAK]: 5 * 60, // 5 minutes
    [TIMER_MODES.LONG_BREAK]: 15 * 60, // 15 minutes
};

// Number of focus sessions before a long break
const SESSIONS_BEFORE_LONG_BREAK = 4;

const PomodoroContext = createContext(null);

export const usePomodoro = () => useContext(PomodoroContext);

export const PomodoroProvider = ({ children }) => {
    // Timer state
    const [mode, setMode] = useState(TIMER_MODES.FOCUS);
    const [timeLeft, setTimeLeft] = useState(
        DEFAULT_DURATIONS[TIMER_MODES.FOCUS]
    );
    const [isActive, setIsActive] = useState(false);
    const [completedSessions, setCompletedSessions] = useState(0);

    // Timer settings
    const [durations, setDurations] = useState(() => {
        const savedDurations = localStorage.getItem("pomodoroSettings");
        return savedDurations ? JSON.parse(savedDurations) : DEFAULT_DURATIONS;
    });

    // Load saved timer state if available
    useEffect(() => {
        const savedState = localStorage.getItem("pomodoroState");
        if (savedState) {
            const { mode, timeLeft, isActive, completedSessions } =
                JSON.parse(savedState);
            setMode(mode);
            setTimeLeft(timeLeft);
            setIsActive(isActive && document.visibilityState === "visible"); // Only auto-start if tab is visible
            setCompletedSessions(completedSessions);
        }
    }, []);

    // Save timer state to localStorage
    useEffect(() => {
        localStorage.setItem(
            "pomodoroState",
            JSON.stringify({
                mode,
                timeLeft,
                isActive,
                completedSessions,
            })
        );
    }, [mode, timeLeft, isActive, completedSessions]);

    // Timer countdown logic
    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            // Timer completed
            clearInterval(interval);

            // Play notification sound
            const audio = new Audio("/assets/notification.mp3");
            audio
                .play()
                .catch((error) =>
                    console.error("Error playing notification:", error)
                );

            // Handle session completion
            if (mode === TIMER_MODES.FOCUS) {
                const newCompletedSessions = completedSessions + 1;
                setCompletedSessions(newCompletedSessions);

                // Determine which break to take
                if (newCompletedSessions % SESSIONS_BEFORE_LONG_BREAK === 0) {
                    switchMode(TIMER_MODES.LONG_BREAK);
                } else {
                    switchMode(TIMER_MODES.SHORT_BREAK);
                }
            } else {
                // After a break, switch back to focus mode
                switchMode(TIMER_MODES.FOCUS);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, completedSessions]);

    // Handle visibility change (pause when tab is hidden)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden" && isActive) {
                setIsActive(false);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [isActive]);

    // Switch timer mode
    const switchMode = (newMode) => {
        setMode(newMode);
        setTimeLeft(durations[newMode]);
        setIsActive(false);
    };

    // Start the timer
    const startTimer = () => {
        setIsActive(true);
    };

    // Pause the timer
    const pauseTimer = () => {
        setIsActive(false);
    };

    // Reset the timer to the current mode's initial duration
    const resetTimer = () => {
        setTimeLeft(durations[mode]);
        setIsActive(false);
    };

    // Skip to the next mode
    const skipToNext = () => {
        if (mode === TIMER_MODES.FOCUS) {
            const newCompletedSessions = completedSessions + 1;
            setCompletedSessions(newCompletedSessions);

            if (newCompletedSessions % SESSIONS_BEFORE_LONG_BREAK === 0) {
                switchMode(TIMER_MODES.LONG_BREAK);
            } else {
                switchMode(TIMER_MODES.SHORT_BREAK);
            }
        } else {
            switchMode(TIMER_MODES.FOCUS);
        }
    };

    // Update timer settings
    const updateSettings = (newDurations) => {
        setDurations(newDurations);
        localStorage.setItem("pomodoroSettings", JSON.stringify(newDurations));

        // Update current timer if not active
        if (!isActive) {
            setTimeLeft(newDurations[mode]);
        }
    };

    const value = {
        mode,
        timeLeft,
        isActive,
        completedSessions,
        durations,
        startTimer,
        pauseTimer,
        resetTimer,
        switchMode,
        skipToNext,
        updateSettings,
    };

    return (
        <PomodoroContext.Provider value={value}>
            {children}
        </PomodoroContext.Provider>
    );
};
