import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/services/supabase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for existing session
        const checkSession = async () => {
            try {
                setLoading(true);
                const session = await auth.getSession();

                if (session) {
                    const user = await auth.getUser();
                    // Sync user with backend
                    await auth.syncUser(user);
                    setUser(user);
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
        const { data: authListener } = auth.onAuthStateChange(
            async (event, session) => {
                if (event === "SIGNED_IN" && session) {
                    const user = await auth.getUser();
                    // Sync user with backend
                    await auth.syncUser(user);
                    setUser(user);
                } else if (event === "SIGNED_OUT") {
                    setUser(null);
                }
            }
        );

        // Clean up subscription
        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    // Auth methods
    const signUp = async (userData) => {
        try {
            setLoading(true);
            await auth.signUp(userData);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (credentials) => {
        try {
            setLoading(true);
            const { user } = await auth.signIn(credentials);
            return user;
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            await auth.signInWithGoogle();
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            await auth.signOut();
            setUser(null);
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
