import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminSongs from "@/pages/AdminSongs";
import AdminWallpapers from "@/pages/AdminWallpapers";
import AdminGenres from "@/pages/AdminGenres";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminApp = () => {
    return (
        <Router basename="/admin">
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/songs" replace />} />
                    <Route path="songs" element={<AdminSongs />} />
                    <Route path="wallpapers" element={<AdminWallpapers />} />
                    <Route path="genres" element={<AdminGenres />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AdminApp;
