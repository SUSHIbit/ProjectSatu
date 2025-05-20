/**
 * Format seconds into a MM:SS string
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string (MM:SS)
 */
export const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
};

/**
 * Convert minutes to seconds
 * @param {number} minutes - Minutes to convert
 * @returns {number} Seconds
 */
export const minutesToSeconds = (minutes) => {
    return Math.round(minutes * 60);
};

/**
 * Convert seconds to minutes
 * @param {number} seconds - Seconds to convert
 * @returns {number} Minutes
 */
export const secondsToMinutes = (seconds) => {
    return seconds / 60;
};

// resources/js/utils/storage.js
/**
 * Get item from localStorage with expiration check
 * @param {string} key - Storage key
 * @returns {any} Parsed value or null if expired/not found
 */
export const getStorageItem = (key) => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const parsed = JSON.parse(item);

        // Check if the item has an expiration time and it's expired
        if (parsed.expiry && parsed.expiry < Date.now()) {
            localStorage.removeItem(key);
            return null;
        }

        return parsed.value;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return null;
    }
};

/**
 * Set item in localStorage with optional expiration
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {number} expiryHours - Optional expiration in hours
 */
export const setStorageItem = (key, value, expiryHours = null) => {
    try {
        const item = {
            value,
            expiry: expiryHours
                ? Date.now() + expiryHours * 60 * 60 * 1000
                : null,
        };

        localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
    }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key to remove
 */
export const removeStorageItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
    }
};
