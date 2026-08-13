import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import glob from 'fast-glob'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const htmlFiles = glob.sync('./src/**/*.html')

export default defineConfig({
  base: './',
  root: resolve(__dirname, 'src'),

  server: {
    host: true,
    port: 3000,
    hot: true,
    open: true,
  },

  plugins: [
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: '../robots.txt', dest: '.' },
        { src: '../sitemap.xml', dest: '.' },
        { src: '../404.html', dest: '.' },
        { src: '../CNAME', dest: '.' },
      ],
    }),
  ],

  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: htmlFiles.length
        ? Object.fromEntries(
            htmlFiles.map(file => [
              file.replace(/^\.\/src\//, '').replace(/\.html$/, ''),
              resolve(__dirname, file),
            ])
          )
        : resolve(__dirname, 'src/index.html'),
      output: {
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'assets/images/[name][extname]'
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name][extname]'
          }
          return 'assets/[name][extname]'
        },
      },
    },
  },
})
