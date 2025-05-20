import React, { useEffect, useState } from "react";
import { useMusic } from "@/contexts/MusicContext";
import Header from "@/components/common/Header";
import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";
import MusicPlayer from "@/components/music/MusicPlayer";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
    const { currentSong, loading } = useMusic();
    const [bgImageUrl, setBgImageUrl] = useState("");

    // Update background when current song changes
    useEffect(() => {
        if (currentSong && currentSong.wallpaper) {
            setBgImageUrl(currentSong.wallpaper.image_url);
        }
    }, [currentSong]);

    return (
        <div className="relative flex flex-col min-h-screen overflow-hidden">
            {/* Background Image with smooth transition */}
            <AnimatePresence>
                {bgImageUrl && (
                    <motion.div
                        key={bgImageUrl}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="fixed inset-0 w-full h-full z-0"
                        style={{
                            backgroundImage: `url(${bgImageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Overlay for better readability */}
            <div className="fixed inset-0 bg-black bg-opacity-40 z-10" />

            {/* Main Content Container */}
            <div className="relative z-20 flex flex-col min-h-screen">
                <Header />

                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <PomodoroTimer />
                </main>

                <footer className="w-full p-4">
                    <MusicPlayer />
                </footer>
            </div>
        </div>
    );
};

export default Home;
