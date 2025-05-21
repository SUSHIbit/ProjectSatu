import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/app.css",
                "resources/js/app.js",
                "resources/js/admin.js",
            ],
            refresh: true,
        }),
        react({
            // Explicitly configure the react plugin to handle both .js and .jsx files
            include: "**/*.{jsx,js}",
        }),
    ],
    resolve: {
        alias: {
            "@": "/resources/js",
        },
    },
});
