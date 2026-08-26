import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
   server: {
      host: "::",
      port: 7800,
      proxy: {
        '/api': 'http://127.0.0.1:8080',
      },
    },
   plugins: [react()],
   resolve: {
     alias: {
       "@": path.resolve(__dirname, "./src"),
     },
   },
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'react-vendor': ['react', 'react-dom'],
           'router-vendor': ['react-router-dom'],
         },
       },
     },
   },
 });
