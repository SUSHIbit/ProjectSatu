import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMusic } from "@/contexts/MusicContext";
import MusicControls from "./MusicControls";
import SongList from "./SongList";
import VolumeControl from "./VolumeControl";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const MusicPlayer = () => {
    const { user } = useAuth();
    const {
        currentSong,
        isPlaying,
        loading,
        error,
        togglePlay,
        playNextSong,
        playPreviousSong,
        volume,
        changeVolume,
    } = useMusic();

    const [showPlaylist, setShowPlaylist] = useState(false);

    const togglePlaylist = () => {
        setShowPlaylist(!showPlaylist);
    };

    return (
        <div className="w-full max-w-md mx-auto relative">
            {/* Main Player */}
            <div className="bg-black bg-opacity-70 text-white rounded-lg shadow-lg p-4">
                {user ? (
                    <>
                        {/* Now Playing */}
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-300">
                                    Now Playing
                                </h3>
                                {loading ? (
                                    <div className="animate-pulse h-6 w-3/4 bg-gray-600 rounded mt-1"></div>
                                ) : currentSong ? (
                                    <p className="text-lg font-semibold truncate">
                                        {currentSong.title}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 italic">
                                        No song selected
                                    </p>
                                )}
                                {currentSong?.genre && (
                                    <p className="text-xs text-gray-400">
                                        {currentSong.genre.name}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={togglePlaylist}
                                className="text-gray-300 hover:text-white p-1 focus:outline-none"
                            >
                                <ChevronUpIcon
                                    className={`h-6 w-6 transform transition-transform ${
                                        showPlaylist ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Controls */}
                        <div className="mt-4">
                            <MusicControls
                                isPlaying={isPlaying}
                                onPlay={togglePlay}
                                onNext={playNextSong}
                                onPrevious={playPreviousSong}
                                disabled={!currentSong}
                            />
                        </div>

                        {/* Volume Control */}
                        <div className="mt-3">
                            <VolumeControl
                                volume={volume}
                                onChange={changeVolume}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-2 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Song List (Expandable) */}
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                showPlaylist ? "max-h-60" : "max-h-0"
                            }`}
                        >
                            <div className="mt-3 pt-3 border-t border-gray-700">
                                <SongList />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-2">
                        <h3 className="text-lg font-semibold mb-2">
                            Music Player
                        </h3>
                        <p className="mb-3">Sign in to play music</p>
                        <ProtectedRoute>
                            <div></div> {/* This will trigger the auth modal */}
                        </ProtectedRoute>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicPlayer;
