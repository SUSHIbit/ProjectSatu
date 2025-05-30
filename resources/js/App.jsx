import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { MusicProvider } from "@/contexts/MusicContext";
import Home from "@/pages/Home";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <PomodoroProvider>
                    <MusicProvider>
                        <Routes>
                            <Route path="*" element={<Home />} />
                        </Routes>
                    </MusicProvider>
                </PomodoroProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
