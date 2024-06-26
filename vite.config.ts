import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import dayjs from 'dayjs';
import { setupVitePlugins } from './build/plugins';
import { createViteProxy } from './build/config';

export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;

  const buildTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/scss/global.scss" as *;`
        }
      }
    },
    plugins: setupVitePlugins(viteEnv),
    define: {
      BUILD_TIME: JSON.stringify(buildTime)
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      proxy: createViteProxy(viteEnv)
    },
    preview: {
      port: 9725
    },
    build: {
      target: 'esnext',
      reportCompressedSize: false,
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      commonjsOptions: {
        ignoreTryCatch: false
      }
    }
  };
});
