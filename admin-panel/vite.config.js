import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    root: "./",
    build: {
        outDir: "build",
    },
    base: "/",
    // base: "/staging/adpostman-admin",
    publicDir: "public",
    server: {
        port: 4000, // To run the app on port 3000
        open: true // If we want to open the app once its started
    },
})

