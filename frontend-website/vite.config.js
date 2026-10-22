import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5180,
        strictPort: false,
    },
    preview: {
        port: 4180,
    },
    build: {
        target: "es2022",
        sourcemap: false,
        assetsInlineLimit: 0,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "motion"],
                },
            },
        },
    },
});
