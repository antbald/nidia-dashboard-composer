import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'NidiaDashboardComposer',
            fileName: 'nidia-dashboard-composer-panel',
            formats: ['es']
        },
        outDir: '../custom_components/nidia_dashboard_composer/www',
        emptyOutDir: true,
        rollupOptions: {
            external: [],
            output: {
                entryFileNames: 'nidia-dashboard-composer-panel.js'
            }
        }
    }
});
