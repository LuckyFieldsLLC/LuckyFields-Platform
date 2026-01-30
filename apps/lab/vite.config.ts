import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: './',
    publicDir: '../../data', // Serve root /data folder content as root of the app
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
