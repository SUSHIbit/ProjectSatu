import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
} from "react";
import { songAPI } from "@/services/api";

const MusicContext = createContext(null);

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
    // Audio player ref
    const audioRef = useRef(new Audio());

    // State
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(() => {
        const savedVolume = localStorage.getItem("musicVolume");
        return savedVolume ? parseFloat(savedVolume) : 0.8; // Default volume 80%
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch songs on component mount
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true);
                const { data } = await songAPI.getAll();
                setSongs(data);

                // Restore last played song if available
                const lastSongId = localStorage.getItem("lastSongId");
                if (lastSongId && data.length > 0) {
                    const lastSong = data.find(
                        (song) => song.id.toString() === lastSongId
                    );
                    if (lastSong) {
                        setCurrentSong(lastSong);
                    } else {
                        setCurrentSong(data[0]); // Default to first song
                    }
                } else if (data.length > 0) {
                    setCurrentSong(data[0]); // Default to first song
                }
            } catch (err) {
                console.error("Error fetching songs:", err);
                setError("Failed to load songs");
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();

        // Clean up audio on unmount
        return () => {
            audioRef.current.pause();
            audioRef.current.src = "";
        };
    }, []);

    // Handle audio events
    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => {
            playNextSong();
        };

        const handleError = (e) => {
            console.error("Audio error:", e);
            setError("Failed to play the selected song");
            setIsPlaying(false);
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
        };
    }, [currentSong, songs]);

    // Update audio source when current song changes
    useEffect(() => {
        if (currentSong) {
            const audio = audioRef.current;
            audio.src = currentSong.audio_url;
            audio.volume = volume;

            if (isPlaying) {
                audio.play().catch((err) => {
                    console.error("Error playing song:", err);
                    setIsPlaying(false);
                });
            }

            // Save last played song
            localStorage.setItem("lastSongId", currentSong.id.toString());
        }
    }, [currentSong]);

    // Update playing state
    useEffect(() => {
        const audio = audioRef.current;

        if (isPlaying) {
            audio.play().catch((err) => {
                console.error("Error playing song:", err);
                setIsPlaying(false);
            });
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // Update volume
    useEffect(() => {
        audioRef.current.volume = volume;
        localStorage.setItem("musicVolume", volume.toString());
    }, [volume]);

    // Play a specific song
    const playSong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
    };

    // Toggle play/pause
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Play next song
    const playNextSong = () => {
        if (songs.length === 0) return;

        const currentIndex = currentSong
            ? songs.findIndex((song) => song.id === currentSong.id)
            : -1;
        const nextIndex =
            currentIndex === songs.length - 1 ? 0 : currentIndex + 1;

        setCurrentSong(songs[nextIndex]);
        setIsPlaying(true);
    };

    // Play previous song
    const playPreviousSong = () => {
        if (songs.length === 0) return;

        const currentIndex = currentSong
            ? songs.findIndex((song) => song.id === currentSong.id)
            : -1;
        const prevIndex =
            currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;

        setCurrentSong(songs[prevIndex]);
        setIsPlaying(true);
    };

    // Change volume
    const changeVolume = (newVolume) => {
        setVolume(Math.max(0, Math.min(1, newVolume)));
    };

    const value = {
        songs,
        currentSong,
        isPlaying,
        volume,
        loading,
        error,
        playSong,
        togglePlay,
        playNextSong,
        playPreviousSong,
        changeVolume,
    };

    return (
        <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
    );
};
