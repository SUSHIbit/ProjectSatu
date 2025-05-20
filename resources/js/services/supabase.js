import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const auth = {
    /**
     * Sign up a new user with email and password
     */
    signUp: async ({ email, password, name }) => {
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
    },

    /**
     * Sign in with email and password
     */
    signIn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign in with Google OAuth
     */
    signInWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign out the current user
     */
    signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;
        return true;
    },

    /**
     * Get the current user session
     */
    getSession: async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    /**
     * Get the current user
     */
    getUser: async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        return data.user;
    },

    /**
     * Set up auth state change listener
     */
    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback);
    },

    /**
     * Sync user with Laravel backend
     */
    syncUser: async (user) => {
        if (!user) return null;

        const response = await fetch("/api/auth/sync-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
            body: JSON.stringify({
                supabase_id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.email,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to sync user with backend");
        }

        return await response.json();
    },
};

export const storage = {
    /**
     * Upload a file to Supabase Storage
     */
    uploadFile: async (file, bucket, folder = "") => {
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) throw error;

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return publicUrlData.publicUrl;
    },

    /**
     * Delete a file from Supabase Storage
     */
    deleteFile: async (filePath, bucket) => {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) throw error;
        return true;
    },

    /**
     * Get a list of files from a bucket
     */
    listFiles: async (bucket, folder = "") => {
        const { data, error } = await supabase.storage
            .from(bucket)
            .list(folder);

        if (error) throw error;
        return data;
    },
};

export default supabase;
