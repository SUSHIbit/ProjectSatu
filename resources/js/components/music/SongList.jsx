import React from "react";
import { useMusic } from "@/contexts/MusicContext";
import { PlayIcon, MusicalNoteIcon } from "@heroicons/react/24/solid";

const SongList = () => {
    const { songs, currentSong, playSong, loading } = useMusic();

    if (loading) {
        return (
            <div className="py-2">
                <div className="animate-pulse space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-700 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (songs.length === 0) {
        return (
            <div className="py-4 text-center text-gray-400">
                <p>No songs available</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto max-h-60 pr-1">
            <ul className="space-y-1">
                {songs.map((song) => (
                    <li
                        key={song.id}
                        className={`rounded p-2 flex items-center hover:bg-gray-700 cursor-pointer transition-colors ${
                            currentSong?.id === song.id ? "bg-gray-700" : ""
                        }`}
                        onClick={() => playSong(song)}
                    >
                        <div className="flex-shrink-0 mr-3">
                            {currentSong?.id === song.id ? (
                                <PlayIcon className="h-5 w-5 text-primary-500" />
                            ) : (
                                <MusicalNoteIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p
                                className={`text-sm truncate ${
                                    currentSong?.id === song.id
                                        ? "text-primary-400 font-medium"
                                        : "text-white"
                                }`}
                            >
                                {song.title}
                            </p>
                            {song.genre && (
                                <p className="text-xs text-gray-500 truncate">
                                    {song.genre.name}
                                </p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SongList;
