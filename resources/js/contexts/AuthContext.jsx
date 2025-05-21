import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/services/supabase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the auth context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                setLoading(true);

                // Get the current session
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (session) {
                    // Get user details
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();

                    if (user) {
                        // Sync user with backend
                        await syncUserWithBackend(user);
                        setUser(user);
                    }
                }
            } catch (error) {
                console.error("Error checking session:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === "SIGNED_IN" && session) {
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();

                    // Sync user with backend
                    await syncUserWithBackend(user);
                    setUser(user);
                } else if (event === "SIGNED_OUT") {
                    setUser(null);
                }
            }
        );

        // Clean up subscription on unmount
        return () => {
            if (
                authListener &&
                typeof authListener.unsubscribe === "function"
            ) {
                authListener.unsubscribe();
            }
        };
    }, []);

    // Sync user with Laravel backend
    const syncUserWithBackend = async (user) => {
        if (!user) return null;

        try {
            const response = await axios.post(
                "/api/auth/sync-user",
                {
                    supabase_id: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name || user.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${
                            user.access_token || session?.access_token
                        }`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error("Failed to sync user with backend:", error);
            return null;
        }
    };

    // Sign up with email and password
    const signUp = async ({ email, password, name }) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) throw error;
            return data;
        } finally {
            setLoading(false);
        }
    };

    // Sign in with email and password
    const signIn = async ({ email, password }) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return data;
        } finally {
            setLoading(false);
        }
    };

    // Sign in with Google OAuth
    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
            return data;
        } finally {
            setLoading(false);
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUser(null);
            navigate("/");
            return true;
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Reset password
    const resetPassword = async (email) => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            return true;
        } finally {
            setLoading(false);
        }
    };

    // Update password
    const updatePassword = async (newPassword) => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;
            return true;
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (updates) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.updateUser({
                data: updates,
            });

            if (error) throw error;
            setUser({ ...user, ...data.user });
            return data.user;
        } finally {
            setLoading(false);
        }
    };

    // Auth context value
    const value = {
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
